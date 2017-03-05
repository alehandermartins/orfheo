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
          item1:'...an image from <strong>flickr, instagram, pinterest</strong> (a pin) or a video from <strong>youtube, vimeo, vine</strong> or an audio from <strong>soundcloud</strong>:',
          sublist1_1:"open the image, video or audio in the corresponding website",
          sublist1_2:'copy its link directly form the browser or using the option "share" or "copy link"',
          sublist1_3:"paste it in the orfheo formulary field",
          sublist1_4:'click on the validation button',
          itemTwitter:'...an image from <strong>twitter</strong> (a tweet):',
          sublistTwitter_1:'click on the tweet you want to share',
          sublistTwitter_2:'on the opening popup, click on the three dotted icon',
          sublistTwitter_3:'select "Copy link to Tweet"',
          sublistTwitter_4:'copy the link and paste it in the orfheo formulary field',
          sublistTwitter_5:'click on the validation button',
          item2:'...una imagen, un post o un vídeo publicado en <strong>facebook</strong>:',
          sublist2_1:'pincha la fecha con la hora de publicación que aparece en la parte superior del post',
          sublist2_2:'copia desde el navegador el enlace de la página que se abre',
          sublist2_3:'copy the link and paste it in the orfheo formulary field',
          sublist2_4:'click on the validation button',
          item3: '...an audio from <strong>bandcamp</strong>:',
          sublist3_1:'in the song page click on "Share/Embed" (under the main picture) and then click on "Embed this album"',
          sublist3_2:'Select a style for the music player',
          sublist3_3:'copy the html code form the "Embed" field located on the upper left corner',
          sublist3_4:'copy the link and paste it in the orfheo formulary field',
          sublist3_5:'click on the validation button',
          item4: '...an audio from <strong>spotify</strong>:',
          sublist4_1:'select a song from a playlist with the mouse right button',
          sublist4_2:'click on "Copy Song Link"',
          sublist4_3:'copy the link and paste it in the orfheo formulary field',
          sublist4_4:'click on the validation button',
          finalMex: 'Finally, consider that you can only import into orfheo multimedia contents declared public on the web where they have been uploaded.'
        }
      }
    },
    createProfileCard:{
      text: 'Create a profile'
    },
    createProfile:{
      artistText:'Show your portfolio <br> and participate in big events',
      spaceText: 'Host artistic events and position yourself in the cultural map',
      organizationText: 'Announce your project and launch calls',
      introA: 'This information will be displayed on your profile page, you can modify it. It will let others know about you.',
      introS: 'This information will be displayed on the profile page of your space, you can modify it.',
      introO: 'This information will be displayed on the profile page, you can modify it.',
      submit: 'Create',
      artistForm:{
        nameL: "Artistic name",
        nameH: "The name for your artist profile",
        photoL:"Profile picture (500kb maximum)",
        bioL: "Biografy / Information",
        bioH: "Anything you want to share about your artistic-cultural life.",
        addressL: "City and Postal code",
        addressH: "Indicating your city and postal code will make it easier to locate you for a possible contact.",
        phoneL:"Phone number",
        webL:"Personal website and links to social networks",
        webH: "You can add links to both your websites and personal blogs as well as to your profiles on social networks (photos and videos are managed along with your artistic proposal).",
        colorL: "Pick a color",
        colorH:"Is the personal color for your profile!"
      },
      spaceForm:{
        nameL:"Space name",
        nameH:"The name for your space profile.",
        addressL:"Address",
        addressPlaceholder: 'Ex: Gauden Road, London, United Kingdom',
        catL: "Space type",
        catPlaceholder:'Select',
        bioL:"Description / Information",
        bioPlaceholder:'Dimensions, characteristics, activities that usually hosts, etc.',
        bioH: "Anything you want to share about your space.",
        phoneL: "Phone number",
        webL: "Personal website and links to social networks",
        webH: "You can add links to both your websites and personal blogs as well as to your profiles on social networks.",
        linksL: 'Online materials',
        linksH:'Add videos, pictures and audios from your social networks.',
        photoL:"Space pictures (5 maximum, size must not exceed 500kb each)",
        photoH: "The first picture will be your profile picture",
        colorL: "Pick a color",
        colorH: "Is the personal color for your profile!"
      },
      organizationForm:{
        nameL: "Organization name",
        nameH: "The name for your organization profile.",
        catL: "Organization type",
        catPlaceholder:'Select',
        addressL:"Address of the organization's headquarters",
        bioL: "Information / Project",
        bioH: "Anything you want to share about the organization."
      }
    },
    modifyProfile:{
      title: 'Modify your profile',
      delete: 'Delete the profile',
    },
    proposal:{
      form:{
        nameL:"Name",
        emailL:"Email",
        addressL:"Address",
        bioL:"Description / Information",
      }
    },
    production:{
      createTitle: 'Create an artistic proposal',
      form:{
        titleL: "Title for the artistic proposal",
        descriptionL: 'Desripction',
        descriptionH: 'Describe in more detail your artistic proposal.',
        short_descriptionL:'Brief description',
        short_descriptionH:'Summarize your artistic proposal in a maximum of 80 characters. Remaining:',
        durationL: "Duration *",
        childrenL:"Public addressed",
        childrenH: "Indicate to which type of audience the proposal is addressed.",
        linksL:"Online materials",
        linksH: "Add videos, pictures and audios from your social networks. This material will let others better know your art.",
        photoL: "Your art pictures (4 maximum, size must not exceed 500kb each)",
        cacheL:"Cache / Production expenses",
        noDefinedDuration:"It has no defined duration",
        catSel:'Select a category *',
        submit: 'Create'
      },
      modify:{
        title: 'Modify your artistic project',
        cat:'Category',
        initMex: 'With this form you can modify the contents of your artistic project. Changes will not affect data sent to calls.',
        delete: 'Delete this artistic project'
      }
    },
    signUp:{
      btn:'Join',
      popup:{
        title: 'Start by creating an account...',
        email:'Email',
        passwd:'Password',
        insertEmail:'Your email',
        confirmEmail:'Confirm your email',
        tooshort: 'Password must be at least 8 characters long.',
        notequal:'Mail fields do not match.',
        format: 'Email must have a valid format.',
        submit:'Create an account',
        mex: '...doing it, of course, <strong>is totally free :) </strong>',
        conditions: 'general conditions',
        conditionText:'By creating an account, you confirm that you agree with our ',
        length: '8 characters minimum'
      }
    },
    login:{
      dropdown:{
        recover:'Forgot your password?',
        email:'Email',
        passwd:'Password',
        gobtn:'Login',
        rememberme:'Remember me',
        popup:{
          notValidated: 'User not validated',
          notValidatedmex: 'When registering, we send you an email with a link to activate your account. Check in the spam folder...',
          sendOther:"...or re-type your email here, and we'll send you another one.",
          okbtn:'Send',
          notValidEmail:'The email is not valid',
          sent: 'We have sent you an email with the instructions to access your account.',
          nouser:'This user does not exist.',
          notExisting: '¡There is no user associated with this email!',
          registerbtn:'Register',
          registerTitle: 'Register to proceed'
        }
      },
      eventPage:{
        nouser: "If you don't have an account:",
        signUp: 'Create an account',
        signUpTitle: 'Create an account...' 
      }
    },
    call:{
      initText:'This call is for profiles of the type ',
      conjunction:' and ',
      chooseProfile: 'Apply with an existing profile',
      newProfile: '...or create and apply with a new one',
      createProfile:{
        title:'Create a profile and apply as:',
        artistText: 'Show your art',
        spaceText: 'Host activities',
        organizationText: 'Send your proposal'
      },
      successTitle: '¡Awesome!',
      succesMex:'You have successfully applied.',
      sendOther: 'Send another proposal',
      toProfile: 'Go to your profile page',
      alreadyInscribed: {
        title: 'You have already applied as this space :)', 
        mex: 'If you want, you can send proposals to perform during the event.',
      },
      stop:{
        title: 'ATTENTION, YOU SHALL NOT PASS',
        mex1:'This call is for profiles whith type<strong>',
        mex2:'</strong>. Select or create one of the accepted types to proceed.'
      },
      form:{
        initMex:"Fill in this <strong>form</strong> in order to apply with %{link} to <strong>%{organizer}</strong>'s call",
        portfolio:'Apply with a portfolio proposal',
        catPlaceholder: 'select how you want to apply',
        newProposal: '...or propose something new'
      }
    },  
    footer:{
      languages:'Languages',
      project: 'Project',
      contact: 'Contact',
      services:'Services',
      conditions: 'Conditions'
    },
    header:{
      events:'Events',
      profiles:'Profiles',
      news:'News',
      callToAction: 'Launch your call',
      home: 'Home',
      insideDropdown:{
        delete: 'Delete my account',
        modifypasswd:'Modify password',
        logout:'Logout',
        contact:'Contact orfheo',
        event:'Event'
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
