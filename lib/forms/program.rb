class Forms::Program < Forms::Base
  
  def create
    scopify
    program.map{ |performance|
      performance = create_model_from_performance performance
    }
  end

  private
  def scopify
    params[:program] = Util.arrayify_hash params[:program]
    raise Pard::Invalid::Params if params[:event_id].blank?
    [:event_id, :program].each do |param|
      self.send(:define_singleton_method, param) {
        params[param]
      }
    end
  end

  def create_model_from_performance performance
    {
      performance_id: performance[:performance_id] || SecureRandom.uuid,
      time: performance[:time],
      participant_id: performance[:participant_id],
      participant_proposal_id: performance[:participant_proposal_id],
      host_id: performance[:host_id],
      host_proposal_id: performance[:host_proposal_id]
    }
  end
end
