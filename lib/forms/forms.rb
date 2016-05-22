class Forms
  class << self

    def create type
      Creator.send(type)
    end

    def modify type
      Modifier.send(type)
    end

    private
    class Creator
      class << self
        def artist
          {
            name: {
              type: 'mandatory',
              label: 'Nombre artístico *',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Es el nombre artístico de la persona o del colectivo que quiere participar en el festival.'
            },
            city: {
              type: 'mandatory',
              label: 'Ciudad *',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Indicar tu ciudad hará más facil localizarte para un posible contacto.'
            },
            zip_code: {
              type: 'mandatory',
              label: 'Código postal *',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Para situar tu proyecto artístico en el mapa.'
            },
            personal_web: {
              type: 'optional',
              label: 'Web personal y enlaces a redes sociales',
              input: 'InputPersonalWeb',
              args: nil,
              helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística).'
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

        def space
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
              helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística).'
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

    
        def organization
          {
            name: {
              type: 'mandatory',
              label: 'Nombre*',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Es el nombre del colectivo.'
            },
            city: {
              type: 'mandatory',
              label: 'Ciudad *',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Indicar tu ciudad hará más facil localizarte para un posible contacto.'
            },
            zip_code: {
              type: 'mandatory',
              label: 'Código postal *',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Para situar tu proyecto en el mapa.'
            },
            personal_web: {
              type: 'optional',
              label: 'Web personal y enlaces a redes sociales',
              input: 'InputPersonalWeb',
              args: nil,
              helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales'
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

        def music
          {
            title: title,
            description: description,
            short_description: short_description,
            duration: duration,
            components: components,
            children: children,
            links: links,
            photos: photos
          }
        end

        def arts
          music
        end

        def poetry
          music
        end

        def workshop
          music
        end

        def other
          music
        end

        def expo
          {
            title: title,
            description: description,
            short_description: short_description,
            meters: {
              type: 'optional',
              label: 'Espacio necesario para la exposición *',
              input: 'Input',
              args: ['', 'text'],
              helptext: 'Indicar cuantos metros cuadrados (y precisar si verticales o horizontales) se piensan necesitar para exponer.'
            },
            children: children,
            links: links,
            photos: photos
          }
        end

        def audiovisual
          {
            title: title,
            description: description,
            short_description: short_description,
            duration: duration,
            children: children,
            links: links,
            photos: photos
          }
        end

        def street_art
          {
            title: title,
            description: description,
            short_description: short_description,
            components: components,
            children: children,
            links: links,
            photos: photos
          }
        end

        def title
          {
            type: 'mandatory',
            label: 'Título de la propuesta artística *',
            input: 'Input',
            args: ['', 'text'],
            helptext: ''
          }
        end

        def description
          {
            type: 'mandatory',
            label: 'Descripción *',
            input: 'TextArea',
            args: [''],
            helptext: 'Cuéntanos en detalle en que constiste tu propuesta.'
          }
        end

        def short_description
          {
            type: 'mandatory',
            label: 'Descripción (muy) breve *',
            input: 'TextAreaCounter',
            args: ['', 80, 'Es la descripción que aparecerá en el programa de mano del festival. Por motivos de espacio en el papel, está limitada a 80 caracteres. Quedan: '],
            helptext: ''
          }
        end

        def duration
          labelsTime = ['15 min', '30 min', '45 min', '1 h', '1h 15min', '1h 30min', '1h 45min', '2 h', '2h 15min', '2h 30min']
          valuesTime = ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150']
          {
            type: 'mandatory',
            label: 'Duración del espectáculo *',
            input: 'Selector',
            args: [labelsTime, valuesTime],
            helptext: ''
          }
        end

        def components
          {
            type: 'optional',
            label: 'Número de integrantes *',
            input: 'Input',
            args: ['', 'number'],
            helptext: 'Número de personas que llevan la actividad/espectáculo.'
          }
        end

        def children
          {
            type: 'optional',
            label: '',
            input: 'CheckBox',
            args: ['Actividad para un público infantil', 'yes_children'],
            helptext: ''
          }
        end

        def links
          {
            type: 'optional',
            label: 'Materiales online',
            input: 'InputMultimedia',
            args: nil,
            helptext: 'Añade vídeos, fotos o audios desde tus redes sociales. Este material permitirá dar a conocer tu arte mejor.'
          }
        end

        def photos
          {
            type: 'optional',
            label: 'Fotos de tu arte (máximo 4, tamaño inferior a 500kb)',
            input: 'Cloudinary',
            folder: '/photos',
            amount: 4
          }
        end
      end
    end

    class Modifier
      class << self
        def artist
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
            Creator.artist.merge! new_fields
        end

        def space
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
            Creator.space.merge! new_fields
        end

         def organization
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
            Creator.organization.merge! new_fields
        end
      end
    end
  end
end
