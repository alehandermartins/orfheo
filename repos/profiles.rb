module Repos
  class Profiles
    class << self

      def for db
        @@profiles_collection = db['profiles']
        profiles = grab({})
        profiles.each{ |profile|
          next unless profile[:address].blank?
          profile[:address] = {
            locality: profile[:city],
            postal_code: profile[:zip_code]
          }
          profile.delete(:city)
          profile.delete(:zip_code)
        }
        profiles.each{ |profile|
          update profile
        }
      end

      def update profile
        @@profiles_collection.update_one({profile_id: profile[:profile_id]},{
          "$set": profile,
        },
        {upsert: true})
        @@profiles_collection.update_one({profile_id: profile[:profile_id]},{
          "$unset": {'city': '', 'zip_code': ''}
        },
        {upsert: true})
      end

      def name_available? user_id, name
        @@profiles_collection.count(user_id: {"$ne": user_id}, name: name) == 0
      end

      def add_production profile_id, production
        @@profiles_collection.update_one({profile_id: profile_id},{
          "$push": {productions: production}
        })
      end

      def modify_production production
        @@profiles_collection.update_one({"productions.production_id": production[:production_id]},{
          "$set": {"productions.$": production}
        },
        {upsert: true})
      end

      def exists? profile_id
        return false unless UUID.validate(profile_id)
        @@profiles_collection.count(profile_id: profile_id) > 0
      end

      def production_exists? production_id
        return false unless UUID.validate(production_id)
        @@profiles_collection.count("productions.production_id": production_id) > 0
      end

      def get_profiles method, args = nil
        Scout.get(method, args)
      end

      def get_profile_owner profile_id
        profile = grab({profile_id: profile_id}).first
        profile[:user_id]
      end

      def get_production_owner production_id
        profile = grab({"productions.production_id": production_id}).first
        profile[:user_id]
      end

      def delete_production production_id
        @@profiles_collection.update_one({ "productions.production_id": production_id },
          {
            "$pull": {'productions': {'production_id' => production_id}}
          }
        )
      end

      def delete_profile profile_id
        @@profiles_collection.delete_one(profile_id: profile_id)
      end

      private
      def grab query
        results = @@profiles_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
         Util.string_keyed_hash_to_symbolized profile
        }
      end

      class Scout < Profiles
        class << self
          def get method, args
            Scout.send(method, args)
          end

          def all args
            grab({}).shuffle
          end

          def profile args
            profile_id = args[:profile_id]
            profile = grab({profile_id: profile_id}).first
            events = Repos::Events.my_events(profile_id)
            proposals = Repos::Events.my_artist_proposals(profile_id) if profile[:type] == 'artist'
            proposals = Repos::Events.my_space_proposals(profile_id) if profile[:type] == 'space'
            program = Repos::Events.my_program(profile_id)
            profile.merge! ({events: events, proposals: proposals, program: program})
          end

          def production args
            results = grab({ "productions.production_id": args[:production_id]})
            return [] unless results.count > 0
            productions = results.first[:productions]
            the_production = productions.select{ |element| element[:production_id] == args[:production_id] }.first
            Util.string_keyed_hash_to_symbolized the_production
          end

          def user_profiles args
            profiles = grab({user_id: args[:user_id]})
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
            profiles.each{ |profile|
              events = Repos::Events.my_events(profile[:profile_id])
              proposals = Repos::Events.my_artist_proposals(profile[:profile_id]) if profile[:type] == 'artist'
              proposals = Repos::Events.my_space_proposals(profile[:profile_id]) if profile[:type] == 'space'
              program = Repos::Events.my_program(profile[:profile_id])
              profile.merge! ({events: events, proposals: proposals, program: program})
            }
          end

          def visit_profiles args
            profiles = grab({user_id: args[:user_id]})
            profiles.each{ |profile|
              events = Repos::Events.my_events(profile[:profile_id])
              program = Repos::Events.my_program(profile[:profile_id])
              profile.merge! ({events: events, program: program})
            }
            profiles = sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
            profiles
          end

          def event_profiles args
            event = Repos::Events.get_event args[:event_id]
            participant_ids = event[:program].map{ |performance|
              [performance[:participant_id], performance[:host_id]]
            }.flatten.compact.uniq
            grab({profile_id: {"$in": participant_ids}})
          end

          def sort_profiles profiles, profile_id
            index = profiles.index{|profile| profile[:profile_id] == profile_id}
            profiles.insert(0, profiles.delete_at(index))
          end
        end
      end
    end
  end
end
