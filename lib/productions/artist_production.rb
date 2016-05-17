class ArtistProduction

  def initialize params, user_id
    @production = new_production params, user_id
    @user_id = user_id
    @profile_id = params[:profile_id]
  end

  def wrong_params?
    check_fundamentals
  end

  def images
    {
      photos: photos
    }
  end

  def photos
    return [] if production[:photos].blank?
    production[:photos]
  end

  def [] key
    production[key]
  end

  def uuid
    production[:production_id]
  end

  def to_h
    production.to_h
  end

  private
  attr_reader :production

  def new_production params, user_id
    {
      production_id: params[:production_id] || SecureRandom.uuid, 
      category: params[:category],
      title: params[:title],
      description: params[:description],
      photos: params[:photos],
      links: params[:links],
      short_description: params[:short_description],
      duration: params[:duration],
      children: params[:children]
    }
  end

  def check_fundamentals
    [:category, :title, :description].any?{ |field|
      production[field].blank?
    }
  end
end
