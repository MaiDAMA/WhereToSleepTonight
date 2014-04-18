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
