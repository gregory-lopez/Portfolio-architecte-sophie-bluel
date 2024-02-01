document.addEventListener('DOMContentLoaded', function () {

    let modal = null;

    const stopPropagation = function (e) {
        e.stopPropagation();
    };

    const openModal = function (e) {
        e.preventDefault();
        modal = document.querySelector(e.target.getAttribute('href'));
        modal.style.display = null;
        modal.addEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

        // Appel à l'API pour récupérer les images des projets
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                // Sélectionne l'élément où tu veux afficher les images
                const imageContainer = modal.querySelector('.modal-images');
                // Parcourt les données de l'API et crée des éléments img pour chaque image
                data.forEach(project => {
                    const image = document.createElement('img');
                    image.src = project.imageUrl; // Récupère l'URL de l'image depuis la propriété "imageUrl" de l'objet
                    image.alt = project.title; // Utilise le titre du projet comme attribut alt de l'image
                    imageContainer.appendChild(image); // Ajoute l'image à ton conteneur d'images dans la modal
                });
            })
            .catch(error => {
                console.error('Une erreur s\'est produite lors de la récupération des données:', error);
            });
    };

    const closeModal = function (e) {
        if (modal === null) return;
        e.preventDefault();
        modal.style.display = "none";
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        
        // Supprime les images générées en JavaScript
        const imageContainer = modal.querySelector('.modal-images');
        imageContainer.innerHTML = ''; // Vide le contenu de l'élément
        
        modal = null;
    };

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

});
