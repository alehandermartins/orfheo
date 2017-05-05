module Pard
  module Test
    module DbTools

      def mongo_uri
        config = YAML::load( File.read(File.expand_path('../../../config/config.yml', __FILE__)))[ENV['RACK_ENV']]
        config['mongo_uri']
      end

      def prepare_db
        @db = Mongo::Client.new(mongo_uri)
        Repos::Users.for @db
        Repos::Profiles.for @db
        Repos::Events.for @db
        Repos::Calls.for @db
      end

      def drop_collections
        connection = Mongo::Client.new(mongo_uri)
        connection.collections.each{ |c|
          c.drop
        }
      end
    end
  end
end

