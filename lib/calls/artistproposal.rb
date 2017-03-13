class ArtistProposal

  def initialize user_id, params
    @params = params
    @user = Repos::Users.grab({user_id: user_id})
    @event = Repos::Events.get_event params[:event_id]
    raise Pard::Invalid::UnexistingEvent if event.blank?
    @artist = event[:artists].detect{|ev_artist| ev_artist[:proposals].any?{ |proposal| proposal[:proposal_id] == params[:proposal_id]}}
  end

  def create
    @profile = Repos::Profiles.get_profile params[:profile_id]
    @form = get_artist_form
    check_fields!

    raise Pard::Invalid::UnexistingProfile if profile.blank?
    raise Pard::Invalid::ProfileOwnership unless profile[:user_id] == user[:user_id]
    raise Pard::Invalid::Deadline unless on_time?
    raise Pard::Invalid::Params if params[:phone][:value].blank?
    raise Pard::Invalid::Params if params[:conditions] != 'true'
    
    add_phone if profile[:phone][:value].blank?
    @artist = new_artist
  end

  def amend
    raise Pard::Invalid::UnexistingProposal if artist.blank?
    raise Pard::Invalid::ProposalOwnership unless artist[:user_id] == user[:user_id]
    raise Pard::Invalid::Deadline unless on_time?
    amend_arist
  end

  def modify
    @form = get_artist_form
    check_fields!
    raise Pard::Invalid::EventOwnership unless event[:user_id] == user[:user_id]
    modify_artist
  end

  def own
    raise Pard::Invalid::UnexistingProposal if artist.blank?
    proposal = artist[:proposals].detect{ |proposal| proposal[:proposal_id] == params[:proposal_id]}
    return true unless proposal[:own].blank?
  end

  def delete
    raise Pard::Invalid::UnexistingProposal if artist.blank?
    raise Pard::Invalid::ProposalOwnership unless event[:user_id] == user[:user_id] || artist[:user_id] == user[:user_id]
    raise Pard::Invalid::Deadline unless on_time? || event[:user_id] == user[:user_id]
    send_rejection_mail if user[:user_id] == event[:user_id] && user[:user_id] != artist[:user_id]
  end

  def proposal_id
    artist[:proposals].first[:proposal_id]
  end
 
  def [] key
    artist[key]
  end

  def to_h
    artist.to_h
  end

  private
  attr_reader :artist, :event, :user, :profile, :form, :params
  def check_fields!
    raise Pard::Invalid::Category unless correct_category?
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type]
    }
  end

  def new_artist
    artist = {
      user_id: user[:user_id],
      profile_id: profile[:profile_id],
      email: user[:email],
      name: profile[:name],
      address: profile[:address],
      phone: profile[:phone],
      type: profile[:type],
      proposals: [new_proposal]
    }
  end

  def new_proposal
    proposal = {
      production_id: params[:production_id],
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
      category: params[:category],
      subcategory: params[:subcategory],
      form_category: params[:form_category],
      amend: params[:amend]
    }
    form.each{ |field, content| proposal[field] = params[field]}
    proposal
  end

  def get_artist_form
    form_category = params[:form_category].to_sym
    forms = Repos::Calls.get_forms params[:call_id]
    raise Pard::Invalid::UnexistingCall if forms.blank?
    categories = forms[:es][:artist].keys
    raise Pard::Invalid::Params unless categories.include? form_category 
    forms[:es][:artist][form_category]
  end

  def correct_entry? value, type
    return !value.blank? if type == 'mandatory'
    true
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

  def on_time?
    return true if event[:user_id] == user[:user_id] || event[:whitelist].any?{ |whitelisted| whitelisted[:email] == user[:email] }
    event[:start].to_i/1000 < Time.now.to_i && event[:deadline].to_i/1000 > Time.now.to_i
  end

  def modify_artist
    [:address].each{ |field| artist[field] = params[field] unless params[field].blank?}
    proposal = artist[:proposals].detect{ |proposal| proposal[:proposal_id] == params[:proposal_id]}
    form.each{ |field, content| proposal[field] = params[field] unless params[field].blank?}
    artist[:proposals] = [proposal]
  end

  def amend_arist
    proposal = artist[:proposals].detect{ |proposal| proposal[:proposal_id] == params[:proposal_id]}
    proposal[:amend] = params[:amend]
    artist[:proposals] = [proposal]
  end

  def send_rejection_mail
    receiver = Repos::Users.grab({email: artist[:email]})
    payload = {organizer: event[:organizer], event_name: event[:name], title: artist[:proposals].first[:title]}
    Services::Mails.deliver_mail_to receiver, :rejected, payload
  end

  def add_phone
    profile[:phone] = params[:phone]
    Repos::Profiles.update profile
  end
end