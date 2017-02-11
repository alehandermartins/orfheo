class Production

  def initialize params, user_id
    check_fields params
    @production = new_production params, user_id
  end

  def check_fields params
  raise Pard::Invalid::Params if mandatory(params).any?{ |field|
    params[field].blank?
  }
  raise Pard::Invalid::Category unless correct_category? params[:category]
  end

  def [] key
    production[key]
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
      short_description: params[:short_description],
      duration: params[:duration],
      photos: params[:photos],
      links: params[:links],
      children: params[:children],
      cache: params[:cache]
    }
  end

  def mandatory params
    fields = [
      :title,
      :description,
      :short_description
    ]
    fields.push(:duration) if(['music', 'arts', 'workshop', 'audiovisual', 'poetry'].include? params[:category])
    fields
  end

  def correct_category? category
    [
      'music', 
      'arts', 
      'expo', 
      'poetry', 
      'audiovisual', 
      'street_art', 
      'workshop', 
      'gastronomy', 
      'other'
    ].include? category
  end
end