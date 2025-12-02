document.addEventListener('DOMContentLoaded', () => {
    // --- Sélection des éléments DOM ---
    const startBtn = document.getElementById('start-btn');
    const diskCountInput = document.getElementById('disk-count');
    // On sélectionne les conteneurs complets pour le clic (plus facile à cliquer)
    const towerContainers = document.querySelectorAll('.tower-container');
    const startTowerWrapper = document.querySelector('#tower-1 .disks-wrapper');

    // --- Variables d'état ---
    let gameActive = false;     // Le jeu a-t-il commencé ?
    let selectedDisk = null;    // L'élément DOM du disque actuellement sélectionné
    let selectedTower = null;   // La tour d'où vient le disque sélectionné

    // --- Événements ---
    startBtn.addEventListener('click', startGame);

    // On ajoute le clic sur chaque tour
    towerContainers.forEach(tower => {
        tower.addEventListener('click', () => handleTowerClick(tower));
    });

    // --- Fonctions ---

    function startGame() {
        // 1. Réinitialisation complète
        towerContainers.forEach(container => {
            const wrapper = container.querySelector('.disks-wrapper');
            wrapper.innerHTML = ''; // Vide les tours
        });
        
        // Reset des variables
        selectedDisk = null;
        selectedTower = null;
        gameActive = true; // On autorise le jeu

        // 2. Création des anneaux
        const count = parseInt(diskCountInput.value);
        if (count < 3 || count > 8) {
            alert("Veuillez choisir entre 3 et 8 anneaux.");
            gameActive = false;
            return;
        }

        for (let i = count; i >= 1; i--) {
            createDisk(i, count);
        }
    }

    function createDisk(sizeIndex, totalDisks) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        
        const maxWidth = 160; 
        const calculatedWidth = (sizeIndex / totalDisks) * maxWidth + 20; 
        
        disk.style.width = `${calculatedWidth}px`;
        const hue = (sizeIndex * 40) % 360; 
        disk.style.backgroundColor = `hsl(${hue}, 70%, 55%)`;
        
        // On stocke la taille en attribut pour les comparaisons futures
        disk.dataset.size = sizeIndex;

        startTowerWrapper.appendChild(disk);
    }

    // --- Cœur de la logique du jeu ---
    function handleTowerClick(towerContainer) {
        // Si le jeu n'est pas lancé, on ne fait rien
        if (!gameActive) return;

        const disksWrapper = towerContainer.querySelector('.disks-wrapper');
        
        // Grâce au flex-direction: column-reverse, le disque du haut est le dernier enfant
        const topDisk = disksWrapper.lastElementChild;

        // CAS 1 : Aucun disque n'est actuellement sélectionné
        if (selectedDisk === null) {
            if (topDisk) {
                // On sélectionne le disque du dessus
                selectedDisk = topDisk;
                selectedTower = towerContainer;
                topDisk.classList.add('selected'); // Ajoute le style visuel
            }
        } 
        // CAS 2 : Un disque est DÉJÀ sélectionné
        else {
            // Sous-cas : On clique sur la MÊME tour -> On annule la sélection
            if (towerContainer === selectedTower) {
                selectedDisk.classList.remove('selected');
                selectedDisk = null;
                selectedTower = null;
            } 
            // Sous-cas : On clique sur une AUTRE tour -> Tentative de déplacement
            else {
                // Vérification des règles :
                // 1. La tour cible est vide OU
                // 2. Le disque cible (topDisk) est plus grand que le disque sélectionné
                
                // Note : dataset.size est une string, on convertit en int pour comparer
                const sizeSelected = parseInt(selectedDisk.dataset.size);
                const sizeTarget = topDisk ? parseInt(topDisk.dataset.size) : 999; // 999 = infini (si vide)

                if (sizeTarget > sizeSelected) {
                    // --- MOUVEMENT VALIDE ---
                    // appendChild déplace physiquement l'élément d'un parent à l'autre
                    disksWrapper.appendChild(selectedDisk);
                    
                    // Nettoyage après mouvement
                    selectedDisk.classList.remove('selected');
                    selectedDisk = null;
                    selectedTower = null;
                    
                    // (Optionnel) Ici, tu pourrais vérifier la victoire
                } else {
                    // --- MOUVEMENT INVALIDE ---
                    alert("Mouvement impossible : Vous ne pouvez pas placer un grand disque sur un petit !");
                    // On ne désélectionne pas, on laisse le joueur réessayer ailleurs
                }
            }
        }
    }
});