module Services
	class Search
		class << self

			@lang = :es
			def get_program_suggestions lang, event_id, queriable_tags, filters
				check_lang! lang
				tags = queriable_tags[0...-1]
				program = Services::Events.get_program event_id
				matched_performances = query_program program, tags, filters
				results = get_suggestions_for matched_performances, queriable_tags
				sort_results results
			end

			def get_program_results lang, event_id, tags, filters, date, time
				check_lang! lang
				program = Services::Events.get_program event_id
				program = program.select{|performance| performance[:date] == date} unless date.blank?
				results = query_program program, tags, filters
				results = select_now results, time unless time.blank?
				order_results results
			end

			private
			def check_lang! lang
		    raise Pard::Invalid.new 'invalid_language' unless ['en', 'es', 'ca'].include? lang
		    @lang = lang.to_sym
		  end

			def select_now results, time
				results.select{|performance|
					(performance[:time].first.to_i > time.to_i && performance[:time].first.to_i < time.to_i + 3600 * 1000) || (performance[:time].first.to_i < time.to_i && performance[:time].last.to_i > time.to_i + 60 * 15 * 1000)
				}
			end

			def query_program program, tags, filters
				program = filter_participants program, filters[:participants] if filters.has_key? :participants
				program = filter_hosts program, filters[:hosts] if filters.has_key? :hosts
				program = filter_other program, filters[:other] if filters.has_key? :other

				return program if tags.all?{ |tag| tag.blank? }
				program.select{ |performance|
					query_performance(performance, tags)
				}
			end

			def filter_participants program, filters
				program.select{ |performance|
					filters.include? performance[:participant_subcategory].to_s
				}
			end

			def filter_hosts program, filters
				program.select{ |performance|
					puts performance[:host_subcategory].to_s
					filters.include? performance[:host_subcategory].to_s
				}
			end

			def filter_other program, filters
				program.select{ |performance|
					filters.include? performance[:children]
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
				matchable_tags = tag.split(/\W+/)
				matchable_value = translate(I18n.transliterate(value).downcase)
				words = matchable_value.split(/\W+/).map{ |word| translate(word).split(/\W+/)}.flatten
				matchable_value == tag || words_match?(words, matchable_tags)
			end

			def words_match? words, tags
				tags.all?{ |tag|
					words.any?{ |word|
						word.start_with? tag  
					}
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
		    dictionary = {
		      es:[
		        'musica', 
		        'artes escenicas', 
		        'exposicion', 
		        'poesia',
		        'audiovisual',
		        'street art',
		        'taller',
		        'gastronomia',
		        'otros'
		      ],
		      en: [
		        'music', 
		        'performing arts', 
		        'exposition', 
		        'poetry',
		        'audiovisual',
		        'street art',
		        'workshop',
		        'gastronomy',
		        'other'
		      ],
		      ca: [
		      	'musica', 
		        'arts esceniques', 
		        'exposicio', 
		        'poesia',
		        'audiovisual',
		        'art de carrer',
		        'taller',
		        'gastronomia',
		        'altres',
		      ]
		    }
		    dictionary[@lang].include? text
		  end

		  def space_category? text
		    dictionary = {
		      es:[
		        'espacio exterior',
		        'espacio cultural',
		        'local comercial', 
		        'espacio particular',
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
		        'festival',
		        'association', 
		        'ngo', 
		        'collective', 
		        'enterprise', 
		        'institution',
		        'federation',
		        'foundation'
		      ],
		      ca:[
		      	'espai exterior',
		        'espai cultural',
		        'local comercial', 
		        'espai particular',
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
			
			def get_suggestions_for matched_performances, query
				suggestions = []
				return suggestions if query.last.blank?
				matched_performances.each{ |performance|
					add_suggestions suggestions, performance, query  
				}
				suggestions
			end

			def queriable? value, query
				return false if value.nil?
				tags = query[0...-1]
				return false if tags.any? { |tag| tag == translate(I18n.transliterate(value).downcase)}
				matches? value, query.last
			end

			def add_suggestions suggestions, performance, query
				add_suggestion(suggestions, performance[:participant_name], 'name', 'artist') if queriable? performance[:participant_name], query
				add_suggestion(suggestions, performance[:host_name], 'name', 'space') if queriable? performance[:host_name], query
				add_suggestion(suggestions, performance[:title], 'title') if queriable? performance[:title], query
				add_suggestion(suggestions, performance[:address]['locality'], 'city') if queriable? performance[:address]['locality'], query
			end

			def add_suggestion suggestions, text, type, icon = nil
				icon = icon || text
				translation = I18n.transliterate(translate text)
				suggestions.push({id: translation, text: translation, type: type, icon: icon}) unless suggestions.any?{ |suggestion| suggestion[:text].downcase == I18n.transliterate(translation).downcase}
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

			def sort_results results
				sorted_results = []
				sorted_results.push(results.select{ |result| result[:type] == 'category'})
				sorted_results.push(results.select{ |result| result[:type] == 'name'})
				sorted_results.push(results.select{ |result| result[:type] == 'city'})
				sorted_results.push(results.select{ |result| result[:type] == 'title'})
				sorted_results.flatten
			end

			def order_results results
				results.sort_by{ |performance| [performance[:date], performance[:permanent] == 'false' ? 0 : 1, performance[:time].first, performance[:time].last] }
			end
		end
	end
end