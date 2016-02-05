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

    before '/users/*' do
      if !session[:identity] then
        halt erb(:welcome)
      end
    end

    get '/users/place' do
      erb(:users)
    end
  end
end
