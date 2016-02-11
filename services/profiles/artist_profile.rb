class ArtistProfile
  class << self

    def correct_keys? params
      params.keys == ['type', 'name', 'city', 'zip_code']
    end

    def correct_params? params
      params.all?{ |key, value|
        !(value.nil? || value.empty?)
      }
    end
  end
end
