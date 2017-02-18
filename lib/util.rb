module Util
  class << self
    def string_keyed_hash_to_symbolized hash
      hash.map do |k,v|
        next if k == '_id'
        next [k,v] unless k.is_a? String
        next [k.to_sym, string_keyed_hash_to_symbolized(v)] if v.is_a? Hash
        next [k.to_sym, symbolize_array(v)] if v.is_a? Array
        [k.to_sym, v]
      end.compact.to_h
    end

    def symbolize_array array
      array.map do |v|
        next string_keyed_hash_to_symbolized v if v.is_a? Hash
        next symbolize_array v if v.is_a? Array
        v
      end
    end

    def stringify_hash hash
      hash.map do |k, v|
        next [k.to_s, stringify_hash(v)] if v.is_a? Hash
        next [k.to_s, stringify_array(v)] if v.is_a? Array
        next [k.to_s, v.to_s] if v.is_a? Symbol
        [k.to_s, v]
      end.to_h
    end

    def stringify_array array
      array.map do |v|
        next stringify_hash v if v.is_a? Hash
        next stringify_array v if v.is_a? Array 
        v
      end
    end

    def arrayify_hash hash
      return hash if hash.is_a? Array
      return [] if hash.blank?
      return symbolize_array(hash) if hash.is_a? Array
      return hash unless hash.is_a? Hash
      hash.map do |k, v|
        string_keyed_hash_to_symbolized(v)
      end
    end

    def translate array
      array.map{ |value|
        esp_eng(I18n.transliterate(value.downcase))
      }
    end

    def esp_eng text
        dictionary = {
          'artista' => 'artist',
          'espacio' => 'space',
          'espacio exterior' => 'open_air',
          'asociacion cultural' => 'cultural_ass',
          'local comercial' => 'commercial',
          'espacio particular' => 'home',
          'musica' => 'music',
          'artes escenicas' => 'arts',
          'exposicion' => 'expo',
          'poesia' => 'poetry',
          'audiovisual' => 'audiovisual',
          'street_art' => 'street_art',
          'taller' => 'workshop',
          'otros' => 'other',
          'infantil' => 'children'
        }
        return dictionary[text] if dictionary.has_key? text
        text
      end

    def destroy_old_pictures old_pictures, new_pictures
      unused_pictures = old_pictures.keys.map{ |field|
        next if old_pictures[field].blank?
        next old_pictures[field] if new_pictures[field].blank?
        old_pictures[field].reject{ |picture|
          new_pictures[field].include? picture
        }
      }.compact.flatten
      Cloudinary::Api.delete_resources(unused_pictures) unless unused_pictures.blank?
    end
  end
end
