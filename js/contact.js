document.addEventListener('DOMContentLoaded', () => {
    fetch('data/contact.json', {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        return response.json();
    })
    .then(data => {
        const professeursList = document.getElementById('professeurs-list');
        data.professeurs.forEach(professeur => {
            professeursList.innerHTML += `
                <div class="list-group-item">
                    <h5>${professeur.matiere}</h5>
                    <p><strong>Nom :</strong> ${professeur.nom}</p>
                    <p><strong>Email :</strong> <a href="mailto:${professeur.email}">${professeur.email}</a></p>
                </div>`;
        });
    })
    .catch(error => console.error('Erreur:', error));
}); 
