class Whitelist

  def initialize params, event_id
    check_fields params
    @event = Repos::Events.get_event event_id
    whitelisted = new_whitelisted params
    @whitelist = new_whitelist whitelisted
  end

  def check_fields params
  raise Pard::Invalid::Params if mandatory.any?{ |field|
    params[field].blank?
  }
  end

  def to_a
    @whitelist    
  end

  private
  attr_reader :whitelist, :event
  def new_whitelist whitelisted
    event[:whitelist].reject{ |participant| participant[:email] == whitelisted[:email]}
    event[:whitelist].push(whitelisted)
    event[:whitelist]
  end

  def new_whitelisted params
    {
      name_email: params[:name_email],
      email: params[:email]
    }
  end

  def mandatory
    [
      :name_email,
      :email
    ]
  end
end
