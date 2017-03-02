module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{ |call|
          next if call[:artist].blank?
          es = {}
          new_artist = {}
          new_space = {}
          categories = {
            artist: {
              'music': {
                forms: ['1'],
                subcategories: ['1']
              },
              'arts': {
                forms: ['2'],
                subcategories: ['2']
              },
              'workshop': {
                forms: ['3'],
                subcategories: ['3']
              },
              'gastronomy': {
                forms: ['4'],
                subcategories: ['4']
              },
              'expo': {
                forms: ['5'],
                subcategories: ['5']
              },
              'street_art': {
                forms: ['6'],
                subcategories: ['6']
              },
              'poetry': {
                forms: ['7'],
                subcategories: ['7']
              },
              'audiovisual': {
                forms: ['8'],
                subcategories: ['8']
              },
              'other': {
                forms: ['9'],
                subcategories: ['9']
              }
            }
          }
          call[:artist].each{ |field, value|
            new_field = proposals_form call[:call_id].to_sym, :artist, field.to_sym
            new_value = {}
            value.each { |fie, val|
              new_value[fie] = val
              if fie == :category
                new_value[:category][:args] = val[:args].pop
                new_value[:category][:input] = 'CategorySelector'
                new_value[:subcategory] = subcategory new_field
              end
            }
            new_artist[new_field] = new_value
          }
          call[:space].each{ |field, value|
            new_field = proposals_form call[:call_id].to_sym, :space, field.to_sym
            value.delete(:category)
            value.delete(:subcategory)
            new_value = {}
            new_value[:subcategory] = space_sub
            value.each { |fie, val| new_value[fie] = val}
            new_space[new_field] = new_value
          }
          call[:es] = {
            artist: new_artist,
            space: new_space
          }
          @@calls_collection.update_one({call_id: call[:call_id]},{
          "$set": {categories: categories, es: call[:es]},
          "$unset": {artist: 1, space: 1}
          })
        }
      end

      def cat call_id
        categories = {
          "b6bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'music': {
                forms: ['1'],
                subcategories: ['1']
              },
              'arts': {
                forms: ['2'],
                subcategories: ['2']
              },
              'workshop': {
                forms: ['3'],
                subcategories: ['3']
              },
              'gastronomy': {
                forms: ['4'],
                subcategories: ['4']
              },
              'expo': {
                forms: ['5'],
                subcategories: ['5']
              },
              'street_art': {
                forms: ['6'],
                subcategories: ['6']
              },
              'poetry': {
                forms: ['7'],
                subcategories: ['7']
              },
              'audiovisual': {
                forms: ['8'],
                subcategories: ['8']
              },
              'other': {
                forms: ['9'],
                subcategories: ['9']
              }
            }
          }
        }
      end

      def subcategory number
        args = []
        args.push(number)
        field = {
          "type" => "mandatory",
          "label" => "Categoría de la propuesta en el evento",
          "input" => "SubcategorySelector",
          "args" => [args, "artist"],
          "helptext" => ""
        }
        field
      end

      def space_sub
        args = ['1', '2', '3', '4']
        field = {
          "type" => "mandatory",
          "label" => "Categoría del espacio en el evento",
          "input" => "SubcategorySelector",
          "args" => [args, "space"],
          "helptext" => ""
        }
        field
      end

      def proposals_form event_id, type, category
        categories = {
          "b6bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'Música': '1',
              'Artes Escénicas': '2',
              'Taller': '3',
              'Gastronomía': '4',
              'Exposición': '5',
              'Street Art': '6',
              'Poesía': '7',
              'Audiovisual': '8',
              'Otros': '9'
            },
            space: {
              'Espacio sin actividad programada': '10',
              'Espacio con actividad programada': '11'
            }
          },
          "b5bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'Música': '1',
              'Artes Escénicas': '2',
              'Taller': '3',
              'Gastronomía': '4',
              'Exposición': '5',
              'Street Art': '6',
              'Poesía': '7',
              'Audiovisual': '8',
              'Otros': '9'
            },
            space: {
              'Asociación Cultural': '10',
              'Local Comercial': '11',
              'Espacio Particular': '12',
              'Espacio Exterior': '13'
            }
          }
        }
        return categories[event_id][type][category] if categories[event_id][type].has_key? category
        category
      end

      def update call
        @@calls_collection.update_one({call_id: call[:call_id]},{
          "$set": call,
        },
        {upsert: true})
      end

      def exists? call_id
        return false unless UUID.validate(call_id)
        @@calls_collection.count(call_id: call_id) > 0
      end

      def get_forms call_id
        grab({call_id: call_id}).first
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
