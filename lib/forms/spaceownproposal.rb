class SpaceOwnProposal

  def initialize params, user_id, form
    check_fields params, form
    @space_proposal = new_space params, user_id, form
  end

  def check_fields params, form
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type], field  
    }
    raise Pard::Invalid::Params if params[:name].blank? || params[:email].blank? || params[:address].blank?
  end

  def correct_entry? value, type, field
    return !value.blank? if type == 'mandatory' && field.to_s.to_i == 0
    true
  end

  def [] key
    space_proposal[key]
  end

  def to_h
    space_proposal.to_h
  end

  private
  attr_reader :space_proposal
  def new_space params, user_id, form
    space_proposal = {
      user_id: user_id,
      profile_id: params[:profile_id] || (SecureRandom.uuid + '-own'),
      email: params[:email],
      name: params[:name],
      address: params[:address],
      proposal_id: params[:proposal_id] || (SecureRandom.uuid + '-own'),
      category: params[:category],
      description: params[:description],
      phone: params[:phone],
      subcategory: params[:subcategory],
      form_category: params[:form_category]
    }
    form.each{ |field, content| space_proposal[field] = params[field]} 
    space_proposal
  end
end