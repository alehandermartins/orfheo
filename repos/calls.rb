module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        conFusionCall = {
          user_id: 'conFusion',
          call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
        }
        @@calls_collection.insert(conFusionCall) unless exists? conFusionCall[:call_id] 
      end

      def add call
        @@calls_collection.insert(call)
      end

      def exists? call_id
        @@calls_collection.count(query: {call_id: call_id}) > 0
      end

      def proposal_exists? proposal_id
       @@calls_collection.count(query: {"proposals.proposal_id": proposal_id}) > 0
      end

      def add_proposal call_id, proposal
        @@calls_collection.update({call_id: call_id},{
          "$push": {proposals: proposal}
        })
      end

      def get_proposals_for profile_id
        results = @@calls_collection.find({ "proposals.profile_id": profile_id })
        return [] unless results.count > 0

        get_my_proposals_from(results, profile_id)
      end

      def get_otter_proposals_for profile_id, type
          proposals_info = []
          proposals = get_proposals_for(profile_id)
          proposals.each{ |proposal|
            proposals_info.push(proposal[:title]) if type == 'artist'
            proposals_info.push(proposal[:description]) if type == 'space'
          }
          proposals_info
      end

      def get_proposal proposal_id
        results = @@calls_collection.find({ "proposals.proposal_id": proposal_id })
        return [] unless results.count > 0
        proposals = results.first['proposals']
        proposal = proposals.select{ |proposal| proposal['proposal_id'] == proposal_id }.first
        Util.string_keyed_hash_to_symbolized proposal
      end

      def get_proposal_owner proposal_id
        proposal = get_proposal proposal_id
        proposal[:user_id]
      end

      def amend_proposal proposal_id, amend
        @@calls_collection.update({ "proposals.proposal_id": proposal_id },
          {
            "$set": {"proposals.$.amend": amend}
          },
        {upsert: true})
      end

      def delete_proposal proposal_id
        @@calls_collection.update({ "proposals.proposal_id": proposal_id },
          {
            "$pull": {'proposals': {'proposal_id' => proposal_id}}
          }
        )
      end

      def delete_profile_proposals profile_id
        proposals = get_proposals_for profile_id
        proposals.each{ |proposal|
          delete_proposal proposal[:proposal_id]
        }
      end

      private
      def get_my_proposals_from results, profile_id
        proposals = results.map{ |call| call['proposals']}.flatten
        my_proposals = proposals.select{ |proposal| proposal['profile_id'] == profile_id }
        my_proposals.map{ |proposal|
          Util.string_keyed_hash_to_symbolized proposal
        }
      end
    end
  end
end
