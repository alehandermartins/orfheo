describe SearchController do

  let(:login_route){'/login/login_attempt'}
  let(:logout_route){'/login/logout'}
  let(:create_profile_route){'/users/create_profile'}
  let(:create_proposal_route){'/users/create_proposal'}
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
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:otter_profile_id){'cce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:otter_proposal_id){'c11000e7-8f02-4542-a1c9-7f7aa18752ce'}

  let(:profile){
    {
      profile_id: profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'valencia',
      zip_code: 'zip_code',
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:space_profile){
    {
      profile_id: otter_profile_id,
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

  let(:proposal){
    {
      profile_id: profile_id,
      proposal_id: proposal_id,
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

  let(:otter_proposal){
    {
      profile_id: profile_id,
      proposal_id: otter_proposal_id,
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
    profile.merge! proposals: [proposal, otter_proposal]
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    post login_route, user_hash
    post create_profile_route, profile
    post create_profile_route, space_profile
    post create_proposal_route, proposal
    post create_proposal_route, otter_proposal
    allow(Services::Profiles).to receive(:get_profiles).with(:all, nil).and_return([artist_profile, space_profile])
  }

  describe 'Suggest' do

    it 'returns default types if query is empty' do
      post suggest_route, {query: []}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['items']).to eq([{
        'id' => 'artist',
        'text' => 'artist',
        'type' => 'type'
      },
      {
        'id' => 'space',
        'text' => 'space',
        'type' => 'type'
      }])
    end

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
          "id" => "music",
          "text"=>"music",
          "type"=>"category"
        }, 
        {
          "id"=>"home", 
          "text"=>"home", 
          "type"=>"category"
        }, 
        {
          "id"=>"artist_name", 
          "text"=>"artist_name", 
          "type"=>"name"
        }, 
        {
          "id"=>"space_name", 
          "text"=>"space_name", 
          "type"=>"name"
        }, 
        {
          "id"=>"music_title",
          "text"=>"music_title", 
          "type"=>"title"
        }
      ])
    end

    it 'allows query from proposal fields' do
      post suggest_route, {query: ['music', 'tit']}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['items']).to eq([
        {
          "id"=>"music_title",
          "text"=>"music_title", 
          "type"=>"title"
        }, 
        {
          "id"=>"title", 
          "text"=>"title", 
          "type"=>"title"
        }
      ])
    end
  end

  describe 'Results' do

    it 'fails if the query is not an array of strings' do
      post results_route, {query: {id: 'id'}}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_query')
    end

    it 'returns random profiles if query is empty' do
      post results_route, {query: []}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([Util.stringify_hash(artist_profile), Util.stringify_hash(space_profile)])
    end

    it 'returns matching profiles' do
      post results_route, {query: ['music']}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([Util.stringify_hash(artist_profile)])
    end
  end
end
