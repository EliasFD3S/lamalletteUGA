document.addEventListener('DOMContentLoaded', () => {
    fetch('data/informations.json', {
        cache: 'no-store',  // Force le rechargement du fichier
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
            // Mise à jour des titres
            document.querySelectorAll('.section-title').forEach(title => {
                const section = title.closest('.card').id;
                title.textContent = data[section].titre;
            });

            // Section présentation
            document.querySelector('#presentation .card-body').innerHTML = data.presentation.contenu;
            
            // Section équipe
            const equipeSection = document.querySelector('#equipe');
            equipeSection.querySelector('.section-intro').textContent = data.equipe.introduction;
            const equipeList = equipeSection.querySelector('ul');
            data.equipe.membres.forEach(membre => {
                equipeList.innerHTML += `
                    <li class="mb-3">
                        <i class="${membre.icone} me-2"></i>
                        ${membre.nom}
                    </li>`;
            });
            
            // Section contact
            const contactSection = document.querySelector('#contact');
            contactSection.querySelector('.section-intro').textContent = data.contact.introduction;
            const contactList = contactSection.querySelector('ul');

            // Informations générales
            data.contact.informations.forEach(info => {
                contactList.innerHTML += `
                    <li class="mb-2">
                        <i class="${info.icone} me-2"></i>
                        ${info.type === 'email' ? 'Email : ' : 'Adresse : '} ${info.valeur}
                    </li>`;
            });

            // Ajout des informations du superviseur
            const superviseur = data.contact.superviseur;
            contactList.innerHTML += `
                <li class="mt-4 mb-2">
                    <h5><i class="${superviseur.icone} me-2"></i>${superviseur.titre}</h5>
                    <ul class="list-unstyled ms-4">
                        <li>${superviseur.nom}</li>
                        <li><i class="fas fa-envelope me-2"></i><strong>Email :</strong> ${superviseur.email}</li>
                        <li><i class="fas fa-map-marker-alt me-2"></i><strong>Bureau :</strong> ${superviseur.bureau}</li>
                    </ul>
                </li>`;
        })
        .catch(error => console.error('Erreur:', error));
}); 