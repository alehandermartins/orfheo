class ArtistOwnProposal

  def initialize params, user_id, form
    check_fields params, user_id, form
    @artist_proposal = new_artist params, user_id, form
  end

  def check_fields params, user_id, form
    raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(user_id, params[:name])
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type], field
    }
    raise Pard::Invalid::Params if params[:name].blank? || params[:email].blank?
  end

  def correct_entry? value, type, field
    return !value.blank? if type == 'mandatory' && field.to_s.to_i == 0 
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
  def new_artist params, user_id, form
    proposal = new_proposal params, form
    artist_proposal = {
      user_id: user_id,
      profile_id: params[:profile_id] || (SecureRandom.uuid),
      email: params[:email],
      name: params[:name],
      phone: params[:phone],
      proposals: [proposal],
      own: true
    }
  end

  def new_proposal params, form
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
end