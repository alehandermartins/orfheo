class SpaceProposal

  def initialize user_id, params
    @params = params
    @user = Repos::Users.grab({user_id: user_id})
    @event = Repos::Events.get_event params[:event_id]
    raise Pard::Invalid::UnexistingEvent if event.blank?
    @space = event[:spaces].detect{|ev_space| ev_space[:proposal_id] == params[:proposal_id]}
  end

  def create
    @profile = Repos::Profiles.get_profile params[:profile_id]
    @form = get_space_form
    check_fields!

    raise Pard::Invalid::UnexistingProfile if profile.blank?
    raise Pard::Invalid::ProfileOwnership unless profile[:user_id] == user[:user_id]
    raise Pard::Invalid::Deadline unless on_time?

    add_phone if profile[:phone].blank?
    @space = new_space
  end

  def amend
    raise Pard::Invalid::UnexistingProposal if space.blank?
    raise Pard::Invalid::ProposalOwnership unless space[:user_id] == user[:user_id]
    raise Pard::Invalid::Deadline unless on_time?
    amend_space
  end

  def modify
    @form = get_space_form
    check_fields!
    raise Pard::Invalid::EventOwnership unless event[:user_id] == user[:user_id]
    modify_space
  end

  def own
    raise Pard::Invalid::UnexistingProposal if space.blank?
    return true unless space[:own].blank?
  end

  def delete
    raise Pard::Invalid::UnexistingProposal if space.blank?
    raise Pard::Invalid::ProposalOwnership unless event[:user_id] == user[:user_id] || space[:user_id] == user[:user_id]
    raise Pard::Invalid::Deadline unless on_time? || event[:user_id] == user[:user_id]
    send_rejection_mail if user[:user_id] == event[:user_id] && user[:user_id] != space[:user_id]
  end

  def proposal_id
    space[:proposal_id]
  end

  def [] key
    space[key]
  end

  def to_h
    space.to_h
  end

  private
  attr_reader :space, :event, :user, :profile, :form, :params
  def check_fields!
    raise Pard::Invalid::Category unless correct_category?
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type]
    }
  end

  def new_space
    space = {
      user_id: user[:user_id],
      profile_id: profile[:profile_id],
      email: user[:email],
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
      category: profile[:category],
      name: profile[:name],
      address: params[:address] || profile[:address],
      description: profile[:bio],
      phone: profile[:phone],
      subcategory: params[:subcategory],
      form_category: params[:form_category],
      amend: params[:amend]
    }
    form.each{ |field, content| space[field] = params[field]} 
    space
  end

  def get_space_form
    form_category = params[:form_category].to_sym
    forms = Repos::Calls.get_forms params[:call_id]
    raise Pard::Invalid::UnexistingCall if forms.blank?
    categories = forms[:space].keys
    raise Pard::Invalid::Params unless categories.include? form_category
    forms[:space][form_category]
  end

  def correct_entry? value, type
    return !value.blank? if type == 'mandatory'
    true
  end

  def correct_category?
    [
      'cultural_ass',
      'home',
      'commercial',
      'open_air'
    ].include? params[:category]
  end

  def on_time?
    return true if event[:user_id] == user[:user_id] || event[:whitelist].any?{ |whitelisted| whitelisted[:email] == user[:email] }
    event[:start].to_i/1000 < Time.now.to_i && event[:deadline].to_i/1000 > Time.now.to_i
  end

  def modify_space
    [:address].each{ |field| space[field] = params[field] unless params[field].blank?}
    form.each{ |field, content| space[field] = params[field] unless params[field].blank?}
  end

  def amend_space
    space[:amend] = params[:amend]
  end

  def send_rejection_mail
    receiver = {email: space[:email]}
    payload = {organizer: event[:organizer], event_name: event[:name], title: space[:name]}
    Services::Mails.deliver_mail_to receiver, :rejected, payload
  end

  def add_phone
    profile[:phone] = params[:phone]
    Repos::Profiles.update profile
  end
end