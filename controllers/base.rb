class BaseController < Sinatra::Base

  helpers do

    def respond_with_json
      content_type :json
    end

    def success
      respond_with_json
      message = {status: :success}
      message.to_json
    end

    def fail! reason = nil
      respond_with_json
      message = {status: :fail}
      halt message.to_json
    end

    def check_invalid_email email
      raise Pard::Invalid.new 'invalid_email' if invalid_email? email
    end

    def check_invalid_password password
      raise Pard::Invalid.new 'invalid_password' if invalid_password? password
    end

    private
    def invalid_email? email
      (email =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i).nil?
    end

    def invalid_password? password
      password.nil? || password.empty? || password.size < 8
    end

    def invalid_param? param
      param.nil? || param.empty?
    end
  end
end
