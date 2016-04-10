class SearchController < BaseController

  post '/suggest' do
    query = get_query params[:query]
    tags = query[0...-1]
    all_profiles = get_profiles :all
    matched_profiles = query_profiles all_profiles, tags
    results = get_suggestions_for matched_profiles, query
    results = sort_results results
    success({items: results})
  end

  post '/results' do
    tags = get_query params[:query]
    all_profiles = get_profiles :all
    matched_profiles = query_profiles all_profiles, tags
    success({profiles: matched_profiles})
  end

  private
  def get_query params
    return [] if params.blank?
    raise Pard::Invalid::QueryParams unless params.is_a?(Array) && params.all?{ |param| param.is_a? String}
    params.map{|param| I18n.transliterate(param.downcase)}
  end

  def get_profiles method, args = nil
    Services::Profiles.get_profiles method, args
  end

  def query_profiles all_profiles, tags
    return all_profiles if tags.all?{ |tag| tag.blank?}
    all_profiles.select{ |profile|
      query_profile profile, tags
    }
  end

  def query_profile profile, tags
    tags.all?{ |tag|
      check_profile(profile, tag) || check_proposals(profile, tag) 
    }
  end

  def check_profile profile, tag
    searcheable_fields.any?{ |field|
      check_value profile[field], tag
    }
  end

  def check_proposals profile, tag
    return false unless profile.has_key? :proposals
    searcheable_proposal_fields.any?{ |field|
      profile[:proposals].any?{ |proposal|
        check_value proposal[field], tag
      }
    }
  end

  def check_value value, tag
    return check_hash(value, tag) if value.is_a? Hash
    matches?(value, tag) if value.is_a? String
  end

  def check_hash value, tag
    value.keys.any?{ |key|
      matches?(value[key], tag) if value[key].is_a? String
    }
  end

  def queriable? value, query
    tags = query[0...-1]
    return false if tags.any? { |tag| tag == I18n.transliterate(value.downcase)}
    matches? value, query.last
  end

  def matches? value, tag
    matchable_value = I18n.transliterate(value.downcase)
    words = matchable_value.split(/\W+/)
    words.any?{ |word|
      translation = translate word
      translation.start_with? tag  
    }
  end

  def searcheable_fields
    [
      :type,
      :name,
      :city,
      :bio,
      :address,
      :category,
    ]
  end

  def searcheable_proposal_fields
    [
      :category,
      :title,
      :description,
      :short_description
    ]
  end

  def get_suggestions_for matched_profiles, query
    suggestions = []
    if query.all?{ |tag| tag.blank?}
      add_suggestion suggestions, 'artist', 'type'
      add_suggestion suggestions, 'space', 'type'
    end
    return suggestions if query.last.blank?
    matched_profiles.each{ |profile|
      add_suggestions suggestions, profile, query  
    }
    suggestions
  end

  def add_suggestions suggestions, profile, query
    add_suggestion(suggestions, profile[:type], 'type') if queriable? profile[:type], query
    add_suggestion(suggestions, profile[:name], 'name') if queriable? profile[:name], query
    add_artist_suggestions(suggestions, profile, query) if profile[:type] == 'artist'
    add_space_suggestions(suggestions, profile, query) if profile[:type] == 'space'
  end

  def add_artist_suggestions suggestions, profile, query
    add_suggestion(suggestions, profile[:city], 'city') if queriable? profile[:city], query
    add_proposal_suggestions(suggestions, profile[:proposals], query) if profile.has_key? :proposals
  end

  def add_proposal_suggestions suggestions, proposals, query
    proposals.each{ |proposal|
      add_suggestion(suggestions, proposal[:title], 'title') if queriable? proposal[:title], query
      add_suggestion(suggestions, proposal[:category], 'category') if queriable? proposal[:category], query
    }
  end

  def add_space_suggestions suggestions, profile, query
    add_suggestion(suggestions, profile[:category], 'category') if queriable? profile[:category], query
    add_suggestion(suggestions, profile[:address][:locality], 'city') if queriable? profile[:address][:locality], query
  end

  def add_suggestion suggestions, text, type
    translation = I18n.transliterate(translate text)
    suggestions.push({id: translation, text: translation, type: type, icon: text}) unless suggestions.any?{ |suggestion| suggestion[:text].downcase == I18n.transliterate(translation.downcase)}
  end

  def sort_results results
    sorted_results = []
    sorted_results.push(results.select{ |result| result[:type] == 'type'})
    sorted_results.push(results.select{ |result| result[:type] == 'category'})
    sorted_results.push(results.select{ |result| result[:type] == 'city'})
    sorted_results.push(results.select{ |result| result[:type] == 'name'})
    sorted_results.push(results.select{ |result| result[:type] == 'title'})
    sorted_results.flatten
  end

  def translate text
    dictionary = {
      artist: 'artista',
      space: 'espacio',
      organization: 'organizacion',
      cultural_ass: 'asociacion cultural',
      commercial: 'local comercial',
      home: 'espacio particular',
      music: 'musica',
      arts: 'artes escenicas',
      expo: 'exposicion',
      poetry: 'poesia',
      audiovisual: 'audiovisual',
      street_art: 'street art',
      workshop: 'taller',
      other: 'otros',
    }
    return dictionary[text.to_sym] if dictionary.has_key? text.to_sym
    text
  end
end
