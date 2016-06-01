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

  let(:otter_proposal){
    {
      profile_id: profile_id,
      proposal_id: 'otter_proposal',
      title: 'otter_title',
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      photos: ['otter_photo']
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
      expect(Repos::Calls).to receive(:add).with({user_id: user_id, call_id: call_id, start: nil, deadline: nil})
      Services::Calls.register call, user_id
    end
  end

  describe 'Proposals old pictures' do
    it 'returns all the proposal pictures for a given production' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })
      Repos::Calls.add({
        user_id: 'otter_user',
        call_id: call_id
      })

      Repos::Calls.add_proposal call_id, proposal
      otter_proposal.merge! production_id: production_id
      Repos::Calls.add_proposal 'otter', otter_proposal
      expect(Services::Calls.proposals_old_pictures production_id).to eq({photos: ['photo', 'otter_photo', 'otter_photo']})
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
