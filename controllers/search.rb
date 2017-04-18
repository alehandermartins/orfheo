class SearchController < BaseController
  @lang = :es

  post '/suggest' do
    scopify :query, :event_id, :lang
    check_lang! lang
    @lang = lang.to_sym
    queriable_tags = get_query query
    tags = queriable_tags[0...-1]
    matched_profiles = query_profiles get_profiles(event_id), tags
    results = get_suggestions_for matched_profiles, queriable_tags
    results = sort_results results
    success({items: results})
  end

  post '/results' do
    scopify :query, :shown, :event_id, :lang
    check_lang! lang
    @lang = lang.to_sym
    tags = get_query query
    shown_profiles = check_params shown
    not_shown = not_shown_profiles get_profiles(event_id), shown_profiles
    matched_profiles = query_profiles not_shown, tags
    success({profiles: matched_profiles.take(15)})
  end

  post '/suggest_program' do
    scopify :query, :event_id, :filters, :lang
    queriable_tags = get_query query
    queriable_filters = get_filters filters
    results = Services::Search.get_program_suggestions lang, event_id, queriable_tags, queriable_filters
    success({items: results})
  end

  post '/results_program' do
    scopify :query, :event_id, :filters, :date, :time, :lang
    tags = get_query query
    queriable_filters = get_filters filters
    results = Services::Search.get_program_results lang, event_id, tags, queriable_filters, date, time
    success({program: results})
  end

  private
  def get_query params
    return [] if params.blank?
    check_params params
    params.map{|param| I18n.transliterate(param).downcase}
  end

  def get_filters params
    return {} if params.blank?
    raise Pard::Invalid::FilterParams unless params.is_a?(Hash) && params.values.all?{ |selections| selections.is_a?(Array)}
    params = Util.string_keyed_hash_to_symbolized params
    params.map{ |key, value|
      [key, value]
    }.to_h
  end

  def check_params params
    return [] if params.blank?
    raise Pard::Invalid::QueryParams unless params.is_a?(Array) && params.all?{ |param| param.is_a? String}
    params
  end

  def get_profiles event_id
    profiles = Repos::Profiles.get_event_profiles event_id unless event_id.blank?
    profiles = Repos::Profiles.get_all if event_id.blank?
    profiles
  end

  def query_profiles all_profiles, tags
    return all_profiles if tags.all?{ |tag| tag.blank?}
    all_profiles.select{ |profile|
      query_profile(profile, tags)
    }
  end
  
  def query_profile profile, tags
    tags.all?{ |tag|
      check_profile(profile, tag) || check_productions(profile, tag) 
    }
  end

  def check_profile profile, tag
    return check_value profile[:type], tag if type?(tag)
    return check_value profile[:category], tag if category?(tag)
    searcheable_fields.any?{ |field|
      check_value profile[field], tag
    }
  end

  def check_productions profile, tag
    return false unless profile.has_key? :productions
    return false if type?(tag)

    if category? tag
      return profile[:productions].any?{ |production|
        check_value production[:category], tag
      }
    end

    searcheable_production_fields.any?{ |field|
      profile[:productions].any?{ |production|
        check_value production[field], tag
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
    return false if value.nil?
    tags = query[0...-1]
    return false if tags.any? { |tag| tag == translate(I18n.transliterate(value).downcase)}
    matches? value, query.last
  end

  def matches? value, tag
    matchable_value = translate(I18n.transliterate(value).downcase)
    words = matchable_value.split(/\W+/).map{ |word| translate(word).split(/\W+/)}.flatten
    matchable_value == tag || words.any?{ |word|
      word.start_with? tag  
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

  def searcheable_production_fields
    [
      :category,
      :title,
      :description,
      :short_description
    ]
  end

  def not_shown_profiles profiles, shown
    not_shown = profiles.reject{ |profile| shown.include? profile[:profile_id]}
    not_shown.sort_by { |profile| (profile[:profile_picture].blank? && profile[:photos].blank?) ? 1 : 0}
  end

  def get_suggestions_for matched_profiles, query
    suggestions = []
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
    add_production_suggestions(suggestions, profile[:productions], query) if profile.has_key? :productions
  end

  def add_production_suggestions suggestions, productions, query
    productions.each{ |production|
      add_suggestion(suggestions, production[:title], 'title') if queriable? production[:title], query
      add_suggestion(suggestions, production[:category], 'category') if queriable? production[:category], query
    }
  end

  def add_space_suggestions suggestions, profile, query
    add_suggestion(suggestions, profile[:category], 'category') if queriable? profile[:category], query
    add_suggestion(suggestions, profile[:address][:locality], 'city') if queriable? profile[:address][:locality], query
  end

  def add_suggestion suggestions, text, type
    translation = I18n.transliterate(translate text)
    suggestions.push({id: translation, text: translation, type: type, icon: text}) unless suggestions.any?{ |suggestion| suggestion[:text].downcase == I18n.transliterate(translation).downcase}
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

  def type? text
    dictionary = {
      es: ['artista', 'espacio', 'organizacion'],
      en: ['artist', 'space', 'organization'],
      ca: ['artista', 'espai', 'organitzacio']
    }
    dictionary[@lang].include? text
  end

  def category? text
    dictionary = {
      es:[
        'espacio exterior',
        'espacio cultural',
        'local comercial', 
        'espacio particular',
        'musica', 
        'artes escenicas', 
        'exposicion', 
        'poesia',
        'audiovisual',
        'street art',
        'taller',
        'gastronomia',
        'otros',
        'festival',
        'asociacion', 
        'ong', 
        'colectivo', 
        'empresa', 
        'institucion',
        'federacion',
        'fundacion'
      ],
      en: [
        'open air',
        'cultural space',
        'business', 
        'private home',
        'music', 
        'performing arts', 
        'exposition', 
        'poetry',
        'audiovisual',
        'street art',
        'workshop',
        'gastronomy',
        'other',
        'festival',
        'association', 
        'ngo', 
        'collective', 
        'enterprise', 
        'institution',
        'federation',
        'foundation'
      ],
      ca: [
        'espai exterior',
        'espai cultural',
        'local comercial', 
        'espai particular',
        'musica', 
        'arts esceniques', 
        'exposicio', 
        'poesia',
        'audiovisual',
        'art de carrer',
        'taller',
        'gastronomia',
        'altres',
        'festival',
        'associacio', 
        'ong', 
        'col·lectiu', 
        'enterprise', 
        'institucio',
        'federacio',
        'fundacio'
      ]
    }
    dictionary[@lang].include? text
  end

  def translate text
    dictionary = {
      es: {
        artist: 'artista',
        space: 'espacio',
        organization: 'organizacion',
        open_air: 'espacio exterior',
        cultural_ass: 'espacio cultural',
        commercial: 'local comercial',
        home: 'espacio particular',
        music: 'musica',
        arts: 'artes escenicas',
        expo: 'exposicion',
        poetry: 'poesia',
        audiovisual: 'audiovisual',
        street_art: 'street art',
        workshop: 'taller',
        gastronomy: 'gastronomia',
        other: 'otros',
        festival: 'festival',
        association:'asociacion', 
        ngo:'ong', 
        collective:'colectivo', 
        interprise:'empresa', 
        institution:'institucion',
        federation: 'federacion',
        foundation:'fundacion'
      },
      en:{
        artist: 'artist',
        space: 'space',
        organization: 'organization',
        open_air: 'open air',
        cultural_ass: 'cultural space',
        commercial: 'business',
        home: 'private home',
        music: 'music',
        arts: 'performing arts',
        expo: 'exposition',
        poetry: 'poetry',
        audiovisual: 'audiovisual',
        street_art: 'street art',
        workshop: 'workshop',
        gastronomy: 'gastronomy',
        other: 'other',
        festival: 'festival',
        association:'association', 
        ngo:'ngo', 
        collective:'collective', 
        interprise:'enterprise', 
        institution:'institution',
        federation: 'federation',
        foundation:'foundation'
      },
      ca:{
        artist: 'artista',
        space: 'espai',
        organization: 'organitzacio',
        open_air: 'espai exterior',
        cultural_ass: 'espai cultural',
        commercial: 'local comercial',
        home: 'espai particular',
        music: 'musica',
        arts: 'arts esceniques',
        expo: 'exposicio',
        poetry: 'poesia',
        audiovisual: 'audiovisual',
        street_art: 'art de carrer',
        workshop: 'taller',
        gastronomy: 'gastronomia',
        other: 'altres',
        festival: 'festival',
        association:'associacio', 
        ngo:'ong', 
        collective:'col·lectiu', 
        interprise:'enterprise', 
        institution:'institucio',
        federation: 'federacio',
        foundation:'fundacio' 
      }
    }
    return dictionary[@lang][text.to_sym] if dictionary[@lang].has_key? text.to_sym
    text
  end
end
