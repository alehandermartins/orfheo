class Forms::Productions < Forms::Base

  def create production_id
    scopify
    form = self.send('create_' + category)
    production = create_model_from form
    production.merge! production_id: production_id
    production.merge! category: category
    production    
  end

  def modify production_id
    scopify
    form = self.send('create_' + category)
    production = create_model_from form
    production.merge! production_id: production_id
    production.merge! category: category
    production
  end

  private
  def scopify
    raise Pard::Invalid::Category unless ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'].include? params[:category]
    self.send(:define_singleton_method, :category) {
      params[:category]
    }
  end

  def create_music
    {
      title: title,
      description: description,
      short_description: short_description,
      duration: duration,
      components: components,
      children: children,
      links: links,
      photos: photos
    }
  end

  def create_arts
    create_music
  end

  def create_poetry
    create_music
  end

  def create_workshop
    create_music
  end

  def create_other
    create_music
  end

  def create_expo
    {
      title: title,
      description: description,
      short_description: short_description,
      meters: meters,
      children: children,
      links: links,
      photos: photos
    }
  end

  def create_audiovisual
    {
      title: title,
      description: description,
      short_description: short_description,
      duration: duration,
      children: children,
      links: links,
      photos: photos
    }
  end

  def create_street_art
    {
      title: title,
      description: description,
      short_description: short_description,
      components: components,
      children: children,
      links: links,
      photos: photos
    }
  end
end