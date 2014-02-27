
/** Fonction lors du chargement de la page*/

$(document).ready(function(){
	geolocalisation();
});


/**Affichage de la carte*/
var geolocalisation=function(){
	var map = new OpenLayers.Map('map');
	var osmLayer = new OpenLayers.Layer.OSM();
	map.addLayer(osmLayer);
	map.zoomToMaxExtent();
};