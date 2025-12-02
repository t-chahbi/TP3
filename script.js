document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments du DOM ---
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const demoBtn = document.getElementById('demo-btn');
    const themeBtn = document.getElementById('theme-btn');
    const diskCountInput = document.getElementById('disk-count');
    const towerContainers = document.querySelectorAll('.tower-container');
    const controlsArea = document.querySelector('.controls'); // Pour désactiver les inputs
    const victoryMsg = document.getElementById('victory-message');

    // Stats DOM
    const moveCountDisplay = document.getElementById('move-count');
    const minMovesDisplay = document.getElementById('min-moves');

    // --- Variables d'état ---
    let selectedDisk = null;
    let sourceTower = null;
    let isDemoRunning = false;
    let demoStopper = false;
    let moveCount = 0;
    let totalDisks = 3;

    // --- Initialisation ---
    // Charger le thème depuis le localStorage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // --- Écouteurs d'événements ---
    startBtn.addEventListener('click', () => initGame(false));
    resetBtn.addEventListener('click', () => initGame(false));
    demoBtn.addEventListener('click', () => initGame(true));
    themeBtn.addEventListener('click', toggleTheme);

    towerContainers.forEach(tower => {
        tower.addEventListener('click', handleTowerClick);
    });

    /**
     * Bascule entre le mode sombre et le mode clair.
     * Met à jour l'icône du bouton et sauvegarde la préférence dans le localStorage.
     */
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeBtn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    /**
     * Initialise ou réinitialise le jeu.
     * Configure le plateau, les variables d'état et lance le mode démo si demandé.
     * 
     * @param {boolean} isDemoMode - Indique si le jeu doit démarrer en mode démonstration automatique.
     */
    async function initGame(isDemoMode) {
        // Arrêt démo si en cours
        if (isDemoRunning) {
            demoStopper = true;
            await sleep(100);
        }

        // Reset Variables
        demoStopper = false;
        isDemoRunning = isDemoMode;
        selectedDisk = null;
        sourceTower = null;
        moveCount = 0;
        updateStats();
        victoryMsg.classList.add('hidden');

        // Nettoyage Plateau
        document.querySelectorAll('.disks-wrapper').forEach(w => w.innerHTML = '');

        // Validation et Calcul Stats
        totalDisks = parseInt(diskCountInput.value);
        if (totalDisks < 3) totalDisks = 3;
        if (totalDisks > 8) totalDisks = 8;
        diskCountInput.value = totalDisks;

        // Affichage Score Minimal (2^n - 1)
        minMovesDisplay.textContent = Math.pow(2, totalDisks) - 1;

        // Création des anneaux
        const startWrapper = document.getElementById('tower-1').querySelector('.disks-wrapper');
        for (let i = totalDisks; i >= 1; i--) {
            createDisk(i, totalDisks, startWrapper);
        }

        // Mode Démo
        if (isDemoMode) {
            disableControls(true);
            const t1 = document.getElementById('tower-1').querySelector('.disks-wrapper');
            const t2 = document.getElementById('tower-2').querySelector('.disks-wrapper');
            const t3 = document.getElementById('tower-3').querySelector('.disks-wrapper');

            await solveHanoi(totalDisks, t1, t3, t2);

            if (!demoStopper) alert("Démonstration terminée !");
            disableControls(false);
            isDemoRunning = false;
        }
    }

    /**
     * Met à jour l'affichage du compteur de coups dans le DOM.
     */
    function updateStats() {
        moveCountDisplay.textContent = moveCount;
    }

    /**
     * Crée un élément visuel représentant un anneau (disque).
     * Calcule sa largeur et sa couleur en fonction de sa taille.
     * 
     * @param {number} sizeIndex - L'index de taille de l'anneau (plus grand = plus large).
     * @param {number} total - Le nombre total d'anneaux pour le calcul des proportions.
     * @param {HTMLElement} container - L'élément DOM conteneur où ajouter l'anneau.
     */
    function createDisk(sizeIndex, total, container) {
        const disk = document.createElement('div');
        disk.classList.add('disk');

        // Largeur proportionnelle
        const maxWidth = 160;
        const width = (sizeIndex / total) * maxWidth + 20;
        disk.style.width = `${width}px`;

        // Couleur
        const hue = (sizeIndex * 40) % 360;
        disk.style.backgroundColor = `hsl(${hue}, 70%, 55%)`;

        disk.dataset.size = sizeIndex;
        container.appendChild(disk);
    }

    /**
     * Gère le clic sur une tour pour le jeu manuel.
     * Sélectionne un anneau ou tente de le déplacer vers la tour cliquée.
     * 
     * @param {Event} e - L'événement de clic.
     */
    function handleTowerClick(e) {
        if (isDemoRunning) return;

        const currentWrapper = e.currentTarget.querySelector('.disks-wrapper');

        // Sélection
        if (!selectedDisk) {
            if (currentWrapper.childElementCount === 0) return;
            selectedDisk = currentWrapper.lastElementChild;
            sourceTower = currentWrapper;
            selectedDisk.classList.add('selected');
        }
        // Déplacement
        else {
            // Annuler si même tour
            if (currentWrapper === sourceTower) {
                selectedDisk.classList.remove('selected');
                selectedDisk = null;
                sourceTower = null;
                return;
            }

            // Vérifier validité
            if (isValidMove(selectedDisk, currentWrapper)) {
                // Mouvement Valide
                performMove(selectedDisk, currentWrapper);
                selectedDisk = null;
                sourceTower = null;
            } else {
                alert("Mouvement impossible !");
            }
        }
    }

    /**
     * Exécute le déplacement physique d'un anneau vers une nouvelle tour.
     * Incrémente le compteur de coups et vérifie la victoire.
     * 
     * @param {HTMLElement} disk - L'élément DOM de l'anneau à déplacer.
     * @param {HTMLElement} targetWrapper - Le conteneur de la tour de destination.
     */
    function performMove(disk, targetWrapper) {
        disk.classList.remove('selected');
        // Astuce : pour relancer l'animation CSS, on peut cloner ou forcer un reflow.
        // Ici, le simple appendChild déclenche l'animation 'diskLand' définie dans le CSS.
        targetWrapper.appendChild(disk);

        moveCount++;
        updateStats();
        checkWin();
    }

    /**
     * Vérifie si un mouvement est valide selon les règles des Tours de Hanoï.
     * Un anneau ne peut être placé que sur un anneau plus grand ou un emplacement vide.
     * 
     * @param {HTMLElement} disk - L'anneau à déplacer.
     * @param {HTMLElement} targetWrapper - La tour de destination.
     * @returns {boolean} True si le mouvement est valide, False sinon.
     */
    function isValidMove(disk, targetWrapper) {
        if (targetWrapper.childElementCount === 0) return true;
        const topDisk = targetWrapper.lastElementChild;
        return parseInt(disk.dataset.size) < parseInt(topDisk.dataset.size);
    }

    /**
     * Vérifie si la condition de victoire est remplie.
     * La victoire est atteinte si tous les anneaux sont sur la troisième tour.
     */
    function checkWin() {
        const tower3 = document.getElementById('tower-3').querySelector('.disks-wrapper');
        if (tower3.childElementCount === totalDisks) {
            victoryMsg.classList.remove('hidden');
        }
    }

    /**
     * Utilitaires Démo / UI
     */
    /**
     * Active ou désactive les contrôles de l'interface utilisateur.
     * Utilisé pendant le mode démonstration.
     * 
     * @param {boolean} disable - True pour désactiver les contrôles, False pour les activer.
     */
    function disableControls(disable) {
        const btns = controlsArea.querySelectorAll('button, input');
        btns.forEach(b => {
            if (b.id !== 'reset-btn') { // On laisse Reset actif pour pouvoir stopper la démo
                b.disabled = disable;
                if (disable) b.classList.add('disabled');
                else b.classList.remove('disabled');
            }
        });
    }

    /**
     * Crée une pause asynchrone (promesse).
     * 
     * @param {number} ms - La durée de la pause en millisecondes.
     * @returns {Promise<void>} Une promesse qui se résout après le délai.
     */
    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // --- Logique Récursive Démo (mise à jour pour utiliser moveCount) ---
    /**
     * Algorithme récursif pour résoudre les Tours de Hanoï.
     * Effectue les mouvements visuels étape par étape.
     * 
     * @param {number} n - Le nombre d'anneaux à déplacer.
     * @param {HTMLElement} source - La tour source.
     * @param {HTMLElement} target - La tour de destination.
     * @param {HTMLElement} aux - La tour auxiliaire.
     */
    async function solveHanoi(n, source, target, aux) {
        if (demoStopper) return;
        if (n === 0) return;

        await solveHanoi(n - 1, source, aux, target);
        if (demoStopper) return;

        await moveDiskVisual(source, target);

        await solveHanoi(n - 1, aux, target, source);
    }

    /**
     * Effectue un déplacement visuel animé d'un anneau entre deux tours (Mode Démo).
     * 
     * @param {HTMLElement} from - La tour source.
     * @param {HTMLElement} to - La tour de destination.
     */
    async function moveDiskVisual(from, to) {
        const disk = from.lastElementChild;
        if (!disk) return;

        disk.classList.add('selected');
        await sleep(200);

        disk.classList.remove('selected');
        to.appendChild(disk);

        // Mise à jour compteur en démo aussi
        moveCount++;
        updateStats();

        await sleep(300);
    }
});