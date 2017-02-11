module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{ |call|
          call[:artist].each{ |category, form|
            new_form = {}
            form.each{ |field, subcategory|
              new_form[field] = subcategory unless field == :'1'
              new_form[:cache][:label] = 'Caché / Gastos Producción' if field == :cache
              new_form[:cache][:input] = 'InputCache' if field == :cache
              new_form[:children] = subcategory if field == :'1'
              if field == :'7' && [:'Música', :'Artes Escénicas', :'Poesía'].include?(category)
                new_form[:cache] = subcategory
                new_form[:cache][:label] = 'Caché / Gastos Producción'
                new_form[:cache][:input] = 'InputCache'
                new_form.delete(:'7')
              end
              if field == :'10' && [:'Taller', :'Gastronomía'].include?(category)
                new_form[:cache] = subcategory
                new_form[:cache][:label] = 'Caché / Gastos Producción'
                new_form[:cache][:input] = 'InputCache'
                new_form.delete(:'10')
              end
              if field == :'8' && [:'Street Art', :'Audiovisual'].include?(category)
                new_form[:cache] = subcategory
                new_form[:cache][:label] = 'Caché / Gastos Producción'
                new_form[:cache][:input] = 'InputCache'
                new_form.delete(:'8')
              end
              if field == :'11' && [:'Otros'].include?(category)
                new_form[:cache] = subcategory
                new_form[:cache][:label] = 'Caché / Gastos Producción'
                new_form[:cache][:input] = 'InputCache'
                new_form.delete(:'11')
              end
            }

            call[:artist][category] = new_form
          }
          update call
        }
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
