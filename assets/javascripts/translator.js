'use strict';

var Options = function(){
  var localStorageKey = 'orfheo'
  var orfheoLangs = ['es','en']
  var defaultLang = navigator.language || navigator.userLanguage
  console.log('navigator.language=' + defaultLang)
  defaultLang = defaultLang.substring(0,2)
  if ($.inArray(defaultLang, orfheoLangs) < 0) defaultLang = 'es'
  console.log('localStorage[localStorageKey]=' + localStorage[localStorageKey])

  var orfheoStorage
  if (localStorage[localStorageKey]) orfheoStorage = JSON.parse(localStorage[localStorageKey])
  if (!orfheoStorage || !orfheoStorage.language || $.inArray(orfheoStorage.language, orfheoLangs) < 0){
    localStorage[localStorageKey] = JSON.stringify({
      language: defaultLang, 
      cookies: false, 
      register: {}
    })
    orfheoStorage = JSON.parse(localStorage[localStorageKey])
  }

  console.log('localStorage[localStorageKey]=' + localStorage[localStorageKey])

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

  Pard.t = ns.Translator(ns.langs[Pard.Options.language()])

}(Pard || {}));
