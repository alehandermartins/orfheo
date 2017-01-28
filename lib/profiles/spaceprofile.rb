class SpaceProfile

  def initialize params, user_id
    check_fields! params, user_id
    @profile = new_profile params, user_id
  end

  def check_fields! params, user_id
  raise Pard::Invalid::Params if mandatory.any?{ |field|
    params[field].blank?
  }
  raise Pard::Invalid::Category unless correct_category? params[:category]
  raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(user_id, params[:name])
  end

  def [] key
    profile[key]
  end

  def to_h
    profile.to_h
  end

  private
  attr_reader :profile
  def new_profile params, user_id
    {
      user_id: user_id,
      profile_id: params[:profile_id] || SecureRandom.uuid,
      name: params[:name],
      type: params[:type],
      category: params[:category],
      address: params[:address],
      personal_web: params[:personal_web],
      links: params[:links],
      photos: params[:photos],
      color: params[:color],
      bio: params[:bio],
      profile_picture: params[:profile_picture]
    }
  end

  def mandatory
    [
      :name,
      :address,
      :color,
      :category,
    ]
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