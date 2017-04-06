module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{|call|
          event = Repos::Events.get_by_call call[:call_id]
          form_categories = event[:texts][:es][:form_categories] 
          subcategories = event[:texts][:es][:subcategories]
          call[:forms][:es].each{|type, forms|
            forms.each{|key, form|
              next unless form[:label].blank?
              call[:forms][:es][type][key][:label] = form_categories[type][key.to_sym]
              form[:blocks].each{|field, block|
                if field == :subcategory
                  keys = block[:args].first
                  values = keys.map{|key| subcategories[type][key.to_sym]}
                  call[:forms][:es][type][key][:blocks][:subcategory][:args] = keys.zip(values).to_h
                end
                call[:forms][:es][type][key][:blocks][field][:args] = nil if block[:input] == 'CheckBox'
                call[:forms][:es][type][key][:blocks][field][:args] = nil if block[:input] == 'Input'
                call[:forms][:es][type][key][:blocks][field][:input] = 'Text' if block[:input] == 'Input'
                call[:forms][:es][type][key][:blocks][field][:args] = block[:args][0] if block[:input] == 'MultipleDaysSelector'
                call[:forms][:es][type][key][:blocks][field][:helptext] = nil if block[:helptext].blank?
                call[:forms][:es][type][key][:blocks][field][:helptext] = nil if field == :conditions
                if block[:input] == 'TextArea' || block[:input] == 'TextAreaEnriched'
                  call[:forms][:es][type][key][:blocks][field][:placeholder] = nil
                  call[:forms][:es][type][key][:blocks][field][:placeholder] = block[:args].first unless block[:args].first.blank?
                  call[:forms][:es][type][key][:blocks][field][:args] = nil
                end
                if block[:input] == 'TextAreaCounter'
                  call[:forms][:es][type][key][:blocks][field][:helptext] = block[:args].last unless block[:args].last.blank?
                  call[:forms][:es][type][key][:blocks][field][:args] = 80
                end
              }
            }
          }
          @@calls_collection.update_one({call_id: call[:call_id]},{
            "$set": {forms: call[:forms]}
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
