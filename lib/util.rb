module Util
  class << self
    def string_keyed_hash_to_symbolized hash
      hash.map do |k,v|
        next if k == '_id'
        next [k,v] unless k.is_a? String
        next [k.to_sym, symbolize_array(v)] if v.is_a? Array
        [k.to_sym, v]
      end.compact.to_h
    end

    def symbolize_array array
      return array unless array.all?{ |element| element.is_a? Hash}
      array.map{ |proposal|
        proposal.map{ |k, v|
          next [k.to_sym, symbolize_array(v)] if v.is_a? Array
          [k.to_sym, v]
        }.to_h
      }
    end

    def stringify_hash hash
      hash.map do |k, v|
        next [k.to_s, stringify_array(v)] if v.is_a? Array
        [k.to_s, v]
      end.to_h
    end

    def stringify_array array
      return array unless array.all?{ |element| element.is_a? Hash}
      array.map do |v|
        stringify_hash(v)
      end
    end
  end
end