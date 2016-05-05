describe Services::Calls do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:proposal){
    {
      profile_id: profile_id,
      production_id: production_id,
      call_id: call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      phone: '666999666',
      conditions: true,
      duration: '15',
      availability: 'sun',
      components: 3,
      photos: ['photo', 'otter_photo'],
      repeat: true
    }
  }

  let(:call){
    {}
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}

  let(:profile){
    {
      user_id: user_id,
      profile_id: profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:user){
    {
      email: 'email@test.com',
      password: 'password',
    }
  }

  describe 'Registration' do

    it 'registers the call' do
      expect(Repos::Calls).to receive(:add).with({user_id: user_id, call_id: call_id})
      Services::Calls.register call, user_id
    end
  end

  describe 'Exists?' do

    before(:each){
      Services::Calls.register call, user_id
    }

    it 'checks if a call_id is already employed' do
      expect(Services::Calls.exists? call_id).to eq(true)
      expect(Services::Calls.exists? 'otter').to eq(false)
    end

    it 'checks if a proposal exists' do
      expect(Services::Calls.proposal_exists? proposal_id).to eq(false)
      proposal.merge! proposal_id: proposal_id
      Repos::Calls.add_proposal call_id, proposal
      expect(Services::Calls.proposal_exists? proposal_id).to eq(true)
    end
  end

  describe 'Add proposal' do

    before(:each){
      allow(Repos::Users).to receive(:grab).with({user_id: user_id}).and_return(user);
      allow(Repos::Profiles).to receive(:get_profiles).with(:profile, {profile_id: profile_id}).and_return(profile)
    }

    let(:profile_proposal){
      proposal.merge user_id: user_id
    }

    it 'fails if the category is wrong' do
      proposal[:category] = ''
      expect{Services::Calls.add_proposal proposal, user_id}.to raise_error(Pard::Invalid::Category)
    end

    it 'fails if the parameters are wrong' do
      proposal[:profile_id] = ''
      expect{Services::Calls.add_proposal proposal, user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'adds a production to the profile' do
      expect(Services::Profiles).to receive(:add_production).with(hash_including(profile_proposal), user_id)
      Services::Calls.add_proposal proposal, user_id
    end

    it 'adds a proposal to the call' do
      expect(Repos::Calls).to receive(:add_proposal).with(call_id, hash_including(profile_proposal))
      Services::Calls.add_proposal proposal, user_id
    end
  end

  describe 'Get_owner' do
    it 'retrieves the owner of the call' do
      expect(Repos::Calls).to receive(:get_call_owner).with(call_id)
      Services::Calls.get_call_owner call_id
    end

    it 'retrieves the owner of the proposal' do
      expect(Repos::Calls).to receive(:get_proposal_owner).with(proposal_id)
      Services::Calls.get_proposal_owner proposal_id
    end
  end

  describe 'Get call' do
    it 'retrieves the specified call' do
      expect(Repos::Calls).to receive(:get_call).with(call_id)
      Services::Calls.get_call call_id
    end
  end

  describe 'Get proposal' do

    it 'retrieves the proposals for a given profile' do
      expect(Repos::Calls).to receive(:get_proposals_for).with(profile_id)
      Services::Calls.get_proposals_for profile_id
    end

    it 'retrieves the proposals for a profile when visiting' do
      expect(Repos::Calls).to receive(:get_otter_proposals_for).with(profile_id, 'artist')
      Services::Calls.get_otter_proposals_for profile_id, 'artist'
    end
  end

  describe 'Amend proposal' do
    it 'amends the proposal' do
      expect(Repos::Calls).to receive(:amend_proposal).with(proposal_id, 'amend')
      Services::Calls.amend_proposal proposal_id, 'amend'
    end
  end

  describe 'Delete proposal' do

    it 'deletes proposal but not stored pictures in the production' do
      Services::Calls.register call, user_id
      proposal.merge! proposal_id: proposal_id
      Repos::Calls.add_proposal call_id, proposal
      allow(Services::Profiles).to receive(:production_old_pictures).with(production_id).and_return({photos: ['photo']})
 
      expect(Cloudinary::Api).to receive(:delete_resources).with(['otter_photo'])
      expect(Repos::Calls).to receive(:delete_proposal).with(proposal_id)
      Services::Calls.delete_proposal proposal_id
    end
  end
end
