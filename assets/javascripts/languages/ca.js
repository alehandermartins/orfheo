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
        part1:"<p> <strong>Et donem la benvinguda!</strong></p><p> <strong>Orfheo es basa en un principi potent: podem fer més coses junts que per separat.</strong></p><p>Són les persones com tu les que fan possible que aquest lloc no només existisca, sinó que també creixca i prospere. </br> Aquestes condicions generals d'us expliquen el servei i la relació entre els usuaris, els drets i les responsabilitats recíproques. </br> <strong> Ser part d'orfheo és gratuït </strong> i al fer-ho estàs acceptant aquestes condicions generals.</p>",
        subtitle2: 'Principis generals:',
        mex2: "<p>Orfheo no té normes fermes més enllá dels principis generals enunciats ací: <ul><li>Respecta els ciutadans d'orfheo inclús quan no estigues d'acord amb ells. </li> <li> Comparte continguts civilitzadament, evita els atacs personals i les generalitzacions així com la publicació d'enllaços o textos que puguen ser ofensius per a la comunitat pel seus continguts: racistes, sexistes, homofobs o que incitan a la violència de qualsevol tipus. </li> <li>  Actúa amb bona fe, sigues obert, acogidor i inclusiu.  </li> <li> Si no respectares aquestos principis ens posariem en contacte amb tu per que ens ponar donar una explicació i junts poder trobar una solució. </li> </ul></p>",
        subtitle3:"Ens compromete'm a:",
        mex3: "<p><ul><li>Describir com pot usar-se o compartir-se la teua informació en aquestes condicions generals. </li> <li> Usar les medidas raonables per tal de mantidre la teua informació sensible segura.  </li> <li>  Fer disponible i deixar fluir en la comunitat la informació que decideixques compartir.  </li> <li> Impulsar valors com la solidaritat, el sentit de comunitat, la meritocràcia, la equidat, el respecte i la harmonia amb l'entorno.  </li> <li> Respectar i defendre la comunitat d'orfheo. </li> <li> Escoltar i acollir qualsevol tipus de sugerència i crítica constructiva. </li></ul></p>",
        subtitle4: "Termes d'us i Privacitat:",
        mex4: "<p>Ací t'expliquem com recolectem i compartim la teua informació personal/dades/continguts.<ul><li>Recolectem molt poca informació personal de tu. </li> <li> No lloguem ni venem la teua informació a tercers, es a dir que no compartim les teues dades amb terceres parts per motius comercials.  </li> <li>  Cap la possibilitat que la informació recollida en orfheo es compartixca amb tercers d'acuerd amb la nostra ideologia, complint amb la ley i amb la intenció de portar benefici a tota la comunitat.  </li> <li>Ets responsable dels continguts que comparteixes i de les seus mesures de privacitat.  </li> <li> Ocasionalment t'enviarem correus electrònics sobre informació important. </li> <li>  La qualitat de les dades que ens proporciones és útil per a tú, per a que pugam millorar la teua experiència com a usuari i poder desenvolupar noves funcions, per a que la teua experiència siga inoblidable. </li> <li> Tot allò que publiques en orfheo és públic, pot ser vist i de fet utilitzat per tot observador extern. </li> <li> És possible que et demanem que ens proporciones informació mitjançant enquestes o retro-alimentació, però de forma sempre voluntaria. </li> <li> No necessites crear una compte per explorar i visualitzar qualsevol dels continguts. </li> <li> Per crear una compte, necessites donar-nos només la teua adreça de correu electrònic. </li><li> Quasevol persona pot unir-se i abandonar orfheo en qualsevol moment.</li> </ul></p>",
        subtitle5:'Publicitat:',
        mex5: "<p>A hores d'ara no hi ha cap forma de publicitat dins d'orfheo. En un futur, no es descarta la presència de publicitat no molesta, relacionada amb el món artístic-cultural, que puga proporcionar informació útil i valuosa per a els ciudatans. Considerem que la publicitat pot ser eficaz sense ser molesta. Excluim la presència de publicitat en forma de finestres emergentes que puguen interferir amb la visualització dels continguts d'orfheo. </p>",
        subtitle5_5:'Sostenibilitat del projecte:',
        mex5_5:"<p>Com hem promés, ser part d'orfheo no té i no tindrá cap cost per cap usuari. Malgrat això, el mantenimient online d'una web d'aquest tipus té un cost, axí com la sostenibilitat de la vida de les persones que treballen diariament en ell. Per tant, llançar una convocatòria i poder accedir la corresponent eina de gestió té un preu, que es decideix de forma conjunta, a partir d'una base mínima, segons el tipus d'event que es vol organitzar.</p>",
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
        subtitle1: 'Plataforma de gestió',
        subtitle2: 'Assessoria creativa',
        subtitle3: 'Connexió API',
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
        mex1: 'orfheo preten crear i donar valor a les comunitats culturals i les trobades que realment existeixen o poden generar-se en la vida real. És per això que les posibilitats que oferim es centren principalment en recolçar, impulsar i facilitar la creació, difusió i sobretot <strong> la gestió de processos i grans events participatius</strong>. Específicament, amb orfheo pots aprofitar els següents serveis:',
        subtitle2: 'Plataforma de gestió:',
        mex2: "Una potent eina web innovativa que et permet llançar la teua convocatòria i gestionar totes les dades relatives amb extrema facilitat i simplicitat. Podràs consultar, organitzar, filtrar i modificar les propostes rebudes, i a més a més, crear noves per inserir-les a la teua programació. Fer el programa del teu event serà tan fàcil com arrossegar tarjetes dins d'un calendari i treure llistats de correu per tal de contactar amb artistes i espais et costarà només un click. Podràs publicar online un programa interactiu, actualitzable a cada moment, que perfectament s'adapte a qualsevol dispositiu mòbil, funcionant com la guia perfecta per al teu públic.",
        subtitle3: 'Assessoria creativa:',
        mex3: "L'equip d'orfheo compta amb professionals amb molta experiència en la organització i gestió de grans events participatius. Podràs aprofitar d'un seguiment constant durant tot el procés de preparació del teu event i descobrir noves estratègies creatives focalitzades en traure i aconseguir el màxim de la teua comunitat cultural.",
        subtitle4: 'Connexió API:',
        mex4: "El servei API et permet rebre i utiliztar les dades relatives als teus events i convocatòries en la teua aplicació per a mòbils o espai web. Qualsevol canvi que fages en orfheo s'actualizarà de forma automàtica i simultànea en totes les plataformas conectades. Podràs disposar de toda la teua informació sempre actualitzada, on i quan tu vulgues.",
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
      baseline: 'Podem fer més coses junts que per separat',
      mex1: "<p> Benvingut/da a orfheo, </p> <p>un lloc especial, que serà realitat i el reflex d'una comunitat organitzada, gràcies a tots els seus ciutadans. Orfheo és una plataforma per a artistes, actors culturals, desenvolupadors, creatius i treballadors de la cultura lliures d'estrictes categories i esquemes.</p><p> Hem creat un món ùnic, una web no només capaç de facilitar el treball d'organització i gestió de una convocatòria, sinó de donar valor a les propostes dels creadores més enllà d'una mera trobada, a través d\'un camp comú d\'acció.</p> <p> Estàs en la teua comunitat artística online, a on llançar la teua convocatòria és fàcil, i des d'on pots mostrar les teves produccions artístiques, els teus projectes i trobar altres, que poden ser útils tant per a tu, com per a altres festivals i esdeveniments. </p><p>Tens al teu abast una eina, un mecanisme de gestió cultural amb el qual crear i organitzar events, descobrir mitjançant perfils, enllaços i connexions, que et permetran portar a la realitat els teus somnis i idees. </p><p> Creiem en el poder de compartir i lluitem per a que les formes de vida basades en relacions de col·laboració, siguin possibles en l'ecosistema del treball cultural. </p><p> Esperem que aquest petit món pugui servir per estimular les creacions compartides i l'intercanvi d'idees. </p><p> Volem donar la possibilitat d'utilitzar aquesta eina a totes les persones, respectant unes mínimes condicions generals. </p><p> Ens agradaria compartir nostres coneixemente i seguir desenvolupant aquest projecte que acaba de començar, per a que tots els ciudatans d'orfheo puguen seguir gaudint de la comunitat. </p> <p> Saber escoltar és fonamental per poder seguir avant, ets liure d'expresar-te i comunicar-nos els teu punto de vista en qualsevol moment. </p><p> Volem que siguis tu el que imagini i comparteixi amb els altres experiències inoblidables. </p>",
      more: 'Llegir més...',
      subtitle: 'Els pilars',
      list1: "<p>COMPARTIR <ul><li>Saber més l'un de l'atre significa aprendre uns dels altres. </li> <li> Compartim nostre valor a on valor = (experiències + coneixements) x actitud. </li> <li> Compartim les nostres idees i inspiracions creatives amb el fi de crear/inspirar experiències enriquidores. </li> <li> Pensa en la comunitat i la comunitat pensarà en tu. </li> </ul></p>",
      list2: "<p>IDENTITAT <ul><li>Defenem l'individuo com una cosa única, autèntica, un punto en l'espai. Valorem el grup, como el cercle cromàtic, en el qual s'uneix i es defineix la identitat personal, un tret cultural, un matís, un color. </li> <li> Exercim un paper actiu en el desenvolupament d'un món liure, a on s'innova gràcies al xicotet esforç colectiu de moltes persones. </li> </ul></p>",
      list3: "<p>INFORMACIÓ <ul><li>La necessitat d'informació és més forta que totes les fronteras. Ens agradaria facilitar l'accés en els més idiomes possibles.  </li> <li> Volem que tingues accés a la informació en qualsevol lloc i en qualsevol moment. </li> <li> No volem que busques sinó que trobes en orfheo allò que esperabes trobar. </li> </ul></p>",
      list4: '<p>EXPERIÈNCIA <ul><li>Ix de la xarxa: volem donar la millor experiència possible els usuaris per damunt dels nostres propis beneficis i objectius interns, per tal que els processos siguen cada vegada més ràpids, perquè es puga viure en orfheo només el temps necessari i utilitzar la seua informació en la vida quotidiana. </li> <li> Pretenem evolucionar cap a una interfie i una estètica neta, clara i senzilla, utilitzable per tots. </li> </ul></p>',
      list5: '<p>ECONOMIA <ul><li>Es poden guanyar diners sent honestos i cuidant i defenen la comunitat. Amb aquesta intenció volem fer sostenible econòmicament aquest projecte i les vides de qui treballen en ell. </li> </ul></p>',
      list6: "<p>VISIÓ <ul><li>Pensem que encarar un projecte ha de ser divertit i apassionant. Pensem que una cultura de treball adequada promou el talent i la creativitat.  Els èxits de l'equip i els individuals contribueixen al èxit global. Tenim una visió creativa del treball, de l'oci i de la vida. </li> <li> Totes les ideas interessants que surgeixen en els més diferents contextos es comenten, s'analitzen en profonditat i si fa falta es posen en pràctica amb qualitat.  </li> <li> Triem i construïm col·laborativament. Nostra meta és la unitat, no la unanimitat. Prenem decisions amb mètode, de forma genuina i utilitzant el consens. Tenim discusions obertes, animades amb processos que porten a acords en un temps raonable. </li> <li> Ens posem objectius que sabem tal vegada no podem abastar, perquè estem convençuts que al llarg del camí, els esforços, per complir-los, ens portaran a obtindre resultats, potser diferents dels esperats, però igualment valuosos. </li> </ul></p>",
      list7: '<p>MISSIÓ <ul><li>La nostra missió és estimular noves possibilitats culturals creades a partir de connexions. </li> </ul></p>'
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
      mex: "Uneix a les persones, crea en xarxa amb la teua comunitat cultural i conecta't amb altres.<br> ​Llança en orfheo la convocatòria artístico-cultural del teu event <br> i gestiona totes les teues dades amb una nova i potent eina.",
      contact: "Contacta'ns",
      section1: {
        title: "Expandeix el teu event més enllà d'un event",
        mex: "Obrir el teu event en orfheo significa alimentar i donar valor a la teua comunitat més enllà d'una trobada només. Tindràs una pàgina completament dedicada. Entraràs en un món ple de noves possibilitats cuturals creades per connexions, un univers en expansió construït per fomentar al màxim la participació, compartir recursos i arribar a nous públics."
      },
      section2: {
        title: 'Llança amb força la teua convocatòria',
        mex: "Comença bé amb el teu formulari personalitzat, és el principi d'una cosa gran. Qualsevol pot apuntarse fàcilment a la teua convocatòria des de la pàgina del teu event. Pregunta tot el que vulgues. Rebreràs tot ja ordenat i organizat automàticament."
      },
      section3:{
        title: 'Visualitza i gestiona les dades rebudes',
        mex: 'Visualitza, filtra i explora de forma fàcil i ràpida totes les propostes rebudes. Navega entre els perfils i selecciona els participants. Exporta dades, llistats de correu i tot el que et faja falta amb tan sols un "click". Estalvia temps, aprofita la potència de la informació ben organitzada, mantén tot baix control.'
      },
      section4: {
        title: 'Crear el programa mai ha sigut igual',
        mex: 'Construir la programació del teu event és tan fàcil com arrossegar les propostes en una taula. Organitza amb el teu equip i des de qualsevol lloc. Tot está sincronitzat en temps real i ràpidament modificable. Confirma, comenta i descarrega el programa en taules ordenades.'
      },
      section5: {
        title: 'Preparat? Publica el programa interactiu',
        mex: "Publica el teu programa interactiu en la pàgina de l'event. Permiteix al teu públic trobar el que vulga i navegar entre els perfils dels participants. Comparteix l'event amb un link i fes que sea un èxit."
      },
      section6: {
        title: 'Sorpren al teu públic més que mai!',
        mex: "orfheo s'adapta perfectament al tamany mòbil, funcionant per tu i per al teu públic como la guia perfecta durant el teu event. Es poden filtrar, ordenar i trobar continguts per ubicació en el mapa, per horas, per dies, per tags o per categories, o tot a la vegada."
      },
      api:{
        title: 'API - Integra en temps real el que vulgues i on vulgues',
        mex: "El servei API permet rebre i utilitzar les dades relatives als teus events i convocatòries en totes les teus aplicacions. Qualsevol canvi que fages en orfheo s'actualizarà de forma automàtica i simultànea en la teua web i app per a mòbils. Podràs disposar de tota la teua informació sempre actualitzada, on i quan vulgues."
      },
      counseling: {
        title: "Servei d'Assessoria Creativa per al teu projecte",
        mex: "Podràs gaudir d'un seguiment constant durant tot el procés de preparació del teu event i descobrir noves estratègies creatives focalitzades en traure el millor del teu projecte."
      },
      price: {
        title: 'El preu no és un límit',
        mex: 'Mitjançant el que fas, estàs ajudant a construir algo realment important,<br>no només un gran projecte, sinó també una vibrant comunitat encarada a una molt noble meta.<br> Volem que sempre pugues fer-ho, i como tu, tots.'
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
