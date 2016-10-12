module Services
   class Chat
    
    KEEPALIVE_TIME = 15 # in seconds
    attr_reader :clients, :base_channel
    
    def initialize(app)
      @app = app
      @clients = []
    end
    
    # def call(env)
    #   if Faye::WebSocket.websocket?(env)
    #     # If the type of connection we're dealing with is a weboscket request,
    #     # handle the connection.
    #     setup_websocket_connection(env)
    #   else
    #     # Normal requests will continue through the call chain.
    #     @app.call(env)
    #   end
    # end
    
    # def send_message(channel, msg)
    #   # For every client that has connected
    #   clients.each do |client|

    #     channel_name = channel.gsub("#{base_channel}.", "")

    #     # If the client has requested a subscription to this channel
    #     if client[:channels].include?(channel_name)

    #       # Send the client the message, including the channel on which it
    #       # was received.
    #       message = "{\"channel\":\"#{channel_name}\",\"message\":#{msg}}"
    #       client[:ws].send(message)
    #     end
    #   end
    # end
    
    # def new_client
    #   # A client is represented here as a hash that has access to the Faye::Websocket
    #   # object and an array of channels they care about.
    #   { :ws => nil, :channels => [] }
    # end
    
    # def setup_websocket_connection(env)
    #   ws = Faye::WebSocket.new(env, nil, { ping: KEEPALIVE_TIME })

    #   # Create a new client
    #   client = new_client
  
    #   # Set up the "connection opened" event
    #   websocket_connection_open(ws, client, env)
    #   # Set up the "connection closed" event
    #   websocket_connection_close(ws, client)
  
    #   # Return the websocket rack response
    #   ws.rack_response
    # end
    
    #   def websocket_connection_open(ws, client, env)
    #     request = Rack::Request.new(env)
    
    #     # The list of channels the client is requesting access to
    #     channels = request.params["channels"]
    #     # A user token used for authentication
    #     #token = request.cookies["user_token"]
    #     token = session[:identity]
    #     # When a connection has been opened
    #     ws.on :open do |event|

    #       # Assign the websocket object to the client
    #       client[:ws] = ws
    
    #       # For every channel the client wants to subscribe to...
    #       channels.each do |channel|
    #         # Ensure they are authorized to listen on this channel. (This is not
    #         # needed, but useful if you want to add security to specific channels)
    #         if WebsocketChannelAuthorizer.can_subscribe?(channel, token)
    #           # Add the channel to the client
    #           client[:channels].push(channel)
    #         end
    #       end
    
    #       # Add the client to the list of clients
    #       clients.push(client)
    #     end
    
    #   end
    
    #   def websocket_connection_close(ws, client)
    #     # When a client disconnects
    #     ws.on :close do |event|
    #       # Remove them from our list
    #       clients.delete(client)
    #       ws = nil
    #     end
    #   end
    
    # end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        # WebSockets logic goes here
        ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })

        ws.on :open do |event|
          p [:open, ws.object_id]
          req = Rack::Request.new(env)
          puts req.params
          puts req.session[:identity]
          @clients << ws
        end

        ws.on :message do |event|
          p [:message, event.data]
          @clients.each {|client| client.send(event.data) }
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code, event.reason]
          @clients.delete(ws)
          ws = nil
        end

        # Return async Rack response
        ws.rack_response
      else
        @app.call(env)
      end
    end
  end
end
