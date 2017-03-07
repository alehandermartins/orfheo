'use strict';

(function(ns){
  ns.langs = ns.langs || {}

  ns.langs.es = {
    search: {
      artista: 'artist',
      espacio: 'space',
    },
    type: {
      artist: "Artista",
      space: "Espacio",
      organization: "Organización",
      spaces:'Espacios'
    },
    partners:{
      collaborators:'Colaboradores',
      sponsors:'Patrocinadores'
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
    form:{
      incomplete: 'Por favor, revisa los campos obligatorios.'
    },
    popup_alert:{
      error: '¡Error!',
      noAction: 'No se ha podido ejecutar la acción',
      serverProblem:{
        title: 'Error en el servidor',
        mex: '<p>Operación no ejecutada. Por favor, vuelve a intentar. </p> <p>Si el error persiste no olvides que estamos a tu disposición para ayudarte. Escríbenos a <a href="mailto:info@orfheo.org" target="_top"> info@orfheo.org</a> o contactános en el chat de nuestra <a href="https://www.facebook.com/orfheo.org", target="_blank">página facebook.</a></p>'
      }
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
        date:'Última actualización: 1 de Mayo 2016',
        part1:'<p> <strong>Te damos la bienvenida!</strong></p><p> <strong>Orfheo se basa en un principio potente: podemos hacer más cosas juntos que por separado.</strong></p><p>Son las personas como tú las que hacen posible que este lugar no solo exista, sino que también crezca y prospere. </br> Estas condiciones generales de uso explican el servicio y la relación entre los usuarios, los derechos y las responsabilidades recíprocas. </br> <strong> Ser parte de orfheo es gratuito </strong> y al hacerlo estás aceptando estas condiciones generales.</p>',
        subtitle2: 'Principios generales:',
        mex2: '<p>Orfheo no tiene normas firmes más allá de los principios generales enunciados aquí: <ul><li>Respeta a los ciudadanos de orfheo incluso cuando no estés de acuerdo con ellos. </li> <li> Comparte contenidos civilizadamente, evita los ataques personales y las generalizaciones asi como la publicación de enlaces o textos que puedan ser en sus contenidos ofensivos para la comunidad, racistas, sexistas, homófobos o que incitan a la violencia de cualquier tipo. </li> <li>  Actúa con buena fe, se abierto, acogedor e inclusivo.  </li> <li> Si no respetaras estos principios nos pondremos en contacto contigo para que nos puedas dar una explicación y juntos poder encontrar una solución. </li> </ul></p>',
        subtitle3:'Nos comprometemos a:',
        mex3: '<p><ul><li>Describir cómo puede usarse o compartirse tu información en estas condiciones generales. </li> <li> Usar las medidas razonables para mantener tu información sensible segura.  </li> <li>  Hacer disponible y dejar fluir en la comunidad la información que decidas compartir.  </li> <li> Impulsar valores tales como la solidaridad, el sentido de comunidad, la meritocracia, la equidad, el respeto y la armonía con el entorno.  </li> <li> Respetar y defender la comunidad de orfheo. </li> <li> Escuchar y acoger cualquier tipo de sugerencia y crítica constructiva. </li></ul></p>',
        subtitle4: 'Términos de uso y Privacidad:',
        mex4: '<p>Aquí te explicamos cómo recolectamos y compartimos tu información personal/datos/contenidos.<ul><li>Recolectamos muy poca información personal acerca de ti. </li> <li> No alquilamos ni vendemos tu información a terceros, es decir que no compartimos tus datos con terceras partes para propósitos de mercadeo.  </li> <li>  Cabe la posibilidad de que la información recogida en orfheo se comparta con terceros de acuerdo con nuestra ideología, cumpliendo con la ley y con la intención de traer beneficio a toda la comunidad.  </li> <li>Eres responsable de los contenidos que compartes y de sus medidas de privacidad.  </li> <li> Ocasionalmente te mandaremos correos electrónicos con respecto a información importante. </li> <li>  La calidad de los datos que nos proporcionas es útil para ti, para que podamos mejorar tu experiencia como usuario y poder desarrollar nuevas funciones, para que tu experiencia sea inolvidable. </li> <li> Todo lo que publicas en orfheo es público, puede ser visto y eventualmente usado por todo observador externo. </li> <li> Es posible que te pidamos nos proporciones información a través de una encuesta o retro-alimentación, pero nunca estarás obligado a participar en éstas. </li> <li> No necesitas crear una cuenta para explorar y visualizar cualquiera de los contenidos. </li> <li> Para crear una cuenta, necesitas darnos sólo tu dirección de correo electrónico. </li><li> Cualquier persona puede unirse y abandonar orfheo en cualquier momento.</li> </ul></p>',
        subtitle5:'Publicidad:',
        mex5: '<p>Ahora mismo no hay ninguna forma de publicidad dentro de orfheo. En un futuro, no se excluye la presencia de publicidad no molesta, relacionada con el mundo artístico-cultural, que pueda proporcionar información útil y valiosa para los ciudadanos. Consideramos que la publicidad puede ser eficaz sin ser molesta. Excluimos la presencia de publicidad en forma de ventanas emergentes que pueden interferir con la visualización de los contenidos de orfheo. </p>',
        subtitle5_5:'Sostenibilidad del proyecto:',
        mex5_5:'<p>Como prometido, ser parte de orfheo no tiene y no tendrá ningún coste para ningún usuario. Sin embargo, el mantenimiento online de una web de este tipo tiene un coste, así como la sostenibilidad de la vida de las personas que trabajan diariamente en ello. Por lo tanto, lanzar una convocatoria y poder acceder a la relativa herramienta de gestión tiene un precio, que se decide juntos, a partir de una base mínima, según el tipo de evento que se quiere organizar.</p>',
        cookies: 'Política de cookies:',
        cookiesMex1: 'Las cookies son un elemento informático ampliamente usado en internet. Cuando uno accede a una página web, alguna información se almacena en la memoria del navegador para que la página web pueda acceder rápidamente a esa información en el futuro.',
        cookiesMex2: 'Orfheo utiliza cookies con el único fin de mejorar la experiencia de navegación de sus usuarios. Por ejemplo, guardamos información para permitir un login más rápido y continuado, evitar la desconexión de la web en caso de reinicio del servidor, y recordar preferencias o elecciones durante todo el proceso de navegación.',
        cookiesMex3:'En general, por como se estructura internet hoy en día, las coockies son un elemento imprescindible. Por ley, toda web que las utiliza, está obligada a avisar sus usuarios para que sepan lo que está ocurriendo.',
        cookiesMex4: 'La misma información aquí mostrada se encuentra también disponible en el apartado de condiciones de uso. En caso de modificación se avisará a los ciudadanos de orfheo con suficiente antelación.',
        subtitle6: 'Actualizaciones:',
        mex6: 'Nos reservamos el derecho de modificar, si necesario, las condiciones generales para adaptarlas a futuras novedades y asumimos el deber y el compromiso de informar de los cambios a todos los ciudadanos de orfheo, para que puedan conocer las actualizaciones de antemano.',
        subtitle7: '¡Muchas gracias!',
        finalMex: '<p> Si tienes preguntas o sugerencias  envía un correo electrónico a <a href="mailto:info@orfheo.org"> info@orfheo.org</a>.</p> <p> Gracias por leer hasta aquí. Esperamos que disfrutes dentro y fuera orfheo. </br> Tu participación al crear, mantener y mejorar este lugar es imprescindible. </p> <p> Apreciamos que te hayas tomado tu tiempo para informarte sobre el proyecto, y te agradecemos que contribuyas. Mediante lo que haces, estás ayudando a construir algo realmente importante, no sólamente una conexión de proyectos compartidos de manera colaborativa, sino también una vibrante comunidad enfocada en una muy noble meta. </p>'
      },
      noMapLocation:{
        title: '¡Atencion!',
        mex: 'Google no reconoce la dirección que has insertado y por lo tanto no puede ser localizada en ningún mapa.',
        fix:'Corrige la dirección',
        ok:'Continua igualmente'
      }
    },
    widget:{
      search:{
        placeholder:'Busca por tags'
      },
      uploadPhoto:{
        btn: 'Sube una imagen',
        tooBigError: 'El tamaño de las imágenes no puede ser superior a 500Kb. Puedes reducirlo en un momento utilizando, entre muchas otras,  <a href = "http://optimizilla.com/es/"  target="_blank">esta web</a>.',
        max5: 'Máximo cinco imagenes.',
        max1:'Máximo una imagen.',
        max4: 'Máximo cuatro imagenes.',
        acceptedFormat: 'Formatos aceptados: .gif, .jpeg, .jpg, .png'
      },
      inputName:{
        unavailable: 'Este nombre de perfil ya existe. Escoge otro para poder proceder.'
      },
      inputTel:{
        show:'Muestra en mi página de perfil'
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
        number: 'Numero',
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
      inputMultimedia:{
        placeholder:'Copia y pega aquí el enlace/código correspondiente y dale al botón para validar',
        invalid:'Entrada no valida',
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
    createProfileCard:{
      text: 'Crea un perfil'
    },
    createProfile:{
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
        addressH: "Indicar tu ciudad y código postal hará más facil localizarte para un posible contacto.",
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
        bioPlaceholder:'Dimensiones, caracteristicas, actividades que suele hospedar, etc.',
        bioH: "Cualquier cosa que quieras compartir sobre tu espacio.",
        phoneL: "Numero de teléfono",
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
        bioH: "Cualquier cosa que quieras contar sobre la organización."
      }
    },
    modifyProfile:{
      title: 'Modifica tu perfil',
      delete: 'Elimina el perfil',
    },
    proposal:{
      form:{
        nameL:"Nombre",
        emailL:"Correo",
        addressL:"Dirección",
        bioL:"Descripción / Información",
      }
    },
    production:{
      createTitle: 'Crea una propuesta artística',
      form:{
        titleL: "Título de la propuesta artística",
        descriptionL: 'Descripción',
        descriptionH: 'Decribe con más detalles tu propuesta artística.',
        short_descriptionL:'Descripción (muy) breve',
        short_descriptionH:'Resume tu propuesta artística en máximo 80 caracteres. Quedan:',
        durationL: "Duración *",
        childrenL:"Edades público",
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
        loginTitle: 'Para apuntarte necesitas hacer antes el login'
      }
    },
    call:{
      initText:'Esta convocatoria es para perfiles de tipo ',
      conjunction:' y ',
      chooseProfile: 'Inscribe un perfil existente',
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
      toProfile: 'Ve a pagína de perfil',
      alreadyInscribed: {
        title: 'Ya te has inscrito como espacio :)', 
        mex: 'Si quieres, puedes enviar propuestas para actuar durante el evento.',
      },
      stop:{
        title: 'ATENCIÓN, NO PUEDES CONTINUAR',
        mex1:'Esta convocatoría es sólo para perfiles de<strong>',
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
        finalMex: 'ATENCIÓN: Una vez enviado, <strong>no te será permitido modificar</strong> el contenido de este formulario, sino sólo de enmendarlo. Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".',
        sendbtn:'Envía'
      }
    },  
    footer:{
      languages:'Idiomas',
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
        title: "Tu comunidad cultural te llama<br>Entra en ofheo como:",
        artist: "Comparte tu arte,<br>apúntate en convocatorias,<br>genera red, descubre, crea...",
        space: "Saca el máximo partido a tu espacio,<br>alberga eventos artísticos,<br>abre las puertas a la cultura",
        organization: "Da a conocer tu proyecto,<br>lanza convocatorias,<br>expande tu comunidad",
        create: "Crea un perfil"
      },
      networkSection: {
        title: 'Une a las personas,</br> crea en red con tu comunidad cultural',
        subtitle1: 'Aquí y ahora',
        subtitle2: 'Toma el control',
        subtitle3: 'Hazlo',
        section1: 'Descubre proyectos y déjate </br> conocer por lo que haces',
        section2: 'Involucra a la comunidad, </br> lanza tu convocatoria',
        section3: 'Crea experiencias inolvidables junto con los demás',
        link: 'Explora las ventajas de lanzar tu convocatoria en orfheo'
      },
      inspireSection: {
        title: 'El futuro está aquí, frente a ti',
        section: 'Alguna vez lo has imaginado, pero ahora es realidad. <br> Tienes a tu alcance un universo de nuevas, <br>grandes posibilidades culturales.',
        link: 'Déjate inspirar'
      },
      servicesSection: {
        logo: 'S e r v i c i o s',
        subtitle1: 'Plataforma de gestión',
        subtitle2: 'Asesoría creativa',
        subtitle3: 'Conexión API',
        section1: 'Crea un evento,</br> lanza una convocatoria, </br>utiliza la potente herramienta de gestión </br>y publica una programación interactiva',
        section2: 'Saca lo mejor de tu proyecto,</br> alimenta tu comunidad </br>y explora nuevas estrategias creativas durante el proceso',
        section3: 'Reenvía los datos de tu evento a tu página web o aplicación móvil y utilízalos siempre actualizados como mejor te convenga',
        link: 'Descubre más'
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
        public: 'Público ',
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
          other:'Edades',
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
    }
  }
}(Pard || {}))
