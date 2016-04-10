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
    raise Pard::Invalid::QueryParams unless params.is_a?(Array) && params.each{ |param| param.is_a? String}
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
    check_string(value, tag) if value.is_a? String
  end

  def check_hash value, tag
    value.keys.any?{ |key|
      check_string(value[key], tag) if value[key].is_a? String
    }
  end

  def check_string value, tag
    I18n.transliterate(value.downcase).include? tag
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
    last = query.pop
    return suggestions if last.blank?
    matched_profiles.each{ |profile|
      add_suggestions suggestions, profile, last  
    }
    suggestions
  end

  def add_suggestions suggestions, profile, last
    add_suggestion(suggestions, profile[:name], 'name') if I18n.transliterate(profile[:name].downcase).include? last
    add_suggestion(suggestions, profile[:type], 'type') if I18n.transliterate(profile[:type].downcase).include? last
    add_artist_suggestions(suggestions, profile, last) if profile[:type] == 'artist'
    add_space_suggestions(suggestions, profile, last) if profile[:type] == 'space'
  end

  def add_artist_suggestions suggestions, profile, last
    add_suggestion(suggestions, profile[:city], 'city') if I18n.transliterate(profile[:city].downcase).include?(last)
    add_proposal_suggestions(suggestions, profile[:proposals], last) if profile.has_key? :proposals
  end

  def add_proposal_suggestions suggestions, proposals, last
    proposals.each{ |proposal|
      add_suggestion(suggestions, proposal[:title], 'title') if I18n.transliterate(proposal[:title].downcase).include? last
      add_suggestion(suggestions, proposal[:category], 'category') if I18n.transliterate(proposal[:category].downcase).include?(last)
    }
  end

  def add_space_suggestions suggestions, profile, last
    add_suggestion(suggestions, profile[:category], 'category') if I18n.transliterate(profile[:category].downcase).include?(last)
    add_suggestion(suggestions, profile[:address]['locality'], 'city') if I18n.transliterate(profile[:address]['locality'].downcase).include?(last)
  end

  def add_suggestion suggestions, text, type
    suggestions.push({id: text, text: I18n.transliterate(text), type: type}) unless suggestions.any?{ |suggestion| suggestion[:text].downcase == I18n.transliterate(text.downcase)}
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
end
