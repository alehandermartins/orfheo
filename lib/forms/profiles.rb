class Forms::Profiles < Forms::Base
	
	def create profile_id
		scopify
		form = self.send('create_' + type)
		profile = create_model_from form
		profile.merge! user_id: user_id
    profile.merge! profile_id: profile_id
    profile.merge! type: type
    profile
	end

	def modify profile_id
		scopify
		form = self.send('modify_' + type)
		profile = create_model_from form
    profile.merge! user_id: user_id
    profile.merge! profile_id: profile_id
    profile.merge! type: type
		profile
	end

	private
	def scopify
		raise Pard::Invalid::Type unless ['artist', 'space', 'organization'].include? params[:type]
		self.send(:define_singleton_method, :type) {
      params[:type]
    }
	end

	def create_artist
    {
      name: artist_name,
      city: city,
      zip_code: zip_code,
      personal_web: personal_web,
      color: color
    }
  end

  def create_space
    labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular']
    values = ['cultural_ass', 'commercial', 'home']
    {
      name: space_name,
      address: address,
      category: {
        type: 'mandatory',
        label: 'Categoría *',
        input: 'Selector',
        args: [labels, values],
        helptext: '',
        format: 'category-input' 
      },
      personal_web: personal_web,
      links: links,
      photos:photos,
      color: color
    }
  end

  def create_organization
    {
      name: {
        type: 'mandatory',
        label: 'Nombre*',
        input: 'Input',
        args: ['', 'text'],
        helptext: 'Es el nombre del colectivo.'
      },
      city: city,
      zip_code: zip_code,
      personal_web: personal_web,
      color: color
    }
  end

  def modify_artist
    new_fields = {
      bio: {
        type: 'optional',
        label: 'Biografía / Información',
        input: 'TextArea',
        args: [''],
        helptext: 'Cualquier cosa que quieras compartir sobre tu vida artística-cultural.'
      },
        profile_picture:{
          type: 'optional',
          label: 'Foto de perfil (máximo 500kb)',
          input: 'Cloudinary',
          folder: '/profile_picture',
          amount: 1
        }
      }
      create_artist.merge! new_fields
  end

  def modify_space
    new_fields = {
      bio: {
        type: 'optional',
        label: 'Biografía / Información',
        input: 'TextArea',
        args: [''],
        helptext: 'Cualquier cosa que quieras compartir sobre tu espacio.'
      },
        profile_picture:{
          type: 'optional',
          label: 'Foto de perfil (máximo 500kb)',
          input: 'Cloudinary',
          folder: '/profile_picture',
          amount: 1
        }
      }
      create_space.merge! new_fields
  end

   def modify_organization
    new_fields = {
      bio: {
        type: 'optional',
        label: 'Biografía / Información',
        input: 'TextArea',
        args: [''],
        helptext: 'Cualquier cosa que quieras compartir sobre el colectivo.'
      },
        profile_picture:{
          type: 'optional',
          label: 'Foto de perfil (máximo 500kb)',
          input: 'Cloudinary',
          folder: '/profile_picture',
          amount: 1
        }
      }
      create_organization.merge! new_fields
  end
end
