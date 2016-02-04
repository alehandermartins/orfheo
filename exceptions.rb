module Pard
  class Invalid < StandardError
  end

  class Invalid::Email < Invalid
    def message
      'invalid_email'
    end
  end

  class Invalid::Password < Invalid
    def message
      'invalid_password'
    end
  end
end


