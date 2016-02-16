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
        !@@calls_collection.find(query).limit(1).to_a.empty?
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
        results = @@calls_collection.find({ proposals: { "$elemMatch": { profile_id: profile_id }}})
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
        new_array = []
        array.each{ |proposal|
          new_proposal = {}
          proposal.map{ |key, value|
            new_proposal[key.to_sym] = value
          }
          new_array.push(new_proposal)
        }
        new_array
      end

      def get_my_proposals_from proposals, profile_id
        symbolize_array(proposals.select{ |proposal| proposal['profile_id'] == profile_id })
      end
    end
  end
end
