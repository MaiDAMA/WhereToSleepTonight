 /**************************************************************************
    Gestion de la page index.html
*****************************************************************************/

/*******************************************
Gestion du localStorage
********************************************/
  var loadWTSTN=function(){
    if(typeof(window.localStorage) != 'undefined'){ 
	var nbload = window.localStorage.getItem('idload'); 
	if(nbload>1){
	   initialeLoad(); 
	}
    else{
	  ihmCreateProfil();
	}
	nbload++;
	window.localStorage.setItem("idload",nbload); 
    }
  };
 
 
/*****************************************
Interface pour la création d'un profil
*****************************************/

var ihmCreateProfil=function(){
	 RechercheEnabled();
	 geolocalisationEnabled();
	 modifProfilEnabled();
	 tabsOngletEnabled();
	 menuEnabled();
	 titreHomeVisible();
	 addProfilVisible();
};

/*******************************************
Accès à l'appli après création ou existance 
du profil
********************************************/
var initialeLoad=function(){
	RechercheEnabled();
	titreHomeEnabled();
	menuVisible();
	tabsOngletEnabled();
	modifProfilEnabled();
	initialiseMap();
	geolocalisation();
};

/*******************************************
Gestion des affichages
********************************************/
var tabsOngletVisible=function(){
	$("#tabs").tabs();
	$("#tabs").css("display","block");
};

var tabsOngletEnabled=function(){
    $("#tabs").css("display","none");
};

var geolocalisationVisible=function(){
	$('#map').css("display","block");
};

var geolocalisationEnabled=function(){
	$('#map').css("display","none");
};

var addProfilVisible=function(){
	$('#profil_add').css("display","block");
};

var addProfilEnabled=function(){
	$('#profil_add').css("display","none");
};

var modifProfilVisible=function(){
	$('#profil_modif').css("display","block");
};

var modifProfilEnabled=function(){
	$('#profil_modif').css("display","none");
};

var menuVisible=function(){
  $('#id_menu_nav').css("display","block");
};

var menuEnabled=function(){
 $('#id_menu_nav').css("display","none");
};

var titreHomeVisible=function(){
  $('#top-titre').css("display","block");
};

var titreHomeEnabled=function(){
  $('#top-titre').css("display","none");
};
var RechercheEnabled=function(){
  $('#recherche_hotel').css("display","none");
};

var RechercheVisible=function(){
  $('#recherche_hotel').css("display","block");
};
/******************************
Gestion des listes
*******************************/
var affichageListeHotels=function(){
  
  var tableau_hotels_proximite=getHotelProximite();
  var nb=tableau_hotels_proximite.length;
  $("#tabs-1").empty();
  
  if(nb==0){
    var information_hotel="Aucun résultat";
	$("#tabs-1").append("<p>"+information_hotel+"</p>");
  }
  
  for(var i=0;i<nb;i++){
  var information_hotel=
      "<strong>"+tableau_hotels_proximite[i].fields.nom_commercial+"</strong></br>"+
	  tableau_hotels_proximite[i].fields.adresse+"</br>"+
      tableau_hotels_proximite[i].fields.code_postal+"</br>"+
	  tableau_hotels_proximite[i].fields.commune+"</br>"+
      tableau_hotels_proximite[i].fields.telephone+"</br>";
  $("#tabs-1").append("<div id="+"liste_hotel_conteneur"+"><img id="+"lien_image"+" src="+"img/marker.png"+"><p><div id="+"contenu_hotel"+">"+information_hotel+"</div></p></div>");
  }
};
