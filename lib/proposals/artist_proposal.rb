class ArtistProposal

  def initialize params, user_id
    @proposal = new_proposal params, user_id
    @profile_id = params[:profile_id]
  end

  def to_h
    proposal.to_h
  end

  private
  attr_reader :proposal

  def new_proposal params, user_id
    {
      proposal_id: params[:proposal_id],
      category: params[:category],
      title: params[:title],
      description: params[:description],
      photos: params[:photos],
      links: params[:links],
      short_description: params[:short_description],
      duration: params[:duration],
      children: params[:children]
    }
  end
end
