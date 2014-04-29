
var existePosition=false;
var existeFavori=false;
var tableau_Commentaire= new Array();
var tableau_Favoris=[];

var params = {
	dbName: 'nomDb24', //nom de la BDD	
	version: 44,//version						
};


var DB = { 
	db: null,
	/**
	 * Initialise la base de données
	 */
	init: function(){
		indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
		IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		if(indexedDB)
		{
			DB.request = indexedDB.open(params.dbName, params.version);

			//declaration des variables pour le magasin 
			var storeFavoris;
			var storePosition;
			var storeCommentaire;


			DB.request.onupgradeneeded = function(e) {
				console.log("DB.request.onupgradeneeded");
				var db = e.target.result;
				if(!db.objectStoreNames.contains("")) 
				{
					console.log("DB.request.onupgradeneeded");
					var objectStore = db.createObjectStore("profil", { keyPath: "id", autoIncrement:true });
					
	
				}
				else
				{ 
					//dans le cadre d'une mise à jour de la base (il faut incrémenter le numéro de version)
					console.log("DB.request.onupgradeneeded : modification de la base "+ e.target.result.transaction);
					var objectStore = e.currentTarget.transaction.objectStore("profil");
					
					if(!objectStore.indexNames.contains('name')){
						objectStore.createIndex('name', 'name', {unique:false});
					}else{
						console.log("DB.request.onupgradeneeded : refonte de l'index name ");
						objectStore.deleteIndex('name');
						objectStore.createIndex('name', 'name', {unique:false});

					}
				}
				//creation des objets stores du 
				storeFavoris = db.createObjectStore("favoris", {keyPath: "idfavori",autoIncrement: true});
    			storePosition = db.createObjectStore("position", {keyPath: "idposition",autoIncrement: true});
				storeCommentaire = db.createObjectStore("commentaire", {keyPath: "idcommentaire",autoIncrement: true});
				
				
				console.log("DB.request.onupgradeneeded : OK");
			}
			DB.request.onsuccess = function(e) {
				console.log("DB.request.success : "+e.target.result);
				DB.db = e.target.result;
				DB.selectAllProfil();
				DB.getProfil();
				/*DB.selectAllCommentaire();
				DB.selectAllFavoris();*/
			};
		}
		else
		{
			alert("Le navigateur ne supporte pas les bases de données indexedDb.");
		}
	},
	
	/**
	 * Retourne la base de données, false en cas de problème
	 */
	getDatabase: function(){
		if(DB.db==null){
			DB.init();
			return false;
		}else{
			return DB.db;
		}
	},

	/**
	 * Ajoute un profil à la table profil
	 */
	addProfil: function(name){
		var transaction = DB.getDatabase().transaction(["profil"],"readwrite");
		var store = transaction.objectStore("profil");
		var request = store.put({
		    name: name,
		});
		request.onsuccess = function(e) {
			console.log("Ajouter");
			DB.selectAllProfil();	
		};
		request.onerror = DB.onerror;
	},
	
	 /**
	 * Récupère le profil 
	 */	
	 getProfil: function(){
		var transaction = DB.db.transaction(['profil'], "readonly");
		var store = transaction.objectStore("profil");
        var keyRange = IDBKeyRange.lowerBound(0);
		var request = store.openCursor(keyRange);
		console.log(store);

        request.onerror = function(event) {
          alert("Unable to retrieve data from database!");
        };
        request.onsuccess = function(event) {
          // Do something with the request.result!
            if(request.result) {
               initialeLoad();
			   $("#profil_name_modif_anc").val(request.result.value.name);
            }
            else {
               ihmCreateProfil();
            }
        };


	},

	/**
	 * Modification du nom du profil
	 */
	 changeProfilName: function(){
		
		var transaction = DB.db.transaction(["profil"],"readwrite");
		var name = $("#profil_name_modif_new").val();
        var key = 1;
		var keyRange = IDBKeyRange.lowerBound(0);
		var store = transaction.objectStore("profil");
		var request = store.openCursor(keyRange);

		if(key === "") {
            store.add({name:name});
        } else {
            store.put({name:name,id:Number(key)});
        }

		transaction.oncomplete = function(event) {

			$("#profil_name_modif_anc").val(name);
		    $("#profil_name_modif_new").val("");
				
		};

        return false;
	  
	 },
	/**
	 * Sélectionne toutes les profils et les afficher
	 */
	selectAllProfil: function(){
		var keyRange = IDBKeyRange.lowerBound(0);
		var transaction = DB.db.transaction(["profil"],"readwrite");
		var store = transaction.objectStore("profil");
		var request = store.openCursor(keyRange);
		
		request.onsuccess = function(e) {
		    var result = e.target.result;
		    if(result == null) return;

		    console.log(result.value);
		    result.continue();
			
		};
	},
	
	/**
	* Ajouter un favoris
	*/
	addFavoris: function(infoFavori){

	    var transaction =  DB.db.transaction(["favoris"], "readwrite");
		var store =DB.db.transaction(['favoris'],'readwrite').objectStore('favoris');

		if(existeFavori == true) {
			alert.log('Ce favori existe deja');
		}
		else{
			var request = store.put(
			    infoFavori
			    );

			request.onsuccess = function(e) {
				console.log("favoris ajoute");
			};
			request.onerror = DB.onerror;
		}
	},

 	 /**
    SelectAllFavoris
	**/
    selectAllFavoris: function(){
		var keyRange = IDBKeyRange.lowerBound(0);
		var transaction = DB.db.transaction("favoris","readwrite");
		var store = transaction.objectStore("favoris");
		var request = store.openCursor(keyRange);
		request.onsuccess = function(e) {
		    var result = e.target.result;
		    if(result == null) return;

		    tableau_Favoris.push(result.value);
			console.log(result.value);
		    result.continue();
		};


		//return tableauFavoris;
		var nb=tableau_Favoris.length;
		$("#tabs-3").empty();
		  
		  if(nb==0){
		    var information_Favori="Aucun r&eacute;sultat";
			$("#tabs-3").append("<p>"+information_Favori+"</p>");
		  }
		  
		  for(var i=0;i<nb;i++){
		  var information_Favori="<strong>"+tableau_Favoris[i].infoHotel+"</strong></br>"+
			"<i>Ajout&eacute; le "+tableau_Favoris[i].date+"</i></br>";
		  $("#tabs-3").append("<div id="+"liste_favori_conteneur"+"><img id="+"lien_imagef"+" src="+"img/favoris.png"+"><p><div id="+"bloc_favori"+"><div id="+"contenu_hotel"+">"+information_Favori+"</div></div></p></div>");
		  }
	},
	
	/**
	* Ajouter un commentaire
	*/
	addCommentaire: function(infoCommentaire){

	    var transaction =  DB.db.transaction(["commentaire"], "readwrite");
		var store =DB.db.transaction(['commentaire'],'readwrite').objectStore('commentaire');
	
		var request = store.put(
		    infoCommentaire
		    );

		request.onsuccess = function(e) {
			console.log("commentaire ajouter");
		};
		request.onerror = DB.onerror;
		
	},
	
		/**
    SelectAllCommentaire
	**/
    selectAllCommentaire: function(){

		var keyRange = IDBKeyRange.lowerBound(0);
		var transaction = DB.db.transaction("commentaire","readwrite");
		var store = transaction.objectStore("commentaire");
		var request = store.openCursor(keyRange);
		$("#tabs-2").empty();

		request.onsuccess = function(e) {
		    
		    var result = e.target.result;
		    if(result == null) return;

		    tableau_Commentaire.push(result.value);
		    result.continue();
			
		}
		console.log(tableau_Commentaire.length);
				//return tableauFavoris;
		var nb=tableau_Commentaire.length;
		$("#tabs-2").empty();
		  
		  if(nb==0){
		    var information_Commentaire="Aucun r&eacute;sultat";
			$("#tabs-2").append("<p>"+information_Commentaire+"</p>");
		  }
		  
		  for(var i=0;i<nb;i++){
			var information_hotel=
			"<strong>"+tableau_Commentaire[i].hotel+"</strong></br>"+
	        "<textarea disabled>"+tableau_Commentaire[i].contenucom+"</textarea></br>"+
            "<i>Ajout&eacute; le :"+tableau_Commentaire[i].dateenvoie+"</i></br>";
			$("#tabs-2").append("<div id="+"liste_commentaire_conteneur"+"><img id="+"lien_imagec"+" src="+"img/commentaire.png"+"><p><div id="+"bloc_commentaire"+"><div id="+"contenu_hotel"+">"+information_hotel+"</div></div></p></div>");
		  }
		
	},

	onerror: function(evt){
		console.log(evt);
	}
};
	