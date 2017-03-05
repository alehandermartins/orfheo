'use strict';

(function(ns){
  ns.langs = ns.langs || {}

  ns.langs.en = {
    type: {
      artist: "Artist",
      space: "Space",
      organization: "Organization",
      spaces:"Spaces"
    },
    partners:{
      collaborators:"Collaborators",
      sponsors:"Sponsors"
    },
    categories:{
      cultural_ass: "Cultural Space",
      commercial: "Shop",
      home: "Private Space",
      open_air: "Open Air",
      festival:"Festival",
      association:'Association',
      ngo:"NGO", 
      collective:"Collective", 
      interprise:"Enterprise", 
      institution:"Institution",
      federation: "Federation",
      foundation:"Foundation",
      music:"Music",
      arts: "Performing Arts",
      expo: "Exposition",
      poetry: "Poetry",
      audiovisual: "Adiovisual",
      street_art: "Street Art",
      workshop: "Workshop",
      other: "Other",
      gastronomy: "Gastronomy"
    },
    form:{
      incomplete: "Please check the required fields."
    },
    popup_alert:{
      error: "¡Error!",
      noAction: "Unable to execute action",
      serverProblem:{
        title: "Server Error",
        mex: "<p>Operation not executed. Please try again. </p> <p>If the error persists do not forget that we are at your disposal to help you. Write to us at <a href='mailto:info@orfheo.org' target='_top'> info@orfheo.org</a> o contact us at the chat of our <a href='https://www.facebook.com/orfheo.org', target='_blank'>facebook page.</a></p>"
      }
    },
    popup:{
      delete:{
        title:"¿Are your sure?",
        user: "By confirming, all your data will be deleted from orfheo: all your profiles and contents will be canceled.",
        profile: "By confirming, your profile will be deleted and with it all its contents. However, proposals sent to calls will not be canceled.",
        confirm:"Confirm",
        cancel: "Cancel",
        production:"By confirming, your artistic project will be removed from your portfolio. This action will not affect your registration in calls."
      },
      modifypasswd:{
        title:"Enter a new password",
        password:"Password",
        passwordConf: "Confirm your password",
        notequal: "The passwords don't match",
        tooshort:"Password must be at least 8 characters long",
        check:"Please verify that the passwords are equal and have a minimum of 8 characters",
        success: "The password has been changed."
      },
      recover:{
        title: "Recover your password",
        submit: "Send"
      },
      termsAndConditions:{
        title: "General conditions",
        date:"Last update: 2016 May 1",
        part1:'<p> <strong>Welcome!</strong></p><p> <strong>Orfheo is based on a powerful principle: we can do more things together than separately.</strong></p><p>It is people like you who make it possible for this place not only to exist, but also to grow and thrive.</br>These general conditions explain the service and the relationship between users, rights and reciprocal responsibilities.</br> <strong>Being part of orfheo is free</strong> and by doing so you are accepting these general conditions.</p>',
        subtitle2: "General principles:",
        mex2: "<p>Orfheo has no firm norms beyond the general principles enunciated here:<ul><li>Respect the orfheo citizens even when you disagree with them.</li> <li>Share contents civilly, avoid personal attacks and generalizations as well as the publication of links or texts that may be offensive for the community, racist, sexist, homophobic or incite violence of any kind.</li> <li>Act in good faith, be open, welcoming and inclusive.</li> <li>If you do not respect these principles we will contact you so you can give us an explanation. Together we will find a solution.</li> </ul></p>",
        subtitle3: "We commit to:",
        mex3: "<p><ul><li>Describe how your information can be used or shared in these general conditions.</li> <li>Use reasonable measures to keep your sensitive information safe.</li> <li>Let the information that you decide to share flow in the community.</li> <li>Promote values ​​such as solidarity, a sense of community, meritocracy, equity, respect and harmony with the environment.</li> <li>Respect and defend the community of orfheo.</li> <li>Listen and welcome any kind of suggestion and constructive criticism.</li></ul></p>",
        subtitle4: "Terms of use and privacy:",
        mex4: '<p>Aquí te explicamos cómo recolectamos y compartimos tu información personal/datos/contenidos.<ul><li>Recolectamos muy poca información personal acerca de ti. </li> <li> No alquilamos ni vendemos tu información a terceros, es decir que no compartimos tus datos con terceras partes para propósitos de mercadeo.  </li> <li>  Cabe la posibilidad de que la información recogida en orfheo se comparta con terceros de acuerdo con nuestra ideología, cumpliendo con la ley y con la intención de traer beneficio a toda la comunidad.  </li> <li>Eres responsable de los contenidos que compartes y de sus medidas de privacidad.  </li> <li> Ocasionalmente te mandaremos correos electrónicos con respecto a información importante. </li> <li>  La calidad de los datos que nos proporcionas es útil para ti, para que podamos mejorar tu experiencia como usuario y poder desarrollar nuevas funciones, para que tu experiencia sea inolvidable. </li> <li> Todo lo que publicas en orfheo es público, puede ser visto y eventualmente usado por todo observador externo. </li> <li> Es posible que te pidamos nos proporciones información a través de una encuesta o retro-alimentación, pero nunca estarás obligado a participar en éstas. </li> <li> No necesitas crear una cuenta para explorar y visualizar cualquiera de los contenidos. </li> <li> Si creas una cuenta,  necesitas darnos sólo tu dirección de correo electrónico. </li> <li> Nadie es mas importante que nadie.  El orden de los resultados de búsqueda y los perfiles no se manipulan en ningún momento para que nadie ocupe una posición aventajada. </li> <li> Cualquier persona puede unirse y abandonar orfheo en cualquier momento.  Cancelando una cuenta, toda la información relacionada será borrada permanentemente.</li> </ul></p>',
        subtitle5:'Publicidad:',
        mex5: '<p>Ahora mismo no hay ninguna forma de publicidad dentro de orfheo. En un futuro, no se excluye la presencia de publicidad no molesta, relacionada con el mundo artístico-cultural, que pueda proporcionar información útil y valiosa para los ciudadanos. Consideramos que la publicidad puede ser eficaz sin ser molesta. Excluimos la presencia de publicidad en forma de ventanas emergentes que pueden interferir con la visualización de los contenidos de orfheo. </p>',
        subtitle5_5:'Sostenibilidad del proyecto:',
        mex5_5:'<p>Como prometido, ser parte de orfheo no tiene y no tendrá ningún coste para ningún usuario. Sin embargo, el mantenimiento online de una web de este tipo tiene un coste, así como la sostenibilidad de la vida de las personas que trabajan diariamente en ello. Por lo tanto, lanzar una convocatoria y poder acceder a la relativa herramienta de gestión tiene un precio, que se decide juntos, a partir de una base mínima, según el tipo de evento que se quiere organizar.</p>',
        cookies: 'Política de cookies:',
        cookiesMex1: 'Las cookies son un elemento informático, ampliamente usado en internet, que una página web instala en el navegador de quien la visita. Es decir, que cuando uno accede a una página web, esta envía información a Chrome, Firefox, Internet Explorer, Opera... y esta información se almacena en la memoria del mismo. La idea es que la página web pueda comprobar esa información en el futuro y utilizarla.',
        cookiesMex2: 'Orfheo utiliza coockies con el único fin de mejorar la experiencia de navegación de sus usuarios. Por ejemplo, guarda localmente informaciones para permitir un login más rápido y continuado, evitar la desconexión del sitio en caso de reinicio del servidor, recordar preferencias o elecciones durante todo el proceso de navegación.',
        cookiesMex3:'En general, por como se estructura internet hoy en día, las coockies son un elemento imprescindible. Por ley, toda web que las utiliza, está obligada a avisar sus usuarios para que sepan lo que está ocurriendo.',
        cookiesMex4: 'La misma información de este popup está también en el apartado de condiciones de uso de la web. En caso de modificación se avisará a los ciudadanos de orfheo con suficiente antelación.',
        subtitle6: 'Actualizaciones:',
        mex6: 'Nos reservamos el derecho de modificar, si necesario, las condiciones generales para adaptarlas a futuras novedades y asumimos el deber y el compromiso de informar de los cambios a todos los ciudadanos  de orfheo, previamente y con tiempo, para que puedan conocer las actualizaciones de antemano.',
        subtitle7: '¡Muchas gracias!',
        finalMex: '<p> Si tienes preguntas o sugerencias  envía un correo electrónico a <a href="mailto:info@orfheo.org"> info@orfheo.org</a>.</p> <p> Gracias por leer hasta aquí. Esperamos que disfrutes dentro y fuera orfheo. </br> Tu participación al crear, mantener y mejorar este lugar es imprescindible. </p> <p> Apreciamos que te hayas tomado tu tiempo para informarte sobre el proyecto, y te agradecemos que contribuyas. Mediante lo que haces, estás ayudando a construir algo realmente importante, no sólamente una conexión de proyectos compartidos de manera colaborativa, sino también una vibrante comunidad enfocada en una muy noble meta. </p>'
      },
      noMapLocation:{
        title: "¡Attention!",
        mex: "Google does not recognize the address you provided and therefore can not be located on any map.",
        fix:"Change the address",
        ok:"Proceed anyway"
      }
    },
    widget:{
      search:{
        placeholder:"Search by tags"
      },
      uploadPhoto:{
        btn: "Upload an image",
        tooBigError: "The size of the images can not exceed 500Kb. You can quickly reduce it by using, among many others,  <a href = 'http://optimizilla.com/es/'  target='_blank'>this web</a>.",
        max5: "Five images maximum.",
        max1:"One image maximum.",
        max4: "Four images maximum.",
        acceptedFormat: "Accepted formats: .gif, .jpeg, .jpg, .png"
      },
      inputName:{
        unavailable: "This profile name already exists. Choose another in order to proceed."
      },
      inputTel:{
        show:"Show in my profile page"
      },
      inputCache:{
        show: "Show in my portfolio"
      },
      inputWeb:{
        placeholder: "Copy and paste the corresponding link here and click the validation button"
      },
      inputAddressArtist:{
        city:"City*",
        postalCode:"Postal Code*",
        neighborhood:"Neighborhood (optional)"
      },
      inputChildren:{
        all_public:'All public',
        baby:"Kids", 
        family:"Family", 
        young: "Youth",  
        adults: "Adults"
      },
      inputAddressSpace:{
        street: "Street",
        number: "Number",
        city:"City",
        postalCode:"Postal Code",
        door:"Floor / Door",
        state: "Country",
        warning:"¡Attention! Google does not recognize the address you provided and therefore can not be located on any map.",
        insertGeo:"If the location is not correct, manually insert your geographic coordinates and save them by clicking ",
        insertGeoBtn:"here"
      },
      multimediaManager:{
        btn: "Modify or create a new one",
        title: "Manage your multimedia content",
        mex:"You can add:",
        videoList:"<strong>videos</strong> from:  youtube, vimeo, vine, facebook",
        imageList:"<strong>images</strong> from: your computer, instagram, flickr, pinterest, twitter, facebook",
        audioList:"<strong>audios</strong> from: soundcloud, bandcamp, spotify",
        photoL:"Upload images from your computer (4 max, size must not exceed 500kb each)"
      },
      inputMultimedia:{
        placeholder:"Copy and paste the corresponding link/code here and click the validation button",
        invalid:"Not a valid entry",
        acepted:"Accepted entries",
        popup:{
          title:"How to add...",
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
          finalMex: 'Finalmente, considera que se pueden importar en orfheo sólo contenidos multimedia declarados públicos en la web donde se han subido.'
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
        initMex: 'Con este formularo puedes modificar el contenido de la página de tu proyecto artistico. Los cambios que hagas no afectarán los datos enviados a convocatorias.',
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
        rememberme:'Recuérdame',
        popup:{
          notValidated: '<h4 style="margin-top:-1.2rem;">Usuario no validado</h4> <p>Al registrate, te enviamos un correo electrónico con un enlace para activar tu cuenta. Controla también en la carpeta de spam...</p>',
          sendOther:'...o vuelve a escribir aquí tu correo, y te enviamos otro.',
          okbtn:'Enviar',
          notValidEmail:'El email no es valido',
          sent: 'Te hemos enviado un correo con las instrucciones para acceder a tu cuenta.',
          nouser:'El usuario no existe.',
          notExisting: '¡No existe ningún usuario asociado con este correo!',
          registerbtn:'Regístrate',
          registerTitle: 'Regístrate para continuar'
        }
      },
      eventPage:{
        nouser: 'Si no tienes una cuenta:',
        signUp: 'Crea una cuenta',
        signUpTitle:  'Crea una cuenta...' 
      }
    },
    call:{
      initText:'Esta convocatoria es para perfiles de tipo ',
      conjunction:' y ',
      chooseProfile: 'Inscribe un perfil ya creado',
      newProfile: '...o crea e inscribe uno nuevo',
      createProfile:{
        title:'Crea un perfil y apúntate como:',
        artistText: 'Enseña tu arte',
        spaceText: 'Alberga actividades',
        organizationText: 'Envía tu propuesta'
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
        initMex1:'Éste es el <strong>formulario</strong> para inscribir tu perfil ',
        initMex2: ' en la convocatoria de <strong>',
        portfolio:'Apúntate con una propuesta de tu portfolio',
        catPlaceholder: 'Selecciona como quieres apuntarte',
        newProposal: '...o propón algo nuevo'
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
        title: "Your cultural community is calling you<br>Join orfheo as:",
        artist: "Share your art,<br>join a call,<br>hatch a network, discover, create...",
        space: "Make the best out of your space,<br>host artistic events,<br>open the doors to culture",
        organization: "Announce your project,<br>launch calls,<br>expand your community",
        create: "Create a profile"
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
        info:'Informaciones',
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
        orderby:'Ordena por'
      }
    }
  }
}(Pard || {}))
