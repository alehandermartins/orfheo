'use strict';

(function(ns){
  ns.langs = ns.langs || {}

  ns.langs.es = {
    type: {
      artist: "Artista",
      space: "Espacio",
      organization: "Organización"
    },
    popup_alert:{
      error: '¡Error!',
      noAction: 'No se ha podido ejecutar la acción',
      serverProblem:{
        title: 'Error en el servidor',
        mex: '<p>Operación no ejecutada. Por favor, vuelve a intentar. </p> <p>Si el error persiste no olvides que estamos a tu disposición para ayudarte.  Escríbenos a  <a href="mailto:info@orfheo.org" target="_top"> info@orfheo.org</a> o contactános a la chat de nuestra <a href="https://www.facebook.com/orfheo.org", target="_blank">página facebook.</a></p>'
      }
    },
    popup:{
      delete:{
        title:'¿Estás seguro/a?',
        mex: 'Confirmando, todos tus datos serán eliminados de orfheo: se cancelarán todos tus perfiles y sus contenidos. Con ello, todas tus inscripciones en convocatorias serán borradas.',
        confirm:'Confirma',
        cancel: 'Anula'
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
      }
    },
    searchWidget:{
      placeholder:'Busca por tags'
    },
    createProfileCard:{
      text: 'Crea un perfil'
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
        forgot: '¿Has olvidado la contraseña?'
      },
      eventPage:{
        nouser: 'Si no tienes una cuenta:',
        signUp: 'Crea una cuenta',
        signUpTitle:  'Crea una cuenta...' 
      }
    },
    call:{
      chooseProfile: 'Inscribe un perfil ya creado',
      newProfile: '...o crea e inscribe uno nuevo',
      createProfile:{
        title:'Crea un perfil y apúntate como:'
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
          other:'Otros',
          titleText:'Selecciona lo que quieres ver'
        },
        nowbtn:'Ahora',
        hs:'Horario',
        sp:'Espacio',
        orderby:'Ordena por'
      }
    }
  }
}(Pard || {}))
