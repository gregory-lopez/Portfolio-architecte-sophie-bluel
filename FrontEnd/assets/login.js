function submitForm() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        // Faire une requête vers l'API pour vérifier les identifiants
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        
        .then(response => {
            return response.json();
        })

        .then(data => {
            // Vérifier si la connexion a réussi
            if (data.token) {
                // Stocker le token dans localStorage
                localStorage.setItem('authToken', data.token);
                // Rediriger vers index.html
                window.location.replace('index.html');
            } else {
                // Création du message d'erreur
                const FormSection = document.getElementById('loginForm')
                const errorMessage = document.createElement('p');
                errorMessage.innerText = `Identifiant ou mot de passe incorrect.`;
                errorMessage.style.textAlign = 'center';
                errorMessage.style.color = 'red';
                errorMessage.style.marginBottom = '15px';
                FormSection.insertBefore(errorMessage, FormSection.lastElementChild);
            }
        })
    }