class EventsController < BaseController

  post '/users/create_performances' do
    scopify :event_id
    check_event_ownership! event_id

    performances = Performances.new(params, event_id)
    Repos::Events.save_program event_id, performances.to_save

    message = {event: 'addPerformances', model: performances.to_a}
    Services::Clients.send_message(event_id, success(message))
    success(message)
  end

  post '/users/modify_performances' do
    scopify :event_id
    check_event_ownership! event_id

    performances = Performances.new(params, event_id)
    Repos::Events.save_program event_id, performances.to_save

    message = {event: 'modifyPerformances', model: performances.to_a}
    Services::Clients.send_message(event_id, success(message))
    success(message)
  end

  post '/users/delete_performances' do
    scopify :event_id
    check_event_ownership! event_id

    event = Repos::Events.get_event params[:event_id]
    performances = Util.arrayify_hash params[:program]
    ids = performances.map{ |performance| performance[:performance_id]}
    program = event[:program].reject{ |performance| ids.include? performance[:performance_id]}

    Repos::Events.save_program event_id, program
    message = {event: 'deletePerformances', model: performances}
    Services::Clients.send_message(event_id, success(message))
    success(message)
  end

  post '/users/space_order' do
    scopify :event_id, :order
    check_event_ownership! event_id

    new_order = Util.arrayify_hash order
    Repos::Events.space_order event_id, new_order
    
    message = {event: 'orderSpaces', model: new_order}
    Services::Clients.send_message(event_id, success(message))
    success(message)
  end

  post '/users/publish' do
    scopify :event_id
    check_event_ownership! event_id
    status = Repos::Events.publish event_id
    
    message = {event: 'publishEvent', model: status}
    Services::Clients.send_message(event_id, success(message))
    success(message)
  end

  post '/events' do
    events = Services::Events.get_events
    success ({events: events})
  end

  get '/event' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    event = Services::Events.get_event params[:id], session[:identity]
    status = status_for event[:user_id]
    erb :event, :locals => {:the_event => event.to_json, :status => status.to_json}
  end

  get '/event_manager' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    event = Services::Events.get_manager_event params[:id]
    halt erb(:not_found) unless event[:user_id] == session[:identity]
    forms = Repos::Calls.get_forms event[:call_id]
    erb :event_manager, :locals => {:the_event => event.to_json, :forms => forms.to_json}
  end

  get '/conFusion' do
    event = Services::Events.get_app_event 'a5bc4203-9379-4de0-856a-55e1e5f3fac6'
    success({event: event})
  end
end
