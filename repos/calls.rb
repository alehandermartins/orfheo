module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
      end

      def add call
        @@calls_collection.insert(call)
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
        @@calls_collection.update({call_id: call_id},{
          "$push": {proposals: proposal}
        })
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

      def amend_proposal proposal_id, amend
        @@calls_collection.update({ "proposals.proposal_id": proposal_id },
          {
            "$set": {"proposals.$.amend": amend}
          },
        {upsert: true})
      end

      def add_program call_id, program
        program.each{ |proposal|
          @@calls_collection.update({ call_id: call_id, "proposals.proposal_id": proposal[:proposal_id]},
            {
              "$set": {"proposals.$.program": proposal[:program]}
            },
          {upsert: true})
        }
      end

      def add_whitelist call_id, whitelist
         @@calls_collection.update({ call_id: call_id },
          {
            "$set": {"whitelist": whitelist}
          },
        {upsert: true})
      end

      def delete_proposal proposal_id
        call = grab({"proposals.proposal_id": proposal_id}).first
        proposals = call[:proposals].each{ |proposal|
          next unless proposal.has_key? :program
          proposal[:program].each{ |event|
            proposal[:program].delete(event) if event[:proposal_id] == proposal_id
          }
        }
        proposals.reject!{|proposal| proposal[:proposal_id] == proposal_id}
        @@calls_collection.update({ call_id: call[:call_id] },
          {
            "$set": {'proposals': proposals}
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

          def profile_proposals args
            results = grab({ "proposals.profile_id": args[:profile_id]})
            get_my_proposals_from(results, :profile_id, args[:profile_id])
          end

          def otter_profile_proposals args
            proposals_info = []
            profile_proposals(args).each{ |proposal|
              proposals_info.push(proposal[:title]) if args[:type] == 'artist'
              proposals_info.push(proposal[:description]) if args[:type] == 'space'
            }
            proposals_info
          end

          def get_my_proposals_from results, key, id
            proposals = results.map{ |call| call[:proposals]}.flatten
            my_proposals = proposals.select{ |proposal| proposal[key] == id }
            my_proposals.map!{ |proposal|
              Util.string_keyed_hash_to_symbolized proposal
            }
            my_proposals.each{ |proposal|
              remove_sensitive_fields proposal
            }
          end

          def remove_sensitive_fields proposal
            proposal.delete(:email)
            proposal.delete(:address)
            proposal.delete(:city)
            proposal.delete(:zip_code)
            proposal
          end
        end
      end
    end
  end
end
