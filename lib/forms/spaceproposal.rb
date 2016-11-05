class SpaceProposal

  def initialize params, user_id, form
    check_fields params, form
    user = Repos::Users.grab({user_id: user_id})
    profile = Repos::Profiles.get_profiles :profile, {profile_id: params[:profile_id]}
    @space_proposal = new_space params, user, profile, form
  end

  def check_fields params, form
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type]  
    }
  end

  def correct_entry? value, type
    return !value.blank? if type == 'mandatory' 
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
  def new_space params, user, profile, form
    space_proposal = {
      user_id: user[:user_id],
      profile_id: profile[:profile_id],
      email: user[:email],
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
      category: profile[:category],
      name: profile[:name],
      address: profile[:address],
      description: profile[:description],
      phone: params[:phone]
    }
    form.each{ |field, content| space_proposal[field] = params[field]} 
    space_proposal
  end
end