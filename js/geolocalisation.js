/**Affichage de la carte*/
// Déclaration des variables globales
//cette variable correspondra à la carte
var map;
//la variable gardera les varleur de la longitude et latitude de l’utilisateur converti
var  LonLat;
// variable garda l’identifiant du div  dans lequel s’affichera la carte
var idMapDiv ='map';

//Fonction permettant l'initialisation de la carte
var initialiseMap = function initialiseMap() {
  // Création d'un objet map
    map = new OpenLayers.Map(idMapDiv);
  // Ajout d'un calque en utilisant le rendu par défaut
    map.addLayer(new OpenLayers.Layer.OSM());
    //
    map.zoomToMaxExtent();
};

var geolocalisation = function(){
  /** Demander de localisation de l'utilisateur**/
  if(navigator.geolocation) {
    // L'utilisateur a accepté la demande 
    navigator.geolocation.getCurrentPosition(succesCallback,errorCallback);
  } 
  
};

//Avec cette méthode, je récupère la position de l'utilisateur
function succesCallback(position) {
  //récupération des positions de l’utilisateur
  var longitudeUser=position.coords.longitude;
  var latitudeUser= position.coords.latitude;

  //appelle a la fonction de convertion 
  convertion(longitudeUser,latitudeUser); 

  //creation d'un objet Position puis stockage de cette valeur dans IndexDB
  
  var positionActuel = new Position(LonLat.lon , LonLat.lat);

  // appelle de la fonction d'ajout du marker par rapport a la position de l'utilisateur
  addMarkerUser(LonLat); 

  //Centrer la carte avec un zoom de 17 vers la position de l'utilisateur
  map.setCenter(LonLat, 17);
  }

  // S'il y a une erreur lors de la demande géolocalisation de l'utilisateur

  function errorCallback(error){
  switch(error.code){
    case error.PERMISSION_DENIED:
      alert("L'utilisateur n'a pas autorisé l'accès à sa position");
      break;     
    case error.POSITION_UNAVAILABLE:
      alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
      break;
    case error.TIMEOUT:
      alert("Le service n'a pas répondu à temps");
      break;
    }
};

// fonction permettant d'ajouter un marquer dans un cordonnées
var addMarkerUser = function (LonLat){
  //création et ajout d'une couche pour acceuillir le Markers
  calqueMarkers = new OpenLayers.Layer.Markers("Repères");
  map.addLayer(calqueMarkers);

  //création 
  var markerUtilisateur = new OpenLayers.Marker(LonLat);
  calqueMarkers.addMarker(markerUtilisateur);
};

var convertion = function convertion(longitude,latitude){
  // Variable de projection sur la carte
  var projCarte = new OpenLayers.Projection("EPSG:900913");
  // transform from WGS 1984
  var projSpherique = new OpenLayers.Projection("EPSG:4326"); 
  LonLat = new OpenLayers.LonLat(longitude,latitude).transform(
                  projSpherique, 
                  projCarte
                );
};



