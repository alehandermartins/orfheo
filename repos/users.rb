module Repos
  class Users
    class << self

      def for db
        @@users_collection = db['users']
      end

      def add user
        @@users_collection.insert(user)
      end

      def exists? query
        !@@users_collection.find(query).limit(1).to_a.empty?
      end

      def validate query
        modify query, {validation: true}
        delete_field query, :validation_code
      end

      def grab query
        result = {}
        @@users_collection.find(query).map{ |cursor|
          cursor.each{ |k,v|
            result[k.to_sym] = v
          }
        }
        result
      end

      def modify query, new_field
        @@users_collection.update(query,{
          "$set": new_field
        })
      end

      private
      def delete_field query, field
        @@users_collection.update(query,{
          "$unset": {"#{field}" => ""}
        })
      end
    end
  end
end
