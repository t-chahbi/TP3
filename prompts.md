Voici la liste des prompts gemini à utilisés pour chaque étape du TP.

### Prompt pour l'Étape 1 (Structure de base)
> "Agis comme un expert en développement web. Crée le code HTML et CSS de base pour le jeu des Tours de Hanoï. Je veux une page contenant :
> 1. Une zone de jeu affichant 3 tours (socles + tiges) alignées horizontalement.
> 2. Un champ de saisie (un input) pour choisir le nombre d'anneaux.
> 3. Un bouton 'Démarrer'.
> N'écris pas encore le JavaScript, concentre-toi uniquement sur la structure et le style (CSS avec Flexbox)."

### Prompt pour l'Étape 2 (Génération des anneaux)
> "Maintenant, ajoutons le JavaScript. Écris une fonction qui se déclenche au clic sur 'Démarrer'. Elle doit :
> 1. Vider le plateau.
> 2. Créer dynamiquement le nombre d'anneaux choisi dans l'input (divs).
> 3. Les placer empilés sur la première tour.
> 4. Chaque anneau doit avoir une couleur différente et une largeur décroissante (le plus grand en bas, le plus petit en haut)."

### Prompt pour l'Étape 3 (Logique de déplacement)
> "Implémente la logique de jeu pour déplacer les anneaux.
> Le fonctionnement attendu est :
> 1. Premier clic sur une tour : sélectionne l'anneau du dessus (indique-le visuellement, par exemple avec une bordure).
> 2. Second clic sur une autre tour : déplace l'anneau sélectionné vers cette tour.
> **Règle absolue :** Interdis le déplacement si l'utilisateur essaie de poser un anneau sur un anneau plus petit que lui. Affiche une alerte si le coup est invalide. Cependant il est possible de déplacer un anneau sur un anneau plus grand que lui.
>  Avant de cliquer sur "démarrer", l'utilisateur ne pourra pas bouger les anneaux."


### Prompt pour l'Étape 4 (Améliorations visuelles)
> "Améliore le design global de la page via le CSS pour la rendre plus professionnelle.
> - Utilise une palette de couleurs harmonieuse pour les anneaux et les tours.
> - Ajoute un effet de survol (hover) sur les tours pour montrer qu'elles sont interactives."
> - Ajoute des petites animations qui rendent le jeu plus visuel.
> - Rends le jeu responsive.

### Prompt pour l'Étape 5 (Démo automatique)
> "Ajoute un bouton 'Démo Automatique'.
> Lorsqu'on clique dessus, le script doit résoudre le jeu tout seul en utilisant l'algorithme récursif des Tours de Hanoï.
> **Important :** Ajoute un délai de 500ms entre chaque mouvement pour que je puisse voir l'animation se dérouler, sinon la résolution sera instantanée."

### Prompt pour l'Étape 6 (Fonctionnalités avancées)
> "Ajoute les extensions suivantes au jeu :
> 1. Un compteur de coups qui s'incrémente à chaque mouvement.
> 2. L'affichage du score minimal théorique (2^n - 1) pour comparer.
> 3. Une détection de victoire : quand tous les anneaux sont sur la dernière tour, affiche un message 'Bravo'.
> 4. Un bouton 'Reset' pour recommencer.
> 5. Une transition CSS fluide sur les anneaux pour qu'ils glissent au lieu de se téléporter.
> 6. Un bouton pour basculer entre Mode Sombre et Mode Clair. Le theme sombre seur bleuté (Style midnight dark) et le theme claire sera très blanc et pure avec des ombres douces pour garder la lisibilité."

### Prompt pour l'Étape 7 (Le Prompt Unique / "Mega Prompt")
"**Rôle :**
Agis comme un Expert Senior en Développement Front-End et UI/UX Designer spécialisé dans les interfaces web modernes et le "Creative Coding".

**Tâche :**
Génère le code complet (HTML, CSS, JS) regroupé en **un seul fichier HTML** pour une version premium du jeu des "Tours de Hanoï".

**Spécifications du Design (UI/UX) :**
1.  **Style Global :** Utilise un design **Glassmorphism** (effets de verre dépoli, transparences, flou). L'interface doit être fluide, épurée et moderne.
2.  **Gestion des Thèmes (CSS Variables) :**
    *   **Mode Sombre (Défaut) :** Doit être "Deep Midnight & Cyber". Utilise un dégradé de fond allant du noir bleuté profond (`#02050e`) vers un bleu nuit intense (`#1e3c72`). Les éléments doivent ressembler à du verre fumé sombre. Texte : Blanc bleuté.
    *   **Mode Clair :** Doit être "Ethereal Sky". Fond blanc vers bleu ciel très pâle. Verre givré lumineux. Texte : Bleu roi foncé.
    *   **Transition :** Transition douce lors du changement de thème.
3.  **Éléments de Jeu :**
    *   **Tours :** Socles et tiges avec un aspect métallique/3D subtil.
    *   **Anneaux :** Doivent avoir un aspect 3D (cylindres) grâce à des dégradés (`linear-gradient`) et une légère brillance. Couleurs dynamiques (HSL) pour chaque taille d'anneau.
    *   **Animations :** Les anneaux doivent "atterrir" avec une animation fluide (effet de rebond/amorti CSS) lorsqu'on les dépose.

**Fonctionnalités JavaScript (Logique) :**
1.  **Mécanique de jeu :**
    *   Sélection au clic (l'anneau se soulève).
    *   Déplacement au second clic.
    *   **Règle stricte :** Impossible de poser un anneau sur un plus petit (afficher une alerte ou un feedback visuel).
    *   Utilisation de `flex-direction: column-reverse` pour empiler visuellement les anneaux du bas vers le haut.
2.  **Contrôles et Stats :**
    *   Input pour choisir le nombre d'anneaux (min 3, max 8).
    *   Bouton "Démarrer" (initialise le plateau).
    *   Bouton "Reset" (recommence la partie).
    *   Compteur de coups en temps réel.
    *   Affichage de l'Objectif (Nombre de coups minimal théorique : $2^n - 1$).
    *   Message de victoire festif qui apparaît à la fin.
3.  **Mode "Démo Automatique" :**
    *   Un bouton dédié qui lance un algorithme récursif pour résoudre le jeu tout seul.
    *   **Important :** Utilise `async/await` et une fonction de délai (ex: 500ms) pour que l'utilisateur puisse voir chaque mouvement se produire à l'écran.
    *   Bouton d'arrêt d'urgence ou désactivation des contrôles pendant la démo.
4.  **Technique :**
    *   Code JS moderne (ES6+).
    *   Code responsive (s'adapte aux mobiles).
    *   Sauvegarde du choix du thème dans le `localStorage`.

**Structure du livrable :**
Fournis un seul bloc de code contenant :
*   `<!DOCTYPE html>...`
*   `<style>...</style>` (Le CSS complet avec les animations et le responsive).
*   Le `<body>` avec la structure sémantique.
*   `<script>...</script>` (La logique JS complète et commentée).

Génère le code maintenant."

### Prompt pour l'Étape 8
> "Modifie le code JavaScript généré pour ajouter des Docstrings (format JSDoc) avant chaque fonction.
> Chaque docstring doit décrire :
> - Le rôle de la fonction.
> - Les paramètres (type et description).
> - La valeur de retour (si applicable)."