
 /****************************************************************************
    Gestion de la géolocalisation des hotels et de l'utilisateur
*****************************************************************************/

/*******************************************
Déclaration des variables globales
********************************************/
var map;
var  LonLat;
var idMapDiv ='map';
var longitudeUser;
var latitudeUser;
var positionActuel;
var tableau_hotel_proximite=[];
var tableau_hotel_Recherche=[];
var nomRecherche;
var ville_recherche;
var nomhotel_recherche;
var infoHotel = new String(" ");
var commentairetext= new String(" ");
var lonlat_Hotel;

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
  longitudeUser= position.coords.longitude;
  latitudeUser= position.coords.latitude;

  //appelle a la fonction de convertion 
  convertion(longitudeUser,latitudeUser); 

  //creation d'un objet Position puis stockage de cette valeur dans IndexDB
  
  positionActuel = new Position(longitudeUser,latitudeUser);

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
  attribuerHotelsPosition();
  geolocalisationHotel();
}

/************************************************************
Fonction qui stocke dans le tableau les hotels de recherche
*************************************************************/
var chargementTableauHotelRecherche=function(nomRecherche,ville_recherche,nomhotel_recherche){
  $.ajax({
    dataType:'json',
    url:'datahotel.json',
    success: function(datahotel) {
      var nb=datahotel.length;
      for(var i=0;i<nb;i++){
        var nom_Commune=datahotel[i].fields.commune;
        var presenceMotCleCommune=nom_Commune.search(nomRecherche.toUpperCase());
    var nom_Hotel=datahotel[i].fields.nom_commercial;
        var presenceMotCleNom_Hotel=nom_Hotel.search(nomRecherche.toUpperCase());
        
    if(ville_recherche==true){
      if(presenceMotCleCommune!=-1){
          tableau_hotel_Recherche.push(datahotel[i]);
          }
    }
    
    if(nomhotel_recherche==true){
      if(presenceMotCleNom_Hotel!=-1){
          tableau_hotel_Recherche.push(datahotel[i]);
          }
    } 
      }
      
      if(tableau_hotel_Recherche.length!=0){
          geolocalisationHotelRecherche(ville_recherche,nomhotel_recherche);
      } 
      else{
        alert("il n'y a pas d'hotel correspondant à vos saisies")
      }
    },
    error: function() {
       alert('La requête n\'a pas abouti'); 
    }
  });    
}    
/**********************************************
Fonction qui attribut les hotels à proximité à la position 
***********************************************/

var attribuerHotelsPosition=function(){
  positionActuel.setTabHotel(tableau_hotel_proximite);
  
  //ajouter position
  //DB.addPosition(positionActuel);
};

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

/**************************************************
Fonction qui localise les hotels à de la recherche 
**************************************************/
var geolocalisationHotelRecherche=function(ville_recherche,nomhotel_recherche){
  var name_marker_hotel="HP";
  for(var i=0;i<tableau_hotel_Recherche.length;i++){
    var name_marker=name_marker_hotel+i;
    var couche_markers = new OpenLayers.Layer.Markers(name_marker_hotel);
    lonlat=new OpenLayers.LonLat(tableau_hotel_Recherche[i].fields.lng,tableau_hotel_Recherche[i].fields.lat).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913")
          );
     var icon;
    if(ville_recherche==true){
      icon = new OpenLayers.Icon('libs/OpenLayers/img/marker-green.png');
    }
    if(nomhotel_recherche==true){
      icon = new OpenLayers.Icon('libs/OpenLayers/img/marker-gold.png');
    }

      var mon_marker=new OpenLayers.Marker(lonlat,icon);
      couche_markers.addMarker(mon_marker);
      map.addLayer(couche_markers);
     affichePopup(mon_marker,tableau_hotel_Recherche[i]);
  }
    if(positionActuel!=null){
      addMarkerUser(positionActuel);
      map.setCenter(positionActuel,13);
    }
    else{
      map.setCenter(lonlat,13);
    }
    
}; 

