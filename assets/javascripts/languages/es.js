'use strict';

(function(ns){

  ns.langs = ns.langs || {}

  ns.langs.es = {
    dictionary: {
      accept: 'acepta',
      address: 'dirección',
      amend: 'enmienda',
      artist: "artista",
      artists: "artistas",
      audience: 'audiencia',
      audios: 'audios',
      availability: 'disponibilidad',
      cache: 'caché',
      cancel: 'cancela',
      category: 'categoría',
      close: 'cierra',
      collaborators:'colaboradores',
      comments: 'comentarios',
      confirm: 'confirma',
      confirmed: 'confirmado',
      copy: 'copia',
      day: 'día',
      description: 'descripción',
      delete: 'elimina',
      duration: 'duración',
      email: 'email',
      first: "primera",
      images: 'imágenes',
      latitude: 'latitud',
      last: "última",
      longitude: 'longitud',
      modify: 'modifica',
      name: 'nombre',
      next: "siguiente",
      no: 'no',
      organization: "organización",
      organizations: "organizaciones",
      permanent: 'permanente',
      phone: 'teléfono',
      previous: "anterior",
      profile: 'perfil',
      program: 'programa',
      schedule: 'horario',
      search: 'busca',
      send: 'envía',
      short_description: 'descripción breve',
      space: "espacio",
      spaces:'espacios',
      sponsors:'patrocinadores',
      promotors: 'promotores',
      table: 'tabla',
      title: 'título',
      type: 'tipo',
      videos: 'vídeos',
      yes: 'sí'
    },
    categories:{
      cultural_ass: 'Espacio Cultural',
      commercial: 'Local Comercial',
      home: 'Espacio Particular',
      open_air: 'Espacio Exterior',
      festival:'Festival',
      association:'Asociación',
      ngo:'ONG',
      collective:'Colectivo',
      interprise:'Empresa',
      institution:'Institución',
      federation: 'Federación',
      foundation:'Fundación',
      music:'Música',
      arts: 'Artes Escénicas',
      expo: 'Exposición',
      poetry: 'Poesía',
      audiovisual: 'Audiovisual',
      street_art: 'Street Art',
      workshop: 'Taller',
      other: 'Otros',
      gastronomy: 'Gastronomía'
    },
    popup:{
      delete:{
        title:'¿Estás seguro/a?',
        user: 'Confirmando, todos tus datos serán eliminados de orfheo: se cancelarán todos tus perfiles y sus contenidos.',
        profile: 'Confirmando, tu perfil será eliminado y con ello todos sus contenidos. Sin embargo, no se cancelarán las propuestas enviadas a convocatorias.',
        confirm:'Confirma',
        cancel: 'Anula',
        production:'Confirmando, tu proyecto artístico se eliminará de tu portfolio. Esa acción no afectará a tu inscripción en convocatorias.'
      },
      modifypasswd:{
        title:'Introduce una nueva contraseña',
        password:'Contraseña',
        passwordConf: 'Confirma tu contraseña',
        notequal: 'Las contraseñas no coinciden.',
        tooshort:'La contraseña debe tener al menos 8 caracteres.',
        check:'Comprueba bien que las contraseñas sean iguales y tengan minímo 8 caracteres',
        success: 'Contraseña cambiada.'
      },
      recover:{
        title: 'Recupera tu cuenta',
        submit: 'Enviar'
      },
      termsAndConditions:{
        title: 'Condiciones generales',
        date:'Última actualización: Febrero 2017',
        part1:'<p> <strong>¡Te damos la bienvenida!</strong></p><p> Estas condiciones generales de uso explican el servicio y la relación entre los usuarios, los derechos y las responsabilidades recíprocas. </p><p> <strong> Ser parte de orfheo es gratuito </strong> y al hacerlo estás aceptando estas condiciones generales:</p>',
        // subtitle2: 'Principios generales:',
        subtitle3:'Nos comprometemos a:',
        mex3: '<p><ul><li>Describir cómo se puede usar y/o compartir tu información en estas condiciones generales. </li><li> Aplicar las medidas razonables para mantener tu información sensible segura.</li> <li>  Hacer disponible en la comunidad la información que decidas compartir.  </li><li> Incentivar el sentido de comunidad, la transversalidad, la equidad, el respeto y la armonía con el entorno. </li><li> Escuchar y acoger cualquier tipo de sugerencia y crítica constructiva. </li></ul></p>',
        subtitle4: 'Términos de uso y Privacidad:',
        mex4: '<p>Aquí te explicamos como recolectamos y compartimos tu información personal/datos/contenidos.<ul><li> Recogemos muy poca información personal acerca de ti. </li><li> No alquilamos ni vendemos tu información a terceros, es decir, que no compartimos tus datos para propósitos comerciales en ningún caso. </li><li> Cabe la posibilidad de que la información recogida en orfheo se comparta con terceros siempre con la intención de difundir propuestas y producciones, trayendo beneficio a toda la comunidad y siempre cumpliendo con la ley. </li><li> Eres responsable de los contenidos que haces disponible en la web, lo que compartes en orfheo es público, puede ser visto y eventualmente usado por todo observador externo.  </li> <li> Ocasionalmente te enviaremos correos electrónicos con respecto a información importante. </li><li> Todo lo que publicas en orfheo es público, puede ser visto y eventualmente usado por todo observador externo. </li> <li> Es posible que en algún momento te pidamos contestar alguna encuesta a modo de retroalimentación, pero nunca estarás obligado/a a participar en éstas. </li><li> No necesitas crear una cuenta para explorar y visualizar cualquiera de los contenidos. </li><li> Para crear una cuenta solo debes proporcionar tu dirección de correo electrónico. </li> <li>  La calidad de los datos que nos proporcionas es útil para ti, para que podamos mejorar tu experiencia como usuario y poder desarrollar nuevas funciones. </li><li> Cualquier persona puede unirse y abandonar orfheo en cualquier momento. </li></ul></p>',
        subtitle5:'Publicidad:',
        mex5: '<p><li>Ahora mismo no hay ninguna forma de publicidad dentro de orfheo. En un futuro no se excluye la posibilidad de incluir publicidad no molesta, relacionada con el mundo artístico-cultural que pueda proporcionar información útil y valiosa para la comunidad. Consideramos que la publicidad puede ser eficaz sin ser molesta.</li><li> Excluimos la posibilidad de contar con publicidad en forma de ventanas emergentes que pueden interferir con la visualización de los contenidos de orfheo. </li></ul></p>',
        subtitle5_5:'Sostenibilidad del proyecto:',
        mex5_5:'<p><li>Como compromiso, ser parte de orfheo no tiene y no tendrá ningún coste para ningún usuario. Sin embargo, para lograr que este proyecto sea sostenible en el tiempo, para lanzar una convocatoria y poder acceder a la herramienta de gestión, es necesario poner un precio, a partir de una base mínima según el tipo de evento que se quiere organizar.</li></ul></p>',
        cookies: 'Política de cookies:',
        cookiesMex1: 'Las cookies son un elemento informático ampliamente usado en internet. Cuando alguien accede a una página web, parte de la información se almacena en la memoria del navegador para que la página web pueda acceder rápidamente a esa información en el futuro.',
        cookiesMex2: 'Orfheo utiliza cookies con el único fin de mejorar la experiencia de navegación de sus usuarios. Por ejemplo, guardamos información para permitir un login más rápido y continuado, evitar la desconexión de la web en caso de reinicio del servidor, y recordar preferencias o elecciones durante todo el proceso de navegación.',
        cookiesMex3:'En general, por como se estructura internet hoy en día, las cookies son un elemento imprescindible. Por ley, toda web que las utiliza, está obligada a avisar sus usuarios para que sepan lo que está ocurriendo.',
        cookiesMex4: 'La misma información aquí mostrada se encuentra también disponible en el apartado de condiciones de uso. En caso de modificación se avisará a los ciudadanos de orfheo con suficiente antelación.',
        subtitle6: 'Actualizaciones:',
        mex6: 'Nos reservamos el derecho de modificar, si es necesario, las condiciones generales para adaptarlas a futuras novedades y asumimos el deber y el compromiso de informar de los cambios a toda la comunidad de orfheo, para que puedan conocer las actualizaciones de antemano.',
        subtitle7: '¡Muchas gracias!',
        finalMex: '<p> Si tienes preguntas o sugerencias envía un correo electrónico a <a href="mailto:info@orfheo.org"> info@orfheo.org</a>.</p> <p> Gracias por leer hasta aquí. Esperamos que disfrutes dentro y fuera orfheo. </br> Tu participación al crear, mantener y mejorar esta comunidad es imprescindible. </p> <p> Agradecemos cualquier tipo de contribución con este proyecto que apuesta por una manera innovadora de vivir la cultura. </p>'
      },
      noMapLocation:{
        title: '¡Atención!',
        mex: 'Google no reconoce la dirección que has insertado y por lo tanto no puede ser localizada en ningún mapa.',
        fix:'Corrige la dirección',
        ok:'Continua igualmente'
      }
    },
    widget:{
      gmap:{
        viewOnGoogle:'Ver en Google Maps'
      },
      search:{
        placeholder:'Busca por tags',
        noResults: 'Ningún resultado'
      },
      uploadPhoto:{
        btn: 'Sube una imagen',
        tooBigError: 'El tamaño de las imágenes no puede ser superior a 500Kb. Puedes reducirlo en un momento utilizando, entre muchas otras,  <a href = "http://optimizilla.com/es/"  target="_blank">esta web</a>.',
        max5: 'Máximo cinco imagenes.',
        max1:'Máximo una imagen.',
        max4: 'Máximo cuatro imagenes.',
        acceptedFormat: 'Formatos aceptados: .gif, .jpeg, .jpg, .png'
      },
      uploadPDF:{
        btn: 'Sube un documento',
        tooBigError: 'El tamaño del documento no puede ser superior a 1Mb. Puedes reducirlo en un momento utilizando, entre muchas otras,  <a href = "http://optimizilla.com/es/"  target="_blank">esta web</a>.',
        max1:'Máximo un documento.',
        acceptedFormat: 'Formatos aceptados: .pdf'
      },
      availability:{
        placeholder: "Selecciona una o más opciones",
        selectAllText: "Selecciona todo",
        allSelected: "Disponible todos los días"
      },
      inputName:{
        unavailable: 'Este nombre de perfil ya existe. Escoge otro para poder proceder.'
      },
      inputTel:{
        show:'Muestra en mi página de perfil',
        label: "Teléfono de contacto",
        helptext: "Esta información es necesaria para un posible contacto por parte de la organización.",
        modify: 'Puedes cambiar el número desde tu página de perfil'
      },
      inputCache:{
        show: 'Muestra esta información en la página de la propuesta'
      },
      inputWeb:{
        placeholder: 'Copia y pega aquí el enlace correspondiente y dale al botón para validar'
      },
      inputAddressArtist:{
        city:'Ciudad*',
        postalCode:'Código postal*',
        neighborhood:'Barrio (opcional)'
      },
      inputChildren:{
        all_public:'Todos los públicos',
        baby:'Infantil',
        family:"Familiar",
        young: "Juvenil",
        adults: "Adultos"
      },
      inputAddressSpace:{
        street: 'Calle',
        number: 'Número',
        city:'Ciudad',
        postalCode:'Código postal',
        door:'Piso / Puerta',
        state: 'País',
        warning:'¡Atención! Google no reconoce la dirección insertada: corrígela, si quieres que sea localizada correctamente.',
        insertGeo:'Si la localización no está correcta, inserta manualmente tus coordenadas geográficas y guardala pinchando ',
        insertGeoBtn:'aquí'
      },
      multimediaManager:{
        btn: 'Modifica o crea uno nuevo',
        title: 'Gestiona tus contenidos multimedia',
        mex:'Puedes añadir:',
        videoList:'<strong>vídeos</strong> desde:  youtube, vimeo, vine, facebook',
        imageList:'<strong>imágenes</strong> desde: tu ordenador, instagram, flickr, pinterest, twitter, facebook',
        audioList: '<strong>audios</strong> desde: soundcloud, bandcamp, spotify',
        photoL:'Sube imágenes desde tu ordenador (máximo 4, tamaño inferior a 500kb)'
      },
      multipleSelector:{
        placeholder: "Selecciona una o más opciones",
        selectAll: "Selecciona todo",
        allSelected: "Todo seleccionado"
      },
      inputMultimedia:{
        placeholder:'Copia y pega aquí el enlace/código correspondiente y dale al botón para validar',
        invalid:'Entrada no válida',
        acepted:'Entradas aceptadas',
        popup:{
          title:'Como añadir...',
          item1:'...una imagen desde <strong>flickr, instagram, pinterest</strong> (un pin) o un vídeo desde <strong>youtube, vimeo, vine</strong> o un audio desde <strong>soundcloud</strong>:',
          sublist1_1:'abre la imagen, vídeo o audio en el sitio web correspondiente',
          sublist1_2:'copia su enlace directamete desde el navegador o desde la opción "compartir" (o "copiar enlace")',
          sublist1_3:'pégalo en el campo del formulario de orfheo',
          sublist1_4:'dale al botón para validar',
          itemTwitter:'...una imagen desde <strong>twitter</strong> (un tweet):',
          sublistTwitter_1:'pincha el tweet que quieres compartir',
          sublistTwitter_2:'en el popup que se te abre, pincha el icono con los tres puntitos',
          sublistTwitter_3:'selecciona "Copiar enlace del tweeet"',
          sublistTwitter_4:'copia el enlace y pégalo en el campo del formulario de orfheo',
          sublistTwitter_5:'dale al botón para validar',
          item2:'...una imagen, un post o un vídeo publicado en <strong>facebook</strong>:',
          sublist2_1:'pincha la fecha con la hora de publicación que aparece en la parte superior del post',
          sublist2_2:'copia desde el navegador el enlace de la página que se abre',
          sublist2_3:'pégalo en el campo del formulario de orfheo',
          sublist2_4:'dale al botón para validar',
          item3: '...un audio desde <strong>bandcamp</strong>:',
          sublist3_1:'en la página de la canción pincha en "Share/Embed" (bajo la foto principal) y entonces en "Embed this album"',
          sublist3_2:'selecciona un estilo del lector musical',
          sublist3_3:'copia el código html desde el campo Embed que aparece en la esquina izquierda superior',
          sublist3_4: 'pégalo en el campo del formulario de orfheo',
          sublist3_5: 'dale al botón para validar',
          item4: '...un audio desde <strong>spotify</strong>:',
          sublist4_1: 'selecciona una canción de una playlist con el botón derecho del ratón',
          sublist4_2: 'pincha en "Copy Song Link"',
          sublist4_3:'pega el contenido copiado en el formulario de orfheo',
          sublist4_4:'dale al botón para validar',
          finalMex: 'Finalmente, considera que sólo se pueden importar a orfheo contenidos multimedia declarados públicos en la web donde se han subido.'
        }
      }
    },
    createProfile:{
      text: 'Crea un perfil',
      artistText:'Muestra tu portfolio <br> y participa en grandes eventos',
      spaceText: 'Alberga arte y posiciónate en el mapa cultural',
      organizationText: 'Da a conocer tu proyecto y lanza convocatorias',
      introA: 'Esta información se mostrará en tu página de perfil, podrás modificarla y te permitirá darte a conocer.',
      introS: 'Esta información se mostrará en la página de perfil de tu espacio y podrás modificarla.',
      introO: 'Esta información se mostrará en la página de perfil y podrás modificarla.',
      submit: 'Crea',
      artistForm:{
        nameL: "Nombre artistico",
        nameH: "Es el nombre de tu perfil de artista.",
        photoL:"Foto de perfil (máximo 500kb)",
        bioL: "Biografía / Información",
        bioH: "Cualquier cosa que quieras compartir sobre tu vida artística-cultural.",
        addressL: "Ciudad y Código postal",
        addressH: "Indicar tu ciudad y código postal hará más fácil localizarte para un posible contacto.",
        phoneL:"Numero de teléfono",
        webL:"Web personal y enlaces a redes sociales",
        webH: "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística).",
        colorL: "Escoge un color",
        colorH:"Es el color personal de tu perfil!"
      },
      spaceForm:{
        nameL:"Nombre del espacio",
        nameH:"Es el nombre de tu perfil de espacio.",
        addressL:"Dirección",
        addressPlaceholder: 'Ej: Carrer de la Murta 13, Valencia',
        catL: "Tipo de espacio",
        catPlaceholder:'Selecciona',
        bioL:"Descripción / Información",
        bioPlaceholder:'Dimensiones, características, actividades que suele hospedar, etc.',
        bioH: "Cualquier cosa que quieras compartir sobre tu espacio.",
        phoneL: "Número de teléfono",
        webL: "Web personal y enlaces a redes sociales",
        webH: "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales.",
        linksL: 'Materiales online',
        linksH:'Añade vídeos, fotos y audios desde tus redes sociales.',
        photoL:"Fotos del espacio (máximo 5, tamaño inferior a 500kb)",
        photoH: "La primera foto será tu foto de perfil.",
        colorL: "Escoge un color",
        colorH: "Es el color personal de tu perfil!"
      },
      organizationForm:{
        nameL: "Nombre de la organización",
        nameH: "Es el nombre de tu perfil organización.",
        catL: "Tipo de organización",
        catPlaceholder:'Selecciona',
        addressL:"Dirección de la sede de la organización",
        bioL: "Información / Proyecto",
        bioH: "Cualquier cosa que quieras contar sobre la organización.",
        photoL: 'Fotos de la organización / sede (máximo 5, tamaño inferior a 500kb)'
      }
    },
    modifyProfile:{
      title: 'Modifica tu perfil',
      delete: 'Elimina el perfil',
    },
    proposal:{
      delete: 'Elimina esta propuesta',
      deleteAlert: 'Confirmando, tu propuesta será retirada de la convocatoria del %{event}.',
      deleteOk: 'Tu solicitud de participación ha sido cancelada correctamente',
      amend: 'Enmienda enviada correctamente',
      sentForm: 'Formulario enviado',
      sentBy: 'Propuesta enviada por',
      terms: 'bases de participación',
      termsOk: 'Has aceptado las %{link} del %{event}',
      amend:{
        title: 'Enmienda enviada:',
        helper: 'No se permite modificar el formulario enviado, pero, en caso lo necesites, puedes enviar una enmienda antes del cierre de la convocatoria',
        placeholder: 'Escribe aquí el mensaje que quieres enviar',
        modify: 'Modifica Enmienda'
      },
      form:{
        category: '(formulario: %{category})',
        door: 'puerta/piso',
        multimedia: 'Multimedia:',
        seeContents: ' ver contenidos enviados',
        duration: 'Duración (si aplica)',
        cache: 'Caché / Gastos producción',
        nameL:"Nombre",
        emailL:"Correo",
        addressL:"Dirección",
        bioL:"Descripción / Información",
      }
    },
    production:{
      createTitle: 'Crea una propuesta artística',
      createOk: 'Contenido creado correctamente',
      form:{
        titleL: "Título de la propuesta artística",
        descriptionL: 'Descripción',
        descriptionH: 'Decribe con más detalles tu propuesta artística.',
        short_descriptionL:'Descripción (muy) breve',
        short_descriptionH:'Resume tu propuesta artística en máximo 80 caracteres. Quedan:',
        durationL: "Duración *",
        childrenL:"Audiencia",
        childrenH: "Indicar a qué tipo de público está dirigida la propuesta.",
        linksL:"Materiales online",
        linksH: "Añade vídeos, fotos o audios desde tus redes sociales. Este material permitirá dar a conocer tu arte mejor.",
        photoL: "Fotos de tu arte (máximo 4, tamaño inferior a 500kb)",
        cacheL:"Caché / Gastos Producción",
        noDefinedDuration:"No tiene duración definida",
        catSel:'Selecciona una categoría *',
        submit: 'Crea'
      },
      modify:{
        title: 'Modifica tu proyecto artístico',
        cat:'Categoría',
        initMex: 'Con este formularo puedes modificar los contenidos de tu proyecto artistico. Los cambios que hagas no afectarán los datos enviados a convocatorias.',
        delete: 'Elimina este proyecto artístico'
      }
    },
    signUp:{
      btn:'Únete',
      success: 'Te hemos enviado por correo un enlace para activar tu cuenta.',
      popup:{
        title: 'Empieza creando una cuenta...',
        email:'Email',
        passwd:'Contraseña',
        insertEmail:'Tu correo',
        confirmEmail:'Confirma tu correo',
        tooshort: 'La contraseña debe tener al menos 8 caracteres.',
        notequal:'Los campos de correo no coinciden.',
        format: 'El correo debe tener un formato válido.',
        submit:'Crea una cuenta',
        mex: '...hacerlo,  por supuesto,  <strong>es libre y gratuito :) </strong>',
        conditions: 'condiciones generales',
        conditionText:'Al crear una cuenta, confirmas que estás de acuerdo con nuestras ',
        length: 'Mínimo 8 caracteres'
      }
    },
    login:{
      dropdown:{
        recover:'¿Has olvidado la contraseña?',
        email:'Tu email',
        passwd:'Contraseña',
        gobtn:'Entra',
        rememberme:'Recuérdame'
      },
      popup:{
        notValidated: 'Usuario no validado',
        notValidatedmex: 'Al registrate, te enviamos un correo electrónico con un enlace para activar tu cuenta. Controla también en la carpeta de spam...',
        sendOther:'...o vuelve a escribir aquí tu correo, y te enviamos otro.',
        okbtn:'Enviar',
        notValidEmail:'El email no es valido',
        sent: 'Te hemos enviado un correo con las instrucciones para acceder a tu cuenta.',
        nouser:'El usuario no existe.',
        notExisting: '¡No existe ningún usuario asociado con este correo!',
        registerbtn:'Regístrate',
        registerTitle: 'Regístrate para continuar'
      },
      eventPage:{
        nouser: 'Si no tienes una cuenta:',
        signUp: 'Crea una cuenta',
        signUpTitle:  'Crea una cuenta...',
        loginTitle: 'Para apuntarte necesitas hacer login'
      }
    },
    call:{
      initText:'Esta convocatoria es para perfiles de tipo <strong>%{types}</strong>',
      chooseProfile: 'Inscribe un perfil existente...',
      newProfile: '...o crea e inscribe uno nuevo',
      createProfile:{
        title:'Crea un perfil y apúntate como:',
        artistText: 'Enseña tu arte y construye tu portfolio: sé protagonista en grandes eventos',
        spaceText: 'Alberga y propón actividades: posiciónate el mapa cultural',
        organizationText: 'Ofrece tu espacio y envía propuestas: crea red dando a conocer tu proyecto'
      },
      successTitle: '¡Genial!',
      succesMex:'Te has inscrito correctamente.',
      sendOther: 'Envía otra propuesta',
      toProfile: 'Ve a página de perfil',
      alreadyInscribed: {
        title: 'Ya te has inscrito como espacio :)',
        mex: 'Si quieres, puedes enviar propuestas para actuar durante el evento.',
      },
      stop:{
        title: 'ATENCIÓN, NO PUEDES CONTINUAR',
        mex1:'Esta convocatoria es sólo para perfiles de<strong>',
        mex2:'</strong>. Selecciona o crea uno de los tipos aceptados para seguir.'
      },
      form:{
        initMex:'Rellena este <strong>formulario</strong> para inscribir tu perfil %{link} en la convocatoria de <strong>%{organizer}</strong>',
        portfolio:'Apúntate con una propuesta de tu portfolio',
        catPlaceholder: 'Selecciona como quieres apuntarte',
        newProposal: '...o propón algo nuevo',
        chooseHow: 'Puedes participar tanto hospedando como proponiendo actividades:',
        stagebtn:'Ofrece tu espacio',
        perfomerbtn: 'Propón tu arte',
        partI:'PARTE I: Esta información se quedará en tu <strong>portfolio</strong> y se mostrará en tu perfil',
        partII: 'PARTE II: Sólo los organizadores tendrán acceso a los siguientes datos',
        initSpace: 'Sólo los organizadores tendrán acceso a los siguientes datos',
        finalMex: 'ATENCIÓN: Una vez enviado, <strong>no te será permitido modificar</strong> el contenido de este formulario (podrás únicamente enviar una enmienda desde tu página de perfil). Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".',
        sendbtn:'Envía'
      }
    },
    footer:{
      // languages:'Idiomas',
      languages:{
        es: 'Español',
        ca: 'Valencià',
        en: 'English'
      },
      project: 'Proyecto',
      contact: 'Contacta',
      services:'Servicios',
      conditions: 'Condiciones'
    },
    header:{
      events:'Eventos',
      profiles:'Perfiles',
      news:'Novedades',
      callToAction: 'Lanza tu convocatoria',
      home: 'Inicio',
      insideDropdown:{
        delete: 'Elimina mi cuenta',
        modifypasswd:'Modifica contraseña',
        logout:'Cierra sesión',
        contact:'Contacta orfheo',
        event:'Evento'
      }
    },
    welcome: {
      profilesSection: {
        title: "Tu comunidad cultural te llama<br>Entra en orfheo como:",
        artist: "Comparte tu arte,<br>apúntate en convocatorias,<br>genera red, descubre, crea.",
        space: "Saca el máximo partido a tu espacio,<br>alberga eventos artísticos,<br>abre las puertas a la cultura.",
        organization: "Da a conocer tu proyecto,<br>lanza convocatorias,<br>expande tu comunidad.",
        create: "Crea un perfil"
      },
      networkSection: {
        title: 'Crea en red con tu comunidad cultural',
        subtitle1: 'Aquí y ahora',
        subtitle2: 'Toma el control',
        subtitle3: 'Hazlo',
        section1: 'Descubre proyectos y déjate </br> conocer por lo que haces.',
        section2: 'Involucra a la comunidad, </br> lanza tu convocatoria.',
        section3: 'Crea experiencias inolvidables junto con los demás.',
        link: 'Explora las ventajas de lanzar tu convocatoria en orfheo'
      },
      inspireSection: {
        title: 'El futuro que queremos está aquí',
        section: 'Alguna vez lo has imaginado, pero ahora es realidad: <br> tienes a tu alcance un universo de nuevas <br> y grandes posibilidades culturales.',
        link: 'Déjate inspirar'
      },
      servicesSection: {
        logo: 'S e r v i c i o s',
        subtitle1: 'e-Manager',
        subtitle2: 'Asesoría',
        subtitle3: 'API',
        section1: 'Crea un evento,</br> lanza una convocatoria, </br>utiliza la herramienta de gestión </br>y publica una programación interactiva.',
        section2: 'Saca lo mejor de tu proyecto,</br> alimenta tu comunidad </br>y explora nuevas estrategias creativas durante el proceso.',
        section3: 'Reenvía los datos de tu evento a tu página web o aplicación móvil y utilízalos siempre actualizados como mejor te convenga.',
        link: 'Descubre más'
      }
    },
    eventsTab:{
      organizer: 'Organiza: ',
      announcing: 'Apertura convocatoria: %{date}',
      opened: 'Convocatoria abierta',
      closed: 'Convocatoria cerrada',
      finished: 'Evento terminado',
      until: ' hasta el %{date}',
      onlineProgram: '¡Programación online!',
      contact: 'Contáctanos para crear tu evento'
    },
    contact: {
      logo: 'C o n t a c t a',
      servicesTab: {
        tab: 'Servicios',
        title: '¿Qué te ofrece orfheo?',
        mex1: 'Las posibilidades que se ofrecen se centran principalmente en apoyar, impulsar y facilitar la creación, difusión y <strong> gestión de procesos y grandes eventos participativos</strong>. En específico, con orfheo puedes aprovechar los siguientes servicios:',
        subtitle2: 'e-Manager:',
        mex2: 'Una potente herramienta web innovadora que te permite lanzar tu convocatoria y gestionar todos los datos relativos con extrema facilidad y simplicidad.',
        subtitle3: 'Asesoría:',
        mex3: ' Podrás aprovechar de un seguimiento constante durante todo el proceso de preparación de tu evento y descubrir nuevas estrategias creativas focalizadas en sacar y lograr el máximo de tu comunidad cultural.',
        subtitle4: 'API:',
        mex4: 'El servicio API te permite recibir y utilizar los datos relativos a tus eventos y convocatorias en tu aplicación para móviles o sitio web.',
        mex5: 'Para más información, consulta nuestra %{link} y contáctanos, sin compromiso, a través del siguiente formulario:',
        servicesPage: 'página de servicios'
      },
      techTab:{
        tab: 'Soporte técnico',
        title: '¿Cómo podemos ayudarte?',
        mex1: 'Estamos aquí para proporcionarte ayuda técnica, consejos, responder a tus preguntas o darte información útil cuando más lo necesites.',
        mex2: 'Te contestaremos enseguida.'
      },
      feedBackTab:{
        tab: 'Feedback',
        title: '¿Qué te parece orfheo?',
        mex1: 'Para poder mejorar es necesario ponerse en juego y ser cuestionados. Estaríamos encantados de saber que piensas de orfheo, qué funcionalidades le faltan y te gustaría tener a tu alcance, qué cambiarías, quitarías o añadirías...',
        mex2: 'Cualquier crítica constructiva es bienvenida, nos ayudará a proporcionarte un servicio mejor.',
        mex3: '¡Tu opinión es importante!'
      },
      collaborateTab:{
        tab: 'Colabora',
        title: '¿Quieres ser parte?',
        mex1: 'Nos gustaría compartir conocimientos y seguir desarrollando este proyecto para que todos los ciudadanos de orfheo puedan siempre disfrutar de la comunidad y para dar la posibilidad de utilizar esta herramienta a todas las personas que lo deseen.',
        mex2: 'Creemos que la inclusión inspira la innovación y por lo tanto siempre estamos abiertos a escuchar ideas para colaborar.',
        mex3: 'Contáctanos a ',
        mex4: 'Hay muchas formas de colaborar en orfheo:',
        mex5: 'como partner: </br>si tienes un negocio y como nosotros crees que podemos hacer más cosas juntos que por separado, no dudes en enviarnos tu propuesta de alianza.',
        mex6: 'como patrocinador: </br>gracias a ti, que quieres invertir y/o colaborar a través de publicidad y patrocinio, podemos ofrecer la posibilidad de ayudar económicamente a los proyectos de la comunidad orfheo.',
        mex7: 'como trabajador:</br>trabaja en orfheo como creativo, artista, diseñador, programador, community manager, gestor administrativo o comercial. Envíanos información sobre ti.',
        mex8: 'como mecenas: </br>apoya de forma generosa una realidad, porque crees en ella. Apoyar orfheo significa ser parte de un proyecto con el potencial de mejorar nuestro mundo.',
        mex9: 'como voluntario: </br>contáctanos si quieres aprender a través del desarrollo de orfheo o, si ya tienes conocimientos, te estimula ofrecer tu tiempo a una noble causa.'
      },
      contactTab:{
        tab: 'Contacto',
        title: '¡Aquí estamos!',
        country: 'España'
      },
      eventContact:{
        title: 'Tus eventos en orfheo',
        mex1: 'Para crear un evento o para más información, contáctanos sin compromiso a través del siguiente formulario:',
        mex2: 'Crear un evento en orfheo te permitirá lanzar <strong>tu convocatoria</strong> en la comunidad y acceder a su <strong>herramienta de gestión</strong> que te acompañará hasta la publicación de <strong>tu programa interactivo</strong> (más información en nuestra %{link}).'
      },
      contactUs: {
        title: 'Contacta orfheo',
        mex1: 'Estamos siempre disponibles para proporcionarte ayuda técnica, consejos, responder a tus preguntas o darte información útil cuando más lo necesites.',
        mex2: 'Envíanos un mensaje, te contestaremos enseguida :)'
      },
      forms: {
        name: 'Nombre*',
        email: 'Email*',
        phone: 'Número de teléfono',
        subject: 'Asunto',
        links: 'Enlace a web/redes sociales de tu proyecto',
        call_me: 'Quiero ser contactado por teléfono',
        hangout_me: 'Quiero una cita por Hangout/Skype',
        mex: 'Mensaje*',
        days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        daysPlaceholder: "Selecciona tu disponibilidad durante la semana",
        everyday: "Todos los días",
        always: "Disponible todos los días",
        periods: ['Mañana', 'Tarde'],
        periodsPlaceholder: "Selecciona tu disponibilidad durante el día",
        everyperiod: "Mañana y tarde",
        anytime: "Disponible mañana y tarde",
        profileName: 'Nombre de tu perfil en orfheo'
      },
      send: 'Envía',
      correct: 'Mensaje enviado correctamente. ',
      thanks: '<br>Gracias por contactar con nosotros.<br> Te contestaremos cuanto antes :)',
      thankFeedback: 'Gracias por tu opinión :)',
      noSend: 'Mensaje no enviado:'
    },
    project:{
      baseline: 'Se pueden hacer más cosas juntos que por separado',
      mex1: '<p> Bienvenido/a a orfheo: </p><p>Una red social diferente, el reflejo de comunidades activas y la respuesta práctica a los requerimientos de una cultura que se abre a la participación.</p><p>  Orfheo es una plataforma para artistas, actores culturales, creativos y trabajadores de la cultura, que han descubierto que es posible salir de los espacios convencionales de exhibición para vivir experiencias artísticas de infinitas formas.</p> <p> Esta web está compuesta por múltiples funcionalidades, no sólo capaces de facilitar el trabajo de organización y gestión de convocatorias, sino de dar valor a las ideas desde su inicio hasta su realización. Ofrece herramientas para almacenar, organizar y publicar los datos de cualquier proyecto, haciendo que las formas de vida basadas en relaciones de colaboración sean posibles en el ecosistema cultural. Hace disponible una fuente de recursos compartidos y autogestionados, creados por todos y todas, de acceso universal e inclusivo. </p> ',
      more: 'Leer más...',
      subtitle: 'La visión y misión de orfheo se basa en los siguientes pilares:',
      list1: '<p>COMPARTIR <ul> <li> Compartimos nuestras ideas e inspiraciones, porque saber más de los demás significa aprender unos de otros. </li> <li> Compartimos nuestro valor, donde: valor = (experiencias + conocimientos) x actitud. </li>  <li> Decidimos y construimos colaborativamente. </li> </ul></p>',
      list2: '<p>IDENTIDAD <ul><li>Creemos que cada persona es algo único. </li> <li> Desempeñamos un papel activo en el desarrollo de un mundo más libre e inclusivo, que se crea gracias al esfuerzo colectivo. </li></ul></p>',
      list3: '<p>INFORMACIÓN <ul><li>Pretendemos hacer disponible la información en la mayor cantidad de idiomas posibles. </li> <li> Queremos que tengas acceso en cualquier lugar y en cualquier momento. </li> </ul></p>',
      list4: '<p>EXPERIENCIA <ul><li>Queremos dar la mejor experiencia posible a los usuarios, de manera que utilicen los recursos de orfheo sólo el tiempo necesario, para aplicarlos en la vida cotidiana. </li> <li> Pretendemos seguir desarrollando una interfaz y una estética limpia, clara y sencilla, cercana para todos y todas. </li> </ul></p>',
      list5: '<p>MODELO <ul><li>Aspiramos a aplicar un modelo de economía sostenible, donde todos y todas podamos disfrutar sin límites de los recursos compartidos, sin olvidar su rentabilidad en el tiempo. Es por eso, que ser parte de la comunidad es totalmente gratuito, pero al acceso a las herramientas de gestión supone un importe mínimo. </li> <li> Nos planteamos objetivos aparentemente inalcanzables, porque estamos convencidos de que a lo largo del camino llegaremos a obtener resultados, quizás diferentes de los esperados, pero sin duda valiosos. </li></ul></p>',
      list7: '<p>OBJETIVO <ul><li>Incentivamos la cultura participativa a través de otorgar nuevas oportunidades y herramientas dedicadas a construir y mejorar las relaciones de colaboración, utilizando las posibilidades de las nuevas tecnologías para vivir y hacer realidad la cultura transversal e inclusiva que queremos. </li> </ul></p>'  
    },
    manager:{
      title: 'Gestiona',
      toEvent: 'Página evento',
      export: 'Exporta tabla',
      zeroRecords: "Ningún resultado",
      infoEmpty: "Ningúna información disponible",
      export: 'Exporta tabla',
      copy:{
        helper: 'Crea y copia lista de correos',
        table: 'Copia tabla',
        keys: '<i>ctrl</i> o <i>\u2318</i> + <i>C</i> para copiar los datos de la tabla a tu portapapeles. <br><br>Para anular, haz click en este mensaje o pulsa Esc.',
        success: '<strong>Copiadas %d filas</strong> de datos al portapapeles',
        success1: '<strong>Copiada 1 fila</strong> de datos al portapapeles',
        results: ' Resultados por página _MENU_',
        artistEmails: 'Email artistas',
        spaceEmails: 'Email espacios',
        allEmails: 'Email artist. y esp.',
        title: 'Copia correos',
        mex1: '<strong>Copiados %{amount} contactos </strong> de correo al portapapeles',
        mex2: '(<strong><i>Ctrl+V</i></strong> para pegar)'
      },
      program:{
        tab: 'Programa',
        chain: 'Encadena los cambios',
        unchain: 'Desencadena los cambios',
        menu: {
          helper: 'Menú de herramientas',
          artistsnoProgram: 'Propuestas sin programa',
          spacesnoProgram: 'Espacios sin programa',
          orderSpaces: 'Ordena Espacios',
          orderby: 'Ordena por:',
          save: 'Guarda los cambios'
        },
        publish: 'Publica el programa',
        publishmex: 'El programa se ha publicado correctamente en la página de tu evento',
        unpublish: 'Retira el programa',
        unpublishmex: 'El programa se ha retirado de la página de tu evento',
        manageTool: 'Herramienta de gestión',
        chronoOrder: 'Ordena cronológicamente',
        artistCat: 'Categoría art.',
        spaceCat: 'Categoría esp.',
        spaceNum: 'Núm. esp.',
        artistEmail: 'Email artista',
        spaceEmail: 'Email espacio',
        punctuals: 'puntuales',
        permanents: 'permanentes'
      },
      proposals: {
        tab: 'Propuestas',
        addAnother: 'Añade otra propuesta a un participante que ya has creado',
        addArtist: 'Crea y añade una propuesta de tipo artista',
        addSpace: 'Crea y añade una propuesta de tipo espacio',
        orNew: '...o crea algo nuevo',
        byName: "Selecciona por nombre",
        selectCat: "Selecciona la categoría de la propuesta",
        phoneL: "Teléfono de contacto",
        showFields: 'Muestra todos los campos',
        modifyNote1: 'Esta información, así como el nombre, puede ser modificada sólo por su propietario, desde la página de perfil.',
        modifyNote2: 'Esta información, así como el nombre y el email, se puede cambiar modificando cualquier propuesta de este artista que has creado.',
        allProposals: 'Todas las propuestas',
        artistProposals: 'Propuestas artísticas',
        spaceProposals: 'Propuestas de espacios',
        eventCat: 'Categoría en el evento',
        hideShowCol: {
          helper: 'Muestra/Esconde columnas',
          selectAll: "Selecciona todo",
          unselect: 'Desmarca todo',
          initial: 'Configuración incial'
        },
        created: 'creadas',
        received: 'recibidas',
        createOk: 'Propuesta creada correctamente',
        createTitle: 'Crea una propuesta (%{type})',
        deleteNote: 'Al eliminar la propuesta, se enviará de forma automática una notificación por email a %{name}',
        deleteOk: 'Propuesta eliminada correctamente',
        modifymex: 'Formulario: %{type}',
        organizerProposal: 'Propuesta creada por los organizadores del evento'
      },
      tools: {
        tab: 'Útiles',
        whitelist: {
          title: 'Habilita usuarios para que puedan enviar una propuesta en cualquier momento',
          placeholder: 'Email o Nombre de perfil',
          ontheList: 'Este usuario ya está en la lista.'
        },
        qr: {
          title: 'Descarga y difunde el codigo QR de la página de tu evento en orfheo',
          download: 'Descarga'
        },
        slug:{
          title: 'URL corta',
          created: 'Dirección personalizada a tu evento:',
          create:'Crea la dirección personalizada de la página de tu evento:',
          regexMex:'Usa letras minúsculas, números y/o los caracteres _ -',
          unavailable: 'Esta dirección ya está siendo empleada',
          regexError: 'La dirección sólo puede incluir letras minúsculas, números y/o los caracteres _ -',
          lengthError: 'La dirección debe contener al menos tres caracteres',
          available:'Dirección disponible',
          popupMex: 'La nueva dirección será:',
          popupWarning:'Funcionará paralelamente a la ya existente y no podrá ser eliminada o modificada una vez creada.'
        }
      }
    },
    profile_page:{
      aside:{
        yourOther: 'tus otros perfiles',
        other:'Otros perfiles del mismo usuario',
        portfolio:'Portfolio'
      },
      artistBio: 'Biografía',
      call:'Participación en convocatorias',
      callMex:'No estás inscrito en ninguna convocatoria activa en este periodo.',
      multimedia:'Contenidos multimedia',
      video: 'Vídeos',
      images: 'Imágenes',
      audio:'Audio',
      spaceInfo: 'Información',
      events: 'Eventos',
      organizationInfo:'Información',
      createEventBtn:'Crea un evento y lanza una convocatoria',
      createEventTitle: 'Tus eventos en orfheo',
      participation:'Participación en eventos',

      production:{
        cache:'Caché: ',
        public: 'Audiencia ',
        noDuration: 'No tiene duración definida',
        info: 'Información'
      }
    },
    event_page:{
      infoTab: {
        signupCall:'¡Apúntate!',
        callOpening:'Apertura convocatoria ',
        callOpened:'Convocatoria abierta',
        till: ' hasta ',
        callClosed:'Convocatoria cerrada (desde el ',
        organize:'Organiza ',
        noConditions: 'Sin condiciones de participación',
        seeAll: 'ver todos',
        conditions:'Bases de participación'
      },
      eventAside:{
        program: 'Programa',
        community: 'Comunidad',
        info:'Info',
        partners:'Partners',
        managerbtn:'Manager del evento',
        withdrawprog:'Retira el programa',
        publishprog: 'Publica el programa',
        withdrawMex:'Ahora sólo tú puedes ver el programa de tu evento',
        publishMex:'El programa se ha publicado correctamente',
      },
      program:{
        filtersbtn: 'Filtros',
        filters:{
          participants:'Categorias Artísticas',
          hosts: 'Categorias Espacios',
          other:'Audiencia',
          titleText:'Selecciona lo que quieres ver'
        },
        all_dates: 'Todas las fechas',
        nowbtn:'Ahora',
        hs:'Horario',
        sp:'Espacio',
        orderby:'Ordena por',
        permanents: 'Permanentes a lo largo del día',
        noResults:'Ningún resultado para esta fecha'
      }
    },
    services: {
      mex: '​Lanza en orfheo la convocatoria artístico-cultural de tu evento <br>y gestiona todos tus datos con una nueva y potente herramienta.',
      pricing:'El precio no es un límite: <del style="font-size:14px; margin:0 .2rem 0 .5rem"> 59,90 €/mes </del> 14,90 €/mes.',
      watchVideo:'Mira el vídeo demo',
      contact: 'Contáctanos',
      section1: {
        title: 'Expande tu evento más allá de un evento',
        mex: 'Abre tu evento en orfheo, alimenta y da valor a tu comunidad más allá de un solo encuentro. Tendrás una página enteramente dedicada y llegarás a nuevos públicos.'
      },
      section2: {
        title: 'Lanza con fuerza tu convocatoria',
        mex: 'Empieza bien con tu formulario personalizado, es el principio de algo grande. Cualquiera puede apuntarse fácilmente a tu convocatoria desde la página de tu evento.'
      },
      section3:{
        title: 'Visualiza y gestiona los datos recibidos',
        mex: 'Visualiza, filtra y explora de forma fácil y rápida todas las propuestas recibidas. Ahorra tiempo, aprovecha la potencia de la información bien organizada, mantén todo bajo control.'
      },
      section4: {
        title: 'Crea el programa, nunca ha sido igual',
        mex: 'Construye la programación de tu evento y organiza junto a tu equipo y desde cualquier lugar. Todo está sincronizado en tiempo real y rápidamente modificable.'
      },
      section5: {
        title: '¿Listo? Publica el programa interactivo',
        mex: 'Publica tu programa interactivo. Permite a tu público encontrar lo que quiera y navegar entre los perfiles de los participantes.'
      },
      section6: {
        title: '¡Sorprende a tu público más que nunca!',
        mex: 'Usa orfheo como la App de tu evento: es la guía perfecta para ti y para tu público. Ordena y encuentra fácilmente lo que quieres ver.'
      },
      api:{
        title: 'API - Integra en tiempo real lo que quieras y donde quieras',
        mex: 'El servicio API permite recibir y utilizar los datos relativos a tus eventos y convocatorias en todas tus aplicaciones. Cualquier cambio que hagas en orfheo se actualizará de forma automática y simultánea en tu web y app para móviles. Podrás disponer de toda tu información siempre actualizada, dónde y cuándo tú quieras.'
      },
      counseling: {
        title: 'Asesoría para tu proyecto',
        mex: 'Podrás disfrutar de un seguimiento constante durante todo el proceso de preparación de tu evento y descubrir nuevas estrategias creativas focalizadas en lograr lo mejor de tu proyecto.'
      },
      price: {
        title: 'El precio no es un límite',
        subtitle: '<span style = "color:black; margin: 0 0 4rem 0; display: block;"><b>Contáctanos para crear y gestionar tu evento en orfheo.</b></span>'
      },
      e_pack: {
        pricing: '<h3 style="font-weight:normal; display:inline">14,90</h3> €/mes<p style="color:#6f6f6f">Precio: <del>59,90 €/mes<del></p> <p style="text-align:center">La herramienta de gestión para grandes eventos</p>',
        list: 'Una página entera dedicada/Convocatoria online/Difusión a todos los usuarios/Formularios multiidioma/Recibe propuestas ilimitadas/Programa cualquier actividad/Programación online interactiva/Usa orfheo como App/URL personalizable/Soporte técnico constante'
      },
      plus_pack:{
        list:'API/Asesoría',
        mex: '<p>Precios sin IVA. A pagar desde el día de lanzamiento de la convocatoria hasta el termine del evento.</p><p> Contáctanos para probar el manager de forma gratuita y sin compromiso.</p>'
      },
      endMex: 'Creemos en universos de creatividad, inclusivos, estimulantes, innovadores, tecnológicos, de integración social y de unión. Creemos en una nueva era, donde el centro sea compartir. Creemos en la interacción y la participación de las personas. Necesitamos acciones colectivas y verdaderos motores para crear una realidad cultural más humana, accesible y cercana. Necesitamos potenciar proyectos, trabajar en red y crecer en comunidad. Soñamos con construir nuevos horizontes sin barreras, un lugar en constante expansión que permita el fácil intercambio de experiencias e información. Hagámoslo posible juntos, ahora.'
    },
    browserTests:{
      version: 'Se ha detectado que estás utilizando una versión de %{browser} con la cual orfheo no ha sido testado. No se excluyen problemas de incompatibilidad. </br>Para una mejor experiencia, se recomienda utilizar una versión reciente de Google Chrome o en alternativa de Mozilla Firefox.',
      tracking: 'No se pueden cargar correctamente todos los contenidos de esta  página. Es muy probable que sea por tener habilitada la función de "tracking protection" del navegador. Para una mejor experiencia, se recomienda desactivarla.'
    },
    cookiesPolicy:{
      title: 'Política de cookies',
      mex: 'Para mejorar tu experiencia de navegación, orfheo almacena información en tu navegador en forma de pequeños elementos de texto llamados cookies. </br>Si aceptas o sigues navegando significa que estás de acuerdo con este aviso. Para más información puedes leer nuestra '
    },
    error: {
      alert: '¡Error!',
      incomplete: 'Por favor, revisa los campos obligatorios.',
      nonExecuted: 'No se ha podido ejecutar la acción',
      unsaved: 'No se han podido guardar los datos',
      already_registered: '¡Usuario ya registrado!',
      invalid_parameters: 'Los parámetros insertados no son validos!<br/> Por favor, revísalos.',
      invalid_email: '¡El correo no es correcto!<br/> Por favor, vuelve a intentar.',
      incorrect_password: '¡Contraseña equivocada!',
      invalid_password: '¡Contraseña no válida!',
      closedCall: 'Convocatoria cerrada',
      out_of_time_range: 'Tu propuesta no ha sido enviada.',
      invalid_type: 'Tipo de perfil no valido.',
      existing_profile: 'Ya existe un perfil con este nombre. Escoge otro.',
      non_existing_profile: '¡Perfil no existente!',
      non_existing_proposal: '¡Propuesta no existente!',
      non_existing_production: '¡Producción artística no existente!',
      invalid_category:'¡Categoría no válida!',
      existing_call: 'Convocatoria ya existente.',
      non_existing_call:'No existe esta convocatoria.',
      you_dont_have_permission: 'Perdiste la conexión...vuelve a logearte e inténtalo de nuevo.',
      invalid_query: 'Acción no válida.',
      non_existing_event:'No existe este evento',
      existing_name: 'El nombre de perfil que has decidido ya existe. Por favor, escoge otro.',
      serverProblem:{
        title: 'Error en el servidor',
        mex: '<p>Operación no ejecutada. Por favor, vuelve a intentar. </p> <p>Si el error persiste no olvides que estamos a tu disposición para ayudarte. Escríbenos a <a href="mailto:info@orfheo.org" target="_top"> info@orfheo.org</a> o contactános en el chat de nuestra <a href="https://www.facebook.com/orfheo.org", target="_blank">página facebook.</a></p>'
      }
    }
  }
}(Pard || {}))
