module Repos
  class Users
    class << self

      def for db
        @@users_collection = db['users']
        users = @@users_collection.find({})
        users.each{ |user|
          next unless user[:lang].blank?
          modify({user_id: user[:user_id]}, {lang: 'es'})  
        }
      end

      def add user
        @@users_collection.insert_one(user)
      end

      def modify query, new_field
        @@users_collection.update_one(query,{
          "$set": new_field
        })
      end

      def exists? query
        @@users_collection.count(query) > 0
      end

      def validate validation_code
        query = {validation_code: validation_code}
        user = grab query
        modify query, {validation: true}
        delete_field query, :validation_code
        user[:user_id]
      end

      def reseted_user email
        modify({email: email}, {validation_code: SecureRandom.uuid})
        grab({email: email})
      end

      def grab query
        results = @@users_collection.find(query)
        return {} unless results.count > 0

        results.map { |user|
         Util.string_keyed_hash_to_symbolized user
        }.first
      end

      def delete_user user_id
        @@users_collection.delete_one({user_id: user_id})
      end
      
      private
      def delete_field query, field
        @@users_collection.update_one(query,{
          "$unset": {"#{field}" => ""}
        })
      end
    end
  end
end
