document.addEventListener('DOMContentLoaded', () => {
    // --- Sélecteurs ---
    const startBtn = document.getElementById('start-btn');
    const demoBtn = document.getElementById('demo-btn');
    const diskCountInput = document.getElementById('disk-count');
    const towerContainers = document.querySelectorAll('.tower-container');
    const inputsArea = document.querySelector('.input-group');

    // --- Variables d'état ---
    let selectedDisk = null;
    let sourceTower = null;
    let isDemoRunning = false; // Pour savoir si la démo est en cours
    let demoStopper = false;   // Drapeau d'urgence pour arrêter la démo

    // --- Écouteurs ---
    startBtn.addEventListener('click', () => initGame(false));
    demoBtn.addEventListener('click', () => initGame(true));

    towerContainers.forEach(tower => {
        tower.addEventListener('click', handleTowerClick);
    });

    /**
     * Initialise le jeu (Mode Joueur ou Mode Démo)
     */
    async function initGame(isDemoMode) {
        // Arrêt d'urgence si une démo précédente tournait
        if (isDemoRunning) {
            demoStopper = true; 
            // On attend un petit peu que la boucle async s'arrête
            await sleep(100); 
        }

        // Réinitialisation variables
        demoStopper = false;
        isDemoRunning = isDemoMode;
        selectedDisk = null;
        sourceTower = null;
        
        // UI Reset
        document.querySelectorAll('.disks-wrapper').forEach(w => w.innerHTML = '');
        document.querySelectorAll('.disk').forEach(d => d.classList.remove('selected'));
        
        // Validation Input
        let count = parseInt(diskCountInput.value);
        if (count < 3) count = 3;
        if (count > 8) count = 8;
        diskCountInput.value = count;

        // Création des anneaux sur la Tour 1
        const startWrapper = document.getElementById('tower-1').querySelector('.disks-wrapper');
        for (let i = count; i >= 1; i--) {
            createDisk(i, count, startWrapper);
        }

        // Lancement de la démo si demandé
        if (isDemoMode) {
            disableControls(true);
            const tower1 = document.getElementById('tower-1').querySelector('.disks-wrapper');
            const tower2 = document.getElementById('tower-2').querySelector('.disks-wrapper');
            const tower3 = document.getElementById('tower-3').querySelector('.disks-wrapper');
            
            // Appel de l'algorithme récursif
            // Algorithme standard : De Source vers Cible (3) en utilisant Auxiliaire (2)
            await solveHanoi(count, tower1, tower3, tower2);
            
            if (!demoStopper) {
                alert("Démonstration terminée !");
            }
            disableControls(false);
            isDemoRunning = false;
        }
    }

    /**
     * Algorithme Récursif des Tours de Hanoï avec Animation
     * n : nombre d'anneaux
     * source, target, aux : les éléments DOM (.disks-wrapper)
     */
    async function solveHanoi(n, source, target, aux) {
        // Si l'utilisateur a cliqué sur "Démarrer" pendant la démo, on arrête tout
        if (demoStopper) return;

        if (n === 0) {
            return;
        }

        // 1. Déplacer n-1 anneaux de Source vers Auxiliaire
        await solveHanoi(n - 1, source, aux, target);

        // Si interruption, on ne fait pas le mouvement
        if (demoStopper) return;

        // 2. Déplacer le n-ième anneau de Source vers Cible (Action visuelle)
        await moveDiskVisual(source, target);

        // 3. Déplacer n-1 anneaux de Auxiliaire vers Cible
        await solveHanoi(n - 1, aux, target, source);
    }

    /**
     * Effectue le déplacement visuel avec délai
     */
    async function moveDiskVisual(fromWrapper, toWrapper) {
        // Sélection visuelle (petit effet UX)
        const disk = fromWrapper.lastElementChild;
        if (!disk) return;
        
        disk.classList.add('selected');
        
        // Délai avant mouvement (temps pour voir la sélection)
        await sleep(200); 
        
        // Mouvement effectif
        disk.classList.remove('selected');
        toWrapper.appendChild(disk);
        
        // Délai après mouvement (temps pour voir le résultat)
        await sleep(300);
    }

    /**
     * Utilitaire : Pause (Promesse)
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gestion des contrôles UI
     */
    function disableControls(disable) {
        if (disable) {
            inputsArea.classList.add('disabled');
        } else {
            inputsArea.classList.remove('disabled');
        }
    }

    // --- (Le reste des fonctions de création et de jeu manuel reste identique) ---

    function createDisk(sizeIndex, totalDisks, container) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        const maxWidth = 160; 
        const calculatedWidth = (sizeIndex / totalDisks) * maxWidth + 20; 
        disk.style.width = `${calculatedWidth}px`;
        const hue = (sizeIndex * 40) % 360; 
        disk.style.backgroundColor = `hsl(${hue}, 70%, 55%)`;
        disk.dataset.size = sizeIndex;
        container.appendChild(disk);
    }

    function handleTowerClick(e) {
        if (isDemoRunning) return; // Interdire l'interaction pendant la démo

        const currentWrapper = e.currentTarget.querySelector('.disks-wrapper');
        
        if (!selectedDisk) {
            if (currentWrapper.childElementCount === 0) return;
            selectedDisk = currentWrapper.lastElementChild;
            sourceTower = currentWrapper;
            selectedDisk.classList.add('selected');
        } else {
            if (currentWrapper === sourceTower) {
                selectedDisk.classList.remove('selected');
                selectedDisk = null;
                sourceTower = null;
                return;
            }
            if (isValidMove(selectedDisk, currentWrapper)) {
                selectedDisk.classList.remove('selected');
                currentWrapper.appendChild(selectedDisk);
                selectedDisk = null;
                sourceTower = null;
                checkWin();
            } else {
                alert("Mouvement impossible !");
            }
        }
    }

    function isValidMove(diskToMove, targetWrapper) {
        if (targetWrapper.childElementCount === 0) return true;
        const topDiskAtTarget = targetWrapper.lastElementChild;
        return parseInt(diskToMove.dataset.size) < parseInt(topDiskAtTarget.dataset.size);
    }

    function checkWin() {
        const tower3 = document.getElementById('tower-3').querySelector('.disks-wrapper');
        const totalDisks = parseInt(diskCountInput.value);
        if (tower3.childElementCount === totalDisks) {
            setTimeout(() => alert("Bravo ! Vous avez gagné !"), 100);
        }
    }
});