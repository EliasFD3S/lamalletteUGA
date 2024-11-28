document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const pageTitle = document.getElementById('page-title');
    const container = document.getElementById('content-container');
    const loadingSpinner = createLoadingSpinner();
    
    // Détermine le niveau en fonction de l'URL
    const niveau = window.location.pathname.includes('tuto1.html') ? 'tutorat_l1' : 'tutorat_l2';
    
    // Affiche le spinner pendant le chargement
    container.appendChild(loadingSpinner);

    // Charge les données
    loadTutoratData()
        .then(displayContent)
        .catch(handleError);

    // Fonction pour créer le spinner de chargement
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'text-center my-5';
        spinner.innerHTML = `
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-2">Chargement des ressources...</p>
        `;
        return spinner;
    }

    // Fonction pour charger les données
    async function loadTutoratData() {
        try {
            const response = await fetch('data/tutorat.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data[niveau];
        } catch (error) {
            throw new Error('Impossible de charger les données du tutorat');
        }
    }

    // Fonction pour afficher le contenu
    function displayContent(tutorat) {
        // Retire le spinner
        container.innerHTML = '';
        
        // Met à jour le titre
        pageTitle.textContent = tutorat.titre;
        
        // Génère le contenu pour chaque matière
        Object.entries(tutorat.matieres).forEach(([id, matiere]) => {
            const matiereHtml = createMatiereElement(id, matiere);
            container.insertAdjacentHTML('beforeend', matiereHtml);
        });

        // Ajoute les écouteurs d'événements pour la recherche
        setupSearch();
        
        // Ajoute le compteur de ressources
        addResourceCounter();
    }

    // Fonction pour gérer les erreurs
    function handleError(error) {
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Erreur de chargement</h4>
                <p>${error.message}</p>
                <hr>
                <p class="mb-0">
                    <button class="btn btn-outline-danger btn-sm" onclick="location.reload()">
                        <i class="fas fa-sync-alt me-2"></i>Réessayer
                    </button>
                </p>
            </div>
        `;
    }

    // Fonction pour créer l'élément matière
    function createMatiereElement(id, matiere) {
        return `
            <div class="card mb-4" id="${id}">
                <div class="card-header bg-success text-white">
                    <h2 class="h5 mb-0">
                        <i class="${matiere.icone} me-2"></i>
                        ${matiere.titre}
                    </h2>
                </div>
                <div class="card-body">
                    <div class="accordion" id="accordion${id}">
                        ${matiere.sections.map((section, index) => createSectionElement(id, section, index)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction pour créer l'élément section
    function createSectionElement(matiereId, section, index) {
        return `
            <div class="accordion-item">
                <h3 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#collapse${matiereId}${index}">
                        ${section.titre}
                    </button>
                </h3>
                <div id="collapse${matiereId}${index}" 
                     class="accordion-collapse collapse" 
                     data-bs-parent="#accordion${matiereId}">
                    <div class="accordion-body">
                        <div class="list-group">
                            ${section.fichiers.map(createFileElement).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Définition des types de fichiers pris en charge
    const FILE_ICONS = {
        // Archives
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive',
        '7z': 'fas fa-file-archive',
        'tar': 'fas fa-file-archive',
        'gz': 'fas fa-file-archive',
        
        // LaTeX
        'tex': 'fas fa-subscript',
        'latex': 'fas fa-subscript',
        
        // Java
        'java': 'fab fa-java',
        'class': 'fab fa-java',
        'jar': 'fab fa-java',
        
        // PDF
        'pdf': 'far fa-file-pdf',
        
        // Racket et R
        'rkt': 'fas fa-lambda',  // Pour DrRacket
        'r': 'fab fa-r-project'  // Pour R
    };

    // Fonction pour déterminer l'icône
    function getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return {
            icon: FILE_ICONS[extension] || 'far fa-file', // icône par défaut si extension non reconnue
            color: getIconColor(extension)
        };
    }

    // Fonction pour déterminer la couleur de l'icône
    function getIconColor(extension) {
        switch(extension) {
            case 'pdf':
                return 'text-danger';
            case 'java':
            case 'class':
            case 'jar':
                return 'text-warning';
            case 'tex':
            case 'latex':
                return 'text-primary';
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return 'text-secondary';
            case 'rkt':
                return 'text-info';     // Couleur bleue pour Racket
            case 'r':
                return 'text-primary';  // Couleur bleue pour R
            default:
                return 'text-muted';
        }
    }

    // Modifiez la fonction createFileElement pour ajouter l'extension dans le titre
    function createFileElement(fichier) {
        const fileInfo = getFileIcon(fichier.chemin);
        const extension = fichier.chemin.split('.').pop().toLowerCase();
        
        return `
            <a href="${fichier.chemin}" 
               class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <div>
                    <i class="${fileInfo.icon} ${fileInfo.color} me-2"></i>
                    ${fichier.titre}
                    <small class="text-muted ms-2">.${extension}</small>
                </div>
                <i class="fas fa-download"></i>
            </a>
        `;
    }

    // Fonction pour configurer la recherche
    function setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control mb-4';
        searchInput.placeholder = 'Rechercher une ressource...';
        container.insertBefore(searchInput, container.firstChild);

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                const content = card.textContent.toLowerCase();
                card.style.display = content.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Fonction pour ajouter le compteur de ressources
    function addResourceCounter() {
        const totalFiles = document.querySelectorAll('.list-group-item').length;
        const counter = document.createElement('div');
        counter.className = 'alert alert-info mt-4';
        counter.innerHTML = `
            <i class="fas fa-info-circle me-2"></i>
            ${totalFiles} ressources disponibles
        `;
        container.insertBefore(counter, container.firstChild);
    }
}); 