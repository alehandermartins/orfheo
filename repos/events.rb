module Repos
  class Events
    class << self

      def for db
        @@events_collection = db['events']
      end

      def add event
        @@events_collection.insert_one(event)
      end

      def exists? event_id
        return false unless UUID.validate(event_id)
        @@events_collection.count(event_id: event_id) > 0
      end

      def performance_exists? event_id, performance
        @@events_collection.count({
          event_id: event_id,
          "program.performance_id": performance[:performance_id],
          "artists.proposals.proposal_id": performance[:participant_proposal_id],
          "spaces.profile_id": performance[:host_id]}) > 0
      end

      def get_event event_id
        event = grab({event_id: event_id}).first
        event[:program] = arrange_program event
        event
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
      end

      def add_artist event_id, artist
        @@events_collection.update_one({event_id: event_id},{
          "$push": {artists: artist}
        })
      end

      def add_space event_id, space
        @@events_collection.update_one({event_id: event_id},{
          "$push": {spaces: space}
        })
      end

      def add_artist_proposal event_id, profile_id, proposal
        @@events_collection.update_one({event_id: event_id, "artists.profile_id": profile_id},
          {
            "$push": {"artists.$.proposals": proposal}
          },
        {upsert: true})
      end

      def add_performance event_id, performance
        @@events_collection.update_one({event_id: event_id},{
          "$push": {program: performance}
        })
      end

      def modify_performance event_id, performance
        @@events_collection.update_one({event_id: event_id, "program.performance_id": performance[:performance_id]},
          {
            "$set": {"program.$": performance}
          },
        {upsert: true})
      end

      def delete_performance event_id, performance_id
        @@events_collection.update_one({ event_id: event_id },
          {
            "$pull": {'program': {'performance_id' => performance_id}}
          }
        )
      end

      def performers_participate? event_id, performance
        @@events_collection.count({
          event_id: event_id,
          "artists.proposals.proposal_id": performance[:participant_proposal_id],
          "spaces.profile_id": performance[:host_id]}) > 0
      end

      def get_program event_id
        event = grab({event_id: event_id}).first
        arrange_program event
      end

      def arrange_program event
        event[:program].map{ |performance|
          artist = event[:artists].select{ |participant| participant[:profile_id] == performance[:participant_id]}.first
          artist_proposal = artist[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:participant_proposal_id]}.first
          
          space = event[:spaces].select{ |participant| participant[:profile_id] == performance[:host_id]}.first
          order = event[:order].index(performance[:host_proposal_id])

          performance.merge! host_name: space[:name]
          performance.merge! address: space[:address]
          performance.merge! host_category: space[:category]
          performance.merge! participant_name: artist[:name]
          performance.merge! title: artist_proposal[:title]
          performance.merge! short_description: artist_proposal[:short_description]
          performance.merge! children: artist_proposal[:children]
          performance.merge! participant_category: artist_proposal[:category]
          performance.merge! order: order
        }
      end

      private
      def grab query
        results = @@events_collection.find(query)
        return [] unless results.count > 0

        results.map { |event|
         Util.string_keyed_hash_to_symbolized event
        }
      end

      class Scout < Calls
        class << self
          def get method, args
            Scout.send(method, args)
          end

          def proposal args
            results = grab({ "proposals.proposal_id": args[:proposal_id] })
            get_my_proposals_from(results, :proposal_id, args[:proposal_id]).first
          end

          def production_proposals args
            results = grab({ "proposals.production_id": args[:production_id]})
            get_my_proposals_from(results, :production_id, args[:production_id])
          end

          def profile_info args
            calls = grab({profile_id: args[:profile_id]}).each{ |call|
              call.delete(:proposals)
              call.delete(:program)
            }
            proposals = grab({ "proposals.profile_id": args[:profile_id]})
            proposals = get_my_proposals_from(proposals, :profile_id, args[:profile_id])
            program = grab({ "$or": [{ "program.participant_id": args[:profile_id]}, {"program.host_id": args[:profile_id]}]})
            program = get_my_program_from(program, args[:profile_id])
            compose_info calls, proposals, program
          end

          def compose_info calls, proposals, program
            {
              calls: calls,
              proposals: proposals,
              program: program
            }
          end

          def otter_profile_info args
            calls = grab({profile_id: args[:profile_id]}).each{ |call|
              requester = Repos::Users.grab({user_id: args[:requester]})
              call[:whitelist] = false unless !call[:whitelist].blank? && call[:whitelist].any?{ |user| user[:email] == requester[:email] } 
              call[:whitelist] = true if !call[:whitelist].blank? && call[:whitelist].any?{ |user| user[:email] == requester[:email] }
              call.delete(:proposals)
              call.delete(:program)
            }
            proposals = grab({ "proposals.profile_id": args[:profile_id]})
            proposals = get_my_proposals_from(proposals, :profile_id, args[:profile_id])
            proposals.map!{ |proposal|
              next proposal[:title] if proposal[:type] == 'artist'
              next proposal[:description] if proposal[:type] == 'space'
            }.compact
            program = grab({ "$or": [{ "program.participant_id": args[:profile_id]},{"program.host_id": args[:profile_id]}]})
            program = get_my_program_from(program, args[:profile_id])
            compose_info calls, proposals, program
          end

          def get_my_proposals_from results, key, id
            proposals = results.map{ |call| call[:proposals]}.flatten
            my_proposals = proposals.select{ |proposal| proposal[key] == id }
            my_proposals.map!{ |proposal|
              Util.string_keyed_hash_to_symbolized proposal
            }
          end

          def get_my_program_from results, id
            results.map{ |event| 
              my_performances = event[:program].select{|performance| performance[:participant_id] == id || performance[:host_id] == id}
              my_performances.map{ |performance|
                artist = event[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:participant_proposal_id]}.first
                space = event[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:host_proposal_id]}.first
                order = event[:order].index(performance[:host_proposal_id])
                performance.merge! event_id: event[:event_id]
                performance.merge! host_name: space[:name]
                performance.merge! address: space[:address]
                performance.merge! participant_name: artist[:name]
                performance.merge! title: artist[:title]
                performance.merge! short_description: artist[:short_description]
                performance.merge! children: artist[:children]
                performance.merge! participant_category: artist[:category]
                performance.merge! host_category: space[:category]
                performance.merge! order: order
              }
            }.flatten
          end
        end
      end
    end
  end
end
