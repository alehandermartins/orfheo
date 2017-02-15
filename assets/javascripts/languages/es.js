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
      noAction: 'No se ha podido ejecutar la acción'
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
        filtersbtn: 'Filtros',
        filters:{
          participants:'Categorias Artísticas',
          hosts: 'Categorias Espacios',
          other:'Otros',
          titleText:'Selecciona lo que quieres ver'
        },
        nowbtn:'Ahora'
      }
    }
  }
}(Pard || {}))
