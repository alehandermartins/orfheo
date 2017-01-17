class Performance

  def initialize params
    #performances = Util.arrayify_hash params[:program]
    check_fields params
    @performance = new_performance params
  end

  def check_fields performance
  raise Pard::Invalid::Params if mandatory.any?{ |field|
    performance[field].blank?
  }
  end

  def add_host host
    performance[:last_host] = host
  end

  def [] key
    performance[key]
  end

  def to_h
    performance.to_h
  end

  private
  attr_reader :performance
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
