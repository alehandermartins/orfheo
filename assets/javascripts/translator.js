'use strict';

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
    // if (!($.inArray(defaultLang, ['es','ca','it','en']))) defaultLang = 'es'
    var defaultLang = 'es';
    Pard.Options.setLanguage(defaultLang)
  } 

  Pard.t = ns.Translator(ns.langs[Pard.Options.language()])

}(Pard || {}));
