class BaseController < Sinatra::Base

  helpers do

    def respond_with_json
      content_type :json
    end

    def success payload = {}
      respond_with_json
      message = build_message(payload)
      message.to_json
    end

    def scopify **param_projection
      param_projection.each do |param, projection|
        projection = param if projection == true
        self.send(:define_singleton_method, projection) {
          params[param]
        }
      end
    end

    def check_invalid_email email
      raise Pard::Invalid.new 'invalid_email' if invalid_email? email
    end

    def check_invalid_password password
      raise Pard::Invalid.new 'invalid_password' if invalid_password? password
    end

    def check_profile_ownership profile_id
      raise Pard::Invalid::UnexistingProfile unless Repos::Profiles.exists? profile_id
      raise Pard::Invalid::ProfileOwnership unless Repos::Profiles.get_profile_owner(profile_id) == session[:identity]
    end

    def check_event_ownership! event_id
      raise Pard::Invalid::UnexistingEvent unless Repos::Events.exists? event_id
      raise Pard::Invalid::EventOwnership unless Repos::Events.get_event_owner(event_id) == session[:identity]
    end

    def check_type! type
      raise Pard::Invalid::Type unless ['artist', 'space', 'organization'].include? type
    end

    def check_artist_category! category
      raise Pard::Invalid::Category unless ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'gastronomy', 'other'].include? category
    end

    def check_space_category! category
      raise Pard::Invalid::Category unless ['cultural_ass', 'home', 'commercial', 'open_air'].include? category
    end

    def check_type_and_category type
      raise Pard::Invalid::Type unless ['artist', 'space', 'organization', 'music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'].include? type
    end

    def check_event_exists! event_id
      raise Pard::Invalid::UnexistingEvent unless Repos::Events.exists? event_id
    end

    private
    def build_message payload
      message = {status: :success}
      message = message.merge payload
    end

    def invalid_email? email
      (email =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i).nil?
    end

    def invalid_password? password
      password.blank? || password.size < 8
    end
  end
end
