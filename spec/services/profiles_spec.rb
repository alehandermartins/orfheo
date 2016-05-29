describe Services::Profiles do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:space_profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb85'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}

  let(:profile_model){
    {
      user_id: user_id,
      profile_id: profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      personal_web: nil,
      color: 'color',
      profile_picture: ['profile.jpg']
    }
  }

  let(:space_profile_model){
    {
      user_id: user_id,
      profile_id: space_profile_id,
      type: 'space',
      name: 'space_name',
      city: 'city',
      address: 'address',
      zip_code: 'zip_code',
      category: 'home',
      profile_picture: ['picture.jpg'],
      photos: ['space_picture.jpg', 'otter_picture.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:production_model){
    {
      user_id: user_id,
      production_id: production_id,
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: [{'link'=> 'web', 'web_title'=> 'web_name'},{'link'=> 'otter_web', 'web_title'=> 'otter_web_name'}],
      duration: 'duration',
      children: 'children',
      components: nil
    }
  }

  before(:each){
    Repos::Profiles.update profile_model
    Repos::Profiles.update space_profile_model
    Repos::Profiles.add_production profile_id, production_model
  }

  describe 'Delete old images' do

    before(:each){
      Repos::Profiles.add_production profile_id, production_model
      allow(Services::Calls).to receive(:proposals_old_pictures).with(production_id).and_return({photos: []})
    }

    it 'deletes profile old images' do
      old_pictures = Services::Profiles.profile_old_pictures space_profile_id
      space_profile_model[:profile_picture] = ['']
      space_profile_model[:photos] = ['otter_picture.jpg']
      expect(Cloudinary::Api).to receive(:delete_resources).with(['picture.jpg', 'space_picture.jpg'])
      Services::Profiles.destroy_profile_old_pictures old_pictures, space_profile_model
    end

    it 'deletes production old images' do
      old_pictures = Services::Profiles.production_old_pictures production_id
      production_model[:photos] = ['picture.jpg']
      expect(Cloudinary::Api).to receive(:delete_resources).with(['otter_picture.jpg'])
      Services::Profiles.destroy_production_old_pictures old_pictures, production_model
    end

    it 'does not delete images used by proposals' do
      old_pictures = Services::Profiles.production_old_pictures production_id
      allow(Services::Calls).to receive(:proposals_old_pictures).with(production_id).and_return({photos: ['otter_picture.jpg']})
      expect(Cloudinary::Api).not_to receive(:delete_resources)
      Services::Profiles.destroy_production_old_pictures old_pictures, production_model
    end
  end


  describe 'Delete' do

    before(:each){
      allow(Services::Calls).to receive(:proposals_old_pictures).with(production_id).and_return({photos: ['picture.jpg']})
    }

    it 'deletes a production but not stored pictures in the proposals' do
      expect(Cloudinary::Api).to receive(:delete_resources).with(['otter_picture.jpg']) 
      expect(Repos::Profiles).to receive(:delete_production).with(production_id)
      Services::Profiles.delete_production production_id
    end

    it 'deletes a profile and its proposals' do
      allow(Cloudinary::Api).to receive(:delete_resources).with(['otter_picture.jpg'])
      expect(Repos::Profiles).to receive(:delete_production).with(production_id)
      expect(Cloudinary::Api).to receive(:delete_resources).with(['profile.jpg']) 
      expect(Repos::Profiles).to receive(:delete_profile).with(profile_id)
      Services::Profiles.delete_profile profile_id
    end
  end
end
