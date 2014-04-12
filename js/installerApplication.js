var resquest=navigator.mozApps.getSelf();
var manifestUrl = "https://github.com/MaiDAMA/WhereToSleepTonight/manifest.webapp";
request.onsuccess=function (){
	if (request.resukt){
		$('#install').attr(disabled,true);
		$('#status').html('Application déjà installée');
	}
	else{
		$('#install').attr('disabled',false);
		$('#status').html('Application n a pas encore été installée');
	}

}

request.onerror=function(){
	var errorMessage= 'Une erreur est survenue';+this.error.message
	console.log(errorMessage);

}