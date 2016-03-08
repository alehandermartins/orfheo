module Pard
  class Invalid < StandardError
  end

  class Invalid::Params < Invalid
    def message
      'invalid_parameters'
    end
  end

  class Invalid::ExistingProfile < Invalid
    def message
      'existing_profile'
    end
  end

  class Invalid::UnexistingProfile < Invalid
    def message
      'non_existing_profile'
    end
  end
end


