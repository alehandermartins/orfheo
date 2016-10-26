class Forms::Events < Forms::Base
	
	def create event_id
		event = {}
		event.merge! user_id: user_id
		event.merge! event_id: event_id
		event
	end

	def create_performance performance_id
		performance = performance_form performance_id
    performance
	end

  def artist
    {
      user_id: user_id,
      profile_id: params[:participant_id],
      proposals: [artist_proposal]
    }
  end

  def space
    {
      user_id: user_id,
      profile_id: params[:host_id],
    }
  end

  def artist_proposal
    {
      production_id: params[:participant_production_id],
      proposal_id: params[:participant_proposal_id],
      participant_name: params[:participant_name],
      title: params[:title],
      short_description: params[:short_description],
      participant_category: params[:participant_category],
      children: params[:children]
    }
  end

	private
	def performance_form performance_id
		{
			performance_id: performance_id,
      participant_id: params[:participant_id],
      participant_proposal_id: params[:participant_proposal_id],
      host_id: params[:host_id],
      host_proposal_id: params[:host_proposal_id],
      date: params[:date],
      time: params[:time],
      permanent: params[:permanent],
      comments: params[:comments],
      confirmed: false,
    }
	end
end

