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
        result = {}
        @@profiles_collection.find(query).map{ |cursor|
          cursor.each{ |key,value|
            result[key.to_sym] = value unless key == "_id"
          }
        }
        result
      end
    end
  end
end
