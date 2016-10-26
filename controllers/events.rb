class EventsController < BaseController

  post '/users/create_event' do
    event_id = SecureRandom.uuid
    event = Forms::Events.new(params, session[:identity]).create(event_id)
    Repos::Events.add event
    success({event: event})
  end

  post '/users/create_performance' do
    scopify event_id: true
    check_event_ownership! event_id

    performance_id = SecureRandom.uuid
    performance = Forms::Events.new(params, session[:identity]).create_performance(performance_id)
    check_participants! event_id, performance
    Repos::Events.add_performance event_id, performance
    
    success ({performance_id: performance_id})
  end

  post '/users/modify_performance' do
    scopify event_id: true, performance_id: true
    check_event_ownership! event_id

    performance = Forms::Events.new(params, session[:identity]).create_performance(performance_id)
    check_existing_performance! event_id, performance
    Repos::Events.modify_performance event_id, performance

    success ({performance_id: performance_id})
  end

  post '/users/delete_performance' do
    scopify event_id: true, performance_id: true
    check_event_ownership! event_id
    Repos::Events.delete_performance event_id, performance_id
    success
  end

  get '/event' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    program = Repos::Events.get_program params[:id]
    status = 'outsider' if !session[:identity]
    status = 'visitor' if session[:identity]
    erb :event, :locals => {:program => program.to_json, :status => status.to_json}
  end

  get '/event_manager' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    event = Repos::Events.get_event params[:id]
    halt erb(:not_found) unless event[:user_id] == session[:identity]
    erb :event_manager, :locals => {:eventt => event.to_json}
  end

  private
  def check_event_ownership! event_id
    raise Pard::Invalid::UnexistingEvent unless Repos::Events.exists? event_id
    raise Pard::Invalid::EventOwnership unless Repos::Events.get_event_owner(event_id) == session[:identity]
  end

  def check_participants! event_id, performance
    raise Pard::Invalid::UnexistingParticipants unless Repos::Events.performers_participate? event_id, performance
  end

  def check_existing_performance! event_id, performance
    raise Pard::Invalid::UnexistingPerformance unless Repos::Events.performance_exists? event_id, performance
  end
end
