document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const startBtn = document.getElementById('start-btn');
    const diskCountInput = document.getElementById('disk-count');
    const towers = document.querySelectorAll('.disks-wrapper'); // Les zones où vont les anneaux
    const startTower = document.querySelector('#tower-1 .disks-wrapper');

    // Écouteur d'événement sur le bouton
    startBtn.addEventListener('click', startGame);

    function startGame() {
        // 1. Nettoyer le plateau
        // On vide le contenu HTML de chaque wrapper de tour
        towers.forEach(tower => tower.innerHTML = '');

        // 2. Récupérer le nombre d'anneaux choisi
        const count = parseInt(diskCountInput.value);
        
        // Validation basique (au cas où l'utilisateur force les limites HTML)
        if (count < 3 || count > 8) {
            alert("Veuillez choisir entre 3 et 8 anneaux.");
            return;
        }

        // 3. Créer les anneaux
        // IMPORTANT : À cause du CSS "flex-direction: column-reverse",
        // le premier élément ajouté dans le DOM sera visuellement tout en BAS.
        // On doit donc créer le plus grand anneau en premier.
        
        for (let i = count; i >= 1; i--) {
            createDisk(i, count);
        }
    }

    /**
     * Crée un anneau (div) et l'ajoute à la tour de départ
     * @param {number} sizeIndex - L'index de taille (ex: 3 pour le plus grand, 1 pour le petit)
     * @param {number} totalDisks - Le nombre total d'anneaux pour calculer les proportions
     */
    function createDisk(sizeIndex, totalDisks) {
        const disk = document.createElement('div');
        disk.classList.add('disk');

        // --- Calcul de la largeur ---
        // La tour fait 200px de large.
        // Le plus grand (sizeIndex = totalDisks) fera ~180px.
        // Le plus petit fera une taille minimale + un incrément.
        
        // Formule simple : (Index / Total) * (Largeur Max disponible)
        // On ajoute + 40px de base pour que le plus petit ne soit pas minuscule.
        const maxWidth = 160; // 200px - marges
        const calculatedWidth = (sizeIndex / totalDisks) * maxWidth + 20; 
        
        disk.style.width = `${calculatedWidth}px`;

        // --- Gestion de la couleur ---
        // On utilise HSL pour générer des couleurs distinctes automatiquement
        // Hue (teinte) change en fonction de l'index.
        const hue = (sizeIndex * 40) % 360; 
        disk.style.backgroundColor = `hsl(${hue}, 70%, 55%)`;

        // --- Attributs de données ---
        // Utile pour la logique du jeu plus tard (vérifier si on pose un petit sur un grand)
        disk.dataset.size = sizeIndex;

        // --- Ajout au DOM ---
        startTower.appendChild(disk);
    }
});