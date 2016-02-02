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
  end
end

# helpers do
#   def username
#     session[:identity] ? session[:identity] : 'Hello stranger'
#   end
# end

# before '/secure/*' do
#   if !session[:identity] then
#     session[:previous_url] = request.path
#     @error = 'Sorry guacamole, you need to be logged in to visit ' + request.path
#     halt erb(:login_form)
#   end
# end


# post '/receive-action' do
#   content_type :json
#   puts params
#   {:resolved_action => params['action']}.to_json
# end



# get '/login/form' do
#   erb :login_form
# end

# post '/login/attempt' do
#   session[:identity] = params['username']
#   where_user_came_from = session[:previous_url] || '/'
#   redirect to where_user_came_from
# end

# get '/logout' do
#   session.delete(:identity)
#   erb "<div class='alert alert-message'>Logged out</div>"
# end


# get '/secure/place' do
#   erb "This is a secret place that only <%=session[:identity]%> has access to!"
# end
