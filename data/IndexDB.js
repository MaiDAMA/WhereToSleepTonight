var params = {
	dbName: 'db_wtst', //nom de la BDD	
	version: 11,//version						
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
			
			DB.request.onupgradeneeded = function(e) {
				console.log("DB.request.onupgradeneeded");
				var db = e.target.result;
				if(!db.objectStoreNames.contains("")) 
				{
					console.log("DB.request.onupgradeneeded");
					var objectStore = db.createObjectStore("profil", { keyPath: "id", autoIncrement:true });
					objectStore.createIndex('name', 'name', {unique:false});
					
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
				console.log("DB.request.onupgradeneeded : OK");
			}
			DB.request.onsuccess = function(e) {
				console.log("DB.request.success : "+e.target.result);
				DB.db = e.target.result;
				DB.selectAll();
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
			DB.selectAll();
		};
		request.onerror = DB.onerror;
	},
	
	/**
	 * Supprime le profil dont l'id est passé en paramètre
	 */
	deleteProfil: function(id){
		var transaction = DB.db.transaction(["profil"],"readwrite");
		var store = transaction.objectStore("profil");
		var request = store.delete(id);
		request.onsuccess = function(evt){
			DB.selectAll();
		};
		request.onerror = DB.onerror;
		
	},
	
	getProfil: function(id){
	
	
	},
	/**
	 * Récupérer le profil s'il existe
	 */
	selectAll: function(){
		var keyRange = IDBKeyRange.lowerBound(0);
		var transaction = DB.db.transaction(["profil"],"readwrite");
		var store = transaction.objectStore("profil");
		var request = store.openCursor(keyRange);
		
		request.onsuccess = function(e) {
		    var result = e.target.result;
		    if(result == null) return;

		    DB.renderProfil(result.value);
		    result.continue();
		};
	},
	
	/**
	 * Retourner le profil
	 */
	renderProfil:function(row)
	{
		return row;
	},

	onerror: function(evt){
		console.log(evt);
	}
};
	