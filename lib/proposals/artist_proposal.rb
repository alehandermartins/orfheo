class ArtistProposal

  def initialize params, user_id
    @proposal = new_proposal params, user_id
    @user_id = user_id
    @profile_id = params[:profile_id]
  end

  def wrong_params?
    check_fundamentals
  end

  def image_folders
    [{
      address: @user_id + '/' + @profile_id + '/' + proposal[:proposal_id] + '/photos',
      field: :photos
    }]
  end

  def [] key
    proposal[key]
  end

  def to_h
    proposal.to_h
  end

  private
  attr_reader :proposal

  def new_proposal params, user_id
    {
      proposal_id: params[:proposal_id] || SecureRandom.uuid,
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

  def check_fundamentals
    [:category, :title, :description].any?{ |field|
      proposal[field].blank?
    }
  end
end
