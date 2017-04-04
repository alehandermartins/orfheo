module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        call = grab({call_id: "b6bc4203-9379-4de0-856a-55e1e5f3fac6"}).first
        call[:es][:artist].each{ |key, form|
          form[:blocks].each{ |field, block|
            puts field

          }
        }
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
