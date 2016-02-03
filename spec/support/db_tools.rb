module Pard
  module Test
    module DbTools
      def prepare_db
        @db = Mongo::Connection.new['cg_test']
        Repos::Users.for @db
      end

      def drop_collections
        connection = Mongo::Connection.new
        connection['cg_test'].collections.each{ |c|
          c.drop
        }
      end
    end
  end
end

