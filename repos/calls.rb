module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
      end

      def add call
        @@calls_collection.insert(call)
      end

      def exists? query
        @@calls_collection.count(query: query) > 0
      end

      def grab query
        results = @@calls_collection.find(query)
        return [] unless results.count > 0

        results.map { |call|
          string_keyed_hash_to_symbolized call
        }
      end

      def push query, proposal
        @@calls_collection.update(query,{
          "$push": {proposals: proposal}
        })
      end

      def get_proposals_for profile_id
        results = @@calls_collection.find({ "proposals.profile_id": profile_id })
        return [] unless results.count > 0

        get_my_proposals_from(results.map{ |call| call['proposals']}.flatten, profile_id)
      end

      private
      def string_keyed_hash_to_symbolized hash
        hash.map do |k,v|
          next [k,v] unless k.is_a? String
          next [k.to_sym, symbolize_array(v)] if v.is_a? Array
          [k.to_sym, v]
        end.to_h
      end

      def symbolize_array array
        return array unless array.all?{ |element| element.is_a? Hash}
        array.map{ |proposal|
          proposal.map{ |key, value|
            [key.to_sym, value]
          }.to_h
        }
      end

      def get_my_proposals_from proposals, profile_id
        symbolize_array(proposals.select{ |proposal| proposal['profile_id'] == profile_id })
      end
    end
  end
end
