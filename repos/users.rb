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

      def validated? query
        grab(query)['validation'] == true
      end

      private
      def delete_field query, field
        @@users_collection.update(query,{
          "$unset": {"#{field}" => ""}
        })
      end

      def modify query, new_field
        @@users_collection.update(query,{
          "$set": new_field
        })
      end

      def grab query
        @@users_collection.find(query).map{ |cursor|
          cursor.each{ |k,v|
            {k.to_s => v}
          }
        }.first
      end
    end
  end
end
