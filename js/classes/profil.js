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
	
	
	/*****Ajouter un commentaire
	addComentaire(commentaire)
	=>
	1.Dans le main initialiser un commentaire
	2.Le faire passer dans profil.addcommentaire(commentaire)
	3.à l'intérieur de 
	Faire appel à DB.
	Db.addComentaire(pseudo,commentaire)

		/*****Ajouter un favori
	idem
	*****Ajouter un Position
	  idem mais vérifier si existe
	/*****Liste des favoris
	DB.selectAllFavoris(pseudo)
	affichage des favoris en fonction du pseudo
	
	/*****Liste des commentaires
	idem*****/
	
	/*****Liste des position
	idem**/
	
}
