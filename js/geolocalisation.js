 /****************************************************************************
    Gestion de la géolocalisation des hotels et de l'utilisateur
*****************************************************************************/


/*******************************************
Fonciton pour l'Affichage de la carte
********************************************/
// Déclaration des variables globales
//cette variable correspondra à la carte
var map;
//la variable gardera les varleur de la longitude et latitude de l’utilisateur converti
var  LonLat;
// variable garda l’identifiant du div  dans lequel s’affichera la carte
var idMapDiv ='map';
var longitudeUser;
var latitudeUser;
var tableau_hotel_proximite=[];

/************************************************
Fonction permettant l'initialisation de la carte
*************************************************/
var initialiseMap = function initialiseMap() {
  // Création d'un objet map
    map = new OpenLayers.Map(idMapDiv);
  // Ajout d'un calque en utilisant le rendu par défaut
    map.addLayer(new OpenLayers.Layer.OSM());
    //
    map.zoomToMaxExtent();
};

/********************************
Fonction de géolocalisation
********************************/
var geolocalisation = function(){
  /** Demander de localisation de l'utilisateur**/
  if(navigator.geolocation) {
    // L'utilisateur a accepté la demande 
    navigator.geolocation.getCurrentPosition(succesCallback,errorCallback);
  } 
  
};


/*************************************************************
Avec cette méthode, je récupère la position de l'utilisateur
**************************************************************/
function succesCallback(position) {
  //récupération des positions de l’utilisateur
  longitudeUser=position.coords.longitude;
  latitudeUser= position.coords.latitude;

  //appelle a la fonction de convertion 
  convertion(longitudeUser,latitudeUser); 

  //creation d'un objet Position puis stockage de cette valeur dans IndexDB
  
  var positionActuel = new Position(LonLat.lon , LonLat.lat);

  // appelle de la fonction d'ajout du marker par rapport a la position de l'utilisateur
  addMarkerUser(LonLat); 

  //Centrer la carte avec un zoom de 17 vers la position de l'utilisateur
  //map.setCenter(LonLat,13);
  map.setCenter(LonLat,14);
  chargementJSON();
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

/**************************************************************
Fonction permettant d'ajouter un marquer dans un cordonnées
***************************************************************/
var addMarkerUser = function (LonLat){
  //création et ajout d'une couche pour acceuillir le Markers
  calqueMarkers = new OpenLayers.Layer.Markers("Repères");
  map.addLayer(calqueMarkers);

  //création 
  var markerUtilisateur = new OpenLayers.Marker(LonLat);
  calqueMarkers.addMarker(markerUtilisateur);
};

/***************************************************
Fonction qui permet de convertir les coordonnées 
****************************************************/
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

/***************************************************
Fonction qui charge fichier JSON
****************************************************/
var chargementJSON=function(){
   $.ajax({
    dataType:'json',
	url:'datahotel.json',
    success: function(datahotel) {
	  chargementTableauHotelProximite(datahotel);
	},
    error: function() {
       alert('La requête n\'a pas abouti'); 
	}
  });    
};

/*******************************************************
Fonction qui stocke dans tableau les hotels à proximité 
********************************************************/
var chargementTableauHotelProximite=function(datahotel){
  var nb=datahotel.length;
  var j=0;
  for(var i=0;i<nb;i++){
    var latitude_hotel=parseFloat(datahotel[i].fields.lat);
	var longitude_hotel=parseFloat(datahotel[i].fields.lng);
	var intervalle_latitude=latitudeUser-latitude_hotel;
	var intervalle_longitude=longitudeUser-longitude_hotel;
	
	if((intervalle_latitude <= 0.012 && intervalle_latitude >= -0.012) && (intervalle_longitude <= 0.05 && intervalle_longitude >= -0.05)){
	   tableau_hotel_proximite.push(datahotel[i]);
    }
  }
  geolocalisationHotel();
}

/**********************************************
Fonction qui localise les hotels à proximité 
***********************************************/
var geolocalisationHotel=function(){

    var name_marker_hotel="HP";
	for(var i=0;i<tableau_hotel_proximite.length;i++){
    var name_marker=name_marker_hotel+i;
	var couche_markers = new OpenLayers.Layer.Markers(name_marker_hotel);
	lonlat=new OpenLayers.LonLat(tableau_hotel_proximite[i].fields.lng,tableau_hotel_proximite[i].fields.lat).transform(
          new OpenLayers.Projection("EPSG:4326"),
          new OpenLayers.Projection("EPSG:900913")
        );
    var icon = new OpenLayers.Icon('libs/OpenLayers/img/marker-blue.png');
    var mon_marker=new OpenLayers.Marker(lonlat,icon);
    couche_markers.addMarker(mon_marker);
    map.addLayer(couche_markers);
	affichePopup(mon_marker,tableau_hotel_proximite[i]);
	}
}

/**********************************************************
Fonction qui affiche une popup lors du clique d'un marker
***********************************************************/
function affichePopup(marker,hotel_proximite){
   marker.events.register("click", marker, function(e){
   popup = new OpenLayers.Popup("popup",
         map.getLonLatFromPixel(e.xy),
         new OpenLayers.Size(270,195),
         "example popup",true);	   
    map.addPopup(popup);
	gestionPopUp(popup,hotel_proximite);
	});
}

function gestionPopUp(popup,hotel_proximite){
 
   var information_popup="<div id="+"popup_information"+">"+
   "<fieldset>"+
   "<legend style="+"font-style:italic;"+">"+"Informations"+"</legend>"+
   "<div id="+"hotel_info"+">"+
   hotel_proximite.fields.nom_commercial+"</br>"+
   hotel_proximite.fields.adresse+"</br>"+
   hotel_proximite.fields.code_postal+"</br>"+
   hotel_proximite.fields.telephone+"</br>"+
   "<textarea cols="+20+"rows="+15+"></textarea>"+"</br>"+
   "<button type=+"+"button"+" id="+"btncommenter"+">Commenter"+"</button>"+
   "<button type=+"+"button"+" id="+"btnfavori"+">Ajouter favoris"+"</button>"+
   "</div>"+
   "</fieldset>"+
  "</div>";
   popup.setContentHTML(information_popup);
}

 