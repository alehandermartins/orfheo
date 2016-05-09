module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        conFusionCall = {
          user_id: '45825599-b8cf-499c-825c-a7134a3f1ff0',
          call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
        }
        @@calls_collection.insert(conFusionCall) unless exists? conFusionCall[:call_id]
        call = get_call('b5bc4203-9379-4de0-856a-55e1e5f3fac6')
        call[:proposals].each{ |proposal|
          profile = Services::Profiles.get_profiles :profile, {profile_id: proposal[:profile_id]}
          user = Repos::Users.grab({user_id: proposal[:user_id]})
          proposal.merge! email: user[:email]
  
          if(proposal[:type] == 'artist')
            proposal.merge! city: profile[:city]
            proposal.merge! personal_web: profile[:personal_web]
            proposal.merge! zip_code: profile[:zip_code]
            proposal.merge! name: profile[:name]
          end

          if(proposal[:type] == 'space')
            proposal.merge! address: profile[:address]
            proposal.merge! photos: profile[:photos]
            proposal.merge! personal_web: profile[:personal_web]
            proposal.merge! links: profile[:links]
            proposal.merge! name: profile[:name]
          end
          @@calls_collection.update({"proposals.proposal_id": proposal[:proposal_id]},{
            "$set": {"proposals.$": proposal}
          },
          {upsert: true})
        }
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

        get_my_proposals_from(results, 'profile_id', profile_id)
      end

      def get_proposals_for_production production_id
        results = @@calls_collection.find({ "proposals.production_id": production_id })
        return [] unless results.count > 0

        get_my_proposals_from(results, 'production_id', production_id)
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
        proposal = Util.string_keyed_hash_to_symbolized proposal
        remove_sensitive_fields proposal
      end

      def get_call_owner call_id
        call = grab({call_id: call_id}).first
        call[:user_id]
      end

      def get_call call_id
        call = grab({call_id: call_id}).first
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

      def add_program call_id, program
        program.each{ |proposal|
          @@calls_collection.update({ call_id: call_id, "proposals.proposal_id": proposal[:proposal_id]},
            {
              "$set": {"proposals.$.program": proposal[:program]}
            },
          {upsert: true})
        }
      end

      def delete_proposal proposal_id
        @@calls_collection.update({ "proposals.proposal_id": proposal_id },
          {
            "$pull": {'proposals': {'proposal_id' => proposal_id}}
          }
        )
      end

      private
      def grab query
        results = @@calls_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
         Util.string_keyed_hash_to_symbolized profile
        }
      end

      def get_my_proposals_from results, key, id
        proposals = results.map{ |call| call['proposals']}.flatten
        my_proposals = proposals.select{ |proposal| proposal[key] == id }
        my_proposals.map!{ |proposal|
          Util.string_keyed_hash_to_symbolized proposal
        }
        my_proposals.each{ |proposal|
          remove_sensitive_fields proposal
        }
      end

      def remove_sensitive_fields proposal
        proposal.delete(:email)
        proposal.delete(:address)
        proposal.delete(:city)
        proposal.delete(:zip_code)
        proposal
      end
    end
  end
end
