module Forms
  class Base < Struct.new 'Forms', :params, :user_id
    
    def create_model_from form
      raise Pard::Invalid::Params unless form.all?{ |field, entry|
        correct_entry? params[field], entry[:type]  
      }
      form.keys.map{ |field| [field, params[field]] }.to_h
    end

    def correct_entry? value, type
      return !value.blank? if type == 'mandatory' 
      true
    end

    private
    def email
      {
        type: 'mandatory',
        label: 'email',
        input: 'Input',
        args: ['', 'text'],
        helptext: ''
      }
    end

    def artist_name
      {
        type: 'mandatory',
        label: 'Nombre artístico *',
        input: 'Input',
        args: ['', 'text'],
        helptext: 'Es el nombre artístico de la persona o del colectivo que quiere participar en el festival.'
      }
    end

    def space_name
      {
        type: 'mandatory',
        label: 'Nombre del espacio *',
        input: 'Input',
        args: ['', 'text'],
        helptext: 'Es el nombre que será asociado con tu espacio durante el festival.'
      }
    end

    def address
      {
        type: 'mandatory',
        label: 'Dirección *',
        input: 'InputAddressSpace',
        args: ['Ej: Carrer de la Murta 13, Valencia'],
        helptext: 'Tu dirección detallada es necesaria para poderte localizar en el mapa.'
      }
    end

    def space_personal_web
      {
        type: 'optional',
        label: 'Web personal y enlaces a redes sociales',
        input: 'InputPersonalWeb',
        args: nil,
        helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales.'
      }
    end

    def city
      {
        type: 'mandatory',
        label: 'Ciudad *',
        input: 'Input',
        args: ['', 'text'],
        helptext: 'Indicar tu ciudad hará más facil localizarte para un posible contacto.'
      }
    end

    def zip_code
      {
        type: 'mandatory',
        label: 'Código postal *',
        input: 'Input',
        args: ['', 'text'],
        helptext: 'Para situar tu proyecto artístico en el mapa.'
      }
    end

    def personal_web
      {
        type: 'optional',
        label: 'Web personal y enlaces a redes sociales',
        input: 'InputPersonalWeb',
        args: nil,
        helptext: 'Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística).'
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
  end
end
