class ArtistProposal

  def initialize user_id, event_id, call_id, params
    @event = Repos::Events.get_event event_id
    @user = Repos::Users.grab({user_id: user_id})
    @profile = Repos::Profiles.get_profile params[:profile_id]
    @form = get_artist_form call_id, params[:form_category]

    check_fields! params
    @artist_proposal = new_artist params
  end

  def check_fields! params
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type]
    }
    raise Pard::Invalid::Category unless correct_category? params[:category]
    raise Pard::Invalid::Deadline unless on_time?
    raise Pard::Invalid::UnexistingProfile if profile.blank?
    raise Pard::Invalid::ProfileOwnership unless profile[:user_id] == user[:user_id]
  end

  def [] key
    artist_proposal[key]
  end

  def amend amendment
    artist_proposal[:proposals].first[:amend] = amendment
  end

  def to_h
    artist_proposal.to_h
  end

  private
  attr_reader :artist_proposal, :event, :user, :profile, :form
  def new_artist params
    proposal = new_proposal params
    artist_proposal = {
      user_id: user[:user_id],
      profile_id: profile[:profile_id],
      email: user[:email],
      name: profile[:name],
      address: params[:address] || profile[:address],
      phone: params[:phone] || profile[:phone],
      proposals: [proposal]
    }
  end

  def new_proposal params
    proposal = {
      production_id: params[:production_id],
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
      category: params[:category],
      subcategory: params[:subcategory],
      form_category: params[:form_category]
    }
    form.each{ |field, content| proposal[field] = params[field]}
    proposal
  end

  def get_artist_form call_id, form_category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:artist].keys
    raise Pard::Invalid::Params unless categories.include? form_category.to_sym
    forms[:artist][form_category.to_sym]
  end

  def correct_entry? value, type
    return !value.blank? if type == 'mandatory'
    true
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

  def on_time?
    return true if event[:user_id] == user[:user_id] || event[:whitelist].any?{ |whitelisted| whitelisted[:email] == user[:email] }
    event[:start].to_i/1000 < Time.now.to_i && event[:deadline].to_i/1000 > Time.now.to_i
  end
end
