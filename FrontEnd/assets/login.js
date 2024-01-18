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
                // Stocker le token dans localStorage ou sessionStorage
                localStorage.setItem('authToken', data.token);
                // Afficher le token dans la console
                console.log('Token récupéré :', data.token);
                // Rediriger vers index.html
                window.location.replace('index.html');
            } else {
                // Afficher un message d'erreur si la connexion a échoué
                alert('Identifiants invalides. Veuillez réessayer.', data.message);
                console.log(data.message);
            }
        })
    }