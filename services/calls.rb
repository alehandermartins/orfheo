module Services
  class Calls
    class << self

      def register params, user_id
        call = Call.new params, user_id
        Repos::Calls.add call.to_h
      end

      def proposals_old_pictures production_id
        proposals = Repos::Calls.get_proposals(:production_proposals, {production_id: production_id})
        photos = []
        proposals.each{ |proposal|
          photos.push(proposal[:photos])
        }
        old_pictures = { photos: photos.compact.flatten }
      end

      def delete_proposal proposal_id
        proposal = Repos::Calls.get_proposals(:proposal, {proposal_id: proposal_id})
        old_pictures = {
          photos: proposal[:photos]
        }
        storable_pictures = Services::Profiles.production_old_pictures proposal[:production_id]
        Util.destroy_old_pictures old_pictures, storable_pictures 
        Repos::Calls.delete_proposal proposal_id
      end
    end
  end
end
