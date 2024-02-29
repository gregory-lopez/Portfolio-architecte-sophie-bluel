document.addEventListener('DOMContentLoaded', function () {

  window.fetchEtMettreAJourGalerie = function(categorieId = '0') { // Fonction pour faire l'appel à l'API et mettre à jour la galerie
    const worksUrl = 'http://localhost:5678/api/works';
    const categoriesUrl = 'http://localhost:5678/api/categories';
    const galerieContainer = document.getElementById('galerie-container');

    fetch(categoriesUrl) // Appel à l'API pour récupérer les catégories
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur de récupération des catégories : ${response.statusText}`);
        }
        return response.json();
      })
      .then(categoriesData => {
        genererBoutonsFiltre(categoriesData); // Génération des boutons de filtre
        fetchWorksAndUpdateGallery(worksUrl, galerieContainer, categorieId); // Appel à l'API pour récupérer les projets et mettre à jour la galerie
      })
      .catch(error => {
        console.error(`Une erreur s'est produite lors de la récupération des catégories : ${error.message}`);
      });
  }

  function fetchWorksAndUpdateGallery(worksUrl, galerieContainer, categorieId) { // Fonction pour récupérer les projets et mettre à jour la galerie
    fetch(worksUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur de récupération des données : ${response.statusText}`);
        }
        return response.json();
      })
      .then(worksData => {
        const projetsFiltres = filtrerProjetsParCategorie(worksData, categorieId); // Filtrer les projets
        mettreAJourGalerie(galerieContainer, projetsFiltres); // Mettre à jour la galerie
      })
      .catch(error => {
        console.error(`Une erreur s'est produite lors de la récupération des projets : ${error.message}`);
      });
  }

  function filtrerProjetsParCategorie(projets, categorieId) { // Fonction pour filtrer les projets en fonction de la catégorie
    if (categorieId === '0') {
      return projets;
    } else {
      return projets.filter(projet => projet.categoryId.toString() === categorieId);
    }
  }

  let categorieSelectionneeId = '0'; // Variable pour stocker l'identifiant de catégorie sélectionné
  const tousButton = document.createElement('button'); // Déclaration du bouton "Tous" à l'extérieur de la fonction
  tousButton.classList.add('filtre', 'selected'); // Ajout des classes "filtre" et "selected" par défaut
  tousButton.textContent = 'Tous';
  tousButton.setAttribute('data-categorie', '0');

  function genererBoutonsFiltre(categories) { // Fonction pour générer dynamiquement les boutons de filtre
    const filtresContainer = document.getElementById('filtres');
    filtresContainer.innerHTML = ''; // Supprimer les boutons de filtre existants
    filtresContainer.appendChild(tousButton); // Ajouter le bouton "Tous"
    categories.forEach(categorie => { // Ajouter les boutons de filtre pour chaque catégorie dans les données
      const categorieId = categorie.id.toString();
      if (!document.querySelector(`.filtre[data-categorie="${categorieId}"]`)) {
        const bouton = document.createElement('button');
        bouton.classList.add('filtre');
        bouton.textContent = categorie.name;
        bouton.setAttribute('data-categorie', categorieId);
        filtresContainer.appendChild(bouton);
        if (categorieId === categorieSelectionneeId) { // Ajouter la classe "selected" si la catégorie correspond à celle sélectionnée précédemment
          bouton.classList.add('selected');
        }
      }
    });
    attacherEcouteursFiltre(); // Attacher les écouteurs d'événements
  }

  function attacherEcouteursFiltre() { // Fonction pour attacher les écouteurs d'événements aux boutons de filtre
    const filtres = document.querySelectorAll('.filtre');
    filtres.forEach(filtre => {
      filtre.addEventListener('click', () => {
        const categorieId = filtre.getAttribute('data-categorie');
        fetchEtMettreAJourGalerie(categorieId);
        document.querySelectorAll('.filtre').forEach(b => b.classList.remove('selected')); // Réinitialiser tous les boutons
        filtre.classList.add('selected'); // Appliquer la classe 'selected' au bouton cliqué
        categorieSelectionneeId = categorieId;
      });
    });
  }

  function mettreAJourGalerie(container, projets) { // Fonction pour mettre à jour la galerie avec les données récupérées
    container.innerHTML = ''; // Supprimer les travaux existants du HTML
    projets.forEach(projet => { // Ajouter dynamiquement les projets à la galerie
      const projetElement = document.createElement('div');
      const imageElement = document.createElement('img');
      imageElement.src = projet.imageUrl;
      imageElement.alt = projet.title;  // Ajoute un texte alternatif pour l'accessibilité
      projetElement.appendChild(imageElement);
      const titreElement = document.createElement('figcaption');
      titreElement.textContent = projet.title;
      projetElement.appendChild(titreElement);
      container.appendChild(projetElement);
    });
  }

  fetchEtMettreAJourGalerie(); // Appel initial à l'API et mise à jour de la galerie avec le filtre par défaut (Tous)

});
