/******************************************************
Constructor of the Position class
******************************************************/
var Position = function Position(longitude,latitude){
	this.latitude =latitude; 
	this.longitude = longitude;
	this.hotels=null;
}

/*****************************************************
Prototype of the Position class

1.Enregistrer la position si elle n'existe pas 
**********************************************************/

Position.prototype = {

	setTabHotel:function setTabHotel(tabhotels){
	  this.hotels=tabhotels;
	},
}
	