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

  post '/events' do
    events = Repos::Events.get_events
    success ({events: events})
  end

  post '/users/save_program' do
    scopify event_id: true, order: true
    check_event_ownership! event_id

    program = Program.new(params)
    arrangedOrder = Util.arrayify_hash order
    Repos::Events.save_program event_id, program.to_a, arrangedOrder
    success
  end

  get '/event' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    event = Repos::Events.get_event params[:id]
    user = Repos::Users.grab({user_id: session[:identity]})
    event[:whitelisted] = false
    event[:whitelisted] = true if(session[:identity] == event[:user_id] || event[:whitelist].any?{|whitelisted| whitelisted[:email] == user[:email]})
    event.delete(:artists)
    event.delete(:whitelist)
    event.delete(:spaces)
    event.delete(:qr)
    status = 'outsider' if !session[:identity]
    status = 'visitor' if session[:identity]
    status = 'owner' if session[:identity] == event[:user_id]
    erb :event, :locals => {:the_event => event.to_json, :status => status.to_json}
  end

  get '/event_manager' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    event = Repos::Events.get_event params[:id]
    forms = Repos::Calls.get_forms event[:call_id]
    halt erb(:not_found) unless event[:user_id] == session[:identity]
    erb :event_manager, :locals => {:the_event => event.to_json, :forms => forms.to_json}
  end

  get '/conFusion' do
    event = Repos::Events.get_event 'a5bc4203-9379-4de0-856a-55e1e5f3fac6'
    program = [event[:program].first, event[:program][1]]
    program.map!{|performance| 
      performance.delete(:comments)
      performance.delete(:confirmed)
      performance.delete(:participant_proposal_id)
      performance.delete(:host_proposal_id)
      performance
    }
    event_name = event[:name]
    dates = event[:eventTime].keys
    dates.pop
    the_event = {name: event_name, dates: dates, shows: program}
    success({event: the_event})
  end

  private
  def check_participants! event_id, performance
    raise Pard::Invalid::UnexistingParticipants unless Repos::Events.performers_participate? event_id, performance
  end

  def check_existing_performance! event_id, performance
    raise Pard::Invalid::UnexistingPerformance unless Repos::Events.performance_exists? event_id, performance
  end
end
