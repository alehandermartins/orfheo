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
      music:music_call,
      arts: music_call,
      other: music_call,
      poetry: workshop_call, 
      workshop: workshop_call,
      street_art: street_art_call,
      audiovisual: audiovisual_call,
      expo: expo_call
    }
  end

  def basic_artist_call
    {
      title: title,
      description: description,
      short_description: short_description,
      links: links,
      photos: photos,
      sharing: sharing,
      needs: needs,
      waiting_list: waiting_list,
      phone: phone,
      conditions: conditions
    }
  end

  def music_call
    music_fields = {
      availability: availability,
      duration: duration,
      components: components,
      children: children,
      repeat:repeat
    }
    basic_artist_call.merge music_fields
  end

  def workshop_call
    workshop_fields = {
      availability: availability,
      duration: duration,
      children: children,
      repeat:repeat
    }
    basic_artist_call.merge workshop_fields 
  end

  def audiovisual_call
    audiovisual_fields = {
      availability: availability,
      duration: duration,
      children: children
    }
    basic_artist_call.merge audiovisual_fields 
  end

  def street_art_call
    basic_artist_call.merge availability: availability
  end

  def expo_call
    basic_artist_call.merge meters: meters
  end

  def space_form
    {
      cultural_ass: basic_space_call,
      commercial: basic_space_call,
      home: basic_space_call,
      open_air: basic_space_call
    }
  end

  def basic_space_call
    {
      photos: photos,
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
  
  def artist_own
    {
      music: music_call_own,
      arts: music_call_own,
      other: music_call_own,
      poetry: music_call_own, 
      workshop: music_call_own,
      street_art: street_art_call_own,
      audiovisual: audiovisual_call_own,
      expo: basic_artist_call_own
    }
  end

  def basic_artist_call_own
    {
      email: email,
      phone: phone,
      name: artist_name,
      title: title,
      description: description,
      short_description: short_description,
    }
  end

  def music_call_own
    music_fields = {
      duration: duration,
      components: components,
      availability: availability,
      children: children
    }
    basic_artist_call_own.merge music_fields 
  end

  def audiovisual_call_own
    audiovisual_fields = {
      duration: duration,
      availability: availability,
      children: children
    }
    basic_artist_call_own.merge audiovisual_fields 
  end

  def street_art_call_own
    basic_artist_call_own.merge availability: availability
  end

  def space_own
    {
      cultural_ass: basic_space_call_own,
      commercial: basic_space_call_own,
      home: basic_space_call_own,
      open_air: basic_space_call_own
    }
  end

  def basic_space_call_own
    {
      email: email,
      phone: phone,
      name: space_name,
      responsible: responsible,
      availability: availability
    }
  end
end