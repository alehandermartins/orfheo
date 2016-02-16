class ArtistProposal

  def initialize params, user_id
    @proposal = new_proposal params, user_id
    @profile_id = params['profile_id']
  end

  def add
    Repos::Profiles.push({profile_id: profile_id}, proposal)
  end

  private
  attr_reader :proposal, :profile_id

  def new_proposal params, user_id
    {
      user_id: user_id,
      profile_id: params['profile_id'],
      proposal_id: params['proposal_id'],
      category: params['category'],
      title: params['title'],
      description: params['description'],
      links: params['links'],
      short_description: params['short_description'],
      duration: params['duration'],
      children: params['children']
    }
  end
end
