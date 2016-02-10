class SpaceProfile
  class << self

    def correct_keys? params
      params.keys == ['type', 'name', 'address', 'zip_code', 'category']
    end

    def correct_params? params
      correct_values?(params) && correct_categories?(params['category'])
    end

    private
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
