module Services
  class Calls
    class << self

      def register params, user_id
        call = Call.new params, user_id
        Repos::Calls.add call.to_h
      end

      def exists? call_id
        Repos::Calls.exists? call_id
      end

      def proposal_exists? proposal_id
        Repos::Calls.proposal_exists? proposal_id
      end

      def add_proposal params, user_id
        proposal = Proposal.new params, user_id
        raise Pard::Invalid::Category if proposal.wrong_category?
        raise Pard::Invalid::Params if proposal.wrong_params?
        Services::Profiles.add_production proposal.to_h, user_id if params[:type] == 'artist'
        Repos::Calls.add_proposal params[:call_id], proposal.to_h
      end

      def get_call_owner call_id
        Repos::Calls.get_call_owner call_id
      end

      def get_call call_id
        Repos::Calls.get_call call_id
      end

      def get_proposal_owner proposal_id
        Repos::Calls.get_proposal_owner proposal_id
      end

      def get_proposals_for profile_id
        Repos::Calls.get_proposals_for profile_id
      end

      def get_otter_proposals_for profile_id, type
        Repos::Calls.get_otter_proposals_for profile_id, type
      end

      def amend_proposal proposal_id, amend
        Repos::Calls.amend_proposal proposal_id, amend
      end

      def proposals_old_pictures production_id
        proposals = Repos::Calls.get_proposals_for_production production_id
        photos = []
        proposals.each{ |proposal|
          photos.push(proposal[:photos])
        }
        old_pictures = { photos: photos.compact.flatten }
      end

      def delete_proposal proposal_id
        proposal = Repos::Calls.get_proposal proposal_id
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
