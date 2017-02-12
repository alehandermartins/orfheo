class ArtistOwnProposal

  def initialize user_id, params
    @user_id = user_id
    @params = params
    @event = Repos::Events.get_event params[:event_id]
    raise Pard::Invalid::UnexistingEvent if event.blank?
    @artist = event[:artists].detect{|ev_artist| ev_artist[:proposals].any?{ |proposal| proposal[:proposal_id] == params[:proposal_id]}}
  end

  def create
    @form = get_artist_form
    check_fields!
    @artist = new_artist
  end

  def modify
    @form = get_artist_form
    check_fields!
    modify_artist
  end

  def [] key
    artist[key]
  end

  def to_h
    artist.to_h
  end

  private
  attr_reader :artist, :params, :event, :user_id, :form
  def check_fields!
    raise Pard::Invalid::EventOwnership unless event[:user_id] == user_id
    raise Pard::Invalid::Params if params[:name].blank? || params[:email].blank?
    raise Pard::Invalid::Params if params[:phone].blank?
    raise Pard::Invalid::Category unless correct_category?
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type], field
    }
    raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(user_id, params[:name])
  end

  def new_artist
    proposal = new_proposal
    artist = {
      user_id: user_id,
      profile_id: params[:profile_id] || (SecureRandom.uuid),
      email: params[:email],
      name: params[:name],
      phone: params[:phone],
      type: 'artist',
      own: true,
      proposals: [proposal],
    }
  end

  def new_proposal
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

  def get_artist_form
    form_category = params[:form_category].to_sym
    forms = Repos::Calls.get_forms params[:call_id]
    raise Pard::Invalid::UnexistingCall if forms.blank?
    categories = forms[:artist].keys
    raise Pard::Invalid::Params unless categories.include? form_category 
    forms[:artist][form_category]
  end

  def correct_category?
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
    ].include? params[:category]
  end

  def modify_artist
    [:email, :name, :address, :phone].each{ |field| artist[field] = params[field] unless params[field].blank?}
    proposal = artist[:proposals].detect{ |proposal| proposal[:proposal_id] == params[:proposal_id]}
    proposal.each{ |field, value| proposal[field] = params[field] unless params[field].blank?}
    artist[:proposals] = [proposal]
  end
end