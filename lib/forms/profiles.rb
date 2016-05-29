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
      color: {
        type: 'mandatory',
        label: 'Escoge un color',
        input: 'InputColor',
        args: nil,
        helptext: 'Es el color personal de tu perfil!'
      }
    }
  end

  def create_space
    labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular']
    values = ['cultural_ass', 'commercial', 'home']
    {
      name: {
        type: 'mandatory',
        label: 'Nombre del espacio *',
        input: 'Input',
        args: ['', 'text'],
        helptext: 'Es el nombre que será asociado con tu espacio durante el festival.'
      },
      address: {
        type: 'mandatory',
        label: 'Dirección *',
        input: 'InputAddressSpace',
        args: ['Ej: Carrer de la Murta 13, Valencia'],
        helptext: 'Tu dirección detallada es necesaria para poderte localizar en el mapa.'
      },
      category: {
        type: 'mandatory',
        label: 'Categoría *',
        input: 'Selector',
        args: [labels, values],
        helptext: '',
        format: 'category-input' 
      },
      personal_web: {
        type: 'optional',
        label: 'Web personal y enlaces a redes sociales',
        input: 'InputPersonalWeb',
        args: nil,
        helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales.'
      },
      links: {
        type: 'optional',
        label: 'Materiales online',
        input: 'InputMultimedia',
        args: nil,
        helptext: 'Añade vídeos, fotos y audios desde tus redes sociales.'
      },
      photos:{
        type: 'optional',
        label: 'Fotos del espacio (máximo 4, tamaño inferior a 500kb)',
        input: 'Cloudinary',
        folder: '/photos',
        amount: 4
      },
      color: {
        type: 'mandatory',
        label: 'Escoge un color',
        input: 'InputColor',
        args: nil,
        helptext: 'Es el color personal de tu perfil!'
      }
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
      personal_web: {
        type: 'optional',
        label: 'Web personal y enlaces a redes sociales',
        input: 'InputPersonalWeb',
        args: nil,
        helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales.'
      },
      color: {
        type: 'mandatory',
        label: 'Escoge un color',
        input: 'InputColor',
        args: nil,
        helptext: 'Es el color personal de tu perfil!'
      }
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
