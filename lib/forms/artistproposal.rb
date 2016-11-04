class ArtistProposal

  def initialize params, user_id, form
    @artist_proposal = new_artist params, user, profile
    proposal = new_proposal params, form
    @artist_proposal[:proposals] = [proposal]
    user = Repos::Users.grab({user_id: user_id})
    profile = Repos::Profiles.get_profiles :profile, {profile_id: params[:profile_id]}
    check_fields form[params[:category]]
  end

  def create_proposal params, forms
    @proposal = new_proposal params, forms
  end

  def create_artist params, user_id
    @proposal = new_proposal params, forms
  end

  def check_fields form
    raise Pard::Invalid::Params unless form.all?{ |field, entry|
      correct_entry? params[field], entry[:type]  
    }
  end

  def correct_entry? value, type
    return !value.blank? if type == 'mandatory' 
    true
  end

  def [] key
    proposal[key]
  end

  def to_h
    proposal.to_h
  end

  private
  attr_reader :proposal
  def new_proposal params, forms
    proposal = {
      production_id: params[:production_id],
      proposal_id: SecureRandom.uuid,
      category: params[:category],
    }
    forms[params[:category]].each{|field|
      proposal[field] = params[field]
    }
    proposal
  end

  def new_artist params, user, profile
    {
      user_id: user[:user_id],
      profile_id: profile[:profile_id],
      email: user[:email],
      name: profile[:name],
      address: profile[:address],
      phone: params[:phone]
    }
  end

  def mandatory
    fields = [
      :production_id, 
      :category,
      :title,
      :description,
      :short_description,
      :phone
    ]
    fields.push(:duration) if(['music', 'arts', 'workshop', 'audiovisual', 'poetry'].include? production[:category])
    fields
  end
end