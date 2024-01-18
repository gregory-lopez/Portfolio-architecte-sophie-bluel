document.addEventListener('DOMContentLoaded', function () {

  // Fonction pour faire l'appel à l'API et mettre à jour la galerie
  function fetchEtMettreAJourGalerie(categorieId = '0') {
    const url = 'http://localhost:5678/api/works';
    const galerieContainer = document.getElementById('galerie-container');

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur de récupération des données : ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Une fois les données récupérées, filtre et met à jour la galerie
        const projetsFiltres = filtrerProjetsParCategorie(data, categorieId);
        mettreAJourGalerie(galerieContainer, projetsFiltres);
      })
      .catch(error => {
        console.error(`Une erreur s'est produite : ${error.message}`);
      });
  }

  // Fonction pour filtrer les projets en fonction de la catégorie
  function filtrerProjetsParCategorie(projets, categorieId) {
    if (categorieId === '0') {
      // Si la catégorie sélectionnée est "Tous", retourne tous les projets
      return projets;
    } else {
      // Sinon, filtre les projets en fonction de la catégorie
      return projets.filter(projet => projet.categoryId.toString() === categorieId);
    }
  }

  // Fonction pour mettre à jour la galerie avec les données récupérées
  function mettreAJourGalerie(container, projets) {
    // Supprimer les travaux existants du HTML
    container.innerHTML = '';

    // Ajouter dynamiquement les projets à la galerie
    projets.forEach(projet => {
      const projetElement = document.createElement('div');

      // Ajouter l'image
      const imageElement = document.createElement('img');
      imageElement.src = projet.imageUrl;
      imageElement.alt = projet.title;  // Ajoute un texte alternatif pour l'accessibilité
      projetElement.appendChild(imageElement);

      // Ajouter le titre
      const titreElement = document.createElement('figcaption');
      titreElement.textContent = projet.title;
      projetElement.appendChild(titreElement);

      // Ajouter d'autres informations si nécessaire...

      container.appendChild(projetElement);
    });
  }

  // Attache les écouteurs d'événements aux boutons de filtre
  const filtres = document.querySelectorAll('.filtre');
  filtres.forEach(filtre => {
    filtre.addEventListener('click', () => {
      const categorieId = filtre.getAttribute('data-categorie');
      fetchEtMettreAJourGalerie(categorieId);
      console.log(categorieId)
    });
  });

  // Appel initial à l'API et mise à jour de la galerie avec le filtre par défaut (Tous)
  fetchEtMettreAJourGalerie();

});
