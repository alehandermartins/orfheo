'use strict';

(function(ns){

  ns.langs = ns.langs || {}

  ns.langs.ca = {
    ﻿dictionary: {
      accept: 'accepta',
      address: 'adreça',
      amend: 'esmena',
      artist: "artista",
      artists: "artistes",
      audience: 'audiència',
      audios: 'àudios',
      availability: 'disponibilitat',
      cache: 'caché',
      cancel: 'cancel·la',
      category: 'categòria',
      close: 'tanca',
      collaborators:'col·laboradors',
      comments: 'comentaris',
      confirm: 'confirma',
      confirmed: 'confirmat',
      copy: 'còpia',
      day: 'dia',
      description: 'descripció',
      delete: 'elimina',
      duration: 'duració',
      email: 'correu',
      first: "primera",
      images: 'imàtgens',
      latitude: 'latitud',
      last: "última",
      longitude: 'longitud',
      modify: 'modifica',
      name: 'nom',
      next: "següent",
      no: 'no',
      organization: "organització",
      organizations: "organitzacions",
      permanent: 'permanent',
      phone: 'telèfon',
      previous: "anterior",
      profile: 'perfil',
      program: 'programa',
      schedule: 'horari',
      search: 'busca',
      send: 'envia',
      short_description: 'descripció breu',
      space: "espai",
      spaces:'espais',
      sponsors:'patrocinadors',
      promotors: 'promotors',
      table: 'taula',
      title: 'títol',
      type: 'tipus',
      videos: 'videos',
      yes: 'sí'
    },
    categories:{
      cultural_ass: 'Espai Cultural',
      commercial: 'Local Comercial',
      home: 'Espai Particular',
      open_air: 'Espai Exterior',
      festival:'Festival',
      association:'Associació',
      ngo:'ONG',
      collective:'Col·lectiu',
      interprise:'Empresa',
      institution:'Institució',
      federation: 'Federació',
      foundation:'Fundació',
      music:'Música',
      arts: 'Arts Escèniques',
      expo: 'Exposició',
      poetry: 'Poesia',
      audiovisual: 'Audiovisual',
      street_art: 'Art de carrer',
      workshop: 'Taller',
      other: 'Altres',
      gastronomy: 'Gastronomia'
    },
    popup:{
      delete:{
        title:'Estàs segur/a?',
        user: "Confirmat, totes les teus dades seran eliminades d'orfheo: es cancel·laran tots els teus perfils i els seus contiguts.",
        profile: 'Confirmant, el teu perfil serà eliminat i tots els continguts corresponents. Tot i això, no es cancel·laran les propostes enviades a convocatòries.',
        confirm:'Confirma',
        cancel: 'Anul·la',
        production:"Confirmant, el teu proyecte artístic s'eliminarà del teu perfil. Eixa acció no afectarà a la teua inscripció en convocatòries."
      },
      modifypasswd:{
        title:'Introdueix una nova contrasenya',
        password:'Contrasenya',
        passwordConf: 'Confirma la teua contrasenya',
        notequal: 'Les contrasenyes no coincideixen.',
        tooshort:'La contrasenya ha de tindre al menys 8 caràcters.',
        check:'Comprova bé que les contrasenyes siguen iguals i tinguen un mínim de 8 caràcters',
        success: 'Contrasenya canviada.'
      },
      recover:{
        title: 'Recupera el teu compte',
        submit: 'Enviar'
      },
      termsAndConditions:{
        title: 'Condicions generals',
        date:'Última actualització: Febrer 2017',
        part1:"<p> <strong>Et donem la benvinguda!</strong></p><p> <strong>Orfheo es basa en un principi: podem fer més coses junts que per separat.</strong></p><p>Són les persones com tu les que fan possible que aquest lloc no només existisca, sinó que també creixca i prospere. </br> Aquestes condicions generals d'us expliquen el servei i la relació entre els usuaris, els drets i les responsabilitats recíproques. </p><p> <strong> Ser part d'orfheo és gratuït </strong> i al fer-ho estàs acceptant aquestes condicions generals.</p>",
        subtitle2: 'Principis generals:',
        subtitle3:"Ens compromete'm a:",
        mex3: "<p><ul><li>Descriure com es pot usar i/o compartir la teua informació en aquestes condicions generals. </li><li> Usar les mesures raonables per tal de mantidre la teua informació sensible segura. </li><li> Fer disponible i deixar fluir en la comunitat la informació que decideixques compartir.  </li><li> Impulsar valors com la solidaritat, el sentit de comunitat, la transversalitat, la equidat, el respecte i la harmonia amb l'entorn.  </li><li> Respectar i defendre la comunitat d'orfheo. </li><li> Escoltar i acollir qualsevol tipus de sugerència o crítica constructiva. </li></ul></p>",
        subtitle4: "Termes d'us i Privacitat:",
        mex4: "<p>Ací t'expliquem com recolectem i compartim la teua informació personal/dades/continguts.<ul><li>Recolectem molt poca informació personal de tu. </li> <li> No lloguem ni venem la teua informació a tercers, es a dir que no compartim les teues dades amb terceres parts per motius comercials.  </li> <li>  Cap la possibilitat que la informació recollida en orfheo es compartixca amb tercers d'acuerd amb la nostra ideologia, sempre complint amb la ley i amb la intenció de portar benefici a tota la comunitat. </li><li> Ets responsable dels continguts que comparteixes i de les seus mesures de privacitat.  </li> <li> Ocasionalment t'enviarem correus electrònics sobre informació important. </li> <li>  La qualitat de les dades que ens proporciones és útil per a tú, per a que pugam millorar la teua experiència com a usuari i poder desenvolupar noves funcions. </li><li> Tot allò que publiques en orfheo és públic, pot ser vist i de fet utilitzat per tot observador extern. </li><li> És possible que en algun moment et demanem contestar alguna enquesta a manera de retroalimentació, però mai estaràs obligat a participar en aquestes. </li><li> No necessites crear una compte per explorar i visualitzar qualsevol dels continguts. </li> <li> Per crear una compte, necessites donar-nos només la teua adreça de correu electrònic. </li><li> Quasevol persona pot unir-se i abandonar orfheo en qualsevol moment.</li> </ul></p>",
        subtitle5:'Publicitat:',
        mex5: "<p>A hores d'ara no hi ha cap forma de publicitat dins d'orfheo. En un futur, no es descarta la presència de publicitat no molesta, relacionada amb el món artístic-cultural, que puga proporcionar informació útil i valuosa per a els ciudatans. Considerem que la publicitat pot ser eficaz sense ser molesta. Excloem la possibilitat de comptar amb publicitat en forma de finestres emergents que puguen interferir amb la visualització dels continguts d'orfheo. </p>",
        subtitle5_5:'Sostenibilitat del projecte:',
        mex5_5:"<p>Com hem promés, ser part d'orfheo no té i no tindrá cap cost per cap usuari. Malgrat això, el mantenimient online d'una web d'aquest tipus té un cost, axí com la sostenibilitat de la vida de les persones que treballen diariament en ell. Per tant, llançar una convocatòria i poder accedir la corresponent eina de gestió té un preu, segons el tipus d'event que es vol organitzar.</p>",
        cookies: 'Política de cookies:',
        cookiesMex1: "Les cookies són un element informàtic ampliament usat en internet. En accedir a una pàgina web, alguna informació s'emmagatzema en la memòria del navegador per que la pàgina web puga accedir ràpidament a ixa informació en el futur.",
        cookiesMex2: "orfheo utilitza cookies amb l'únic fi de millorar la experiència de navegació de sus usuaris. Por ejemplo, guardamos informació para permitir un login més rápido i continuado, evitar la desconnexió de la web en caso de reinici del servidor, i recordar preferències o eleccions durant tot el proceso de navegació.",
        cookiesMex3:"En general, per com s'estructura internet hui en dia, les cookies són un element imprescindible. Por ley, toda web que les utiliza, está obligada a avisar els seus usuaris perquè sàpiguen el que està passant.",
        cookiesMex4: "La mateixa informació ací mostrada es troba també disponible en l'apartat de condicions d'us. En cas de modificació s'avisarà a els ciudatans d'orfheo amb prou d'antelació.",
        subtitle6: 'Actualitzacions:',
        mex6: "Ens reservem el dret de modificar, si fora necessari, les condicions generals per adaptar-les a futures novetats i assumim el deure i el compromís d'informar dels canvis a tots els ciudatans d'orfheo, per tal que puguen conèixer les actualitzacions de bestreta.",
        subtitle7: 'Moltes gràcies!',
        finalMex: "<p> Si tens preguntes o sugerències envia un correu electrònic a <a href='mailto:info@orfheo.org'> info@orfheo.org</a>.</p> <p> Gràcies per llegir fins ací. Esperem que gaudixques dins i fora orfheo. </br> La teua participació al crear, mantindre i millorar aquest lloc és imprescindible. </p> <p> Apreciem que hages pres el teu temps per informar-te sobre el projecte, i t'agraïm que dones suport. Mitjançant el que fas, estàs ajudant a construir una cosa realment important, no només una connexió de projectes compartits de manera col·laborativa, sinó també una vibrant comunitat enfocada en una molt noble meta. </p>"
      },
      noMapLocation:{
        title: 'Atenció!',
        mex: "Google no reconeix l'adreça que has inserit i per tant no pot ser localitzada en cap mapa.",
        fix:"Corregeix l'adreça",
        ok:'Continua igualment'
      }
    },
    widget:{
      gmap:{
        viewOnGoogle:'Veure en Google Maps'
      },
      search:{
        placeholder:'Busca per tags',
        noResults: 'Cap resultat'
      },
      uploadPhoto:{
        btn: 'Puja una imatge',
        tooBigError: 'El tamany de les imatges no pot ser superior a 500Kb. Pots reduir-ho en un moment utilitzant, entre altres,  <a href = "http://optimizilla.com/es/"  target="_blank">aquesta web</a>.',
        max5: 'Màxim cinc imàtgens.',
        max1:'Màxim una imatge.',
        max4: 'Màxim quatre imatges.',
        acceptedFormat: 'Formats acceptats: .gif, .jpeg, .jpg, .png'
      },
      uploadPDF:{
        btn: 'Puja un document',
        tooBigError: 'El tamany del document no pot ser superior a 1Mb. Pots reduir-ho en un moment utilitzant, entre altres,  <a href = "http://optimizilla.com/es/"  target="_blank">aquesta web</a>.',
        max1:'Màxim un document.',
        acceptedFormat: 'Formats acceptats: .pdf'
      },
      availability:{
        placeholder: "Selecciona una o més opcions",
        selectAllText: "Selecciona tot",
        allSelected: "Disponible tots els dies"
      },
      inputName:{
        unavailable: 'Aquest nom de perfil ja existeix. Tria una altre per poder continuar.'
      },
      inputTel:{
        show:'Mostra en la meua pàgina de perfil',
        label: "Telèfon de contacte",
        helptext: "Aquesta informació és necessària per a un eventual contacte per part de l'organització.",
        modify: 'Pots canviar el nombre des de la pàgina de perfil'
      },
      inputCache:{
        show: 'Mostra aquesta informació en la pàgina de la proposta'
      },
      inputWeb:{
        placeholder: "Còpia i enganxa ací l'enllaç corresponent i pica al botó per validar"
      },
      inputAddressArtist:{
        city:'Ciutat*',
        postalCode:'Codi postal*',
        neighborhood:'Barri (opcional)'
      },
      inputChildren:{
        all_public:'Tots els públics',
        baby:'Infantil',
        family:"Familiar",
        young: "Juvenil",
        adults: "Adults"
      },
      inputAddressSpace:{
        street: 'Carrer',
        number: 'Número',
        city:'Ciutat',
        postalCode:'Codi postal',
        door:'Pis / Porta',
        state: 'País',
        warning:"Atenció! Google no reconeix l'adreça inserida: corregeix-la, si vols que siga localitzada correctament.",
        insertGeo:'Si la localització no està correcta, insereix manualment les teus coordenades geogràfiques i guarda-les punjant ',
        insertGeoBtn:'ací'
      },
      multimediaManager:{
        btn: 'Modifica o crea un nou',
        title: 'Gestiona els teus continguts multimèdia',
        mex:'Pots afegir:',
        videoList:'<strong>videos</strong> des de:  youtube, vimeo, vine, facebook',
        imageList:'<strong>imàtgens</strong> des de: tu ordinador, instagram, flickr, pinterest, twitter, facebook',
        audioList: '<strong>audios</strong> des de: soundcloud, bandcamp, spotify',
        photoL:'Puja imatges des del teu ordinador (màxim 4, tamany inferior a 500kb)'
      },
      multipleSelector:{
        placeholder: "Selecciona una o més opcions",
        selectAll: "Selecciona tot",
        alwaysAv: "Disponible tots els dies"
      },
      inputMultimedia:{
        placeholder:"Còpia i enganxa ací l'enllaç/codi corresponent i punja al botó per validar",
        invalid:'Entrada no vàlida',
        acepted:'Entrades acceptades',
        popup:{
          title:'Com afegir...',
          item1:'...una imatge des de <strong>flickr, instagram, pinterest</strong> (un pin) o un video des de <strong>youtube, vimeo, vine</strong> o un audio des de <strong>soundcloud</strong>:',
          sublist1_1:'obri la imatge, video o audio en el lloc web corresponent',
          sublist1_2:'còpia el seu enllaç directamet des del navegador o des de la opció "compartir" (o "copiar enllaç")',
          sublist1_3:"enganxa en el camp del formulari d'orfheo",
          sublist1_4:'punja al botó per validar',
          itemTwitter:'...una imatge des de <strong>twitter</strong> (un tweet):',
          sublistTwitter_1:'punja el tweet que quieres compartir',
          sublistTwitter_2:"en el popup que s'obri, punja la icona amb els tres puntets",
          sublistTwitter_3:'selecciona "Copiar enllaç del tweeet"',
          sublistTwitter_4:"còpia l'enllaç i enganxa'l en el camp del formulari d'orfheo",
          sublistTwitter_5:'punja al botó per validar',
          item2:'...una imatge, un post o un video publicat en <strong>facebook</strong>:',
          sublist2_1:"punja la data amb l'hora de publicació que apareix en la part superior del post",
          sublist2_2:"còpia des del navegador l'enllaç de la pàgina que s'obri",
          sublist2_3:"enganxa'l en el camp del formulari d'orfheo",
          sublist2_4:'punja al botó per validar',
          item3: '...un audio des de <strong>bandcamp</strong>:',
          sublist3_1:'en la pàgina de la cançó punja en "Share/Embed" (baix la foto principal) i aleshores en "Embed this album"',
          sublist3_2:'selecciona un estil del lector musical',
          sublist3_3:'còpia el codi html des del camp Embed que apareix en el cantó superior esquerre',
          sublist3_4: "enganxa en el camp del formulari d'orfheo",
          sublist3_5: 'punja en el botó per validar',
          item4: '...un audio des de <strong>spotify</strong>:',
          sublist4_1: "selecciona una cançó d'una playlist amb el botó dret del ratolí",
          sublist4_2: 'punja en "Copy Song Link"',
          sublist4_3:"enganxa el contingut copiat en el formulari d'orfheo",
          sublist4_4:'punja al botó per validar',
          finalMex: "Finalment, considera que només es poden importar a orfheo continguts multimèdia declarats públics en la web a on s'han pujat."
        }
      }
    },
    createProfile:{
      text: 'Crea un perfil',
      artistText:'Mostra el teu portfolio <br> i participa en grans events',
      spaceText: "Allotja art i posiciona't en el mapa cultural",
      organizationText: 'Dóna a conèixer el teu projecte i llança convocatòries',
      introA: 'Aquesta informació es mostrarà en la teua pàgina de perfil, podràs modificar-la i et permetrà donar-te a conèixer.',
      introS: 'Aquesta informació es mostrarà en la pàgina de perfil del teu espai i podràs modificar-la.',
      introO: 'Aquesta informació es mostrarà en la pàgina de perfil i podràs modificar-la.',
      submit: 'Crea',
      artistForm:{
        nameL: "Nom artístic",
        nameH: "És el nom del teu perfil d'artista.",
        photoL:"Foto de perfil (màxim 500kb)",
        bioL: "Biografia / Informació",
        bioH: "Qualsevol cosa que vullgues compartir sobre la teua vida artística-cultural.",
        addressL: "Ciutat i codi postal",
        addressH: "Indicar la teua ciutat i codi postal farà més fàcil localitzar-te per un possible contacte.",
        phoneL:"Número de telèfon",
        webL:"Web personal i enllaços a xarxes socials",
        webH: "Pots afegir enllaços a la teua web o blogs personals i als teus perfils en xarxes socials (les fotos i videos es gestionen conjuntament amb la teua proposta artística).",
        colorL: "Tria un color",
        colorH:"És el color personal del teu perfil!"
      },
      spaceForm:{
        nameL:"Nom de l'espai",
        nameH:"És el nom del teu perfil de espai.",
        addressL:"adreça",
        addressPlaceholder: 'Exemple: Carrer de la Murta 13, València',
        catL: "Tipus d'espai",
        catPlaceholder:'Selecciona',
        bioL:"Descripció / Informació",
        bioPlaceholder:'Dimensions, característiques, activitats que sol allotjar, etc.',
        bioH: "Qualsevol cosa que vulgues compartir del teu espai.",
        phoneL: "Número de telèfon",
        webL: "Web personal i enllaços a xarxes socials",
        webH: "Pots afegir enllaços tant a les teues webs o blogs personals com als teus perfils en xarxes socials.",
        linksL: 'Materials online',
        linksH:'Afegeix videos, fotos i audios des de les teues xarxes socials.',
        photoL:"Fotos de l'espai (màxim 5, tamany inferior a 500kb)",
        photoH: "La primera foto serà la teua foto de perfil.",
        colorL: "Tria un color",
        colorH: "És el color personal del teu perfil!"
      },
      organizationForm:{
        nameL: "Nom de la organització",
        nameH: "És el nom del teu perfil organització.",
        catL: "Tipus d'organització",
        catPlaceholder:'Selecciona',
        addressL:"Adreça de la sèu de l'organització",
        bioL: "Informació / projecte",
        bioH: "Qualsevol cosa que vulgues contar de l'organització.",
        photoL: "Fotos de l'organització / seu (màxim 5, tamany inferior a 500kb)"
      }
    },
    modifyProfile:{
      title: 'Modifica el teu perfil',
      delete: 'Elimina el perfil',
    },
    proposal:{
      delete: 'Elimina esta proposta',
      deleteAlert: 'Confirmant, la teua proposta serà retirada de la convocatòria del %{event}.',
      deleteOk: 'La teua sol·licitud de participació ha sigut cancel·lada correctament',
      amend: 'Esmeda enviada correctament',
      signedUp: 'Inscrit en ',
      sentForm: 'Formulari enviat',
      sentBy: 'Proposta enviada per',
      terms: 'bases de participació',
      termsOk: 'Has acceptat les %{link} del %{event}',
      amend:{
        title: 'Esmena enviada:',
        helper: 'No es permiteix modificar el formulari enviat, però, en cas de que ho necessites, pots enviar una modificació abans del tancamente de la convocatòria',
        placeholder: 'Escriu ací el missatge que vols enviar',
        modify: 'Modifica Esmena'
      },
      form:{
        category: '(formulari: %{category})',
        door: 'porta/pis',
        multimedia: 'Multimèdia:',
        seeContents: ' veure continguts enviats',
        duration: 'Duració (si cal)',
        cache: 'Caché / Despeses producció',
        nameL:"Nom",
        emailL:"Correu",
        addressL:"Adreça",
        bioL:"Descripció / Informació",
      }
    },
    production:{
      createTitle: 'Crea una proposta artística',
      createOk: 'Contingut creat correctament',
      form:{
        titleL: "Títol de la proposta artística",
        descriptionL: 'Descripció',
        descriptionH: 'Decriu amb més detalls la teua proposta artística.',
        short_descriptionL:'Descripció (molt) breu',
        short_descriptionH:'Resumeix la teua proposta artística en un màxim de 80 caràcters. Resten:',
        durationL: "Duració *",
        childrenL:"Audiència",
        childrenH: "Indicar a quin tipus de públic està dirigida la proposta.",
        linksL:"Materials online",
        linksH: "Afegeix videos, fotos o audios des de les teues xarxes socials. Aquest material permitirà donar a conèixer el teu art millor.",
        photoL: "Fotos del teu art (màxim 4, tamany inferior a 500kb)",
        cacheL:"Caché / Despeses Producció",
        noDefinedDuration:"No té duració definida",
        catSel:'Selecciona una categoria *',
        submit: 'Crea'
      },
      modify:{
        title: 'Modifica el teu projecte artístic',
        cat:'Categoria',
        initMex: 'Amb aquest formulari pots modificar els continguts del teu projecte artístic. Els canvis que fages no afectaran les dades enviades a convocatòries.',
        delete: 'Elimina aquest projecte artístic'
      }
    },
    signUp:{
      btn:'Uneix-te',
      success: 'Hem enviat per correu un enllaç per activar el teu compte.',
      popup:{
        title: 'Comença creant un compte...',
        email:'Correu electrònic',
        passwd:'Contrasenya',
        insertEmail:'El teu correu',
        confirmEmail:'Confirma el teu correu',
        tooshort: 'La contrasenya ha de tindre al menys 8 caràcters.',
        notequal:'Els camps de correu no coincideixen.',
        format: 'El correu ha de tindre un format vàlid.',
        submit:'Crea un compte',
        mex: '...fer-ho,  per suposat,  <strong>és lliure i gratuït :) </strong>',
        conditions: 'condicions generals',
        conditionText:"En crear un compte, confirmes que estàs d'acord amb nostres ",
        length: 'Mínimo 8 caràcters'
      }
    },
    login:{
      dropdown:{
        recover:'Has oblidat la contrasenya?',
        email:'El teu email',
        passwd:'Contrasenya',
        gobtn:'Entra',
        rememberme:"Recorda'm"
      },
      popup:{
        notValidated: 'Usuari no valitat',
        notValidatedmex: "En registrar-te, t'enviem un correu electrònic amb un enllaç per activar el teu compte. Controla també en la carpeta de spam...",
        sendOther:"...o torna a escriure ací el teu correu, i t'enviem un altre.",
        okbtn:'Enviar',
        notValidEmail:'El email no és vàlid',
        sent: 'Hem enviat un correu amb les instruccions per accedir el teu compte.',
        nouser:"L'usuari no existeix.",
        notExisting: 'No existeix cap usuari associat amb aquest correu!',
        registerbtn:"Registra't",
        registerTitle: "Registra't per continuar"
      },
      eventPage:{
        nouser: 'Si no tens un compte:',
        signUp: 'Crea un compte',
        signUpTitle:  'Crea un compte...',
        loginTitle: 'Per a apuntar-te necessites fer login'
      }
    },
    call:{
      initText:'Aquesta convocatòria és per a perfils de tipus <strong>%{types}</strong>',
      chooseProfile: 'Inscriu un perfil existent...',
      newProfile: '...o crea i inscriu de nou',
      createProfile:{
        title:"Crea un perfil i apunta't como a:",
        artistText: 'Mostra el teu art i construeix el teu portfoli: sigues protagonista en grans events',
        spaceText: "Allotja i proposa activitats: posicióna't en el mapa cultural",
        organizationText: 'Ofereix el teu espai i envia propostes: crea xarxa donant a conèixer el teu projecte'
      },
      successTitle: 'Genial!',
      succesMex:"T'has inscrit correctament.",
      sendOther: 'Envia una altra proposta',
      toProfile: 'Vés a la pàgina de perfil',
      alreadyInscribed: {
        title: "Ja t'has inscrit com a espai :)",
        mex: "Si vols, pots enviar propostes per actuar durant l'event.",
      },
      stop:{
        title: 'ATENCIÓ, NO POTS CONTINUAR',
        mex1:'Aquesta convocatòria és només per a perfils de<strong>',
        mex2:'</strong>. Selecciona o crea un dels tipus acceptats per continuar.'
      },
      form:{
        initMex:'Ompli aquest <strong>formulari</strong> per inscriure el teu perfil %{link} en la convocatòria de <strong>%{organizer}</strong>',
        portfolio:"Apunta't amb una proposta del teu portfoli",
        catPlaceholder: 'Selecciona com vols apuntar-te',
        newProposal: '...o proposa una cosa nova',
        chooseHow: 'Pots participar tant allotjant com proposant activitats:',
        stagebtn:'Ofereix el teu espai',
        perfomerbtn: 'Proposa el teu art',
        partI:'PART I: Aquesta informació es quedarà en el teu <strong>portfolio</strong> i es mostrarà en el teu perfil',
        partII: 'PART II: Només els organitzadors tindran accés a les següents dades',
        initSpace: 'Només els organitzadors tindran accés a les següents dades',
        finalMex: "ATENCIÓ: Una vegada enviat, <strong>no et serà permés modificar</strong> el contingut d'aquest formulari, únicament podràs enviar una correcció. Per tant, per favor, repassa bé tots els camps abans de punjar el botó 'Envia'.",
        sendbtn:'Envia'
      }
    },
    footer:{
      languages:{
        es: 'Español',
        ca: 'Valencià',
        en: 'English'
      },
      project: 'projecte',
      contact: 'Contacta',
      services:'Serveis',
      conditions: 'Condicions'
    },
    header:{
      events:'Events',
      profiles:'Perfils',
      news:'Novetats',
      callToAction: 'Llança la teua convocatòria',
      home: 'Inici',
      insideDropdown:{
        delete: 'Esborra el meu compte',
        modifypasswd:'Modifica contrasenya',
        logout:'Tanca sessió',
        contact:'Contacta orfheo',
        event:'Event'
      }
    },
     welcome: {
      profilesSection: {
        title: "La teua comunitat cultural et crida<br>Entra en orfheo com:",
        artist: "Comparteix el teu art,<br>apunta't en convocatòries,<br>genera xarxa, descobreix, crea.",
        space: "Trau el màxim partit al teu espai,<br>allotja events artístics,<br>obri les portes a la cultura.",
        organization: "Dóna a conèixer el teu projecte,<br>llança convocatòries,<br>expandeix la teua comunitat.",
        create: "Crea un perfil"
      },
      networkSection: {
        title: 'Crea en xarxa amb la teua comunitat cultural',
        subtitle1: 'Ací i ara',
        subtitle2: 'Pren el control',
        subtitle3: 'Fes-ho',
        section1: "Descobreix projectes i deixa't </br> conèixer per el que fas.",
        section2: 'Involucra a la comunitat, </br> llança la teua convocatòria.',
        section3: 'Crea experiències inoblidables conjuntament amb els demés.',
        link: 'Explora les avantatges de llançar la teua convocatòria en orfheo'
      },
      inspireSection: {
        title: 'El futur que volem està ací',
        section: 'Alguna vegada ho has imaginat, però ara és realitat. <br> Tens al teu abast un univers de noves, <br>grans posibilitats culturals.',
        link: "Deixa't inspirar"
      },
      servicesSection: {
        logo: 'R e c u r s o s',
        subtitle1: 'e-Manager',
        subtitle2: 'Assessoria',
        subtitle3: 'API',
        section1: 'Crea un event,</br> llança una convocatòria, </br>utilitza l\'eina de gestió </br>i publica una programació interactiva.',
        section2: 'Trau el millor del teu projecte,</br> alimenta la teua comunitat </br>i explora noves estratègies creatives durant el procés.',
        section3: 'Reenvia les dades del teu event a la teua pàgina web o aplicació mòbil i utilitza-los sempre actualizats com millor et convinga.',
        link: 'Descobreix més'
      }
    },

    eventsTab:{
      organizer: 'Organitza: ',
      announcing: 'Obertura convocatòria: %{date}',
      opened: 'Convocatòria oberta',
      closed: 'Convocatòria tancada',
      finished: 'event tancat',
      until: ' fins el %{date}',
      onlineProgram: 'Programació online!',
      contact: "Contacta'ns per crear el teu event"
    },
    contact: {
      logo: 'C o n t a c t a',
      servicesTab: {
        tab: 'Serveis',
        title: "Què t'ofereix orfheo?",
        mex1: 'Les posibilitats que oferim es centren principalment en recolçar, impulsar i facilitar la creació, difusió i <strong> gestió de processos i grans events participatius</strong>. Específicament, amb orfheo pots aprofitar els següents serveis:',
        subtitle2: 'e-Manager:',
        mex2: "Una potent eina web innovativa que et permet llançar la teua convocatòria i gestionar totes les dades relatives amb extrema facilitat i simplicitat.",
        subtitle3: 'Assessoria:',
        mex3: "L'equip d'orfheo compta amb professionals amb molta experiència en la organització i gestió de grans events participatius.",
        subtitle4: 'API:',
        mex4: "El servei API et permet rebre i utiliztar les dades relatives als teus events i convocatòries en la teua aplicació per a mòbils o espai web.",
        mex5: "Per més informació, consulta nostra %{link} i contacta'ns mitjançant el següent formulari:",
        servicesPage: 'pàgina de serveis'
      },
      techTab:{
        tab: 'Suport tècnic',
        title: 'Com podem ajudar-te?',
        mex1: 'Estem ací per proporcionar-te ajuda tècnica, consells, respondre a les teus preguntes o donar-te informació útil quan més ho necessites.',
        mex2: 'Et contestem de seguida.'
      },
      feedBackTab:{
        tab: 'Feedback',
        title: 'Què et sembla orfheo?',
        mex1: "Per millorar és necessari posar-se en joc i ser questionats. Estariem encantats de saber que penses d'orfheo, quines funcionalitats li manquen i t'agradaria tindre al teu abast, quines coses cambiaries, llevaries o afegiries...",
        mex2: 'Qualsevol crítica constructiva és benvinguda, ens ajudarà a proporcionar-te un servei millor.',
        mex3: 'La teua opinió és important!'
      },
      collaborateTab:{
        tab: 'Col·labora',
        title: 'Vols formar part?',
        mex1: "Ens agradaria compartir coneixements i seguir desenvolupant aquest projecte perquè tots els ciudatans d'orfheo puguen sempre gaudir de la comunitat i para donar la posibilitat de utilizar esta herramienta a totes les persones que lo deseen.",
        mex2: 'Pensem que la inclusió inspira la innovació i per tant sempre estem oberts a escoltar idees per col·laborar.',
        mex3: "Contacta'ns a ",
        mex4: 'Hi ha moltes formes de col·laborar en orfheo:',
        mex5: 'com a partner: </br>si tens un negoci i com nosaltres creus que podem fer més coses junts que per separat, no dubtes a enviar-nos la teua proposta de aliança.',
        mex6: 'com a a patrocinador: </br>gràcies a tu, que vols invertir i/o col·laborar mitjançant publicitat i patrocini, podem oferir la posibilitat de ajudar econòmicament els projectes de la comunitat orfheo.',
        mex7: "com a treballador:</br>traballa en orfheo com a creatiu, artista, disenyador, programador, community manager, gestor administratiu o comercial. Envía'ns informació sobre tu.",
        mex8: "com a mecenas: </br>recolça de forma generosa una realitat, perquè creus en ella. Recolçar orfheo significa ser part d'un projecte amb el potencial de millorar nostre món.",
        mex9: "com a voluntari: </br>contacta'ns si vols aprender mitjançant el desenvolupament d'orfheo o, si ja tens coneixements, t'estimula oferir el teu temps a una noble causa."
      },
      contactTab:{
        tab: 'Contacte',
        title: 'Ací estem!',
        country: 'Espanya'
      },
      eventContact:{
        title: 'Els teus events en orfheo',
        mex1: "Per crear un event o per més informació, contacta'ns mitjançant el següent formulari:",
        mex2: "Crear un event en orfheo et permetrà llançar <strong>la teua convocatòria</strong> en la comunitat i accedir a la corresponent <strong>eina de gestió</strong> que t'acompanyarà fins la publicació de <strong>el teu programa interactiu</strong> (més informació en nostra %{link})."
      },
      contactUs: {
        title: 'Contacta orfheo',
        mex1: 'Estem sempre disponibles per proporcionar-te ajuda tècnica, consells, respondre a les teues preguntes o donar-te informació útil quan més ho necessites.',
        mex2: "Envia'ns un missatge, te contestarem de seguida :)"
      },
      forms: {
        name: 'Nom*',
        email: 'Email*',
        phone: 'Número de telèfon',
        subject: 'Assumpte',
        links: 'Enllaç a web/xarxes socials del teu projecte',
        call_me: 'Vull ser contactat per telèfon',
        hangout_me: 'Vull una cita per Hangout/Skype',
        mex: 'Missatge*',
        days: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'],
        daysPlaceholder: "Selecciona la teua disponibilitat durant la setmana",
        everyday: "Tots els dies",
        always: "Disponible tots els dies",
        periods: ['Matí', 'Vesprada'],
        periodsPlaceholder: "Selecciona la teua disponibilitat durant el dia",
        everyperiod: "Matí i vesprada",
        anytime: "Disponible matí i vesprada",
        profileName: 'Nom del teu perfil en orfheo'
      },
      send: 'Envia',
      correct: 'Missatge enviat correctament. ',
      thanks: '<br>Gràcies per contactar amb nosaltres.<br> Et contestarem prompte :)',
      thankFeedback: 'Gràcies per la teua opinió :)',
      noSend: 'Missatge no enviat:'
    },
    project:{
      baseline: 'Es poden fer més coses junts que per separat ',
      mex1: "<p> Benvingut/Benvinguda a orfheo: </p> <p>Una xarxa social diferent, el reflex de comunitats actives i la resposta pràctica als requeriments d'una cultura que s'obri a la participació.</p><p> Orfheo és una plataforma per a artistes, actors culturals, creatius i treballadors de la cultura, que han descobert que és possible eixir dels espais convencionals d'exhibició per a viure experiències artístiques d'infinites formes. </p> <p> Esta web està composta per múltiples funcionalitats, no sols capaços de facilitar el treball d'organització i gestió de convocatòries, sinó de donar valor a les idees des del seu inici fins a la seua realització. Oferix ferramentes per a emmagatzemar, organitzar i publicar les dades de qualsevol projecte, fent que les formes de vida basades en relacions de col·laboració siguen possibles en l'ecosistema cultural. Fa disponible una font de recursos compartits i autogestionats, creats per tots i totes, de accés universal i inclusiu.</p>",
      more: 'Llegir més...',
      subtitle: "La visió i missió d'orfheo es basa en els pilars següents:",
      list1: "<p>COMPARTIR <ul><li>Compartim les nostres idees i inspiracions, perquè saber més dels altres significa aprendre uns d'altres. </li> <li> Compartim el nostre valor, on: valor = (experiències + coneixements) x actitud. </li> <li> Decidim i construïm col·laborativament. </li> </ul></p>",
      list2: "<p>IDENTITAT <ul><li>Creiem que cada persona és quelcom únic. </li> <li> Exercim un paper actiu en el desenrotllament d'un món més lliure i inclusiu, que es crega gràcies a l'esforç col·lectiu. </li> </ul></p>",
      list3: "<p>INFORMACIÓ <ul><li>Pretenem fer disponible la informació en la major quantitat d'idiomes possibles.  </li> <li> Volem que tingues accés en qualsevol lloc i en qualsevol moment. </li> </ul></p>",
      list4: "<p>EXPERIÈNCIA <ul><li>Volem donar la millor experiència possible als usuaris, de manera que utilitzen els recursos d'orfheo només el temps necessari, per a aplicar-los en la vida quotidiana. </li> <li> Pretenem continuar desenrotllant una interfície i una estètica neta, clara i senzilla, pròxima per a tots i totes. </li> </ul></p>",
      list5: "<p>MODEL <ul><li>Aspirem a aplicar un model d'economia sostenible, on tots i totes podem disfrutar dels recursos compartits, sense oblidar la seua rendibilitat en el temps. És per això, que ser part de la comunitat és totalment gratuït, però a l'accés a les ferramentes de gestió suposa un import mínim.  </li> <li>Ens plantegem objectius aparentment inabastables, perquè estem convençuts de que al llarg del camí arribarem a obtindre resultats, potser diferents dels esperats, però sens dubte valuós.</li></ul></p>",
      list7: "<p>OBJECTIU <ul><li>Incentivem la cultura participativa a través d'atorgar noves oportunitats i ferramentes dedicades a construir i millorar les relacions de col·laboració, utilitzant les possibilitats de les noves tecnologies per a viure i fer realitat la cultura transversal i inclusiva que volem. </li> </ul></p>"
    },
    manager:{
      title: 'Gestiona',
      toEvent: 'pàgina event',
      export: 'Exporta taula',
      zeroRecords: "Cap resultat",
      infoEmpty: "Cap informació disponible",
      export: 'Exporta taula',
      copy:{
        helper: 'Crea i còpia llista de correus',
        table: 'Còpia taula',
        keys: '<i>ctrl</i> o <i>\u2318</i> + <i>C</i> per copiar les dades de la taula al teu portapapers. <br><br>Para anul·lar, fes click en aquest missatge o pica Esc.',
        success: '<strong>Copiades %d files</strong> de dades al portapapers',
        success1: '<strong>Copiada 1 fila</strong> de dades al portapapers',
        results: ' Resultats per pàgina _MENU_',
        artistEmails: 'Email artistes',
        spaceEmails: 'Email espais',
        allEmails: 'Email artist. i esp.',
        title: 'Còpia correus',
        mex1: '<strong>Copiats %{amount} contactes </strong> de correu al portapapers',
        mex2: '(<strong><i>Ctrl+V</i></strong> per enganxar)'
      },
      program:{
        tab: 'Programa',
        chain: 'Encadena els canvis',
        unchain: 'Desencadena els canvis',
        menu: {
          helper: 'Menú de eines',
          artistsnoProgram: 'Propostes sense programa',
          spacesnoProgram: 'Espais sense programa',
          orderSpaces: 'Ordena espais',
          orderby: 'Ordena per:'
        },
        publish: 'Publica el programa',
        publishmex: "El programa s'ha publicat correctament en la pàgina del teu event",
        unpublish: 'Retira el programa',
        unpublishmex: "El programa s'ha retirat de la pàgina del teu event",
        manageTool: 'Eines de gestió',
        chronoOrder: 'Ordena cronològicament',
        artistCat: 'Categoria art.',
        spaceCat: 'Categoria esp.',
        spaceNum: 'Núm. esp.',
        artistEmail: 'Email artista',
        spaceEmail: 'Email espai',
        punctuals: 'puntuals',
        permanents: 'permanents'
      },
      proposals: {
        tab: 'Propostes',
        addAnother: 'Afegeix una altra proposta a un participant que ja has creat',
        addArtist: 'Crea i afegeix una proposta de tipus artista',
        addSpace: 'Crea i afegeix una proposta de tipus espai',
        orNew: '...o crea algo nou',
        byName: "Selecciona per nom",
        selectCat: "Selecciona la categoria de la proposta",
        phoneL: "Telèfon de contacte",
        showFields: 'Mostra tots els campos',
        modifyNote1: 'Aquesta informació, així com el nom, pot ser modificada només pel seu propietari, des de la pàgina de perfil.',
        modifyNote2: "Aquesta informació, així com el nom i el email, es pot canviar modificant qualsevol proposta d'aquest artista que has creat.",
        allProposals: 'Totes les propostes',
        artistProposals: 'Propostes artístiques',
        spaceProposals: "Propostes d'espais",
        eventCat: "Categoria en l'event",
        hideShowCol: {
          helper: 'Mostra/Amaga columnas',
          selectAll: "Selecciona tot",
          unselect: 'Desmarca tot',
          initial: 'Configuració incial'
        },
        created: 'creades',
        received: 'rebudes',
        createOk: 'Propostes creada correctament',
        createTitle: 'Crea una proposta (%{type})',
        deleteNote: "Al eliminar la proposta, s'enviarà de forma automàtica una notificació per email a %{name}",
        deleteOk: 'Proposta eliminada correctament',
        modifymex: 'Formulari: %{type}',
        organizerProposal: "Propostes creada per els organitzadors de l'event"
      },
      tools: {
        tab: 'Utilitats',
        whitelist: {
          title: 'Habilita usuaris per poder enviar una proposta en qualsevol moment',
          placeholder: 'Email o Nom de perfil',
          ontheList: 'Aquest usuari ja està en la llista.'
        },
        qr: {
          title: 'Descarrega i difón el codi QR de la pàgina del teu event en orfheo',
          download: 'Descarrega'
        },
        slug:{
          title: 'URL curta',
          created: 'Adreça personalitzada al teu esdeveniment:',
          create:'Crea la dirección personalizada de la página de tu evento:',
          regexMex:"Crea l'adreça personalitzada de la pàgina del teu esdeveniment:",
          unavailable: "Aquesta adreça ja està sent empleada",
          regexError: "L'adreça només pot incloure lletres minúscules, nombres i/o els caràcters _ -",
          lengthError: "L'adreça ha de contenir almenys tres caràcters",
          available:'Adreça disponible',
          popupMex: 'La nova adreça serà:',
          popupWarning:'Funcionarà paral·lelament a la ja existent i no podrà ser eliminada o modificada una vegada creada.'
        }
      }
    },
    profile_page:{
      aside:{
        yourOther: 'Els teus altres perfils',
        other:'Altres perfils del mateix usuari',
        portfolio:'Portfolio'
      },
      artistBio: 'Biografia',
      call:'Participació en convocatòries',
      callMex:'No estàs inscrit en cap convocatòria activa en aquest periode.',
      multimedia:'Continguts multimèdia',
      video: 'Videos',
      images: 'Imatges',
      audio:'Audio',
      spaceInfo: 'Informació',
      events: 'Events',
      organizationInfo:'Informació',
      createEventBtn:'Crea un event i llança una convocatòria',
      createEventTitle: 'Els teus events en orfheo',
      participation:'Participació en events',

      production:{
        cache:'Caché: ',
        public: 'Audiència ',
        noDuration: 'No té duració definida',
        info: 'Informació'
      }
    },
    event_page:{
      infoTab: {
        signupCall:"Apunta't!",
        callOpening:'Obertura convocatòria ',
        callOpened:'Convocatòria oberta',
        till: ' fins ',
        callClosed:'Convocatòria tancada (des de el ',
        organize:'Organiza ',
        noConditions: 'Sense condicions de participació',
        seeAll: 'veure tots',
        conditions:'Bases de participació'
      },
      eventAside:{
        program: 'Programa',
        community: 'Comunitat',
        info:'Info',
        partners:'Partners',
        managerbtn:"Gestor de l'event",
        withdrawprog:'Retira el programa',
        publishprog: 'Publica el programa',
        withdrawMex:'Ara només tu pots veure el programa del teu event',
        publishMex:"El programa s'ha publicat correctament",
      },
      program:{
        filtersbtn: 'Filtres',
        filters:{
          participants:'Categories Artístiques',
          hosts: 'Categories espais',
          other:'Audiència',
          titleText:'Selecciona el que vulgues veure'
        },
        all_dates: 'Totes les dates',
        nowbtn:'Ara',
        hs:'Horari',
        sp:'Espai',
        orderby:'Ordena per',
        permanents: 'Permanents al llarg del dia',
        noResults:'Cap resultat per a aquesta data'
      }
    },
    services: {
      mex: "​Llança en orfheo la convocatòria artístico-cultural del teu event <br> i gestiona totes les teues dades amb una nova i potent eina.",
      pricing: "Preu: <del style='font-size:14px; margin:0 .1rem 0 1rem'> 59,90 €/mes </del>",
      watchVideo:'Mira el vídeo demo',
      contact: "Contacta'ns",
      section1: {
        title: "Expandeix el teu event més enllà d'un event",
        mex: "Obri el teu esdeveniment en orfheo, alimenta i dóna valor a la teua comunitat més enllà només d'una trobada. Tindràs una pàgina enterament dedicada i arribaràs a nous públics."
      },
      section2: {
        title: 'Llança amb força la teua convocatòria',
        mex: "Comença bé amb el teu formulari personalitzat, és el principi d'una cosa gran. Qualsevol pot apuntarse fàcilment a la teua convocatòria des de la pàgina del teu esdeveniment."
      },
      section3:{
        title: 'Visualitza i gestiona les dades rebudes',
        mex: 'Visualitza, filtra i explora de forma fàcil i ràpida totes les propostes rebudes. Estalvia temps, aprofita la potència de la informació ben organitzada, mantín tot baix control.'
      },
      section4: {
        title: 'Crear el programa mai ha sigut igual',
        mex: 'Construïx la programació del teu esdeveniment i  organitza amb el teu equip i des de qualsevol lloc. Tot está sincronitzat en temps real i ràpidament modificable.'
      },
      section5: {
        title: 'Preparat? Publica el programa interactiu',
        mex: "Publica el teu programa interactiu. Permet al teu públic trobar el que vullga i navegar entre els perfils dels participants."
      },
      section6: {
        title: 'Sorpren al teu públic més que mai!',
        mex: "Utilitza orfheo com l'App del teu esdeveniment: és la guia perfecta per a tu i per al teu públic. Ordena i troba fàcilmente el que vols veure. "
      },
      api:{
        title: 'API - Integra en temps real el que vulgues i on vulgues',
        mex: "El servei API permet rebre i utilitzar les dades relatives als teus events i convocatòries en totes les teus aplicacions. Qualsevol canvi que fages en orfheo s'actualizarà de forma automàtica i simultànea en la teua web i app per a mòbils. Podràs disposar de tota la teua informació sempre actualitzada, on i quan vulgues."
      },
      counseling: {
        title: "Assessoria per al teu projecte",
        mex: "Podràs gaudir d'un seguiment constant durant tot el procés de preparació del teu event i descobrir noves estratègies creatives focalitzades en traure el millor del teu projecte."
      },
      price: {
        title: 'El preu no és un límit',
        subtitle: "Contacta'ns per a crear i gestionar el teu esdeveniment en orfheo."
      },
      e_pack: {
        pricing: "<h3 style='font-weight:normal; display:inline'>14,90</h3> €/mes<p style='color:#6f6f6f'>Preu: <del>59,90 €/mes<del></p> <p style='text-align:center'>L'eina de gestió per a grans esdeveniments </p>",
        list: "Una pàgina sencera dedicada/Convocatòria online/Difusió a tots els usuaris/Formularis multiidioma/Rep propostes il'limitades/Programa qualsevol activitat/Programació online interactiva/Utilitza orfheo com App/URL personalitzable/Suport tècnic constant"
      },
      plus_pack:{
        list:'API/Asesoría',
        mex: "<p>Preus sense IVA. A pagar des del dia de llançament de la convocatòria fins que acabe l'esdeveniment.</p><p> Contacta'ns per a provar el mànager de forma gratuïta y sense compromís.</p>"
      },
      endMex: "Creiem en univers de creativitat, inclusius, estimulants, innovadors, tecnològics, d'integració social i de unió. Creiem en una nova era, on el centre siga compartir. Creiem en la interacció i la participació de les persones. Necessitem accions colectivas i veritables motors per crear una realitat cultural més humana, accesible i properta. Necessitem potenciar projectes, treballs en xarxa i créixer en comunitat. Somiem amb construir nous horitzons sense barreres, un lloc en constant expansió que permeta el fàcil intercanvi d'experièncias i informació. Fem-ho possible junts, ara."
    },
    browserTests:{
      version: "S'ha detectat que estàs utilitzant una versió de %{browser} amb la qual orfheo no ha sigut provat. Poden aparèixer problemes de incompatibilitat. </br>Es recomana utilitzar una versió recent de Google Chrome o com a alternativa de Mozilla Firefox.",
      tracking: "No es poden cargar correctament tots els continguts d'aquesta pàgina. És molt probable que siga per tindre habilitada la funció de 'tracking protection' del navegador. Es recomana desactivar-la."
    },
    cookiesPolicy:{
      title: 'Política de cookies',
      mex: "Per millorar la teua experiència de navegació, orfheo emmagatzema informació en el teu navegador en forma de xicotets elements de text nomenats cookies. </br>Si acceptes o continues navegant significa que estàs d'acord amb aquest avís. Per més informació pots llegir la nostra web "
    },
    error: {
      alert: 'Error!',
      incomplete: 'Por favor, revisa els camps obligatoris.',
      nonExecuted: "No s'ha pogut executar l'acció",
      unsaved: "No s'ha pogut guardar les dades",
      already_registered: 'Usuari ja registrat!',
      invalid_parameters: "Els paràmetres insertats no són vàlids!<br/> Per favor, revísa'ls.",
      invalid_email: 'El correu no és correcte!<br/> Per favor, torna a intentar-ho.',
      incorrect_password: 'Contrasenya equivocada!',
      invalid_password: 'Contrasenya no vàlida!',
      closedCall: 'Convocatòria tancada',
      out_of_time_range: 'La teua proposta no ha sigut enviada.',
      invalid_type: 'Tipus de perfil no vàlid.',
      existing_profile: 'Ja existeix un perfil amb aquest nom. Tria un altre.',
      non_existing_profile: 'Perfil no existent!',
      non_existing_proposal: 'Proposta no existent!',
      non_existing_production: 'Producció artística no existent!',
      invalid_category:'Categoria no vàlida!',
      existing_call: 'Convocatòria ja existent.',
      non_existing_call:'No existeix aquesta convocatòria.',
      you_dont_have_permission: 'Has perdut la connexió...torna a entrar i intenta-ho de nou.',
      invalid_query: 'Acció no vàlida.',
      non_existing_event:'No existeix aquest event',
      existing_name: 'El nom de perfil que has triat ja existeix. Per favor, tria un altre.',
      serverProblem:{
        title: 'Error en el servidor',
        mex: "<p>Operació no executada. Per favor, torna a intentar-ho. </p> <p>Si el error persisteix no oblides que estem a la teua disposició per ajudar-te. Escriu-nos a <a href='mailto:info@orfheo.org' target='_top'> info@orfheo.org</a> o contacta'ns en el xat de nostra <a href='https://www.facebook.com/orfheo.org', target='_blank'>pàgina facebook.</a></p>"
      }
    }
  }
}(Pard || {}))
