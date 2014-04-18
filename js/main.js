
 /*******************************************************
   Fonction lors du chargement de la page
********************************************************/
$(document).ready(function(){

   loadWTSTN();
   chargementJSON();
   chargementHotel();
   
   /********************************************
     Les évenements click des menus
   *******************************************/
   $('a.listes[href^=#]').click(function() {
	 geolocalisationEnabled();
	 modifProfilEnabled();
	 addProfilEnabled();
	 titreHomeEnabled();
	 tabsOngletVisible();
   });
	 
   $('a.modifprofil[href^=#]').click(function() {
	 geolocalisationEnabled();
	 tabsOngletEnabled();
	 addProfilEnabled();
	 titreHomeEnabled();
	 modifProfilVisible();
   });
	 
  $('a.test[href^=#]').click(function() {
	 geolocalisationEnabled();
     tabsOngletEnabled();
     modifProfilEnabled();
	 titreHomeEnabled();
	 addProfilVisible();
   });

  $('a.quitter[href^=#]').click(function() {
	 titreHomeEnabled();
	 window.localStorage.removeItem('idload');
     window.close();
  });  
  
});

