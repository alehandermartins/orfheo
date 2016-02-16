class SpaceProposal

  def initialize params, user_id
    @proposal = new_proposal params, user_id
    @profile_id = params[:profile_id]
  end

  def add
    Repos::Profiles.push({profile_id: profile_id}, proposal)
  end

  def to_h
    proposal.to_h
  end

  private
  attr_reader :proposal, :profile_id

  def new_proposal params, user_id
    {
      proposal_id: params[:proposal_id],
      category: params[:category],
      title: params[:title],
      description: params[:description],
      links: params[:links],
      short_description: params[:short_description],
    }
  end
end
