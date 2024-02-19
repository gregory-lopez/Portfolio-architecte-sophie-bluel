const token = localStorage.getItem('authToken');
if(token){
document.addEventListener('DOMContentLoaded', function () {

    const link = document.querySelector('.js-modal');
    link.style.display = 'block';


    console.log(token)

    



    let currentModal = null;
    let addArticleModal = null;

    const stopPropagation = function (e) {
        e.stopPropagation();
    };

    const openModal = function (e) {
        e.preventDefault();
        currentModal = document.querySelector(e.target.getAttribute('href'));
        currentModal.style.display = null;
        currentModal.addEventListener('click', closeModal);
        currentModal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        currentModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

        if (currentModal.id === 'modal') { // Vérifier si les articles n'ont pas déjà été chargés
            MettreAJourGalerieModal();
        }
    };

    function MettreAJourGalerieModal() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                const imageContainer = currentModal.querySelector('.modal-images');
                imageContainer.innerHTML = ''; // Effacer le contenu précédent de la galerie
                data.forEach(project => {
                    const divImages = document.createElement('div');
                    const image = document.createElement('img');
                    const boutonSupprimer = document.createElement('button');
                    boutonSupprimer.textContent = 'Supprimer';
                    image.src = project.imageUrl;
                    image.alt = project.title;
                    image.id = project.id;
                    imageContainer.appendChild(divImages);
                    divImages.appendChild(image);
                    divImages.appendChild(boutonSupprimer);
                    divImages.classList.add('div-photo_container');
                    boutonSupprimer.classList.add('div-photo_delete');
    
                    // Ajouter un gestionnaire d'événements au bouton "Supprimer"
                    boutonSupprimer.addEventListener('click', function () {
                        supprimerArticleParId(project.id); // Appeler la fonction supprimerArticleParId avec l'ID du projet
                    });
                });
            })
        }  

    const resetModal = function (modal) {
        modal.style.display = "none";
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        const imageContainer = modal.querySelector('.modal-images');
    };
    
    const closeModal = function (e) {
        if (currentModal === null) return;
        e.preventDefault();
        resetModal(currentModal);
        resetModal(addArticleModal);
        currentModal = null;
    };

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    let isFormSubmitEventAttached = false; // Variable pour suivre si l'événement de soumission du formulaire est déjà attaché

const openAddArticleModal = function (e) {
    e.preventDefault();
    currentModal.style.display = "none"; // Masquer la modal actuelle
    addArticleModal = document.getElementById('add-article-modal');
    addArticleModal.style.display = null; // Afficher la nouvelle modal
    addArticleModal.addEventListener('click', closeModal);
    addArticleModal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    addArticleModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    if (!isFormSubmitEventAttached) {
        // Écouter l'événement de soumission du formulaire uniquement s'il n'est pas déjà attaché
        const articleForm = addArticleModal.querySelector('#article-form');
        articleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(articleForm);
            console.log(formData);
            // Envoyer les données à votre endpoint API via une requête POST
            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            .then(data => {
                // Traiter la réponse de l'API si nécessaire
                console.log('Article ajouté avec succès:', data);
                // Réinitialiser le formulaire
                articleForm.reset();
                // Mettre à jour la galerie après avoir ajouté l'article
                fetchEtMettreAJourGalerie();
                // Mettre à jour la galerie de la modale après avoir ajouté l'article
                MettreAJourGalerieModal();
                // Retour a la modale de base après l'envoi d'un nouvel article
                goBackToBaseModal();
            })
            .catch(error => {
                console.error('Une erreur s\'est produite lors de l\'ajout de l\'article:', error);
            });
        });

        isFormSubmitEventAttached = true; // Marquer l'événement de soumission du formulaire comme attaché
    }

   // Récupérer les catégories depuis votre API
fetch('http://localhost:5678/api/categories')
.then(response => response.json())
.then(data => {
    const categorySelect = addArticleModal.querySelector('#category');
    
    // Vide le menu déroulant des catégories pour évitez de doublons a l'ouverture et reouverture de la modale
    categorySelect.innerHTML = '';

    // Ajouter chaque catégorie comme une option dans le menu déroulant
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // Assurez-vous que vous avez une propriété "id" pour chaque catégorie
        option.textContent = category.name; // Assurez-vous que vous avez une propriété "name" pour chaque catégorie
        categorySelect.appendChild(option);
    });
})
.catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des catégories:', error);
}); 
};

    const addArticleButton = document.querySelector('.js-add-article');
    addArticleButton.addEventListener('click', openAddArticleModal);


      // Fonction pour supprimer un article par son ID

      function supprimerArticleParId(idArticle) {
        const apiUrl = 'http://localhost:5678/api';
        const url = `${apiUrl}/works/${idArticle}`;
    
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                fetchEtMettreAJourGalerie();
                MettreAJourGalerieModal(); // Appeler la fonction pour mettre à jour la galerie après la suppression
                alert(`L'article avec l'ID ${idArticle} a été supprimé avec succès.`);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'article :', error);
        });
    }

    // Ajouter un gestionnaire d'événements à chaque bouton "Supprimer"
    document.querySelectorAll('.div-photo_delete').forEach(boutonSupprimer => {
        boutonSupprimer.addEventListener('click', function(e) {
            const idArticle = e.target.dataset.id; // Récupérer l'ID de l'article depuis l'attribut data-id
            supprimerArticleParId(idArticle); // Appeler la fonction supprimerArticleParId avec l'ID de l'article
        });
    });

    function goBackToBaseModal() {
        addArticleModal.style.display = "none"; // Masquer la modale du formulaire
        currentModal.style.display = null; // Afficher la modale de base
    }

    const backButton = document.querySelector('.js-modal-back');
    backButton.addEventListener('click', goBackToBaseModal);
});
}
