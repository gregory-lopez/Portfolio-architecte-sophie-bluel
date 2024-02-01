document.addEventListener('DOMContentLoaded', function () {

  // Fonction pour faire l'appel à l'API et mettre à jour la galerie
  function fetchEtMettreAJourGalerie(categorieId = '0') {
    const worksUrl = 'http://localhost:5678/api/works';
    const categoriesUrl = 'http://localhost:5678/api/categories';
    const galerieContainer = document.getElementById('galerie-container');

    // Appel à l'API pour récupérer les catégories
    fetch(categoriesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur de récupération des catégories : ${response.statusText}`);
        }
        return response.json();
      })
      .then(categoriesData => {
        // Une fois les catégories récupérées, générez les boutons de filtre
        genererBoutonsFiltre(categoriesData);

        // Appel à l'API pour récupérer les projets
        fetch(worksUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erreur de récupération des données : ${response.statusText}`);
            }
            return response.json();
          })
          .then(worksData => {
            // Filtre et met à jour la galerie
            const projetsFiltres = filtrerProjetsParCategorie(worksData, categorieId);
            mettreAJourGalerie(galerieContainer, projetsFiltres);

            // Attachez les écouteurs d'événements aux nouveaux boutons de filtre
            attacherEcouteursFiltre();
          })
          .catch(error => {
            console.error(`Une erreur s'est produite lors de la récupération des projets : ${error.message}`);
          });
      })
      .catch(error => {
        console.error(`Une erreur s'est produite lors de la récupération des catégories : ${error.message}`);
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

  // Fonction pour générer dynamiquement les boutons de filtre
  function genererBoutonsFiltre(categories) {
    const filtresContainer = document.getElementById('filtres');

    // Supprimer les boutons de filtre existants
    filtresContainer.innerHTML = '';

    // Ajouter le bouton "Tous"
    const tousButton = document.createElement('button');
    tousButton.classList.add('filtre');
    tousButton.textContent = 'Tous';
    tousButton.setAttribute('data-categorie', '0');
    filtresContainer.appendChild(tousButton);

    // Ajouter les boutons de filtre pour chaque catégorie dans les données
    categories.forEach(categorie => {
      const categorieId = categorie.id.toString();

      // Vérifier si le bouton de cette catégorie n'existe pas déjà
      if (!document.querySelector(`.filtre[data-categorie="${categorieId}"]`)) {
        const bouton = document.createElement('button');
        bouton.classList.add('filtre');
        bouton.textContent = categorie.name;
        bouton.setAttribute('data-categorie', categorieId);
        filtresContainer.appendChild(bouton);
      }
    });
  }

  // Fonction pour attacher les écouteurs d'événements aux boutons de filtre
  function attacherEcouteursFiltre() {
    const filtres = document.querySelectorAll('.filtre');
    filtres.forEach(filtre => {
      filtre.addEventListener('click', () => {
        const categorieId = filtre.getAttribute('data-categorie');
        fetchEtMettreAJourGalerie(categorieId);
        console.log(categorieId)
      });
    });
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

  // Appel initial à l'API et mise à jour de la galerie avec le filtre par défaut (Tous)
  fetchEtMettreAJourGalerie();

});
