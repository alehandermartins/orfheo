class EventsController < BaseController

  post '/users/create_performances' do
    scopify :event_id, :signature
    check_event_ownership! event_id

    performances = Performances.new(params, event_id)
    Repos::Events.save_program event_id, performances.to_save

    message = {event: 'addPerformances', model: performances.to_a, signature: signature}
    Services::Clients.send_message(event_id, success(message))
    success(message)
  end

  post '/users/modify_performances' do
    scopify :event_id, :signature
    check_event_ownership! event_id

    performances = Performances.new(params, event_id)
    Repos::Events.save_program event_id, performances.to_save

    message = {event: 'modifyPerformances', model: performances.to_a, signature: signature}
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

  post '/events' do
    events = Repos::Events.get_events
    success ({events: events})
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

  get '/event' do
    halt erb(:not_found) unless Repos::Events.exists? params[:id]
    event = Repos::Events.get_arranged_event params[:id]
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
    event = Repos::Events.get_arranged_event params[:id]
    forms = Repos::Calls.get_forms event[:call_id]
    halt erb(:not_found) unless event[:user_id] == session[:identity]
    erb :event_manager, :locals => {:the_event => event.to_json, :forms => forms.to_json}
  end

  get '/conFusion' do
    event = Repos::Events.get_arranged_event 'a5bc4203-9379-4de0-856a-55e1e5f3fac6'
    program = event[:program]
    program.map!{|performance|
      performance[:participant_category] = performance[:participant_subcategory]
      performance[:host_category] = performance[:host_subcategory]
      performance.delete(:participant_subcategory)
      performance.delete(:host_subcategory) 
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
end
