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
    end
  end
end
