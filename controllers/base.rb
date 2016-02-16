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

    def check_invalid_email email
      raise Pard::Invalid.new 'invalid_email' if invalid_email? email
    end

    def check_invalid_password password
      raise Pard::Invalid.new 'invalid_password' if invalid_password? password
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
