describe ArtistProduction do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}

  let(:production_params){
    {
      profile_id: profile_id,
      production_id: production_id,
      category: 'category',
      title: 'title',
      description: 'description',
      short_description: 'short_descritpion',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children'
    }
  }

  describe 'Initialize' do

    it 'assigns a new production_id if the params do not specify any' do
      production_params.delete(:proposal_id)
      production = ArtistProduction.new production_params, user_id

      expect(UUID.validate production[:production_id]).to eq(true)
    end

    it 'assigns the old production_id if specified' do
      production = ArtistProduction.new production_params, user_id
      expect(production[:production_id]).to eq(production_id)
    end
  end

  describe 'Checks' do

    it 'if the fundamental fields are not empty' do
      production = ArtistProduction.new production_params, user_id
      expect(production.wrong_params?).to eq(false)

      production_params[:title] = ''
      otter_production = ArtistProduction.new production_params, user_id

      expect(otter_production.wrong_params?).to eq(true)
    end
  end
end
