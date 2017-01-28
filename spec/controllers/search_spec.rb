describe SearchController do

  let(:login_route){'/login/login_attempt'}
  let(:logout_route){'/login/logout'}
  let(:suggest_route){'/search/suggest'}
  let(:results_route){'/search/results'}

  let(:user_hash){
    {
      email: 'email@test.com',
      password: 'password'
    }
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      validation: false,
      validation_code: validation_code
    }
  }

  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:otter_profile_id){'cce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:otter_production_id){'c11000e7-8f02-4542-a1c9-7f7aa18752ce'}

  let(:profile){
    {
      user_id: user_id,
      profile_id: profile_id,
      type: 'artist',
      name: 'TEATRO CÍRCULO',
      city: 'valencia',
      zip_code: 'zip_code',
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:space_profile){
    {
      user_id: 'otter_user',
      profile_id: 'otter_profile_id',
      type: 'space',
      name: 'space_name',
      category: 'home',
      address:  {
        "route": "Calle Nuestra Señora de la Asunción",
        "street_number": "4",
        "door": "b",
        "locality": "valencia",
        "country": "Spain",
        "postal_code": "46020"
      },
      zip_code: 'zip_code',
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:production){
    {
      profile_id: profile_id,
      production_id: production_id,
      category: 'music',
      title: 'music_title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      duration: 'duration',
      children: 'children'
    }
  }

  let(:otter_production){
    {
      profile_id: profile_id,
      production_id: otter_production_id,
      category: 'poetry',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      duration: 'duration',
      children: 'children'
    }
  }

  let(:artist_profile){
    profile.merge! productions: [production, otter_production]
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    allow(Repos::Profiles).to receive(:get_all).and_return([artist_profile, space_profile])
  }

  describe 'Suggest' do

    it 'returns empty array if last query is empty' do
      post suggest_route, {query: ['valencia', '']}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['items']).to eq([])
    end

    it 'fails if a non-empty query is not an array of strings' do
      post suggest_route, {query: [{id: 'id'}]}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_query')
    end

    it 'suggests names, categories... of profiles' do
      post suggest_route, {query: ['valencia', 'm']}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['items']).to eq([
        {
          "id" => "musica",
          "text"=>"musica",
          "type"=>"category",
          "icon"=>"music"
        }, 
        {
          "id"=>"music_title",
          "text"=>"music_title", 
          "type"=>"title",
          "icon"=>"music_title"
        }
      ])
    end

    it 'allows query from production fields' do
      post suggest_route, {query: ['music', 'tit']}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['items']).to eq([
        {
          "id"=>"title", 
          "text"=>"title", 
          "type"=>"title",
          "icon"=>"title"
        }
      ])
    end

    it 'does not suggest already queried elements' do
      post suggest_route, {query: ['musica', 'mus']}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['items']).to eq([{
        "id"=>"music_title", 
        "text"=>"music_title", 
        "type"=>"title",
        "icon"=>"music_title"
      }])
    end
  end

  describe 'Results' do

    it 'fails if the query is not an array of strings' do
      post results_route, {query: {id: 'id'}}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_query')
    end

    it 'returns random profiles if query is empty' do
      post results_route, {query: [], shown: []}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([Util.stringify_hash(artist_profile), Util.stringify_hash(space_profile)])
    end

    it 'retrieves profiles form other users if logged in' do
      post login_route, user_hash
      post results_route, {query: ['valencia'], shown: []}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([Util.stringify_hash(space_profile)])
    end

    it 'returns matching profiles' do
      post results_route, {query: ['music'], shown: []}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([Util.stringify_hash(artist_profile)])
    end

    it 'excludes already shown profiles' do
      post results_route, {query: ['valencia'], shown: [profile_id]}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([Util.stringify_hash(space_profile)])
    end
  end
end
