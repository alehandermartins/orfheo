module Repos
  class Calls
    class << self

      def for db
        @@calls_collection = db['calls']
        # call = {}
        # call[:user_id] = "45825599-b8cf-499c-825c-a7134a3f1ff0"
        # call[:call_id] = "b5bc4203-9379-4de0-856a-55e1e5f3fac6"
        # call[:artist] = artist_form
        # call[:space] = space_form
        # add call


        # call = get_call('b5bc4203-9379-4de0-856a-55e1e5f3fac6')
        # proposals = call[:proposals]
        # event = {}
        # proposals.each{ |proposal|
        #   event[proposal[:profile_id]] = event[proposal[:profile_id]] || []
        #   event[proposal[:profile_id]].push(proposal)
        # }

        # new_event = call
        # new_event[:artists] = []
        # new_event[:spaces] = []
        # event.each{|participant_id, proposals|
        #   new_event[:artists].push(artist_fields proposals) if proposals[0][:type] == 'artist'
        #   new_event[:spaces].push(space_fields proposals) if proposals[0][:type] == 'space'
        # }

        # spaces = [];
        # call[:order].each{ |host_proposal_id|
        #   space = new_event[:spaces].select{ |space| space[:proposal_id] == host_proposal_id}.first
        #   spaces.push(space)
        # }
        # new_event[:spaces] = spaces
        # program = []
        # call[:program].each{ |performance|
        #   performance[:performance_id] = SecureRandom.uuid;
        #   program.push(performance)
        # }
        # new_event[:program] = program
        # new_event.delete(:proposals)
        # new_event.delete(:order)
        # Repos::Events.add new_event
      end
      def artist_form
        {
          music: my_music,
          arts: my_music,
          workshop: my_workshop,
          expo: my_expo,
          street_art: my_street_art,
          poetry: my_workshop, 
          audiovisual: my_music,
          other: my_music,
        }
      end

      def show
        {
          title: title,
          description: description,
          short_description: short_description,
          phone: phone,
          duration: duration,
          #links: links,
          #photos: photos,
        }
      end

      def expo
        {
          title: title,
          description: description,
          short_description: short_description,
          phone: phone,
          #links: links,
          #photos: photos,
        }
      end

      def my_music
        {
          availability: availability,
          children: children,
          components: components,
          repeat:repeat,
          links: links,
          photos: photos,
          conditions: conditions
        }
      end

      def my_workshop
        {
          availability: availability,
          children: children,
          repeat:repeat,
          links: links,
          photos: photos,
          conditions: conditions
        }
      end

      def my_audiovisual
        {
          availability: availability,
          repeat:repeat,
          children: children,
          links: links,
          photos: photos,
          conditions: conditions
        }
      end

      def my_expo
        {
          meters: meters,
          links: links,
          photos: photos,
          conditions: conditions,
        }
      end

      def my_street_art
        {
          availability: availability,
          links: links,
          photos: photos,
          conditions: conditions,
        }
      end

      def space_form
        {
          cultural_ass: my_space,
          commercial: my_space,
          home: my_space,
          open_air: my_space
        }
      end

      def space
        {
          phone: phone
        }
      end

      def my_space
        {
          availability: availability,
          responsible: responsible,
          sharing: sharing,
          own: own,
          un_wanted: un_wanted,
          conditions: conditions
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
          helptext: 'Cuéntanos en detalle en qué consiste tu propuesta.'
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

      def color
        {
          type: 'mandatory',
          label: 'Escoge un color',
          input: 'InputColor',
          args: nil,
          helptext: 'Es el color personal de tu perfil!'
        }
      end

      def meters
        {
          type: 'optional',
          label: 'Espacio necesario para la exposición *',
          input: 'Input',
          args: ['', 'text'],
          helptext: 'Indicar cuantos metros cuadrados (y precisar si verticales o horizontales) se piensan necesitar para exponer.'
        }
      end

      def availability
        {
          type: 'mandatory',
          label: 'Disponibilidad *',
          input: 'InputDate',
          args: [''],
          helptext: 'Selecciona los días que estás disponible para tu participación en el festival.'
        }
      end

      def sharing
        {
          type: 'optional',
          label: 'Materiales a compartir',
          input: 'TextArea',
          args: [''],
          helptext: 'Material que puedes compartir durante el festival, como: equipo de sonido, altavoces, material de arte plástico, focos de luz, etc.'
        }
      end

      def needs
        {
          type: 'optional',
          label: 'Necesidades',
          input: 'TextArea',
          args: [''],
          helptext: 'Indicar si se tienen necesidades técnicas especiales y/o de espacio. IMPORTANTE: El festival tendrá lugar en espacios no convencionales y no podrá hacerse cargo del material necesario para cada actuacción.'
        }
      end

      def repeat
        {
          type: 'optional',
          label: '',
          input: 'CheckBox',
          args: ['Si posible, quiero repetir mi actuacción', 'yes_repeat'],
          helptext: ''
        }
      end

      def waiting_list
        {
          type: 'optional',
          label: '',
          input: 'CheckBox',
          args: ['En la eventualidad, quiero quedarme en la lista de espera', 'yes_waitig_list'],
          helptext: ''
        }
      end

      def phone
        {
          type: 'mandatory',
          label: 'Teléfono de contacto *',
          input: 'InputTel',
          args: [''],
          helptext: 'Esta información es necesaria para un eventual contacto por parte de la organización del festival.'
        }
      end

      def conditions
        {
          type: 'optional',
          label: '',
          input: 'CheckBox',
          args: ['En la eventualidad, quiero quedarme en la lista de espera', 'yes_waitig_list'],
          helptext: ''
        }
      end

      def responsible
        {
          type: 'mandatory',
          label: 'Nombre del responsable del espacio *',
          input: 'Input',
          args: ['', 'text'],
          helptext: 'Indicar la persona que se compromete con el festival para la programación y gestión del espacio.'
        }
      end

      def space_description
        {
          type: 'mandatory',
          label: 'Descripción del espacio disponible y superficies para murales *',
          input: 'TextArea',
          args: [''],
          helptext: 'Número de habitaciones, dimensiones aproximadas, paredes o persianas para intervenciones de arte urbano, etc.'
        }
      end

      def own
        {
          type: 'optional',
          label: 'Programación propia',
          input: 'TextArea',
          args: [''],
          helptext: 'Indicar, si se da el caso, el nombre y los horarios de actuacción de los artistas ya programados. IMPORTANTE: Los artistas también tendrán que apuntarse en la convocatoria y comunicar a través de la misma el espacio donde actuarán.'
        }
      end

      def un_wanted
        {
          type: 'optional',
          label: 'Preferencias de actividades',
          input: 'TextArea',
          args: [''],
          helptext: 'Indicar tanto las actividades que NO quieres en tu espacio como las que te gustaría hospedar.'
        }
      end

      def artist_fields proposals
        address = {
          locality: proposals[0][:city],
          postal_code: proposals[0][:zip_code]
        }
        fields = {
          user_id: proposals[0][:user_id],
          email: proposals[0][:email],
          profile_id: proposals[0][:profile_id],
          name: proposals[0][:name],
          phone: proposals[0][:phone],
          address: address,
          proposals: []
        }

        proposals.each{ |proposal|
          proposal.delete(:photos)
          proposal.delete(:personal_web)
          proposal.delete(:links)
          proposal.delete(:whitelist)
          proposal.delete(:call_id)

          proposal.delete(:city)
          proposal.delete(:zip_code)
          proposal.delete(:user_id)
          proposal.delete(:email)
          proposal.delete(:profile_id)
          proposal.delete(:name)
          proposal.delete(:phone)
          proposal.delete(:program)
          proposal.delete(:type)
          proposal.delete(:profile_picture)
          fields[:proposals].push(proposal)
        }
        return fields
      end

      def space_fields proposals
          proposal = proposals.first
          proposal.delete(:photos)
          proposal.delete(:personal_web)
          proposal.delete(:links)
          proposal.delete(:call_id)

          proposal.delete(:program)
          proposal.delete(:profile_picture)
          proposal.delete(:production_id)
          proposal.delete(:type)
          proposal
      end

      def add call
        @@calls_collection.insert_one(call)
      end

      def exists? call_id
        return false unless UUID.validate(call_id)
        @@calls_collection.count(call_id: call_id) > 0
      end

      def get_forms call_id
        call = grab({call_id: call_id}).first
        call.delete(:user_id)
        call
      end

      def proposal_exists? proposal_id
        return false unless UUID.validate(proposal_id)
       @@calls_collection.count("proposals.proposal_id": proposal_id) > 0
      end

      def add_proposal call_id, proposal
        add_artist_proposal(call_id, proposal) if proposal[:type] == 'artist'
        add_space_proposal(call_id, proposal) if proposal[:type] == 'space'
      end

      def add_artist_proposal call_id, proposal
        @@calls_collection.update_one({call_id: call_id},{
          "$push": {proposals: proposal}
        })
      end

      def add_space_proposal call_id, proposal
        @@calls_collection.update_one({call_id: call_id},{
          "$push": {proposals: proposal, order: proposal[:proposal_id]}
        })
      end

      def get_call call_id
        grab({call_id: call_id}).first
      end

      def get_calls profile_id
        grab({profile_id: profile_id})
      end

      def get_event event_id
        event = grab({event_id: event_id}).first
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
      end

      def get_call_owner call_id
        call = grab({call_id: call_id}).first
        call[:user_id]
      end

      def get_proposals method, args = nil
        Scout.get(method, args)
      end

      def get_proposal_owner proposal_id
        proposal = get_proposals :proposal, {proposal_id: proposal_id}
        proposal[:user_id]
      end

      def proposal_on_time? call_id, email
        call = grab({call_id: call_id}).first
        return true if !call[:whitelist].blank? && call[:whitelist].include?(email)
        call[:start].to_i < Time.now.to_i && call[:deadline].to_i > Time.now.to_i
      end

      def modify_proposal proposal
        @@calls_collection.update_one({ "proposals.proposal_id": proposal[:proposal_id]},
          {
            "$set": {"proposals.$": proposal}
          },
        {upsert: true})
      end

      def amend_proposal proposal_id, amend
        @@calls_collection.update_one({ "proposals.proposal_id": proposal_id },
          {
            "$set": {"proposals.$.amend": amend}
          },
        {upsert: true})
      end

      def add_program event_id, program, order
        @@calls_collection.update_one({ event_id: event_id },
          {
            "$set": {'program': program, 'order': order}
          },
        {upsert: true})
      end

      def add_whitelist call_id, whitelist
        @@calls_collection.update_one({ call_id: call_id },
          {
            "$set": {"whitelist": whitelist}
          },
        {upsert: true})
      end

      def delete_proposal proposal_id
        event = grab({"proposals.proposal_id": proposal_id}).first
        event[:proposals].reject!{|proposal| proposal[:proposal_id] == proposal_id}
        event[:program].reject!{|performance| performance[:participant_proposal_id] == proposal_id || performance[:host_proposal_id] == proposal_id} unless event[:program].blank?
        event[:order].reject! {|proposal_id| proposal_id == proposal_id} unless event[:order].blank?

        @@calls_collection.update_one({event_id: event[:event_id]},
          {
            "$set": {'proposals': event[:proposals], 'program': event[:program], 'order': event[:order]}
          }
        )
      end

      private
      def grab query
        results = @@calls_collection.find(query)
        return [] unless results.count > 0

        results.map { |event|
         Util.string_keyed_hash_to_symbolized event
        }
      end

      class Scout < Calls
        class << self
          def get method, args
            Scout.send(method, args)
          end

          def proposal args
            results = grab({ "proposals.proposal_id": args[:proposal_id] })
            get_my_proposals_from(results, :proposal_id, args[:proposal_id]).first
          end

          def production_proposals args
            results = grab({ "proposals.production_id": args[:production_id]})
            get_my_proposals_from(results, :production_id, args[:production_id])
          end

          def profile_info args
            calls = grab({profile_id: args[:profile_id]}).each{ |call|
              call.delete(:proposals)
              call.delete(:program)
            }
            proposals = grab({ "proposals.profile_id": args[:profile_id]})
            proposals = get_my_proposals_from(proposals, :profile_id, args[:profile_id])
            program = grab({ "$or": [{ "program.participant_id": args[:profile_id]}, {"program.host_id": args[:profile_id]}]})
            program = get_my_program_from(program, args[:profile_id])
            compose_info calls, proposals, program
          end

          def compose_info calls, proposals, program
            {
              calls: calls,
              proposals: proposals,
              program: program
            }
          end

          def otter_profile_info args
            calls = grab({profile_id: args[:profile_id]}).each{ |call|
              requester = Repos::Users.grab({user_id: args[:requester]})
              call[:whitelist] = false unless !call[:whitelist].blank? && call[:whitelist].any?{ |user| user[:email] == requester[:email] } 
              call[:whitelist] = true if !call[:whitelist].blank? && call[:whitelist].any?{ |user| user[:email] == requester[:email] }
              call.delete(:proposals)
              call.delete(:program)
            }
            proposals = grab({ "proposals.profile_id": args[:profile_id]})
            proposals = get_my_proposals_from(proposals, :profile_id, args[:profile_id])
            proposals.map!{ |proposal|
              next proposal[:title] if proposal[:type] == 'artist'
              next proposal[:description] if proposal[:type] == 'space'
            }.compact
            program = grab({ "$or": [{ "program.participant_id": args[:profile_id]},{"program.host_id": args[:profile_id]}]})
            program = get_my_program_from(program, args[:profile_id])
            compose_info calls, proposals, program
          end

          def get_my_proposals_from results, key, id
            proposals = results.map{ |call| call[:proposals]}.flatten
            my_proposals = proposals.select{ |proposal| proposal[key] == id }
            my_proposals.map!{ |proposal|
              Util.string_keyed_hash_to_symbolized proposal
            }
          end

          def get_my_program_from results, id
            results.map{ |event| 
              my_performances = event[:program].select{|performance| performance[:participant_id] == id || performance[:host_id] == id}
              my_performances.map{ |performance|
                artist = event[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:participant_proposal_id]}.first
                space = event[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:host_proposal_id]}.first
                order = event[:order].index(performance[:host_proposal_id])
                performance.merge! event_id: event[:event_id]
                performance.merge! host_name: space[:name]
                performance.merge! address: space[:address]
                performance.merge! participant_name: artist[:name]
                performance.merge! title: artist[:title]
                performance.merge! short_description: artist[:short_description]
                performance.merge! children: artist[:children]
                performance.merge! participant_category: artist[:category]
                performance.merge! host_category: space[:category]
                performance.merge! order: order
              }
            }.flatten
          end
        end
      end
    end
  end
end
