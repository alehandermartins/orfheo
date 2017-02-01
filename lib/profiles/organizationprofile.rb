class OrganizationProfile

  def initialize params, user_id
    check_fields params
    @profile = new_profile params, user_id
  end

  def check_fields params
  raise Pard::Invalid::Params if mandatory.any?{ |field|
    params[field].blank?
  }
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
      :category
    ]
  end
end