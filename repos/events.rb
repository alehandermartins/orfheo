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

      def get_event event_id
        event = grab({event_id: event_id}).first
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
      end

      def add_proposal event_id, profile_id, proposal
        @@calls_collection.update_one({event_id: event_id, 'participants': {profile_id: profile_id}},{
          "$push": {'participants.$.proposals': proposal}
        })
      end

      def proposal_exists? proposal_id
        return false unless UUID.validate(proposal_id)
       @@events_collection.count('participants.proposals': {proposal_id: proposal_id}) > 0
      end

      def get_proposals method, args = nil
        Scout.get(method, args)
      end

      def get_proposal_owner proposal_id
        proposal = get_proposals :proposal, {proposal_id: proposal_id}
        proposal[:user_id]
      end

      def modify_proposal proposal
        @@calls_collection.update_one({ 'participants.proposals': {proposal_id: proposal[:proposal_id]} },
          {
            "$set": {"participants.$.proposals": proposal}
          },
        {upsert: true})
      end

      def amend_proposal proposal_id, amend
        @@calls_collection.update_one({ "proposals.proposal_id": proposal_id },
          {
            "$set": {"proposals.$.amend": amend}
          },
        {upsert: true})
      end

      def add_program event_id, program
        @@calls_collection.update_one({ event_id: event_id },
          {
            "$set": {"program": program}
          },
        {upsert: true})
      end

      def delete_proposal proposal_id
        event = grab({"proposals.proposal_id": proposal_id}).first
        event[:proposals].reject!{|proposal| proposal[:proposal_id] == proposal_id}
        event[:program].reject!{|performance| performance[:participant_proposal_id] == proposal_id || performance[:host_proposal_id] == proposal_id} unless event[:program].blank?

        @@calls_collection.update_one({event_id: event[:event_id]},
          {
            "$set": {'proposals': event[:proposals], 'program': event[:program]}
          }
        )
      end

      #Managing call
      def call_exists? call_id
        return false unless UUID.validate(call_id)
        @@events_collection.count(call_id: call_id) > 0
      end

      def proposal_on_time? call_id, email
        call = grab({call_id: call_id}).first
        return true if !call[:whitelist].blank? && call[:whitelist].include?(email)
        call[:start].to_i < Time.now.to_i && call[:deadline].to_i > Time.now.to_i
      end

      def get_call call_id
        grab({call_id: call_id}).first
      end

      def get_calls profile_id
        grab({profile_id: profile_id})
      end
      
      def get_call_owner call_id
        call = grab({call_id: call_id}).first
        call[:user_id]
      end

      def add_whitelist call_id, whitelist
         @@calls_collection.update_one({ call_id: call_id },
          {
            "$set": {"whitelist": whitelist}
          },
        {upsert: true})
      end

      private
      def grab query
        results = @@events_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
         Util.string_keyed_hash_to_symbolized profile
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
            compose_info calls, proposals
          end

          def compose_info calls, proposals
            {
              calls: calls,
              proposals: proposals
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
            compose_info calls, proposals
          end

          def get_my_proposals_from results, key, id
            proposals = results.map{ |call| call[:proposals]}.flatten
            my_proposals = proposals.select{ |proposal| proposal[key] == id }
            my_proposals.map!{ |proposal|
              Util.string_keyed_hash_to_symbolized proposal
            }
          end
        end
      end
    end
  end
end
