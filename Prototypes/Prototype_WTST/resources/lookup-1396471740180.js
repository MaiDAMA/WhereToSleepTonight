(function(window, undefined) {
  var dictionary = {
    "e7367844-ff5a-4b9a-a25c-a31a38d34b6d": "Carte",
    "f7cedca0-5ae0-4474-8fc8-82f694dc369e": "Liste hotels",
    "4c90a25c-fbe7-4f96-b742-3202683765ec": "Recherche",
    "9986a070-9378-4afe-8ec1-996370adf10d": "Itinéraire",
    "58bda819-62cf-45ef-9449-d9615ea69757": "Liste commentaires",
    "dd08b311-ef60-41fc-b455-204c76277c52": "Profil",
    "098bcb4b-a254-4e8f-b2c8-31a05851f1ec": "Liste favoris",
    "a01e2241-4e55-4e62-9cf3-5b8471d9d1cb": "Accueil",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Home",
    "7d08ff4e-bcf4-4d10-9703-1ee6ed68cab5": "Dde_geo",
    "ed3d9440-695a-42f3-8b21-f0190aff098b": "Paramètres",
    "21aef3c7-60c4-497a-bb33-b328b44994d3": "Informations",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1"
  };

  var uriRE = /^(\/#)?(screens|templates|masters)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);