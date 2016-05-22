module Pard
  class Invalid < StandardError
  end

  class Invalid::ExistingUser < Invalid
    def message
      'already_registered'
    end
  end

  class Invalid::UnexistingUser < Invalid
    def message
      'non_existing_user'
    end
  end

  class Invalid::Params < Invalid
    def message
      'invalid_parameters'
    end
  end

  class Invalid::Password < Invalid
    def message
      'incorrect_password'
    end
  end

  class Invalid::Unvalidated < Invalid
    def message
      'not_validated_user'
    end
  end

  class Invalid::Type < Invalid
    def message
      'invalid_type'
    end
  end

  class Invalid::Category < Invalid
    def message
      'invalid_category'
    end
  end

  class Invalid::Form < Invalid
    def message
      'invalid_form'
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

  class Invalid::UnexistingProduction < Invalid
    def message
      'non_existing_production'
    end
  end

  class Invalid::UnexistingProposal < Invalid
    def message
      'non_existing_proposal'
    end
  end

  class Invalid::ProfileOwnership < Invalid
    def message
      'you_dont_have_permission'
    end
  end

  class Invalid::ProductionOwnership < Invalid
    def message
      'you_dont_have_permission'
    end
  end

  class Invalid::ProposalOwnership < Invalid
    def message
      'you_dont_have_permission'
    end
  end

  class Invalid::CallOwnership < Invalid
    def message
      'you_dont_have_permission'
    end
  end

  class Invalid::ExistingCall < Invalid
    def message
      'existing_call'
    end
  end

  class Invalid::UnexistingCall < Invalid
    def message
      'non_existing_call'
    end
  end

  class Invalid::QueryParams < Invalid
    def message
      'invalid_query'
    end
  end
end


