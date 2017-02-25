module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{ |call|
          es = {}
          call[:artist].each{ |field, value|
            new_artist = {}
            new_field = proposals_form call_id.to_sym, :artist, field.to_sym
            new_artist[new_field] = value
          }
          call[:es] = {
            artist: new_artist
          }
          puts call[:es]
        }
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
