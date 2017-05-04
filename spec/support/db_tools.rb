module Pard
  module Test
    module DbTools
      def prepare_db
        @db = Mongo::Client.new('mongodb://localhost:27017/cg_test')
        Repos::Users.for @db
        Repos::Profiles.for @db
        Repos::Events.for @db
        Repos::Calls.for @db
      end

      def drop_collections
        connection = Mongo::Client.new('mongodb://localhost:27017/cg_test')
        connection.collections.each{ |c|
          c.drop
        }
      end
    end
  end
end

