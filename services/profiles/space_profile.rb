class SpaceProfile

  def initialize params, user_id
    @profile = new_profile params, user_id
  end

  def wrong_params?
    check_fundamentals || incorrect_categories?
  end

  def exists?
    profiles = Repos::Profiles.grab({user_id: user_id})
    profiles.any?{ |the_profile|
      (the_profile[:name] == name && the_profile[:profile_id] != uuid)
    }
  end

  def update
    Repos::Profiles.update(uuid, profile)
  end

  def uuid
    profile[:profile_id]
  end

  private
  attr_reader :profile

  def new_profile params, user_id
    {
      user_id: user_id,
      profile_id: params['profile_id'] || SecureRandom.uuid,
      type: params['type'],
      name: params['name'],
      city: params['city'],
      address: params['address'],
      zip_code: params['zip_code'],
      category: params['category'],
      profile_picture: params['profile_picture'],
      bio: params['bio'],
      personal_web: params['personal_web']
    }
  end

  def check_fundamentals
    [:name, :city, :address, :zip_code].any?{ |field|
      (profile[field].nil? || profile[field].empty?)
    }
  end

  def incorrect_categories?
    (!['cultural_ass', 'home', 'commercial'].include? profile[:category])
  end

  def [] key
    profile[key]
  end

  def user_id
    profile[:user_id]
  end

  def name
    profile[:name]
  end
end
