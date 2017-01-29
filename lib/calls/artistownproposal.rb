class ArtistOwnProposal

  def initialize user_id, call_id, params
    @form = get_artist_form call_id, params[:form_category]

    check_fields! params, user_id
    @artist_proposal = new_artist params, user_id
  end

  def check_fields! params, user_id
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type], field
    }
    raise Pard::Invalid::Params if params[:name].blank? || params[:email].blank?
    raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(user_id, params[:name])
    raise Pard::Invalid::Category unless correct_category? params[:category]
  end

  def [] key
    artist_proposal[key]
  end

  def to_h
    artist_proposal.to_h
  end

  private
  attr_reader :artist_proposal, :form
  def new_artist params, user_id
    proposal = new_proposal params
    artist_proposal = {
      user_id: user_id,
      profile_id: params[:profile_id] || (SecureRandom.uuid),
      email: params[:email],
      name: params[:name],
      phone: params[:phone],
      own: true,
      proposals: [proposal],
    }
  end

  def new_proposal params
    proposal = {
      proposal_id: params[:proposal_id] || (SecureRandom.uuid),
      category: params[:category],
      subcategory: params[:subcategory],
      form_category: params[:form_category],
      own: true
    }
    form.each{ |field, content| proposal[field] = params[field]}
    proposal
  end

  def correct_entry? value, type, field
    return !value.blank? if type == 'mandatory' && field.to_s.to_i == 0 
    true
  end

  def get_artist_form call_id, form_category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:artist].keys
    raise Pard::Invalid::Params unless categories.include? form_category.to_sym
    forms[:artist][form_category.to_sym]
  end

  def correct_category? category
    [
      'music', 
      'arts', 
      'expo', 
      'poetry', 
      'audiovisual', 
      'street_art', 
      'workshop', 
      'gastronomy', 
      'other'
    ].include? category
  end
end