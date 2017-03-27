module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{ |call|

          next if call[:es][:artist]["1".to_sym].has_key? :helptext
          artist_forms = {}
          call[:es][:artist].each{ |key, form|
            artist_forms[key] = {helptext: helptext(call[:call_id], key), blocks: form}
            next if form[:category][:args].is_a? Hash
            args = {}
            form[:category][:args].each{|cat|
              args[cat] = nil
            }
            artist_forms[key][:blocks][:category][:args] = args
          }

          space_forms = {}
          call[:es][:space].each{ |key, form|
            space_forms[key] = {helptext: helptext(call[:call_id], key), blocks: form}
          }
          @@calls_collection.update_one({call_id: call[:call_id]},
          {
            "$set": {'es.artist': artist_forms, 'es.space': space_forms}
          })
        }

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

      def helptext call_id, key
        dictionary = {
          "b6bc4203-9379-4de0-856a-55e1e5f3fac6" => {
            "1" => "",
            "2" => "",
            "3" => "",
            "4" => "",
            "5" => "",
            "6" => "",
            "7" => "",
            "8" => "",
            "9" => "",
            "10" => "",
            "11" => ""
          },
          "b5bc4203-9379-4de0-856a-55e1e5f3fac6" => {
            "1" => "",
            "2" => "",
            "3" => "",
            "4" => "",
            "5" => "",
            "6" => "",
            "7" => "",
            "8" => "",
            "9" => "",
            "10" => "",
            "11" => "",
            "12" => "",
            "13" => ""
          },
          "9068d4f8-ed2a-4faf-8a26-df87e000e33c" => {
            "1" => "Piezas de corto formato de 20 a 30 minutos destinadas a ser representadas en un espacio urbano 
Realizarán únicamente 1 pase durante uno de los siguientes días 27, 28, o 29 de Octubre 2017.",
            "2" => "Piezas de corto formato de 20 a 30 minutos destinadas a ser representadas en espacios no convencionales.
Realizarán 3 pases en el espacio asignado durante uno de los días del festival: 27, 28 o 29 de Octubre 2017,
Esta modalidad acogerá tanto a compañías de la comunidad valenciana como a compañías procedentes de otras comunidades autónomas.",
            "3" => "Piezas de corto formato de jóvenes artistas emergentes valencianos que serán representadas los días 28 o 29 de octubre 2017
Tendrán una duración de 15 a 20 minutos máximo. Se mostrarán en un mismo espacio junto con otros Minibucle.",
            "4" => "Piezas de danza española o flamenco de corto formato de 20 a 30 minutos que serán representados en espacios no convencionales. Se realizarán 3 pases en el espacio asignado durante uno de los días del festival: 22, 27, 28 o 29 de octubre.",
            "5" => "¿Tienes alguna propuesta para niños? Si tienes preparado algún taller didáctico, háznoslo llegar si no es de danza, no te preocupes, estamos abiertos a más propuestas: manualidades, títeres, pintura, collage, expresión corporal, ballet, danza en familia etc.
Los talleres se realizarán por la mañana y por la tarde los días 28 y 29 de octubre. Y si tienes algún espectáculo de danza, teatro y danza o teatro gestual de pequeño formato de 20 a 30 minutos, dirigido tanto a público infantil como familiar, envíanos tu propuesta. 
Se realizarán 2 pases en el espacio asignado durante los días del festival: 28 y 29 de octubre por la mañana y por la tarde.",
            "6" => "Se podrán presentar piezas de mayor formato, de cualquier estilo de danza, con una duración superior a 35 minutos que puedan realizarse en espacios aproximados de 6 x 6 metros.",
            "7" => "Es la sección de actividades paralelas en la que aceptamos propuestas de todo tipo. Haznos llegar tu iniciativa de danza - movimiento relacionada con algún taller, jam, charla, intervención urbana, video, artes plásticas, performance etc. para insertarla en nuestra programación.",
            "10" => ""
          }
        }
        return dictionary[call_id][key.to_sym]  
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
