module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
      end

      def add call
        @@calls_collection.insert(call)
      end

      def grab query
        results = @@calls_collection.find(query)
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
