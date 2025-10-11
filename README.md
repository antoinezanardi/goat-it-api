# 🐐 Goat It API

<!-- TOC -->
* [🐐 Goat It API](#-goat-it-api)
  * [🚀 Présentation du projet](#-présentation-du-projet)
  * [🌐 Plateforme et accessibilité](#-plateforme-et-accessibilité)
  * [🎲 Fonctionnement du jeu](#-fonctionnement-du-jeu)
    * [Types de questions](#types-de-questions)
    * [Déroulement d’une partie](#déroulement-dune-partie)
      * [1️⃣ Création de la partie](#1-création-de-la-partie)
      * [2️⃣ Déroulement du quiz](#2-déroulement-du-quiz)
      * [3️⃣ Fin de partie et départage](#3-fin-de-partie-et-départage)
      * [4️⃣ Partie terminée](#4-partie-terminée)
    * [Chronomètre et indices](#chronomètre-et-indices)
    * [Historique d'une partie](#historique-dune-partie)
    * [Modes de jeu et variantes](#modes-de-jeu-et-variantes)
  * [👤 Interface et expérience utilisateur](#-interface-et-expérience-utilisateur)
    * [Écran d’accueil](#écran-daccueil)
    * [Vues du jeu](#vues-du-jeu)
      * [Lobby (statut `preparing`)](#lobby-statut-preparing)
      * [Partie en cours (statut `quizzing`)](#partie-en-cours-statut-quizzing)
      * [Partie en duel (statut `dueling`)](#partie-en-duel-statut-dueling)
      * [Partie terminée (statut `over`)](#partie-terminée-statut-over)
      * [Partie annulée (statut `canceled`)](#partie-annulée-statut-canceled)
    * [Back-office](#back-office)
    * [À propos](#à-propos)
  * [💽 Base de données et modèles](#-base-de-données-et-modèles)
    * [Langues supportées (`Lang`)](#langues-supportées-lang)
    * [Modèle d'une partie (`Game`)](#modèle-dune-partie-game)
    * [Modèle des scores d'une partie (`GameScores`)](#modèle-des-scores-dune-partie-gamescores)
    * [Modèle des options d'une partie (`GameOptions`)](#modèle-des-options-dune-partie-gameoptions)
    * [Modèle d'une question (`Question`)](#modèle-dune-question-question)
    * [Modèle d'un joueur (`Player`)](#modèle-dun-joueur-player)
  * [👑 Back-office](#-back-office)
  * [🎨 Design System, UX / UI et sons](#-design-system-ux--ui-et-sons)
  * [⛰️ Technologie et infrastructure](#-technologie-et-infrastructure)
  * [💵 Monétisation, confidentialité et légal](#-monétisation-confidentialité-et-légal)
  * [🛣️ Roadmap et MVP](#-roadmap-et-mvp)
  * [🐙 Repositories](#-repositories)
<!-- TOC -->

## 🚀 Présentation du projet

Goat It est un jeu de quiz interactif inspiré de l’émission `Les Grosses Têtes` sur RTL.

Accessible via une WebApp, ce jeu met en scène un animateur qui pose des questions en temps réel aux joueurs.

Le but est de répondre correctement pour accumuler des GOAT points et devenir le **GOAT de la partie**.

---

## 🌐 Plateforme et accessibilité

- WebApp responsive : disponible sur desktop, tablette et mobile.
- Open-source sous licence [MIT-NC](https://github.com/antoinezanardi/goat-it-api/blob/main/LICENSE) (interdiction d’exploitation commerciale).
- Déploiement : hébergé dans un premier temps sur un VPS gratuit avec conteneurisation [Docker](https://www.docker.com/). Par la suite, une alternative pro (payante) sera à
  trouver.
- Sécurisation :
    - API Key distincte pour le front et le back-office.
    - Accès au back-office protégé par un login/mot de passe défini dans la conf Nginx.
- Synchronisation en temps réel via [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) ([NestJS](https://nestjs.com/) WS pour
  l’API, [Nuxt](https://nuxt.com/) pour le front).
- Accessibilité : respect des standards WCAG 2.1 AA.

---

## 🎲 Fonctionnement du jeu

### Types de questions

- **Qui a dit ?** : Trouver l’auteur d’une citation.
- **Éphéméride** : Identifier une personne née ou décédée le jour de la partie.
- **Comment appelle-t-on ?** : Deviner le nom d’un objet ou concept.
- **Culture générale** : Toute autre question généraliste.

Chaque question appartient à un thème minimum (histoire, géographie, cinéma, jeux vidéo…) et est taguée par difficulté.

Un thème doit rester généraliste pour englober un maximum de questions. Par exemple, le thème `cinéma` regroupe les questions sur les films, réalisateurs, acteurs, etc.

Liste des thèmes (non exhaustive) :

- Histoire
- Géographie
- Cinéma
- Jeux vidéo
- Littérature
- Musique
- Sciences
- Sport
- Art
- Technologie
- Nature
- Anecdote (Ex : questions insolites ou amusantes)

Des tags complémentaires sont possiblement ajoutés comme :

- Pour les enfants (questions simples, sans violence ni sujet sensible)
- Interdit aux moins de 18 ans (questions avec des sujets sensibles, violence, sexualité, drogue, etc.)
- Hardcore (questions très difficiles, réservées aux experts)
- D’autres tags sont à définir

Une question peut appartenir à plusieurs thèmes et avoir plusieurs tags.

### Déroulement d’une partie

#### 1️⃣ Création de la partie

- L’animateur entre les noms des joueurs et sélectionne les thèmes et options de jeu s’il le souhaite.
- Le nom des joueurs ne doit pas permettre d’identifier une personne (respect de la vie privée). L’animateur est responsable des noms qu’il entre.
- Minimum deux joueurs pour commencer la partie. Maximum 20 joueurs.
- Maximum 10 spectateurs.
- Le nom des joueurs doit être unique.
- Par défaut : tous les thèmes activés, aucune variante appliquée.
- L’API génère une liste de 20 questions uniques aléatoires (modifiable en cours de partie). Le filtrage se fait selon les thèmes, types, difficultés et tags choisis.
- L'animateur peut (et est encouragé à) prévisualiser les questions avant de commencer la partie.
- En passant en revue les questions, l'animateur peut remplacer une question par une autre aléatoire respectant les mêmes filtres.
- Les joueurs peuvent rejoindre la partie dès ce moment grâce à un code de cinq chiffres et lettres tout en majuscule. Ceci est facultatif, une partie peut se dérouler juste avec
  la vue du maître du jeu. Ce code n’est valide que pour une partie dans le statut « En cours ». Le code ne sera pas composé de 1, I, 0 ou O pour ne pas se tromper dans le
  recopiage. Un QR code pourra aussi être généré.
- Grâce à ce code, un utilisateur peut rejoindre en tant que joueur ou spectateur.
- En somme, au maximum 31 personnes peuvent être connectées à une partie (1 animateur, 20 joueurs, 10 spectateurs).

#### 2️⃣ Déroulement du quiz

- Les joueurs répondent en temps réel (à l’oral) et peuvent poser des questions dont l’animateur peut répondre par **OUI/NON**.
- Un **timer de trois minutes** (personnalisable) permet de cadrer le temps accordé aux réponses des joueurs.
- Si une personne ou un groupe de personne trouve la bonne réponse, l’animateur valide manuellement dans son interface et le ou les joueurs se voient attribué un GOAT point.
- Si personne ne trouve la réponse dans le temps imparti, aucun point n’est accordé. Il n’y a aucune pénalité dans une partie classique.
- L’animateur peut à tout moment passer à la question suivante, ce qui fait que personne n’aura de points.
- Un classement en temps réel est affiché sur toutes les vues.
- L’animateur peut modifier les scores à tout moment (ajout ou retrait de points).

#### 3️⃣ Fin de partie et départage

- Après `20` questions, le joueur avec le plus de points est désigné **GOAT de la partie**.
- Départage en cas d’égalité :
    - Un duel est déclenché automatiquement si plusieurs joueurs ont le même score.
    - Chaque joueur répond à tour de rôle à des questions FACILES (Défini par `difficulty: "easy"` dans la BDD).
    - L’ordre de passage est défini aléatoirement, et le joueur en train de répondre est mis en avant dans toutes les vues.
    - `Trois vies` par joueur, `20 secondes` par question. Le joueur peut dire autant de réponses qu’il souhaite, mais n’aura aucun indice ou aide de l’animateur.
    - Si un joueur échoue (ne trouve pas la bonne réponse au bout du temps de la question), il perd une vie. Quand le joueur n’a plus de vie, il est éliminé.
    - Dernier en lice = GOAT de la partie.
    - Les questions sont chargées dynamiquement en lazy load, `20` par `20`. Toutes les questions seront uniques à la partie, impossible de les réutiliser ou d’avoir des questions
      déjà passées dans la partie. S’il n’y a plus de question, le ou les joueurs avec le plus de vies gagnent la partie (les égalités sont donc possible seulement dans ce cas de
      figure).

#### 4️⃣ Partie terminée

- L’animateur peut choisir de recommencer une nouvelle partie avec les mêmes joueurs et options, ou revenir à l’écran d’accueil.
- Pour chaque partie terminée, l'animateur et le reste des joueurs ont le droit de proposer une nouvelle question via un formulaire. Ces questions seront soumises à validation par
  un administrateur avant d’être ajoutées à la base de données grâce à un back-office.
- Seul l'animateur peut rentrer la nouvelle question. Il doit indiquer son nom ou identifiant.
- L'animateur et tous les joueurs peuvent laisser un avis sur la partie (étoiles + commentaire optionnel).
- Un tableau des scores est affiché avec les gagnants en tête (indicateurs multiples pour les gagnants, les joueurs à égalité, les autres).

Étant donné que les parties sont servies grâce à l’API REST, l’`_id` de la partie sera présent dans l’URL, ce qui permet une reconnexion aisée. Chaque partie a un `_id` unique.

Une partie n'a pas de durée maximale. Elle se termine soit lorsque toutes les questions ont été posées, soit lorsque l'animateur décide de l'arrêter.

Cette dernière n'a pas non plus de TTL (Time To Live) défini. Elle reste active tant que l'animateur ne l'a pas terminée ou annulée.

Les données associées ne sont pas supprimées automatiquement étant donné qu'elles peuvent être utiles pour des statistiques ou des analyses futures.
Elles ne sont pas sensibles, donc la conservation n'est pas un problème majeur.

### Chronomètre et indices

- Timer de trois minutes par question, synchronisé dans toutes les vues via WebSockets.
- Contrôle avancé pour l’animateur : pause et ajout de temps. Les joueurs et les spectateurs voient les actions du MJ avec un indicateur et un son spécifique associé.
- Indices :
    - Le nombre d’indices est variable pour une question. Il peut y en avoir 0 jusqu'à 10.
    - Débloqués progressivement pendant la question. Suivant le nombre d’indices, la cadence de dévoilement est plus ou moins grande (ex : pour 2 indices, révélé au bout de 1 min
      et 2 min). Le dernier indice doit OBLIGATOIREMENT être révélé avant 30s restantes.
    - Le dévoilement des indices ne réduit pas le nombre de GOAT point attribué pour une bonne réponse.
    - Sur la vue `Joueur` et `Spectateur`, seuls les indices déjà débloqués sont visibles.
    - Sur la vue `Animateur`, tous les indices sont visibles dès le départ, avec un indicateur montrant ceux qui ne sont pas encore accessibles aux joueurs.
    - L’animateur peut débloquer les indices en avance.
- Alertes sonores :
    - **Début de question** → Son spécifique.
    - **1 min restante** → Premier signal sonore.
    - **30 sec restantes** → Deuxième signal.
    - **10 dernières secondes** → Tic-tac progressif.
    - **Bonne réponse** → Son spécifique lorsque le MJ valide sur son interface.
    - **Ajout de temps** → Son spécifique.
    - **Dévoilement d’un indice** → Son spécifique.
    - **Arrêt / Reprise du chrono** → Son spécifique.
    - **Début d’un duel en cas d’égalité** → Son spécifique.

### Historique d'une partie

- L'historique de la partie est attachée à la partie elle-même et est consultable par n'importe qui ayant accès à la partie (animateur, joueurs, spectateurs).
- Un historique est une suite d'évènements horodatés, qui peuvent être de différents types :
    - Création de la partie.
    - Début de la partie (passage en statut `quizzing`).
    - Début d'une question.
    - Fin d'une question. (avec indication si une ou plusieurs bonnes réponses ont été données, et par qui).
    - Ajout ou retrait de points à un joueur.
    - Changements sur le timer (pause, reprise, ajout de temps).
    - Dévoilement d'un indice (par l'animateur ou automatiquement).
    - Début d'un duel (passage en statut `dueling`).
    - Fin de la partie (passage en statut `over`).
    - Annulation de la partie (passage en statut `canceled`).

### Modes de jeu et variantes

L’ensemble des points suivants ne sont pas à définir pour le moment, ce n’est qu’une vision future du projet.

- Standard : Réponses classiques sans pénalité.
- Variante rapidité : Bonus de points pour une réponse rapide.
- Mode équipes : Il pourrait dans le futur y avoir un mode équipe contre équipe.
- Personnalisation :
    - L’animateur peut modifier toutes les options à tout moment (nombre de questions, durée du timer, thèmes, difficultés, scores…).
    - Les modifications nécessitant un rechargement des questions affichent une confirmation.
    - Les questions déjà posées restent en mémoire, seules les prochaines sont mises à jour.
    - Interface unifiée : la vue de personnalisation est identique en lobby et en partie.

---

## 👤 Interface et expérience utilisateur

### Écran d’accueil

- Créer une partie → Accès au lobby.
- Rejoindre une partie → Entrer un code de cinq caractères.
- À propos → Explication du projet.
- Boutons redirigeant vers les repositories GitHub et le système de donations (Ko-fi/GitHub Sponsors).

### Vues du jeu

#### Lobby (statut `preparing`)

- **Vue Animateur**
    - Entrée des noms des joueurs (minimum deux pour commencer la partie).
    - Sélection des thèmes, types de questions et options de la partie (optionnel, car les valeurs par défaut sont déjà définies).
    - Liste des joueurs connectés en temps réel (petit indicateur différenciant les joueurs associés ou non à la partie).
    - Bouton pour commencer la partie (activé dès que deux joueurs sont connectés).
    - Affichage du code de la partie pour rejoindre. Un QR code peut être généré.
    - Bouton d’aide basé sur Vue Tour.
    - Nombre de spectateurs connectés.

Pour rejoindre la partie, il suffit d’entrer le code à cinq caractères avec le bouton « Rejoindre une partie » sur l’écran d’accueil ou scanner le QR code.

Une fois fait, l'utilisateur choisit son rôle : Joueur ou Spectateur.

- **Vue Joueur**
    - À la connexion : choix du nom parmi ceux non pris. Si le nom n’est pas dans la liste, l’utilisateur peut entrer un nom libre unique, mais doit être validé par l’animateur.
    - Message d'attente en attendant le début de la partie.
- **Vue Spectateur**
    - Message d'attente en attendant le début de la partie.
    - Affichage du code de la partie et QR code pour rejoindre en tant que joueur.
    - Affichage du nombre de joueurs connectés et de leurs noms.

#### Partie en cours (statut `quizzing`)

- **Vue Animateur**
    - Question en cours avec sa réponse.
    - Une description (optionnelle) de la réponse pour mieux aiguiller les joueurs dans leurs questions et les réponses.
    - Liste des questions disponible.
    - Validation manuelle des réponses.
    - Gestion des indices et du timer.
    - Attribution des points et classement en temps réel.
    - Modifications des scores à tout moment.
    - Options de la partie visibles et modifiables.
    - Bouton d’aide basé sur Vue Tour.
- **Vue Joueur**
    - Question en cours et indices visibles.
    - Timer synchronisé.
    - Classement et nombre de GOAT points.
    - Lecture seule des options de la partie.
    - Bouton d’aide basé sur Vue Tour.
- **Vue Spectateur**
    - Similaire à la vue Joueur, mais sans participation active.
    - Affichage du classement en temps réel.
    - Lecture seule des options de la partie.

#### Partie en duel (statut `dueling`)

- **Vue Animateur**
    - Question en cours avec sa réponse.
    - Une description (optionnelle) de la réponse, mais qui ne sera pas lue aux joueurs en duel.
    - Liste des joueurs en duel avec leurs vies restantes.
    - Gestion du timer.
    - Validation manuelle des réponses.
    - Bouton d’aide basé sur Vue Tour.
- **Vue Joueur**
    - Question en cours (facile) sans indices.
    - Timer synchronisé.
    - Vies restantes.
    - Bouton d’aide basé sur Vue Tour.
- **Vue Spectateur**
    - Similaire à la vue Joueur, mais sans participation active.
    - Affichage des joueurs en duel avec leurs vies restantes.
    - Joueur en train de répondre mis en avant.
    - Bouton d’aide basé sur Vue Tour.

#### Partie terminée (statut `over`)

La vue est similaire pour les trois rôles (Animateur, Joueur, Spectateur) avec quelques différences mineures.

- Tableau des scores final avec les gagnants mis en avant.
- Possibilité de recommencer une nouvelle partie avec les mêmes joueurs et options. **(Bouton uniquement pour l’animateur)**.
- Bouton pour revenir à l’écran d’accueil.
- Formulaire pour proposer une nouvelle question.
- Bouton d’aide basé sur Vue Tour.

#### Partie annulée (statut `canceled`)

La vue est similaire pour les trois rôles (Animateur, Joueur, Spectateur) avec quelques différences mineures.

- Possibilité de recommencer une nouvelle partie avec les mêmes joueurs et options. **(Bouton uniquement pour l’animateur)**.
- Message indiquant que la partie a été annulée par l’animateur.
- Bouton pour revenir à l’écran d’accueil.

### Back-office

- Affichage en tableau des questions avec filtres (thème, difficulté, statut, auteur, mots-clés).
- Tri par date de création par défaut (plus récentes en premier).
- Modale disponible pour créer ou éditer une question.
- Possibilité de supprimer une question avec confirmation.
- Interface sécurisée avec login/mot de passe pour les administrateurs.

### À propos

- Informations sur le projet. (inspiration, open-source, objectifs, public visé).
- Règles du jeu.
- Équipe de développement.
- Lien vers les repositories GitHub.
- Crédits et remerciements.
- Contact pour suggestions ou contributions.
- Lien vers la licence MIT-NC.

---

## 💽 Base de données et modèles

- Stockage dans [MongoDB](https://www.mongodb.com/). Collections principales : `games`, `questions`.
- Indexation sur les champs fréquemment recherchés (thème, difficulté, statut).
- Utilisation de [Mongoose](https://mongoosejs.com/) pour la modélisation des données.

### Langues supportées (`Lang`)

Le projet se veut multilingue. Pour les parties et les questions, les langues supportées sont :

- `en` : Anglais
- `fr` : Français
- `es` : Espagnol
- `de` : Allemand
- `it` : Italien
- `pt` : Portugais
- ... (liste non exhaustive, possibilité d’ajouter d’autres langues)

Pour définir la langue principale d’une partie, le champ `language` du modèle `Game` utilise ce type.

Si une langue n’est pas disponible pour une question, c’est la langue `en` (Anglais) qui sera utilisée par défaut.

### Modèle d'une partie (`Game`)

- **_id** : `ObjectId` – Identifiant unique de la partie généré par MongoDB.
- **inviteCode** : `string` – Code unique à cinq caractères pour rejoindre la partie.
- **players** : `Array<Player> | undefined` – Liste des joueurs avec leurs noms renseignés par l’animateur dans le lobby. Ce champ est vide tant que la partie est en statut
  `preparing`.
- **questions** : `Array<Question> | undefined` – Liste des questions sélectionnées pour la partie. Ce champ est vide tant que la partie est en statut `preparing`.
- **currentQuestionIndex** : `number | undefined` – Index de la question en cours. Commence à 0. Ce champ est `undefined` tant que la partie est en statut `preparing`.
- **usedQuestionsIds** : `Array<ObjectId>` – Liste des identifiants des questions déjà posées dans la partie. Utile pour éviter les doublons en cas de rechargement des questions.
- **status** : `"preparing" | "quizzing" | "dueling" | "over" | "canceled"` – Statut actuel de la partie.
    - `preparing` : La partie est en cours de préparation (lobby). Statut initial.
    - `quizzing` : La partie est en cours, l'animateur pose des questions.
    - `dueling` : Un duel est en cours pour départager des joueurs à égalité.
    - `over` : La partie est terminée.
    - `canceled` : La partie a été annulée par l’animateur.
- **scores** : `GameScores | undefined` – Objet contenant les scores des joueurs. Ce champ est `undefined` tant que la partie est en statut `preparing`.
- **options** : `GameOptions` – Options personnalisées pour la partie (durée du timer, thèmes, variantes, etc.).
- **createdAt** : `Date` – Date et heure de création de la partie.
- **updatedAt** : `Date` – Date et heure de la dernière mise à jour de la partie.

### Modèle des scores d'une partie (`GameScores`)

- **playerScores** : `Record<string, number>` – Objet mappant le nom du joueur à son score (nombre de GOAT points). Tous les joueurs sont initialisés à `0` au début de la partie.
- **winners**: `Array<Player> | undefined` – Liste de(s) joueur(s) gagnant(s). En cas d'égalité, il y aura plusieurs joueurs. Ce champ est `undefined` tant que la partie n’est pas
  en statut `over`.

### Modèle des options d'une partie (`GameOptions`)

- **language** : `Lang` – Langue principale de la partie (définit les énoncés et réponses des questions).
- **question** :
    - **count** : `number` – Nombre total de questions dans la partie. Par défaut `20`. Entre `5` et `50`.
    - **types** : `Array<"quote" | "ephemeride" | "definition" | "general">` – Type(s) de question(s) sélectionné(s) pour la partie. Si vide, tous les types sont sélectionnés.
    - **themes** : `Array<"history" | "geography" | "cinema" | "video-games" | ...>` – Thème(s) sélectionné(s) pour la partie. Si vide, tous les thèmes sont sélectionnés.
    - **difficulties** : `Array<"easy" | "medium" | "hard">` – Difficulté(s) sélectionnée(s) pour la partie. Si vide, toutes les difficultés sont sélectionnées.
    - **tags** : `Array<"for-kids" | "adult-only" | ...>` – Tag(s) supplémentaire(s) pour filtrer les questions. Si vide, tous les tags sont sélectionnés.
- **timer** :
    - **duration** : `number` – Durée du timer en secondes pour chaque question. Par défaut `180` (trois minutes). Entre `30` et `300`.
- **duel** :
    - **enabled** : `boolean` – Indique si le mode duel est activé en cas d’égalité. Par défaut `true`. Si non activé, les joueurs à égalité sont tous déclarés gagnants.
    - **lives** : `number` – Nombre de vies par joueur en duel. Par défaut `3`. Entre `1` et `5`.
    - **timePerQuestion** : `number` – Durée en secondes pour chaque question en duel. Par défaut `20`. Entre `10` et `60`.

### Modèle d'une question (`Question`)

- **_id** : `ObjectId` – Identifiant unique de la question généré par MongoDB.
- **type** : `"quote" | "ephemeride" | "definition" | "general"` – Type de la question.
- **themes** : `Array<"history" | "geography" | "cinema" | "video-games" | ...>` – Thème(s) de la question. Doit contenir au moins un thème.
- **tags** : `Array<"for-kids" | "adult-only" | ...> | undefined` – Tags supplémentaires pour la question.
- **difficulty** : `"easy" | "medium" | "hard"` – Difficulté de la question.
- **statement** : `Record<Lang, string>` – Énoncé de la question, organisée par langue. Chaque énoncé est une chaîne de caractères pouvant contenir jusqu'à `500` caractères.
- **answer** : `Record<Lang, string>` – Réponse correcte à la question, organisée par langue. Chaque réponse est une chaîne de caractères pouvant contenir jusqu'à `200` caractères.
- **description** : `Record<Lang, string>` (optionnel) – Description ou explication de la réponse, organisée par langue. Chaque description est une chaîne de caractères pouvant
  contenir jusqu'à `1000` caractères.
- **hints** : `Record<Lang, Array<string>> | undefined` – Indices pour la question, organisés par langue. Chaque indice est une chaîne de caractères pouvant contenir jusqu'à `200`
  caractères. Ce champ est `undefined` si aucun indice n’est disponible.
- **meta** :
  - **source** : `string | undefined` – Source de la question (livre, site web, etc.). Ce champ est obligatoire pour les citations. Peut contenir jusqu'à `50` caractères.
  - **date** : `Date | undefined` – Date associée à la question (utile pour les questions d’éphéméride). Ce champ est obligatoire pour les questions de type `ephemeride`.
- **status** : `"draft" | "to-validate" | "ready" | "refused""` – Statut de la question.
    - `draft` : La question est en brouillon et n’est pas visible publiquement.
    - `to-validate` : La question est en attente de validation par un administrateur.
    - `ready` : La question a été validée et est disponible pour les parties.
    - `refused` : La question a été refusée par un administrateur.
- **refusedReason** : `string | undefined` – Raison du refus si la question a été refusée. Ce champ est `undefined` si la question n’est pas en statut `refused`. Peut contenir
  jusqu'à `100`caractères. Ce champ est recommandé lors d'un refus pour aider les IA et utilisateurs à améliorer leurs propositions.
- **createdBy** :
  - **name** : `string` – Nom ou identifiant de l’auteur de la question. Peut contenir jusqu'à `30` caractères.
  - **role** : `"admin" | "user" | "ai"` – Rôle de l’auteur. `admin` pour un administrateur, `user` pour un utilisateur régulier, `ai` pour une question générée par une IA.
- **createdAt** : `Date` – Date et heure de création de la question.
- **updatedAt** : `Date` – Date et heure de la dernière mise à jour de la question.

### Modèle d'un joueur (`Player`)

- **_id** : `ObjectId` – Identifiant unique du joueur généré par MongoDB.
- **name** : `string` – Nom unique du joueur dans la partie.

---

## 👑 Back-office

Le back-office permet de gérer les questions des parties. Il est accessible uniquement aux administrateurs via une interface de connexion sécurisée.

- Accès sécurisé par login/mot de passe (défini dans l'API, renvoyant un JWT utilisable pour les endpoints propres au back-office).
- Les identifiants de connexion sont stockés en variables d’environnement dans l’API.
- L'URL du back-office n'est pas publique et n'est pas référencée. Elle est communiquée uniquement aux administrateurs.
- Ajout et validation des questions :
    - Les administrateurs peuvent créer, éditer, valider ou refuser des questions. Un bouton de création ouvre une modale avec un formulaire.
    - L’IA **Groq** pourrait par exemple proposer des indices au moment de la création de la question. Les champs proposables par l'IA sont encore à définir.
    - Les suggestions de l’IA ne sont pas stockées si elles ne sont pas validées. Elles sont juste un gain de temps pour l’administrateur.
    - Si l’IA n’est pas disponible, cela ne doit pas bloquer la création de la question.
    - Lors de la validation d'une question proposée par un utilisateur, l’administrateur peut modifier les champs avant validation.
- Affichage des questions :
    - Tri par défaut : date de création (plus récentes en premier).
    - Filtres : thème, difficulté, auteur, mots-clés.
    - Mode d’affichage : Plusieurs vues possibles (tableau, liste, cartes). Dans un premier temps, une vue tableau suffit.

---

## 🎨 Design System, UX / UI et sons

- Design system basé sur [Nuxt UI](https://ui.nuxt.com/) pour la rapidité de développement et la cohérence visuelle.
- Pour le développement rapide et les classes, [Tailwind CSS](https://tailwindcss.com/) sera utilisé.
- Thème sombre et clair, respect des préférences système.
- Sons libres de droits pour les alertes et actions. L'IA peut aider à générer des sons simples (ex : tic-tac du timer).
- Des petites animations avec des Lottie peuvent être ajoutées pour améliorer l’expérience utilisateur.
- Utilisation de [Figma](https://www.figma.com/) pour le prototypage et le design des interfaces. [Nuxt UI](https://ui.nuxt.com/) fournit aussi des ressources Figma.
- L'accessibilité est une priorité, avec des tests réguliers pour s’assurer du respect des standards WCAG 2.1 AA. Elle servira aussi aux
  tests [Playwright](https://playwright.dev/).
- Le son doit pouvoir être coupé facilement via un bouton dédié dans l’interface.
- Les icônes seront toujours en format SVG pour une meilleure qualité et performance. Pour les icônes, une bibliothèque comme [Heroicons](https://heroicons.com/)
  ou [FontAwesome](https://fontawesome.com/) peut être utilisée.
- Le design de manière générale doit être simple, épuré et intuitif pour une prise en main rapide par les utilisateurs. Le flat design est privilégié.
- Le public visé est large, donc le design doit être neutre et adapté à tous les âges.

---

## ⛰️ Technologie et infrastructure

- **API** : [TypeScript](https://www.typescriptlang.org/), [NestJS](https://nestjs.com/), [MongoDB](https://www.mongodb.com/).
- **Front-ends** : [Nuxt](https://nuxt.com/) ([TypeScript](https://www.typescriptlang.org/)). [Nuxt UI](https://ui.nuxt.com/) pour le thème et le [Figma](https://www.figma.com/).
- **Tests** : Tests unitaires ([Vitest](https://vitest.dev/)), Tests de mutation ([Stryker](https://stryker-mutator.io/)), Tests d’acceptance /
  E2E ([Cucumber](https://cucumber.io/) et [Playwright](https://playwright.dev/) [FRONT])
    * Quels que soient les tests, le coverage sera de 100%.
- **Documentation** : [Swagger](https://swagger.io/) pour l’API. Les README des repositories devront être complets et à jour.
- **Conteneurisation** : [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) pour le développement et le déploiement.
- **Authentification** : [JWT](https://jwt.io/) pour sécuriser les endpoints de l’API. Pas de création de compte utilisateur.
- **IA** : Groq pour la génération de questions (backend) et la suggestion d’indices (back-office).
- **Lint + Format** : [ESLint](https://eslint.org/) + [OXC](https://oxc-project.github.io/). La majorité des règles sont activées. [ESLint Stylistic](https://eslint.style/) pour le
  code style.
- **WebSockets** : Pour la synchronisation en temps réel. [Socket IO](https://socket.io/)
- **Sécurité** :
    - API protégée par API key utilisée dans les headers HTTP. Deux clés distinctes : une pour le front, une pour le back-office.
    - Les API keys sont stockées en variables d’environnement dans l’API.
    - Il n'y aura pas besoin de différencier les données renvoyées par l'API entre les différents rôles (animateur, joueur, spectateur) car le front gère l'affichage en fonction du
      rôle.
    - Le front utilisera un proxy inverse pour cacher l’URL de l’API ainsi que l’API key.
    - CORS configurés pour n’autoriser que le domaine du front.
    - Protection contre les attaques courantes (XSS, CSRF, injections).
    - Limitation du nombre de requêtes (rate limiting) à raison de 100 requêtes par minute et par IP.
    - HTTPS obligatoire via certificat SSL gratuit (Let’s Encrypt).
- **Monitoring** : [Sentry](https://sentry.io/) pour suivi des erreurs. [DataDog](https://www.datadoghq.com/) peut aussi être envisagé si version gratuite disponible.
  Si [DataDog](https://www.datadoghq.com/) est utilisé, [Sentry](https://sentry.io/) ne sera plus nécessaire.
- **Hébergement** : VPS gratuit dans un premier temps. Migration vers GCP/AWS/OVH possible à l’avenir si besoin.
- **Fichiers d'environnement** : Documentés dans un fichier .env.example et le README. Pas de rotation des clés prévue.
- **CI / CD** : [GitHub](https://github.com/) actions illimitées grâce à l’open-source. [CodeRabbit](https://coderabbit.ai/) pour la review de PR au compte-goutte.

---

## 💵 Monétisation, confidentialité et légal

- Projet **open-source** et **gratuit**. La licence [MIT-NC](https://github.com/antoinezanardi/goat-it-api/blob/main/LICENSE) (non commune) interdit toute exploitation commerciale.
- Possibilité de donations via [Ko-fi](https://ko-fi.com/) ou [GitHub Sponsors](https://github.com/sponsors).
- Pas encore d’idée pour une version premium.
- Pas de publicité.
- Pas de collecte de données personnelles. Respect du [RGPD](https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on). Aucune création de compte utilisateur.
- Cookies uniquement pour les préférences utilisateur (thème, langue).
- Pas de tracking (Google Analytics, Matomo, etc.).
- Toutes les citations doivent être sourcées (auteur, œuvre, date), et respecter les droits d’auteur.

---

## 🛣️ Roadmap et MVP

La roadmap reste à définir précisément dans un futur proche.

---

## 🐙 Repositories

- [goat-it-api](https://github.com/antoinezanardi/goat-it-api) : API [NestJS](https://nestjs.com/) gérant les requêtes HTTP.
- [goat-it-web](https://github.com/antoinezanardi/goat-it-web) : Ecosysteme [Nuxt](https://nuxt.com/) qui regroupe le jeu + le back office.