/**********************************************************
Fonction qui affiche une popup lors du clique d'un marker
***********************************************************/
function affichePopup(marker,hotel_proximite){
   marker.events.register("click", marker, function(e){
   popup = new OpenLayers.Popup("popup",
         map.getLonLatFromPixel(e.xy),
         new OpenLayers.Size(200,210),
         "example popup",true);    
    map.addPopup(popup);
  gestionPopUp(popup,hotel_proximite);
  });
}
/**********************************************************
Fonction qui gére la popup
***********************************************************/
function gestionPopUp(popup,hotel_proximite){
   infoHotel = hotel_proximite.fields.nom_commercial+"  à  "+hotel_proximite.fields.commune;
   /******Conversion des coordonnées******/
    lonlat_Hotel=new OpenLayers.LonLat(hotel_proximite.fields.lng,hotel_proximite.fields.lat).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913")
          );
      
    //verification des calculs sur la connaissance des positionActuel de l'utilisateur pour calculer la distance
    if(positionActuel!=null){
    var positionActuelConverti=new OpenLayers.LonLat(positionActuel.longitude,positionActuel.latitude).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913")
          );

    var distanceDeuxPoints= distanceEntrePoints(positionActuelConverti,lonlat_Hotel);
    }
    else{
       distanceDeuxPoints="Géolocalisation refus&eacute;e";
    }
  
   var information_popup="<div id="+"popup_information"+">"+
   "<fieldset>"+
   "<legend style="+"font-style:italic;font-size:11px;"+">"+"Informations"+"</legend>"+
   "<div id="+"hotel_info"+">"+
   hotel_proximite.fields.nom_commercial+"</br>"+
   hotel_proximite.fields.adresse+"</br>"+
   hotel_proximite.fields.commune+"</br>"+
   hotel_proximite.fields.code_postal+"</br>"+
   hotel_proximite.fields.telephone+"</br>"+
   "distance: "+distanceDeuxPoints+" km "+"</br>"+
   "<textarea cols="+15+"rows="+15+" id="+"textcommentaire"+"></textarea>"+"</br>"+
   "<div id="+"btn_commande"+">"+
   "<button type="+"button"+" onclick="+"ajoutCommentaire()"+" id="+"btncommenter"+">Commenter"+"</button>"+
   "<button type="+"button"+" onclick="+"ajoutfavoris()"+" id="+"btnfavori"+">+F"+"</button>"+
   "</div>"+
   "</div>"+
   "</fieldset>"+
  "</div>";
   popup.setContentHTML(information_popup);
   popup.setBackgroundColor("#FEC3AC");
}
/**********************************************************
Fonction qui retourne la liste des hôtels à proximité
***********************************************************/
var getHotelProximite=function(){
 return tableau_hotel_proximite;
};

/********************************
*Ajouter favoris
*********************************/
function ajoutfavoris(){
    var dateAjoutFavoris= new Date();
    var favorisAjout = new Favori(infoHotel , dateAjoutFavoris.toLocaleString());

     //ajouter indexedDB
     DB.addFavoris(favorisAjout);

}
/********************************
*Ajouter commentaire
*********************************/
function ajoutCommentaire(){
    var dateAjoutCommentaire= new Date();
    var commentairetext=$('#textcommentaire').val();
    var commentaireAjout = new Commentaire(commentairetext,dateAjoutCommentaire.toLocaleString(),infoHotel);
    DB.addCommentaire(commentaireAjout);
}

/********************************
*Calcul de distance en point 
*********************************/
function distanceEntrePoints(latlng1, latlng2){
  //utilise les valeurs convertis
  var point1 = new OpenLayers.Geometry.Point(latlng1.lon, latlng1.lat);
  var point2 = new OpenLayers.Geometry.Point(latlng2.lon, latlng2.lat);       
  if(latlng1!== undefined || latlng2!== undefined || latlng1!=null || latlng2!=null ){
    return Math.round(((point1.distanceTo(point2))/10))/100;

  }
  else{
    //Convertion de la valeur en kilometre et recupretation de deux chiffres apres la virgule
    return "localisation inconnue";
 }
}
