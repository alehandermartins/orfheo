module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{|call|
          next if call[:categories].blank?
          @@calls_collection.update_one({call_id: call[:call_id]},{
            "$unset": {categories: 1}
          })
        }
      end

      def exists? call_id
        return false unless UUID.validate(call_id)
        @@calls_collection.count(call_id: call_id) > 0
      end

      def get_forms call_id, lang = nil
        call = grab({call_id: call_id}).first
        default_lang = call[:forms].keys.first
        default_lang = lang.to_sym unless lang.blank? || !call[:forms].has_key?(lang.to_sym)
        call[:forms][default_lang]
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
