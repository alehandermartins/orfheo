module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        # calls = grab({})
        # calls.each{ |call|
        #   next unless call[:forms].blank?
        #   forms = {
        #     es: {
        #       form_categories: form_category(call[:call_id])
        #       artist: {},
        #       space:{}
        #     }
        #   }
        #   call[:es][:artist].each{ |key, form|
        #     forms[:es][:artist][key] = {}
        #     forms[:es][:artist][key][:categories] = [category(key)]
        #     forms[:es][:artist][key][:label] = {}
        #     forms[:es][:artist][key][:blocks] = {}
        #     form.each{ |field, block|
        #       next if field == :category
        #       forms[:es][:artist][key][:blocks][field] = block
        #     }
        #   }
        #   call[:es][:space].each{ |key, form|
        #     forms[:es][:space][key] = {}
        #       forms[:es][:space][field][:blocks] = block
        #     }
        #   }
        #   @@calls_collection.update_one({call_id: call[:call_id]},
        #   {
        #     "$set": {'forms': forms},
        #     "$unset": {'es': 1, 'categories': 1}
        #   })
        # }
      end

      def exists? call_id
        return false unless UUID.validate(call_id)
        @@calls_collection.count(call_id: call_id) > 0
      end

      # def get_forms call_id, lang
      #   call = grab({call_id: call_id}).first
      #   call[:forms].each{ |type, forms|
      #     call[:forms][type].each{ |key, form|
      #       form[:blocks].each{ |block|
      #         call[:texts][lang][:blocks][block]
      #       }
      #     }
      #   }
      #   ap call[:forms]
      # end

      def get_forms call_id
        grab({call_id: call_id}).first
      end

      def categoryField categories
        {
          type:  "mandatory",
          label:  "Selecciona una categoría artistica",
          input:  "CategorySelector",
          args:  categories,
          helptext:  ""
        }
      end

      def form_category call_id
        dictionary = {
          "b6bc4203-9379-4de0-856a-55e1e5f3fac6" => {
            "1" => "Música",
            "2" => "Artes Escénicas",
            "3" => "Taller",
            "4" => "Gastronomía",
            "5" => "Exposición",
            "6" => "Street Art",
            "7" => "Poesía",
            "8" => "Audiovisual",
            "9" => "Otros",
            "10" => "Espacio sin actividad programada",
            "11" => "Espacio con actividad programada"
          },
          "b5bc4203-9379-4de0-856a-55e1e5f3fac6" => {
            "1" => "Música",
            "2" => "Artes Escénicas",
            "3" => "Taller",
            "4" => "Gastronomía",
            "5" => "Exposición",
            "6" => "Street Art",
            "7" => "Poesía",
            "8" => "Audiovisual",
            "9" => "Otros",
            "10" => "Asociación Cultural",
            "11" => "Local Comercial",
            "12" => "Espacio Particular",
            "13" => "Espacio Exterior"
          }
        }
        return dictionary[call_id]
      end

      def category key
        dictionary = {
          "1" => "music",
          "2" => "arts",
          "3" => "workshop",
          "4" => "gastronomy",
          "5" => "expo",
          "6" => "street_art",
          "7" => "poetry",
          "8" => "audiovisual",
          "9" => "other"
        }
        return dictionary[key.to_s]
      end
      
      private
      def grab query
        results = @@calls_collection.find(query)
        return [] unless results.count > 0

        results.map { |event|
         Util.string_keyed_hash_to_symbolized event
        }
      end
    end
  end
end
