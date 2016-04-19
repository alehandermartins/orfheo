class ArtistProfile

  def initialize params, user_id
    @profile = new_profile params, user_id
    #web_to_thumbnail 
  end

  def [] key
    profile[key]
  end

  def wrong_params?
    check_fundamentals
  end

  def images
    {
      profile_picture: profile[:profile_picture]
    }
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
      city: params[:city],
      zip_code: params[:zip_code],
      color: params[:color],
      profile_picture: params[:profile_picture],
      bio: params[:bio],
      personal_web: params[:personal_web]
    }
  end

  def check_fundamentals
    [:name, :city, :zip_code].any?{ |field|
      profile[field].blank?
    }
  end

  def web_to_thumbnail
    unless profile[:personal_web].blank? || profile[:personal_web][:link].blank? 
      kit = IMGKit.new('http://google.com')
      kit.to_img
      file = kit.to_file('file.jpg')
      ap file.path
    end
  end
end
