function init()
{
	var map = new OpenLayers.Map('map');



var osmLayer = new OpenLayers.Layer.OSM();

map.addLayer(osmLayer);

map.zoomToMaxExtent();
	
}