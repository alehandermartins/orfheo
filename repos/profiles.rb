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
        !@@profiles_collection.find(query).limit(1).to_a.empty?
      end

      def grab query
        results = @@profiles_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
          profile.map do |k,v|
            next [k,v] unless k.is_a? String
            next [k.to_sym, string_keyed_hash_to_symbolized(v)] if v.is_a? Hash
            [k.to_sym, v]
          end.to_h
        }
      end
    end
  end
end
