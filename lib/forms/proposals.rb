class Forms::Proposals < Forms::Base
  
  def create proposal_id
    scopify
    user = Repos::Users.grab({user_id: user_id})
    profile = Repos::Profiles.get_profiles :profile, {profile_id: profile_id}
    #call = Repos::Calls.get_call call_id
    form = {
      artist: artist_form,
      space: space_form
    }
    raise Pard::Invalid::Params unless form.has_key? type
    raise Pard::Invalid::Params unless form[type].has_key? category
    proposal = create_model_from form[type][category]
    proposal.merge! user_id: user_id
    proposal.merge! email: user[:email]
    proposal.merge! profile_id: profile_id
    proposal.merge! proposal_id: proposal_id
    proposal.merge! production_id: production_id || SecureRandom.uuid
    proposal.merge! type: type
    proposal.merge! category: category
    add_artist_fields(profile, proposal) if type == :artist
    add_space_fields(profile, proposal) if type == :space
    proposal
  end

  def create_own proposal_id
    scopify
    form = {
      artist: artist_own,
      space: space_own
    }
    proposal = create_model_from form[type][category]
    proposal.merge! user_id: user_id
    proposal.merge! profile_id: profile_id
    proposal.merge! proposal_id: proposal_id
    proposal.merge! type: type
    proposal.merge! category: category
    proposal
  end

  private
  def scopify
    [:call_id, :profile_id].each do |param|
      raise Pard::Invalid::Params if params[param].blank?
      self.send(:define_singleton_method, param) {
        params[param]
      }
    end

    [:type, :category].each do |param|
      raise Pard::Invalid::Params if params[param].blank?
      self.send(:define_singleton_method, param) {
        params[param].to_sym
      }
    end

    self.send(:define_singleton_method, :production_id) {
      params[:production_id]
    }
  end

  def add_artist_fields profile, proposal
    proposal.merge! city: profile[:city]
    proposal.merge! personal_web: profile[:personal_web]
    proposal.merge! zip_code: profile[:zip_code]
    proposal.merge! name: profile[:name]
  end

  def add_space_fields profile, proposal
    proposal.merge! address: profile[:address]
    proposal.merge! photos: profile[:photos]
    proposal.merge! personal_web: profile[:personal_web]
    proposal.merge! links: profile[:links]
    proposal.merge! name: profile[:name]
  end

  def artist_form
    {
      music: music_arts_other_call,
      arts: music_arts_other_call,
      other: music_arts_other_call,
      poetry: poetry_workshop_call, 
      workshop: poetry_workshop_call,
      street_art: street_art_call,
      audiovisual: audiovisual_call,
      expo: expo_call
    }
  end

  def artist_own
    {
      music: music_arts_poetry_other_call_own,
      arts: music_arts_poetry_other_call_own,
      other: music_arts_poetry_other_call_own,
      poetry: music_arts_poetry_other_call_own, 
      workshop: music_arts_poetry_other_call_own,
      street_art: music_arts_poetry_other_call_own,
      audiovisual: audiovisual_call_own,
      expo: expo_call_own
    }
  end

  def space_form
    {
      cultural_ass: cultural_ass,
      commercial: cultural_ass,
      home: cultural_ass,
      open_air: cultural_ass
    }
  end

  def space_own
    {
      cultural_ass: cultural_ass_own,
      commercial: cultural_ass_own,
      home: cultural_ass_own,
      open_air: cultural_ass_own
    }
  end

  def cultural_ass
    {
      address: address,
      photos: photos,
      personal_web: space_personal_web,
      links: links,
      responsible: responsible,
      description: space_description,
      availability: availability,
      phone: phone,
      sharing: sharing,
      own: own,
      un_wanted: un_wanted,
      conditions: conditions
    }
  end

  def cultural_ass_own
    {
      email: email,
      phone: phone,
      name: space_name,
      address: address,
      responsible: responsible,
      availability: availability
    }
  end

  def music_arts_other_call
    {
      title: title,
      description: description,
      short_description: short_description,
      duration: duration,
      components: components,
      availability: availability,
      children: children,
      links: links,
      photos: photos,
      sharing: sharing,
      needs: needs,
      repeat: repeat,
      waiting_list: waiting_list,
      phone: phone,
      conditions: conditions
    }
  end

  def music_arts_poetry_other_call_own
    {
      email: email,
      phone: phone,
      name: artist_name,
      title: title,
      description: description,
      short_description: short_description,
      duration: duration,
      components: components,
      availability: availability,
      children: children
    }
  end

  def expo_call_own
    {
      email: email,
      phone: phone,
      name: artist_name,
      description: description,
      short_description: short_description
    }
  end

  def poetry_workshop_call
    music_arts_other_call.delete(:components)
  end

  def street_art_call
    {
      title: title,
      description: description,
      short_description: short_description,
      availability: availability,
      links: links,
      photos: photos,
      sharing: sharing,
      needs: needs,
      repeat: repeat,
      waiting_list: waiting_list,
      phone: phone,
      conditions: conditions
    }
  end

  def expo_call
    {
      title: title,
      description: description,
      short_description: short_description,
      meters: meters,
      links: links,
      photos: photos,
      sharing: sharing,
      needs: needs,
      waiting_list: waiting_list,
      phone: phone,
      conditions: conditions
    }
  end

  def audiovisual_call
    {
      title: title,
      description: description,
      short_description: short_description,
      duration: duration,
      availability: availability,
      children: children,
      links: links,
      photos: photos,
      sharing: sharing,
      needs: needs,
      waiting_list: waiting_list,
      phone: phone,
      conditions: conditions
    }
  end

  def audiovisual_call_own
    {
      email: email,
      phone: phone,
      name: artist_name,
      title: title,
      description: description,
      short_description: short_description,
      duration: duration,
      availability: availability,
      children: children
    }
  end
end
