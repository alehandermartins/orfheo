class Forms
  class << self

    def get type
      Forms.send(type)      
    end

    def list
      ['create_artist', 'create_space', 'create_organization']
    end

    private
    def create_artist
      {
        name: {
          type: 'mandatory',
          label: 'Nombre artístico *',
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Es el nombre artístico de la persona o del colectivo que quiere participar en el festival.'
        },
        city: {
          type: 'mandatory',
          label: 'Ciudad *',
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Indicar tu ciudad hará más facil localizarte para un posible contacto.'
        },
        zip_code: {
          type: 'mandatory',
          label: 'Código postal *',
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Para situar tu proyecto artístico en el mapa.'
        },
        personal_web: {
          type: 'optional',
          label: 'Web personal y enlaces a redes sociales',
          input: {
            type: 'InputPersonalWeb',
            args: nil
          },
          helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística).'
        },
        color: {
          type: 'mandatory',
          label: 'Escoge un color',
          input: {
            type: 'InputColor',
            args: nil
          },
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
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Es el nombre que será asociado con tu espacio durante el festival.'
        },
        address: {
          type: 'mandatory',
          label: 'Dirección *',
          input: {
            type: 'InputAddressSpace',
            args: ['Ej: Carrer de la Murta 13, Valencia']
          },
          helptext: 'Tu dirección detallada es necesaria para poderte localizar en el mapa.'
        },
        category: {
          type: 'mandatory',
          label: 'Categoría *',
          input: {
            type: 'Selector',
            args: [labels, values]
          },
          helptext: '',
          format: 'category-input' 
        },
        personal_web: {
          type: 'optional',
          label: 'Web personal y enlaces a redes sociales',
          input: {
            type: 'InputPersonalWeb',
            args: nil
          },
          helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística).'
        },
        links: {
          type: 'optional',
          label: 'Materiales online',
           input: {
            type: 'InputMultimedia',
            args: nil
          },
          helptext: 'Añade vídeos, fotos y audios desde tus redes sociales.'
        },
        color: {
          type: 'mandatory',
          label: 'Escoge un color',
          input: {
            type: 'InputColor',
            args: nil
          },
          helptext: 'Es el color personal de tu perfil!'
        }
      }
    end

    def create_organization
      {
        name: {
          type: 'mandatory',
          label: 'Nombre*',
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Es el nombre del colectivo.'
        },
        city: {
          type: 'mandatory',
          label: 'Ciudad *',
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Indicar tu ciudad hará más facil localizarte para un posible contacto.'
        },
        zip_code: {
          type: 'mandatory',
          label: 'Código postal *',
          input: {
            type: 'Input',
            args: ['', 'text']
          },
          helptext: 'Para situar tu proyecto en el mapa.'
        },
        personal_web: {
          type: 'optional',
          label: 'Web personal y enlaces a redes sociales',
          input: {
            type: 'InputPersonalWeb',
            args: nil
          },
          helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales'
        },
        color: {
          type: 'mandatory',
          label: 'Escoge un color',
          input: {
            type: 'InputColor',
            args: nil
          },
          helptext: 'Es el color personal de tu perfil!'
        }
      }
    end
  end
end
