class SpaceOwnProposal

  def initialize user_id, call_id, params
    @form = get_space_form call_id, params[:form_category]

    check_fields! params, user_id
    @space_proposal = new_space params, user_id
  end

  def check_fields! params, user_id
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type], field  
    }
    raise Pard::Invalid::Params if params[:name].blank? || params[:email].blank? || params[:address].blank?
    raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(user_id, params[:name])
    raise Pard::Invalid::Category unless correct_category? params[:category]
  end

  def [] key
    space_proposal[key]
  end

  def to_h
    space_proposal.to_h
  end

  private
  attr_reader :space_proposal, :form
  def new_space params, user_id
    space_proposal = {
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
    form.each{ |field, content| space_proposal[field] = params[field]} 
    space_proposal
  end

   def get_space_form call_id, form_category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:space].keys
    raise Pard::Invalid::Params unless categories.include? form_category.to_sym
    forms[:space][form_category.to_sym]
  end

  def correct_entry? value, type, field
    return !value.blank? if type == 'mandatory' && field.to_s.to_i == 0
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
end