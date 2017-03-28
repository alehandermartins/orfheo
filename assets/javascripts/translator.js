'use strict';

var Options = function(){
  var localStorageKey = 'orfheo'
  // var defaultLang = navigator.language || navigator.userLanguage
  // if (!($.inArray(defaultLang, ['es','en']))) defaultLang = 'es'
  var defaultLang = 'es'

  if (!localStorage[localStorageKey]){
    localStorage[localStorageKey] = JSON.stringify({
      language: defaultLang, 
      cookies: false, 
      register: {}
    })
  }

  var orfheoStorage = JSON.parse(localStorage[localStorageKey])
  if(!orfheoStorage.language) 
    orfheoStorage.setLanguage('es')

  return {
    register: function(){
      return orfheoStorage.register
    },
    setRegister: function(info){
      orfheoStorage.register = info
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
    },
    language: function(){
      return orfheoStorage.language
    },
    setLanguage: function(lang){
      Pard.Backend.modifyLang(lang, function(){
        orfheoStorage.language = lang
        localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
        location.reload()
      })
    },
    storeLanguage: function(lang){
      orfheoStorage.language = lang
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
    },
    cookies: function(){
      return orfheoStorage.cookies
    },
    setCookies: function(){
      orfheoStorage.cookies = true
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
    }
  }
}

Pard.Options = Options();

(function(ns){

  ns.Translator = function(language){

    var _text = function(key, interpolations){

      var translatedKey = key.split('.').reduce(function(prev, curr){
        if (prev == null || !prev.hasOwnProperty(curr))
          return null

        return prev[curr]
      }, language)

      // if ('string' != typeof translatedKey)
      //   translatedKey = key

      if (!interpolations)
        return translatedKey

      return translatedKey.replace(/%\{(.+?)\}/g, function(_, subkey){
        if (!interpolations.hasOwnProperty(subkey))
          return '_' + subkey + '_'

        return interpolations[subkey]
      })
    }

    return {
      text:_text
    }
  }

  if(! Pard.Options.language()){
    var defaultLang = navigator.language || navigator.userLanguage
    defaultLang = defaultLang.substring(0,2)
    if (!($.inArray(defaultLang, ['es','en']))) defaultLang = 'es'
    // var defaultLang = 'es';
    Pard.Options.setLanguage(defaultLang)
  } 

  Pard.t = ns.Translator(ns.langs[Pard.Options.language()])

}(Pard || {}));
