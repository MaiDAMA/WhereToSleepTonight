var DB_NAME = "WhereToSleepTonight";
var DB_RELEASE = 1;
var db;
var store;
var storeProfil;
var storeFavoris;
var storePosition;
var storeCommentaire;
var storeHotel;
var storeAchievementsFavoris;

// window.indexedDB
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// window.IDB* objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// test indexedDB
if (!window.indexedDB) {
  alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}


window.onload = function() {
  var request = indexedDB.open(DB_NAME, DB_RELEASE);

  request.onerror = function(event) {
    alert("The web app isn't allow to use IndexedDB.");
  };

  
  request.onupgradeneeded = function(event) { 
    db = event.target.result;
    //create the objet Store
    storeProfil = db.createObjectStore("profils", {keyPath: "idprofil",autoIncrement: true});
    storeFavoris = db.createObjectStore("favoris", {keyPath: "idfavori",autoIncrement: true});
    storePosition = db.createObjectStore("position", {keyPath: "idposition",autoIncrement: true});
	  storeHotel = db.createObjectStore("Hotel", {keyPath: "idhotel",autoIncrement: true});

    //create an multientry index for Profil
    profils.createIndex("favoris", "favoris", {multiEntry: true});

    //create an multientry index for profil position
    profils.createIndex("positions","position",{multiEntry: true} )



  };
/*
  request.onsuccess = function(event) {
    db = event.target.result;
    
    selectSetting("language");
    selectSetting("sounds");
    selectSetting("music");
    
    for (var i = 0; i < oSettings.levels.list.length; i++) {
      selectLevel(oSettings.levels.list[i].id);
    }
    
    for (var i = 0; i < oSettings.achievementsTimeTrial.list.length; i++) {
      selectAchievement(oSettings.achievementsTimeTrial.list[i].id, "TimeTrial");
    }
    
    for (var i = 0; i < oSettings.achievementsLevels.list.length; i++) {
      selectAchievement(oSettings.achievementsLevels.list[i].id, "Levels");
    }
  }
*/
  }


//Add a profile

function addProfil(pseudo) {
  store = db.transaction("profils", "readwrite").objectStore("profils");
	var data = {pseudo:pseudo};

	console.log("Attempting to write profil ", data);

	var request = store.put(data);
  
  request.onsuccess = function onsuccess() {
    console.log("Write profil succeeded");
  };
  
  request.onerror = function onerror(event) {
    console.log("Write profil failed", event);
  };
};

//delete a profil
function deleteProfil(idprofil) {
 store = db.transaction("profils", "readwrite").objectStore("profils");
 
  console.log("Attempting to delete profil");
  
  var request = store.delete(type);
  
  request.onsuccess = function(event) {
    console.log("Delete profil succeeded");
  }
  request.onerror = function(event) {
    console.log("Delete profil failed", event);
  };
}

//
//Add a profile

function addProfil(pseudo) {
  store = db.transaction("profils", "readwrite").objectStore("profils");
	var data = {pseudo:pseudo};

	console.log("Attempting to write profil ", data);

	var request = store.put(data);
  
  request.onsuccess = function onsuccess() {
    console.log("Write profil succeeded");
  };
  
  request.onerror = function onerror(event) {
    console.log("Write profil failed", event);
  };
};

//delete a profil
function deleteProfil(idprofil) {
 store = db.transaction("profils", "readwrite").objectStore("profils");
 
  console.log("Attempting to delete profil");
  
  var request = store.delete(type);
  
  request.onsuccess = function(event) {
    console.log("Delete profil succeeded");
  }
  request.onerror = function(event) {
    console.log("Delete profil failed", event);
  };
}

