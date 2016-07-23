module Services
  class Search
    class << self
    	
    	def get_program_suggestions event_id, queriable_tags
    		tags = queriable_tags[0...-1]
	    	program = Repos::Calls.get_program event_id
	    	matched_performances = query_program program, tags
	    	results = get_suggestions_for matched_performances, queriable_tags
	    	sort_results results
	    end

	    def get_program_results event_id, tags
	    	program = Repos::Calls.get_program event_id
	    	results = query_program program, tags
	    	order_results results
	    end

	    def query_program program, tags
		    return program if tags.all?{ |tag| tag.blank?}
		    program.select{ |performance|
		      query_performance(performance, tags)
		    }
		  end
  
		  def query_performance performance, tags
		    tags.all?{ |tag|
		      check_performance(performance, tag) 
		    }
		  end

		  def check_performance performance, tag
		    return check_value performance[:participant_category], tag if artist_category?(tag)
		    return check_value performance[:host_category], tag if space_category?(tag)
		    searcheable_fields.any?{ |field|
		      check_value performance[field], tag
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

		  def matches? value, tag
		    matchable_value = translate(I18n.transliterate(value.downcase))
		    words = matchable_value.split(/\W+/).map{ |word| translate(word).split(/\W+/)}.flatten
		    matchable_value == tag || words.any?{ |word|
		      word.start_with? tag  
		    }
		  end

		  def searcheable_fields
		    [
		      :participant_name,
		      :host_name,
		      :address,
		      :title,
		      :short_description,
		    ]
		  end

		  def artist_category? text
		    [
		      'musica', 
		      'artes escenicas', 
		      'exposicion', 
		      'poesia',
		      'audiovisual',
		      'street art',
		      'taller',
		      'otros'].include? text
		  end

		  def space_category? text
		    [
		      'organizacion',
		      'asociacion cultural',
		      'local comercial', 
		      'espacio particular'].include? text
		  end

		  def get_suggestions_for matched_performances, query
		    suggestions = []
		    return suggestions if query.last.blank?
		    matched_performances.each{ |performance|
		      add_suggestions suggestions, performance, query  
		    }
		    suggestions
		  end

		  def queriable? value, query
		    tags = query[0...-1]
		    return false if tags.any? { |tag| tag == translate(I18n.transliterate(value.downcase))}
		    matches? value, query.last
		  end

		  def add_suggestions suggestions, performance, query
		    add_suggestion(suggestions, performance[:participant_category], 'category') if queriable? performance[:participant_category], query
		    add_suggestion(suggestions, performance[:host_category], 'category') if queriable? performance[:host_category], query
		    add_suggestion(suggestions, performance[:participant_name], 'name') if queriable? performance[:participant_name], query
		    add_suggestion(suggestions, performance[:host_name], 'name') if queriable? performance[:host_name], query
		  	add_suggestion(suggestions, performance[:title], 'title') if queriable? performance[:title], query
		    add_suggestion(suggestions, performance[:address]['locality'], 'city') if queriable? performance[:address]['locality'], query  
		  end

		  def add_suggestion suggestions, text, type
			  translation = I18n.transliterate(translate text)
			  suggestions.push({id: translation, text: translation, type: type, icon: text}) unless suggestions.any?{ |suggestion| suggestion[:text].downcase == I18n.transliterate(translation.downcase)}
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

		  def sort_results results
		    sorted_results = []
		    sorted_results.push(results.select{ |result| result[:type] == 'category'})
		    sorted_results.push(results.select{ |result| result[:type] == 'name'})
		    sorted_results.push(results.select{ |result| result[:type] == 'city'})
		    sorted_results.push(results.select{ |result| result[:type] == 'title'})
		    sorted_results.flatten
		  end

		  def order_results results
		  	ordered_program = {}
		  	dates = ['2016-10-15', '2016-10-16']
		  	dates.each{ |date|
		  		ordered_program[date] = []
		  		ordered_program[date].push(results.select{ |performance| performance[:date] == date && performance[:permanent] == 'false'}.sort_by{ |performance| [performance[:time].first, performance[:time].last] })
		  		ordered_program[date].push(results.select{ |performance| performance[:date] == date && performance[:permanent] == 'true'}.sort_by{ |performance| [performance[:time].first, performance[:time].last] })
		  		ordered_program[date].flatten!
		  	}
		  	ordered_program
		  end
   	end
  end
end