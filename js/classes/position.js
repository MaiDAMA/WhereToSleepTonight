/******************************************************
Constructor of the Position class
******************************************************/
var Position = function Position(longitude,latitude){
	this.idposition=0;
	this.latitude =latitude; 
	this.longitude = longitude;
	this.profil=0;//faire passer en paramètre le profil à affecté au this.profil
}

/*****************************************************
Prototype of the Position class

1.Enregistrer la position si elle n'existe pas 
**********************************************************/

Position.prototype = {

	// stockage de la position
	savePosition: function savePosition(){
		
	},
	
}
	