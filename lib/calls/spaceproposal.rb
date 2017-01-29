class SpaceProposal

  def initialize user_id, event_id, call_id, params
    @event = Repos::Events.get_event event_id
    @user = Repos::Users.grab({user_id: user_id})
    @profile = Repos::Profiles.get_profile params[:profile_id]
    @form = get_space_form call_id, params[:form_category]

    check_fields! params
    @space_proposal = new_space params
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
    space_proposal[key]
  end

  def amend amendment
    space_proposal[:amend] = amendment
  end

  def to_h
    space_proposal.to_h
  end

  private
  attr_reader :space_proposal, :event, :user, :profile, :form
  def new_space params
    space_proposal = {
      user_id: user[:user_id],
      profile_id: profile[:profile_id],
      email: user[:email],
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
      category: profile[:category],
      name: profile[:name],
      address: params[:address] || profile[:address],
      description: profile[:bio],
      phone: params[:phone] || profile[:phone],
      subcategory: params[:subcategory],
      form_category: params[:form_category]
    }
    form.each{ |field, content| space_proposal[field] = params[field]} 
    space_proposal
  end

  def get_space_form call_id, form_category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:space].keys
    raise Pard::Invalid::Params unless categories.include? form_category.to_sym
    forms[:space][form_category.to_sym]
  end

  def correct_entry? value, type
    return !value.blank? if type == 'mandatory'
    true
  end

  def correct_category? category
    [
      'cultural_ass',
      'home',
      'commercial',
      'open_air'
    ].include? category
  end

  def on_time?
    return true if event[:user_id] == user[:user_id] || event[:whitelist].any?{ |whitelisted| whitelisted[:email] == user[:email] }
    event[:start].to_i/1000 < Time.now.to_i && event[:deadline].to_i/1000 > Time.now.to_i
  end
end