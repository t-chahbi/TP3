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
    if(localStorage.getItem('theme') === 'light') {
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
     * Basculer entre Mode Sombre et Clair
     */
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeBtn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    /**
     * Initialiser ou Réinitialiser le jeu
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
     * Mise à jour de l'affichage des coups
     */
    function updateStats() {
        moveCountDisplay.textContent = moveCount;
    }

    /**
     * Création visuelle d'un anneau
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
     * Gestion du clic sur une tour (Jeu Manuel)
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
     * Exécute le déplacement et incrémente le compteur
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

    function isValidMove(disk, targetWrapper) {
        if (targetWrapper.childElementCount === 0) return true;
        const topDisk = targetWrapper.lastElementChild;
        return parseInt(disk.dataset.size) < parseInt(topDisk.dataset.size);
    }

    function checkWin() {
        const tower3 = document.getElementById('tower-3').querySelector('.disks-wrapper');
        if (tower3.childElementCount === totalDisks) {
            victoryMsg.classList.remove('hidden');
        }
    }

    /**
     * Utilitaires Démo / UI
     */
    function disableControls(disable) {
        const btns = controlsArea.querySelectorAll('button, input');
        btns.forEach(b => {
            if(b.id !== 'reset-btn') { // On laisse Reset actif pour pouvoir stopper la démo
                b.disabled = disable;
                if(disable) b.classList.add('disabled');
                else b.classList.remove('disabled');
            }
        });
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // --- Logique Récursive Démo (mise à jour pour utiliser moveCount) ---
    async function solveHanoi(n, source, target, aux) {
        if (demoStopper) return;
        if (n === 0) return;

        await solveHanoi(n - 1, source, aux, target);
        if (demoStopper) return;

        await moveDiskVisual(source, target);
        
        await solveHanoi(n - 1, aux, target, source);
    }

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