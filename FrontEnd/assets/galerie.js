
  document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour faire l'appel à l'API et mettre à jour la galerie
function fetchEtMettreAJourGalerie() {
    console.log('Avant l\'appel à fetch');
  
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
        console.log('Données récupérées avec succès :', data);
  
        // Une fois les données récupérées, met à jour la galerie
        mettreAJourGalerie(galerieContainer, data);
      })
      .catch(error => {
        console.error(`Une erreur s'est produite : ${error.message}`);
      });
  }
  
  // Fonction pour mettre à jour la galerie avec les données récupérées
  function mettreAJourGalerie(container, projets) {
    console.log('Mise à jour de la galerie avec les données :', projets);
  
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
  
  // Appel initial à l'API et mise à jour de la galerie
  fetchEtMettreAJourGalerie();

  });