const token = localStorage.getItem('authToken')
if(token){ 
document.addEventListener('DOMContentLoaded', function () {

    // Initialisation des variables
    let imageLabel = document.querySelector('.add-image-form_container label');
    let addImageIcon = document.querySelector('.add-image-form_container i.fa-regular.fa-image');
    let maxSizeInfo = document.querySelector('.add-image-form_container p');

    // Créez le lien pour la modale avec l'icône
    var linkModal = document.createElement("a");
    linkModal.href = "#modal";
    linkModal.classList.add("js-modal", "portfolio-title_link__modal");
    var iconLinkModal = document.createElement("i");
    iconLinkModal.classList.add("fa-regular", "fa-pen-to-square");
    linkModal.appendChild(iconLinkModal);
    linkModal.appendChild(document.createTextNode(" Modifier"));
    var portfolioTitle = document.querySelector(".portfolio_title");
    portfolioTitle.appendChild(linkModal);
    let currentModal = null;
    let addArticleModal = null;

    // Ouverture de la modal
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
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    // Fonction pour éviter de fermez la modale lorsqu'on clique a l'interieur
     const stopPropagation = function (e) {
        e.stopPropagation();
    };

    // Fonction pour mettre a jour sans recharger la page pour la galerie de la modal
    function MettreAJourGalerieModal() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                const imageContainer = currentModal.querySelector('.modal-images');
                imageContainer.innerHTML = ''; 
                data.forEach(project => {
                    const divImages = document.createElement('div');
                    const image = document.createElement('img');
                    const boutonSupprimer = document.createElement('button');
                    const iconeCorbeille = document.createElement('i');
                    iconeCorbeille.classList.add('fa-solid', 'fa-trash-can', 'trash-button_modal');
                    boutonSupprimer.appendChild(iconeCorbeille); 
                    boutonSupprimer.classList.add('div-photo_delete');
                    image.src = project.imageUrl;
                    image.alt = project.title;
                    image.id = project.id;
                    imageContainer.appendChild(divImages);
                    divImages.appendChild(image);
                    divImages.appendChild(boutonSupprimer);
                    divImages.classList.add('div-photo_container');
    
                    // Ajouter un gestionnaire d'événements au bouton Supprimer
                    boutonSupprimer.addEventListener('click', function () {
                        supprimerArticleParId(project.id); // Appeler la fonction supprimerArticleParId avec l'ID du projet
                    });
                });
            });
    }

    // Fonction qu'utilise closemodal pour réinitialisez des élements, valeurs, attribue
    const resetModal = function (modal) {
        modal.style.display = "none";
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        imageLabel.style.display = 'block';
        addImageIcon.style.display = 'block';
        maxSizeInfo.style.display = 'block';
        preview.src = ''; // Effacer la prévisualisation en définissant la source sur une chaîne vide
        submitButton.classList.remove('submit-check_form');
    };
    
    // Fonction pour fermez les modale avec la croix
    const closeModal = function (e) {
        if (currentModal === null) return;
        e.preventDefault();
        resetModal(currentModal);
        resetModal(addArticleModal);
        currentModal = null;
    };

    let isFormSubmitEventAttached = false; // Variable vérifier que le formulaire est bien vide (empêche la génération d'image multiple en 1 seul formulaire si la modale est ouverte plusieurs fois)
    // Ouvrir la modale d'ajout d'article
    const openAddArticleModal = function (e) {
        e.preventDefault();
        currentModal.style.display = "none"; // Masquer la modal actuelle
        addArticleModal = document.getElementById('add-article-modal');
        addArticleModal.style.display = null; // Afficher la nouvelle modal
        addArticleModal.addEventListener('click', closeModal);
        addArticleModal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        addArticleModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    
        if (!isFormSubmitEventAttached) {
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

      // Fonction pour supprimer un article avec son ID
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

    // Fonction pour retourner a la modale précedente
    function goBackToBaseModal() {
        addArticleModal.style.display = "none"; // Masquer la modale du formulaire
        currentModal.style.display = null; // Afficher la modale de base
        imageLabel.style.display = 'block';
        addImageIcon.style.display = 'block';
        maxSizeInfo.style.display = 'block';
        submitButton.classList.remove('submit-check_form');
        // Réinitialiser la prévisualisation de l'image
        const preview = document.getElementById('preview');
        preview.src = ''; // Effacer la prévisualisation en définissant la source sur une chaîne vide
    
        // Réinitialiser le champ de sélection de fichier
        const input = document.getElementById('js-image-form_upload');
        input.value = ''; // Effacer la sélection de fichier en définissant la valeur sur une chaîne vide
    }
    const backButton = document.querySelector('.js-modal-back');
    backButton.addEventListener('click', goBackToBaseModal);

        // Fonction pour créer et ajouter le lien de logout
    function createLogoutLink() {
        // Créer un nouvel élément de liste pour le logout
        var logoutListItem = document.createElement("li");
        logoutListItem.id = "js-logout";

        // Créer le lien de logout
        var logoutLink = document.createElement("a");
        logoutLink.href = "index.html";
        logoutLink.textContent = "logout";

        // Ajouter un gestionnaire d'événements pour le clic sur le lien de logout
        logoutLink.addEventListener("click", function(event) {
            // Supprimer l'élément 'authToken' du localStorage
            localStorage.removeItem('authToken');
        });

        // Ajouter le lien de logout à l'élément de liste
        logoutListItem.appendChild(logoutLink);

        // Trouver l'élément précédent où insérer le logout (3ème élément dans ce cas)
        var nav = document.querySelector("nav ul");
        var referenceNode = nav.children[3];

        // Insérer l'élément de logout juste avant l'élément de référence
        nav.insertBefore(logoutListItem, referenceNode);
    }
    createLogoutLink();

    // Fonction pour cacher l'élément de login
    function hideLogin() {
        var loginElement = document.getElementById("js-login");
        if (loginElement) {
            loginElement.style.display = "none";
        }
    }
    hideLogin();

    // Cachez les filtres
    const filtresDiv = document.getElementById('filtres');
    filtresDiv.style.display = 'none';
    const portfolioTitleDiv = document.querySelector('.portfolio_title');
    portfolioTitleDiv.style.marginLeft = '9%';

    // Créez la bannière admin
    var banner = document.createElement("div");
    banner.classList = "banner-admin";
    banner.innerHTML = "<p><i class='fa-regular fa-pen-to-square'></i>Mode édition</p>";
    var header = document.querySelector("header");
    header.insertBefore(banner, header.firstChild);

     const imageUploadForm = document.getElementById('image');
     const titleUploadForm = document.getElementById('title');
     const selectCategoryUploadForm = document.getElementById('category');
     const submitButton = document.getElementById('submit-article');

    // Fonction pour afficher la prévisualisation de l'image
    function previewImage(event) {
        const input = event.target;
        const preview = document.getElementById('preview');

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Afficher l'image prévisualisée
                preview.src = e.target.result;
                preview.style.display = 'block';

                // Cacher les autres éléments
                imageLabel.style.display = 'none';
                addImageIcon.style.display = 'none';
                maxSizeInfo.style.display = 'none';
            };
            reader.readAsDataURL(input.files[0]); // Lire le fichier sélectionné en tant que URL de données
        }
    }
    // Attachez l'événement onchange pour l'input file pour prévisualisation de l'image
    const inputFile = document.getElementById('image');
    if (inputFile) {
        inputFile.addEventListener('change', previewImage);
    }
       
     const checkForm = function() {
         if (imageUploadForm.files[0]?.size < 4000000 && titleUploadForm.value !== '' && selectCategoryUploadForm.value !== '') {
             submitButton.classList.add('submit-check_form');
         } else {
             submitButton.classList.remove('submit-check_form');
         }
     };

     imageUploadForm.addEventListener('change', checkForm);
     titleUploadForm.addEventListener('input', checkForm);
     selectCategoryUploadForm.addEventListener('change', checkForm);

    });
}

