require_relative '../forms/artist_form'
require_relative '../forms/space_form'
class CallProposal

  FORMS_MAP = {
    'artist' => ArtistForm,
    'space' => SpaceForm
  }

  def initialize params, user_id
    @proposal = new_proposal params, user_id
  end

  def wrong_category?
    category.blank? || !category_allowed?
  end

  def wrong_params?
    wrong_basics? || wrong_form?
  end

  def [] key
    proposal[key]
  end

  def to_h
    proposal.to_h
  end

  private
  attr_reader :proposal

  def new_proposal params, user_id
    basic_fields(params, user_id).merge! form_fields(params)
  end

  def basic_fields params, user_id
    {
      user_id: user_id,
      profile_id: params[:profile_id],
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
      call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6',
      type: params[:type],
      category: params[:category]
    }
  end

  def form_fields params
    FORMS_MAP[params[:type]].fields.map{ |field|
      next unless necessary_field? field, params
      next [field[:name].to_sym, params[field[:name].to_sym]] unless params[field[:name].to_sym].nil?
    }.compact.to_h
  end

  def necessary_field? field, params
    field[:category] == 'all' || field[:category] == params[:category]
  end

  def type
    proposal[:type]
  end

  def category
    proposal[:category]
  end

  def category_allowed?
    FORMS_MAP[type].categories.include?('other') || FORMS_MAP[type].categories.include?(category)
  end

  def wrong_basics?
    [:user_id, :profile_id, :proposal_id, :call_id].any?{ |field|
      (UUID.validate proposal[field]).nil?
    }
  end

  def wrong_form?
    form_mandatories.any?{ |field|
      proposal[field].blank?
    }
  end

  def form_mandatories
    FORMS_MAP[type].fields.map{ |field|
      field[:name].to_sym if mandatory? field
    }.compact
  end

  def mandatory? field
    (field[:category] == category || field[:category] == 'all') && field[:type] == 'mandatory'
  end
end
