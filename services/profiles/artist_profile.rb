class ArtistProfile
  class << self

    def correct_keys? params
      params.keys == ['type', 'name', 'zip_code']
    end

    def correct_values? params
      params.map{ |key, value|
        return false if (value.nil? || value.empty?)
      }
    end
  end
end
