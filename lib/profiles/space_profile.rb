class SpaceProfile

  def initialize params, user_id
    @profile = new_profile params, user_id
  end

  def [] key
    profile[key]
  end

  def wrong_params?
    check_fundamentals || incorrect_categories?
  end

  def uuid
    profile[:profile_id]
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
      type: params[:type],
      name: params[:name],
      address: params[:address],
      category: params[:category],
      color: params[:color],
      profile_picture: params[:profile_picture],
      photos: params[:photos],
      bio: params[:bio],
      personal_web: params[:personal_web],
      links: params[:links]
    }
  end

  def check_fundamentals
    [:name, :address].any?{ |field|
      (profile[field].nil? || profile[field].empty?)
    }
  end

  def incorrect_categories?
    (!['cultural_ass', 'home', 'commercial'].include? profile[:category])
  end
end
