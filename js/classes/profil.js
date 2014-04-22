/*****************************************************
Constructor of the Profil class
*****************************************************/
var Profil = function Profil(pseudo) {
	this.pseudo=pseudo;
}

/*************************************************
Prototype of the Profil class
**************************************************/
Profil.prototype = {
	
	/*****Ajouter un profil******/
	addProfil: function(pseudo){
	   DB.addProfil(pseudo);
	}
	
	/*****Modifier un profil*****/
}
/*
1.Créer un profil
2.Modifier un profil
4.Les hotels à proximité du profil
5.Liste des favoris
6.Liste des commentaires
*/	