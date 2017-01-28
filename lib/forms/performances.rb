class Performances

  def initialize params, event_id
    program = Util.arrayify_hash params[:program]
    event = Repos::Events.get_event event_id
    @performances = program.map{ |show|
      check_fields event, show
      performance = new_performance show
    }
  end

  def check_fields event, performance
  raise Pard::Invalid::Params if mandatory.any?{ |field|
    performance[field].blank?
  }
  check_participants event, performance
  end

  def check_participants event, performance
    raise Pard::Invalid::Params unless event[:artists].any?{|artist| artist[:profile_id] == performance[:participant_id]}    
    raise Pard::Invalid::Params unless event[:spaces].any?{|space| space[:profile_id] == performance[:host_id]}
  end

  def to_a
    performances.to_a
  end

  private
  attr_reader :performances
  def new_performance performance
    {
      performance_id: performance[:performance_id] || SecureRandom.uuid,
      date: performance[:date],
      permanent: performance[:permanent],
      time: performance[:time],
      participant_id: performance[:participant_id],
      participant_proposal_id: performance[:participant_proposal_id],
      host_id: performance[:host_id],
      host_proposal_id: performance[:host_proposal_id],
      comments: performance[:comments],
      confirmed: performance[:confirmed]
    }
  end

  def mandatory
    [
      :date,
      :permanent,
      :time,
      :participant_id,
      :participant_proposal_id,
      :host_id,
      :host_proposal_id
    ]
  end
end
