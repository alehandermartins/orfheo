class Program

  def initialize params
    performances = Util.arrayify_hash params[:program]
    @program = performances.map{ |performance|
      check_fields performance
      new_performance performance
    }
  end

  def check_fields performance
  raise Pard::Invalid::Params if mandatory.any?{ |field|
    performance[field].blank?
  }
  end

  def [] key
    program[key]
  end

  def to_a
    program
  end

  private
  attr_reader :program
  def new_performance performance
    {
      performance_id: performance[:performance_id],
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
      :performance_id,
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
