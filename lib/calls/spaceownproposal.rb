class SpaceOwnProposal

  def initialize user_id, params
    @user_id = user_id
    @params = params
    @event = Repos::Events.get_event params[:event_id]
    raise Pard::Invalid::UnexistingEvent if event.blank?
    @space = event[:spaces].detect{|ev_space| ev_space[:profile_id] == params[:profile_id]}
  end

  def create
    @form = get_space_form
    check_fields!
    @space = new_space
  end

  def modify
    @form = get_space_form
    check_fields!
    modify_space
  end

  def [] key
    space[key]
  end

  def to_h
    space.to_h
  end

  private
  attr_reader :space, :params, :event, :user_id, :form
  def check_fields!
    raise Pard::Invalid::EventOwnership unless event[:user_id] == user_id
    raise Pard::Invalid::Params if params[:name].blank? || params[:email].blank?
    raise Pard::Invalid::Category unless correct_category?
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type], field
    }
    raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(user_id, params[:name])
  end

  def new_space
    space = {
      user_id: user_id,
      profile_id: params[:profile_id] || (SecureRandom.uuid),
      email: params[:email],
      name: params[:name],
      address: params[:address],
      proposal_id: params[:proposal_id] || (SecureRandom.uuid),
      category: params[:category],
      description: params[:description],
      phone: params[:phone],
      subcategory: params[:subcategory],
      form_category: params[:form_category],
      own: true
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

  def correct_entry? value, type, field
    return !value.blank? if type == 'mandatory' && field.to_s.to_i == 0 
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
end