
 /*******************************************************
   Fonction lors du chargement de la page
********************************************************/
var nom_recherche=false;
var villehotel=false;

$(document).ready(function(){
  DB.init();

   /********************************************
     Les évenements click des menus
   *******************************************/
   $('a.listes[href^=#]').click(function() {
	 geolocalisationEnabled();
	 modifProfilEnabled();
	 addProfilEnabled();
	 titreHomeEnabled();
	 RechercheEnabled();
	 tabsOngletVisible();
	 affichageListeHotels();
	 DB.selectAllCommentaire();
	 DB.selectAllFavoris();
     });
   
   $('a.modifprofil[href^=#]').click(function() {
	 geolocalisationEnabled();
	 tabsOngletEnabled();
	 addProfilEnabled();
	 titreHomeEnabled();
	 RechercheEnabled();
	 modifProfilVisible();
   });
	 
  $('a.recherche[href^=#]').click(function() {
    geolocalisationEnabled();
    tabsOngletEnabled();
    modifProfilEnabled();
    addProfilEnabled();
    titreHomeEnabled();
    RechercheVisible();

   });

   $('a.quitter[href^=#]').click(function() {
	 titreHomeEnabled();
	 window.localStorage.removeItem('idload');
     window.close();
  }); 
  
  $('#nomhotel').click(function(){
	  nom_recherche=true;
  });
  
  $('#villehotel').click(function(){
	  villehotel=true;
  });
  
  
  $('#button_recherche_hotel').click(function(){
    var saisi=$('#recherche_saisi').val();
    chargementTableauHotelRecherche(saisi,villehotel,nom_recherche);
    geolocalisationVisible();
	RechercheEnabled();
  }); 
  
  $('#button_insert_profil').click(function() {
  var pseudo=$('#profil_name_add').val();
  if(pseudo=='')
     alert('Votre champs est vide');
  else{
   if(DB.getDatabase()){
      var profil=new Profil(pseudo);
      DB.addProfil(pseudo);
      $("#map").css("display","block");
      addProfilEnabled();
      initialeLoad();
       }
  }
  }); 
  
  $('#button_modif_profil').click(function() {
  var pseudo=$('#profil_name_modif_new').val();
  if(pseudo=='')
     alert('Votre champs est vide');
  else{
   if(DB.getDatabase()){
      $("#map").css("display","block");
     initialeLoad();
       }
  }
 
});
});






