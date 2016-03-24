module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
      end

      def add call
        @@calls_collection.insert(call)
      end

      def exists? call_id
        @@calls_collection.count(query: {call_id: call_id}) > 0
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

      private
      def get_my_proposals_from results, profile_id
        proposals = results.map{ |call| call['proposals']}.flatten
        my_proposals = (proposals.select{ |proposal| proposal['profile_id'] == profile_id })
        my_proposals.map{ |proposal|
          Util.string_keyed_hash_to_symbolized proposal
        }
      end
    end
  end
end
