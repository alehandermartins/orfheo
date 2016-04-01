module Repos
  class Profiles
    class << self

      def for db
        @@profiles_collection = db['profiles']
      end

      def update fields
        @@profiles_collection.update({profile_id: fields[:profile_id]},{
          "$set": fields
        },
        {upsert: true})
      end

      def name_available? name, profile_id
        query = {profile_id: {"$ne": profile_id}, name: name}
        @@profiles_collection.count(query: query) == 0
      end

      def add_proposal profile_id, proposal
        @@profiles_collection.update({profile_id: profile_id},{
          "$push": {proposals: proposal}
        })
      end

      def modify_proposal fields
        @@profiles_collection.update({"proposals.proposal_id": fields[:proposal_id]},{
          "$set": {"proposals.$": fields}
        },
        {upsert: true})
      end

      def exists? profile_id
        @@profiles_collection.count(query: {profile_id: profile_id}) > 0
      end

      def proposal_exists? proposal_id
        @@profiles_collection.count(query: {"proposals.proposal_id": proposal_id}) > 0
      end

      def profile_old_pictures profile_id, field
        profile = grab({profile_id: profile_id}).first
        return [] unless profile.has_key? field
        profile[field]
      end

      def proposal_old_pictures proposal_id, field
        profile = grab({"proposals.proposal_id": proposal_id}).first
        proposal = profile[:proposals].select{|proposal| proposal[:proposal_id] == proposal_id}.first
        return [] unless proposal.has_key? field
        proposal[field]
      end

      def get_profiles method, args = nil
        Scout.get(method, args)
      end

      def get_profile_owner profile_id
        profile = grab({profile_id: profile_id}).first
        profile[:user_id]
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
            grab({}).select{ |profile|
              non_empty_profile? profile
            }.shuffle
          end

          def all_user_aside args
            profiles = grab({})
            {
              my_profiles: profiles.select{ |profile| profile[:user_id] == args[:user_id]},
              profiles: profiles.select{ |profile|
                profile[:user_id] != args[:user_id] && non_empty_profile?(profile)
              }.shuffle
            }
          end

          def user_profiles args
            profiles = grab({user_id: args[:user_id]})
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
            profiles.each{ |profile|
              profile.merge! calls: Services::Calls.get_proposals_for(profile[:profile_id])
            }
          end

          def visit_profiles args
            profiles = grab({user_id: args[:user_id]})
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
          end

          def non_empty_profile? profile
            !profile[:proposals].blank? || profile[:type] == 'space'
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
