document.addEventListener('DOMContentLoaded', () => {
    fetch('data/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            // Section héro
            document.querySelector('.hero-title').textContent = data.hero.title;
            document.querySelector('.hero-subtitle').textContent = data.hero.subtitle;
            document.querySelector('.hero-description').textContent = data.hero.description

            // Outils du tuteur
            const tutorToolsContainer = document.querySelector('#tutor-tools');
            data.tutorTools.tools.forEach(tool => {
                tutorToolsContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <i class="${tool.icon} fa-2x mb-3 text-primary"></i>
                                <h4>${tool.title}</h4>
                                <p>${tool.description}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Planning
            const scheduleBody = document.querySelector('#schedule-body');
            data.schedule.sessions.forEach(session => {
                const date = new Date(session.date).toLocaleDateString('fr-FR');
                scheduleBody.innerHTML += `
                    <tr>
                        <td>${date}</td>
                        <td>${session.level}</td>
                        <td>${session.subject}</td>
                        <td>${session.room}</td>
                    </tr>
                `;
            });

            // Informations importantes
            const infoContainer = document.querySelector('#important-info');
            data.importantInfo.items.forEach(item => {
                infoContainer.innerHTML += `
                    <li class="mb-3">
                        <i class="${item.icon} me-2"></i>
                        <strong>${item.title}</strong><br>
                        ${item.content}
                    </li>
                `;
            });
        })
        .catch(error => console.error('Erreur:', error));
});