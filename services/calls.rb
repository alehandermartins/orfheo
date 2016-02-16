require_relative '../lib/forms/artist_form'
require_relative '../lib/forms/space_form'
module Services
  class Calls
    class << self

      FORMS_MAP = {
        'artist' => ArtistForm,
        'space' => SpaceForm
      }

      def register call, user_id
        call.merge! user_id: user_id
        call.merge! call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
        Repos::Calls.add call
      end

      def exists? call_id
        Repos::Calls.exists?({call_id: call_id})
      end

      def wrong_category? params
        form_categories(params[:type], params[:category]) || params[:category].blank?
      end

      def wrong_form? params
        form_fundamentals(params[:type], params[:category]).any?{ |field|
          params[field].blank?
        }
      end

      def add_proposal params, user_id
        params.merge! user_id: user_id
        params.merge! proposal_id: SecureRandom.uuid if params[:proposal_id].blank?
        Repos::Calls.push({call_id: params[:call_id]}, params)
      end

      private
      def form_categories type, category
        (!FORMS_MAP[type].categories.include?('other') && !FORMS_MAP[type].categories.include?(category))
      end

      def form_fundamentals type, category
        FORMS_MAP[type].fields.map{ |field|
          field[:name].to_sym if fundamental?(field, category)
        }.compact
      end

      def fundamental? field, category
        (field[:category] == category || field[:category] == 'all') && field[:type] == 'mandatory'
      end
    end
  end
end
