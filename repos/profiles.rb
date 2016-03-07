module Repos
  class Profiles
    class << self

      def for db
        @@profiles_collection = db['profiles']
      end

      def add profile
        @@profiles_collection.insert(profile)
      end

      def exists? query
        @@profiles_collection.count(query: query) > 0
      end

      def grab query
        results = @@profiles_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
         string_keyed_hash_to_symbolized profile
        }
      end

      def update profile_id, new_fields
        @@profiles_collection.update({profile_id: profile_id},{
          "$set": new_fields
        },
        {upsert: true})
      end

      def push query, proposal
        @@profiles_collection.update(query,{
          "$push": {proposals: proposal}
        })
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
    end
  end
end
