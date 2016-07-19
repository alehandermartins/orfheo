module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        
      
        # call = grab({})[0]
        # if call[:order].blank?
        #   call[:order] = call[:proposals].map{ |proposal|
        #     proposal[:proposal_id] if proposal[:type] == 'space'
        #   }.compact
        #   @@calls_collection.update({event_id: call[:event_id]},{
        #     "$set": {"order": call[:order]}
        #   })
        # end

        # Repos::Events.add(call) unless (Repos::Events.event_exists? call[:event_id])

        # proposals = call[:proposals].each{ |proposal|
        #   availability = []
        #   availability = proposal[:availability].map{ |key, value|
        #     Time.parse(value).to_s.split(' ')[0] unless(value == 'false' || value.blank?)
        #   }.compact if( proposal.has_key? :availability && proposal[:availability].is_a?(Hash) && !proposal[:availability].blank?)
          
        #   availability = ['2016-10-15', '2016-10-16'] if(availability.empty?)
        #   proposal[:availability] = availability
        # }
        # unless (call['modified'] == 'true')
        #   @@calls_collection.update({event_id: call[:event_id]},{
        #     "$set": {"proposals": proposals}
        #   },
        #   {upsert: true})
        # end 
        # @@calls_collection.update({event_id: call[:event_id]},{
        #   "$set": {"modified": 'true'}
        # },
        # {upsert: true})
        # call = grab({})[0]
        # profiles = {}

        # call[:proposals].each{ |proposal|
        #   availability = []
        #   availability = proposal[:availability].map{ |key, value|
        #     Time.parse(value).to_s.split(' ')[0] unless(value == 'false')
        #   }.compact if( proposal.has_key? :availability && proposal[:availability].is_a?(Hash) && !proposal[:availability].blank?)
          
        #   availability = ['2016-10-15', '2016-10-16'] if(availability.empty?)
        #   proposal[:availability] = availability
        # }

        # participants = []
        # profiles.each{ |profile_id, proposals|
        #   participants.push(artist_fields(proposals)) if(proposals[0][:type] == 'artist')
        #   participants.push(space_fields(proposals)) if(proposals[0][:type] == 'space')
        # }
        # call.delete(:proposals)
        # call[:participants] = participants
        # Repos::Events.add(call) unless (Repos::Events.event_exists? call[:event_id])
      end

      def artist_fields proposals
        address = {
          locality: proposals[0][:city],
          postal_code: proposals[0][:zip_code]
        }
        fields = {
          user_id: proposals[0][:user_id],
          email: proposals[0][:email],
          profile_id: proposals[0][:profile_id],
          name: proposals[0][:name],
          type: proposals[0][:type],
          phone: proposals[0][:phone],
          address: address,
          proposals: []
        }

        proposals.each{ |proposal|
          availability = []
          availability = proposal[:availability].map{ |key, value|
            Time.parse(value).to_s.split(' ')[0] unless(value == 'false')
          }.compact if( proposal.has_key? :availability && proposal[:availability].is_a?(Hash) && !proposal[:availability].blank?)
          
          availability = ['2016-10-15', '2016-10-16'] if(availability.empty?)
          proposal[:availability] = availability

          proposal.delete(:photos)
          proposal.delete(:personal_web)
          proposal.delete(:links)
          proposal.delete(:whitelist)
          proposal.delete(:call_id)

          proposal.delete(:city)
          proposal.delete(:zip_code)
          proposal.delete(:user_id)
          proposal.delete(:email)
          proposal.delete(:profile_id)
          proposal.delete(:name)
          proposal.delete(:phone)
          proposal.delete(:program)
          fields[:proposals].push(proposal)
        }
        return fields
      end

      def space_fields proposals
        fields = {
          user_id: proposals[0][:user_id],
          email: proposals[0][:email],
          profile_id: proposals[0][:profile_id],
          name: proposals[0][:name],
          type: proposals[0][:type],
          category: proposals[0][:category],
          phone: proposals[0][:phone],
          address: proposals[0][:address],
          proposals: []
        }

        proposals.each{ |proposal|
          availability = []
          availability = proposal[:availability].map{ |key, value|
            Time.parse(value).to_s.split(' ')[0] unless(value == 'false')
          }.compact unless( !proposal.has_key? :availability || proposal[:availability].is_a?(Array) || proposal[:availability].blank?)
          
          availability = ['2016-10-15', '2016-10-16'] if(availability.empty?)
          proposal[:availability] = availability
          proposal.delete(:category)

          proposal.delete(:photos)
          proposal.delete(:personal_web)
          proposal.delete(:links)
          proposal.delete(:call_id)

          proposal.delete(:address)
          proposal.delete(:user_id)
          proposal.delete(:email)
          proposal.delete(:profile_id)
          proposal.delete(:name)
          proposal.delete(:phone)
          proposal.delete(:program)
          fields[:proposals].push(proposal)
        }
        return fields
      end

      def add call
        @@calls_collection.insert(call)
      end

      def event_exists? event_id
        return false unless UUID.validate(event_id)
        @@calls_collection.count(query: {event_id: event_id}) > 0
      end

      def exists? call_id
        return false unless UUID.validate(call_id)
        @@calls_collection.count(query: {call_id: call_id}) > 0
      end

      def proposal_exists? proposal_id
        return false unless UUID.validate(proposal_id)
       @@calls_collection.count(query: {"proposals.proposal_id": proposal_id}) > 0
      end

      def add_proposal call_id, proposal
        add_artist_proposal(call_id, proposal) if proposal[:type] == 'artist'
        add_space_proposal(call_id, proposal) if proposal[:type] == 'space'
      end

      def add_artist_proposal call_id, proposal
        @@calls_collection.update({call_id: call_id},{
          "$push": {proposals: proposal}
        })
      end

      def add_space_proposal call_id, proposal
        @@calls_collection.update({call_id: call_id},{
          "$push": {proposals: proposal, order: proposal[:proposal_id]}
        })
      end

      def get_call call_id
        grab({call_id: call_id}).first
      end

      def get_calls profile_id
        grab({profile_id: profile_id})
      end

      def get_event event_id
        event = grab({event_id: event_id}).first
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
      end

      def get_call_owner call_id
        call = grab({call_id: call_id}).first
        call[:user_id]
      end

      def get_proposals method, args = nil
        Scout.get(method, args)
      end

      def get_proposal_owner proposal_id
        proposal = get_proposals :proposal, {proposal_id: proposal_id}
        proposal[:user_id]
      end

      def proposal_on_time? call_id, email
        call = grab({call_id: call_id}).first
        return true if !call[:whitelist].blank? && call[:whitelist].include?(email)
        call[:start].to_i < Time.now.to_i && call[:deadline].to_i > Time.now.to_i
      end

      def modify_proposal proposal
        @@calls_collection.update({ "proposals.proposal_id": proposal[:proposal_id]},
          {
            "$set": {"proposals.$": proposal}
          },
        {upsert: true})
      end

      def amend_proposal proposal_id, amend
        @@calls_collection.update({ "proposals.proposal_id": proposal_id },
          {
            "$set": {"proposals.$.amend": amend}
          },
        {upsert: true})
      end

      def add_program event_id, program, order
        @@calls_collection.update({ event_id: event_id },
          {
            "$set": {'program': program, 'order': order}
          },
        {upsert: true})
      end

      def add_whitelist call_id, whitelist
        @@calls_collection.update({ call_id: call_id },
          {
            "$set": {"whitelist": whitelist}
          },
        {upsert: true})
      end

      def get_program event_id
        event = grab({event_id: event_id}).first
        event[:program].map{ |performance|
          artist = event[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:participant_proposal_id]}.first
          space = event[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:host_proposal_id]}.first
          order = event[:order].index(performance[:host_proposal_id])
          performance.merge! host_name: space[:name]
          performance.merge! address: space[:address]
          performance.merge! participant_name: artist[:name]
          performance.merge! title: artist[:title]
          performance.merge! participant_category: artist[:category]
          performance.merge! host_category: space[:category]
          performance.merge! order: order
        }
      end

      def delete_proposal proposal_id
        event = grab({"proposals.proposal_id": proposal_id}).first
        event[:proposals].reject!{|proposal| proposal[:proposal_id] == proposal_id}
        event[:program].reject!{|performance| performance[:participant_proposal_id] == proposal_id || performance[:host_proposal_id] == proposal_id} unless event[:program].blank?
        event[:order].reject! {|proposal_id| proposal_id == proposal_id} unless event[:order].blank?

        @@calls_collection.update({event_id: event[:event_id]},
          {
            "$set": {'proposals': event[:proposals], 'program': event[:program], 'order': event[:order]}
          }
        )
      end

      private
      def grab query
        results = @@calls_collection.find(query)
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
