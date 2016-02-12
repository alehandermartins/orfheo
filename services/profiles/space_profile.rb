class SpaceProfile
  class << self

    def correct_keys? params
      params.keys == ['type', 'name', 'city', 'address', 'zip_code', 'category']
    end

    def correct_params? params
      correct_fields?(params) && correct_values?(params)
    end

    private
    def correct_fields? params
      return true unless params.has_key? 'category'
      correct_categories? params['category']
    end

    def correct_values? params
      params.all?{ |key, value|
        !(value.nil? || value.empty?)
      }
    end

    def correct_categories? category
      ['cultural_ass', 'home', 'commercial'].include? category
    end
  end
end
