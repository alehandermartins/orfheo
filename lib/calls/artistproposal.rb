class ArtistProposal

  def initialize params, user_id, form
    check_fields params, form
    user = Repos::Users.grab({user_id: user_id})
    profile = Repos::Profiles.get_profiles :profile, {profile_id: params[:profile_id]}
    @artist_proposal = new_artist params, user, profile, form
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
    artist_proposal[key]
  end

  def to_h
    artist_proposal.to_h
  end

  private
  attr_reader :artist_proposal
  def new_artist params, user, profile, form
    proposal = new_proposal params, form
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

  def new_proposal params, form
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
end