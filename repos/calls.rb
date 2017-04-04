module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        calls = grab({})
        calls.each{|call|
          es = {}
          call[:es].each{ |type, forms|
            es[type] = forms
            forms.each{ |key, form|
              form[:blocks].each{ |field, block|
                es[type][key][:blocks][field][:input] = "Selector" if block[:input] == "ActivateSelector"
                if (block[:input] == "MultipleSelector" || block[:input] == "Selector") && field != :duration
                  es[type][key][:blocks][field][:args] = Hash[block[:args].first.each_with_index.map {|x, index| [index + 1, x]}] unless block[:args].is_a? Hash
                end
                es[type][key][:blocks][field] = duration if field == :duration && call[:call_id] != "9068d4f8-ed2a-4faf-8a26-df87e000e33c"
              }
            }
          }
          @@calls_collection.update_one({call_id: call[:call_id]},
            {
              "$set": {'es': es}
            })
        }
      end

      def duration
        {
          "type" => "mandatory",
          "label" => "Duración del espectáculo",
          "input" => "Duration",
          "args" => {
              "5" => "5 min",
              "10" => "10 min",
              "15" => "15 min",
              "20" => "20 min",
              "25" => "25 min",
              "30" => "30 min",
              "35" => "35 min",
              "40" => "40 min",
              "45" => "45 min",
              "50" => "50 min",
              "55" => "55 min",
              "60" => "1 h",
              "75" => "1h 15min",
              "90" => "1h 30min",
              "105" => "1h 45min",
              "120" => "2 h",
              "135" => "2h 15min",
              "150" => "2h 30min"
          },
          "helptext" => ""
        }
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
