module Repos
  class Users
    class << self

      def for db
        @@users_collection = db['users']
      end

      def add user
        @@users_collection.insert(user)
      end

      def exists? email
        !@@users_collection.find({
          email: email
        }).limit(1).to_a.empty?
      end
    end
  end
end
