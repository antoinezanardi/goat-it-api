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
      * [3️⃣ Fin de partie](#3-fin-de-partie)
    * [Chronomètre et indices](#chronomètre-et-indices)
    * [Modes de jeu et variantes](#modes-de-jeu-et-variantes)
  * [👤 Interface et expérience utilisateur](#-interface-et-expérience-utilisateur)
    * [Écran d’accueil](#écran-daccueil)
    * [Vues du jeu](#vues-du-jeu)
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
  * [⛰️ Technologie et infrastructure](#-technologie-et-infrastructure)
  * [💵 Monétisation et évolutions](#-monétisation-et-évolutions)
  * [🐙 Repositories](#-repositories)
<!-- TOC -->

## 🚀 Présentation du projet

Goat It est un jeu de quiz interactif inspiré de l’émission `Les Grosses Têtes` sur RTL.

Accessible via une WebApp, ce jeu met en scène un animateur qui pose des questions en temps réel aux joueurs.

Le but est de répondre correctement pour accumuler des GOAT points et devenir le **GOAT de la partie**.

---

## 🌐 Plateforme et accessibilité

* WebApp responsive : disponible sur desktop, tablette et mobile.
* Open-source sous licence MIT-NC (interdiction d’exploitation commerciale).
* Déploiement : hébergé dans un premier temps sur un VPS gratuit avec conteneurisation Docker. Par la suite, une alternative pro (payante) sera à trouver.
* Sécurisation :
    * API Key distincte pour le front et le back-office.
    * Accès au back-office protégé par un login/mot de passe défini dans la conf Nginx.
* Synchronisation en temps réel via WebSockets (NestJS WS pour l’API, Nuxt pour le front).
* Accessibilité : respect des standards WCAG 2.1.

---

## 🎲 Fonctionnement du jeu

### Types de questions

* **Qui a dit ?** : Trouver l’auteur d’une citation.
* **Éphéméride** : Identifier une personne née ou décédée le jour de la partie.
* **Comment appelle-t-on ?** : Deviner le nom d’un objet ou concept.
* **Culture générale** : Toute autre question généraliste.

Chaque question appartient à un thème (histoire, géographie, cinéma, jeux vidéo…) et est taguée par difficulté. Des tags complémentaires sont possiblement ajoutés comme :

- Pour les enfants (questions simples, sans violence ni sujet sensible)
- Interdit aux moins de 18 ans (questions avec des sujets sensibles, violence, sexualité, drogue, etc.)
- D’autres tags sont à définir

### Déroulement d’une partie

#### 1️⃣ Création de la partie

* L’animateur entre les noms des joueurs et sélectionne les thèmes et options de jeu s’il le souhaite. Il n’y a pas de limite de joueurs, mais au moins deux joueurs doivent
  rejoindre la partie pour la commencer. Aucune limite pour le spectateur.
* Le nom des joueurs doit être unique.
* Par défaut : tous les thèmes activés, aucune variante appliquée.
* L’API génère une liste de 20 questions aléatoires (modifiable en cours de partie).
* Les joueurs peuvent rejoindre la partie dès ce moment grâce à un code de cinq chiffres et lettres tout en majuscule. Ceci est facultatif, une partie peut se dérouler juste avec
  la vue du maître du jeu. Ce code n’est valide que pour une partie dans le statut « En cours ». Le code ne sera pas composé de 1, I, 0 ou O pour ne pas se tromper dans le
  recopiage. Un QR code pourra aussi être généré.

#### 2️⃣ Déroulement du quiz

* Les joueurs répondent en temps réel (à l’oral) et peuvent poser des questions dont l’animateur peut répondre par OUI/NON.
* Un timer de 3 min (personnalisable) permet de cadrer le temps accordé aux réponses des joueurs.
* Si une personne ou un groupe de personne trouve la bonne réponse, l’animateur valide manuellement dans son interface et le ou les joueurs se voient attribué un GOAT point.
* Si personne ne trouve la réponse dans le temps imparti, aucun point n’est accordé. Il n’y a aucune pénalité dans une partie classique.
* L’animateur peut à tout moment passer à la question suivante, ce qui fait que personne n’aura de points.

#### 3️⃣ Fin de partie

* Après `20` questions, le joueur avec le plus de points est désigné **GOAT de la partie**.
* Départage en cas d’égalité :
    * Un duel est déclenché automatiquement si plusieurs joueurs ont le même score.
    * Chaque joueur répond à tour de rôle à des questions FACILES (Défini par `difficulty: "easy"` dans la BDD).
    * L’ordre de passage est défini aléatoirement.
    * `Trois vies` par joueur, `20 secondes` par question. Le joueur peut dire autant de réponses qu’il souhaite, mais n’aura aucun indice ou aide de l’animateur.
    * Si un joueur échoue (ne trouve pas la bonne réponse au bout du temps de la question), il perd une vie. Quand le joueur n’a plus de vie, il est éliminé.
    * Dernier en lice = GOAT de la partie.
    * Les questions sont chargées dynamiquement 10 par 10. Toutes les questions seront uniques à la partie, impossible de les réutiliser ou d’avoir des questions déjà passées dans
      la partie. S’il n’y a plus de question, le ou les joueurs avec le plus de vies gagnent la partie (les égalités sont donc possible seulement dans ce cas de figure).

Étant donné que les parties sont servies grâce à l’API REST, l’`_id` de la partie sera présent dans l’URL, ce qui permet une reconnexion aisée. Chaque partie a un `_id` unique.

### Chronomètre et indices

* Timer de trois minutes par question, synchronisé dans toutes les vues via WebSockets.
* Contrôle avancé pour l’animateur : pause et ajout de temps. Les joueurs et les spectateurs voient les actions du MJ avec un indicateur et un son spécifique associé.
* Indices :
    * Le nombre d’indices est variable pour une question. Il peut y en avoir 0 jusqu'à 10.
    * Débloqués progressivement pendant la question. Suivant le nombre d’indices, la cadence de dévoilement est plus ou moins grande (ex : pour 2 indices, révélé au bout de 1 min
      et 2 min). Le dernier indice doit OBLIGATOIREMENT être révélé avant 30s restantes.
    * Le dévoilement des indices ne réduit pas le nombre de GOAT point attribué pour une bonne réponse.
    * Sur la vue `Joueur` et `Spectateur`, seuls les indices déjà débloqués sont visibles.
    * Sur la vue `Animateur`, tous les indices sont visibles dès le départ, avec un indicateur montrant ceux qui ne sont pas encore accessibles aux joueurs.
    * L’animateur peut débloquer les indices en avance.
* Alertes sonores :
    * **Début de question** → Son spécifique.
    * **1 min restante** → Premier signal sonore.
    * **30 sec restantes** → Deuxième signal.
    * **10 dernières secondes** → Tic-tac progressif.
    * **Bonne réponse** → Son spécifique lorsque le MJ valide sur son interface.
    * **Ajout de temps** → Son spécifique.
    * **Dévoilement d’un indice** → Son spécifique.
    * **Arrêt / Reprise du chrono** → Son spécifique.
    * **Début d’un duel en cas d’égalité** → Son spécifique.

### Modes de jeu et variantes

L’ensemble des points suivants ne sont pas à définir pour le moment, ce n’est qu’une vision future du projet.

* Standard : Réponses classiques sans pénalité.
* Variante rapidité : Bonus de points pour une réponse rapide.
* Mode équipes : Il pourrait dans le futur y avoir un mode équipe contre équipe.
* Personnalisation :
    * L’animateur peut modifier toutes les options à tout moment (nombre de questions, durée du timer, thèmes, difficultés, scores…).
    * Les modifications nécessitant un rechargement des questions affichent une confirmation.
    * Les questions déjà posées restent en mémoire, seules les prochaines sont mises à jour.
    * Interface unifiée : la vue de personnalisation est identique en lobby et en partie.

---

## 👤 Interface et expérience utilisateur

### Écran d’accueil

* Créer une partie → Accès au lobby.
* Rejoindre une partie → Entrer un code de cinq caractères.
* À propos → Explication du projet.

### Vues du jeu

* **Vue Animateur**
    * Question en cours avec sa réponse.
    * Une description (optionnelle) de la réponse pour mieux aiguiller les joueurs dans leurs questions et les réponses.
    * Liste des questions disponible.
    * Validation manuelle des réponses.
    * Gestion des indices et du timer.
    * Attribution des points et classement en temps réel.
    * Bouton d’aide basé sur Vue Tour.
* **Vue Joueur**
    * Question en cours et indices visibles.
    * Classement et nombre de GOAT points.
    * Lecture seule des options de la partie.
* **Vue Spectateur**
    * Similaire à la vue Joueur, mais sans participation active.
* **Lobby et gestion des joueurs**
    * L’animateur voit les joueurs connectés via un indicateur.
* **Scores et historique**
    * L’animateur peut modifier les scores à tout moment.
    * Historique des points conservé (automatique et manuel).

### Back-office

* Affichage en tableau des questions avec filtres (thème, difficulté, statut, auteur, mots-clés).
* Tri par date de création par défaut (plus récentes en premier).
* Modale disponible pour créer ou éditer une question.
* Possibilité de supprimer une question avec confirmation.
* Interface sécurisée avec login/mot de passe pour les administrateurs.

### À propos

* Informations sur le projet. (inspiration, open-source, objectifs, public visé).
* Règles du jeu.
* Équipe de développement.
* Lien vers les repositories GitHub.
* Crédits et remerciements.
* Contact pour suggestions ou contributions.
* Lien vers la licence MIT-NC.

---

## 💽 Base de données et modèles

* Stockage dans MongoDB. Collections principales : `games`, `questions`.
* Indexation sur les champs fréquemment recherchés (thème, difficulté, statut).
* Utilisation de **Mongoose** pour la modélisation des données.

### Langues supportées (`Lang`)

Le projet se veut multilingue. Pour les parties et les questions, les langues supportées sont :

* `en` : Anglais
* `fr` : Français
* `es` : Espagnol
* `de` : Allemand
* `it` : Italien
* `pt` : Portugais
* ... (liste non exhaustive, possibilité d’ajouter d’autres langues)

Pour définir la langue principale d’une partie, le champ `language` du modèle `Game` utilise ce type.

Si une langue n’est pas disponible pour une question, c’est la langue `en` (Anglais) qui sera utilisée par défaut.

### Modèle d'une partie (`Game`)

* **_id** : `ObjectId` – Identifiant unique de la partie généré par MongoDB.
* **language** : `Lang` – Langue principale de la partie (définit les énoncés et réponses des questions).
* **inviteCode** : `string` – Code unique à cinq caractères pour rejoindre la partie.
* **players** : `Array<Player> | undefined` – Liste des joueurs avec leurs noms renseignés par l’animateur dans le lobby. Ce champ est vide tant que la partie est en statut
  `preparing`.
* **questions** : `Array<Question> | undefined` – Liste des questions sélectionnées pour la partie. Ce champ est vide tant que la partie est en statut `preparing`.
* **currentQuestionIndex** : `number | undefined` – Index de la question en cours. Commence à 0. Ce champ est `undefined` tant que la partie est en statut `preparing`.
* **status** : `"preparing" | "quizzing" | "dueling" | "over" | "canceled"` – Statut actuel de la partie.
    * `preparing` : La partie est en cours de préparation (lobby). Statut initial.
    * `quizzing` : La partie est en cours, l'animateur pose des questions.
    * `dueling` : Un duel est en cours pour départager des joueurs à égalité.
    * `over` : La partie est terminée.
    * `canceled` : La partie a été annulée par l’animateur.
* **scores** : `GameScores | undefined` – Objet contenant les scores des joueurs. Ce champ est `undefined` tant que la partie est en statut `preparing`.
* **options** : `GameOptions` – Options personnalisées pour la partie (durée du timer, thèmes, variantes, etc.).
* **createdAt** : `Date` – Date et heure de création de la partie.
* **updatedAt** : `Date` – Date et heure de la dernière mise à jour de la partie.

### Modèle des scores d'une partie (`GameScores`)

* **playerScores** : `Record<string, number>` – Objet mappant le nom du joueur à son score (nombre de GOAT points). Tous les joueurs sont initialisés à `0` au début de la partie.
* **winners**: `Array<Player> | undefined` – Liste de(s) joueur(s) gagnant(s). En cas d'égalité, il y aura plusieurs joueurs. Ce champ est `undefined` tant que la partie n’est pas
  en statut `over`.

### Modèle des options d'une partie (`GameOptions`)

* **question** :
    * **count** : `number` – Nombre total de questions dans la partie. Par défaut `20`.
    * **themes** : `Array<"history" | "geography" | "cinema" | "video-games" | ...>` – Thème(s) sélectionné(s) pour la partie. Si vide, tous les thèmes sont sélectionnés.
    * **difficulties** : `Array<"easy" | "medium" | "hard">` – Difficulté(s) sélectionnée(s) pour la partie. Si vide, toutes les difficultés sont sélectionnées.
* **timer** :
    * **duration** : `number` – Durée du timer en secondes pour chaque question. Par défaut `180` (3 minutes).
* **duel** :
    * **enabled** : `boolean` – Indique si le mode duel est activé en cas d’égalité. Par défaut `true`.
    * **lives** : `number` – Nombre de vies par joueur en duel. Par défaut `3`.
    * **timePerQuestion** : `number` – Durée en secondes pour chaque question en duel. Par défaut `20`.

### Modèle d'une question (`Question`)

* **_id** : `ObjectId` – Identifiant unique de la question généré par MongoDB.
* **type** : `"quote" | "ephemeride" | "definition" | "general"` – Type de la question.
* **themes** : `Array<"history" | "geography" | "cinema" | "video-games" | ...>` – Thème(s) de la question. Doit contenir au moins un thème.
* **tags** : `Array<"for-kids" | "adult-only" | ...> | undefined` – Tags supplémentaires pour la question.
* **difficulty** : `"easy" | "medium" | "hard"` – Difficulté de la question.
* **statement** : `Record<Lang, string>` – Énoncé de la question, organisée par langue. Chaque énoncé est une chaîne de caractères pouvant contenir jusqu'à `500` caractères.
* **answer** : `Record<Lang, string>` – Réponse correcte à la question, organisée par langue. Chaque réponse est une chaîne de caractères pouvant contenir jusqu'à `200` caractères.
* **description** : `Record<Lang, string>` (optionnel) – Description ou explication de la réponse, organisée par langue. Chaque description est une chaîne de caractères pouvant
  contenir jusqu'à `1000` caractères.
* **hints** : `Record<Lang, Array<string>> | undefined` – Indices pour la question, organisés par langue. Chaque indice est une chaîne de caractères pouvant contenir jusqu'à `200`
  caractères. Ce champ est `undefined` si aucun indice n’est disponible.
* **status** : `"draft" | "to-validate" | "ready" | "refused""` – Statut de la question.
    * `draft` : La question est en brouillon et n’est pas visible publiquement.
    * `to-validate` : La question est en attente de validation par un administrateur.
    * `ready` : La question a été validée et est disponible pour les parties.
    * `refused` : La question a été refusée par un administrateur.
* **refusedReason** : `string | undefined` – Raison du refus si la question a été refusée. Ce champ est `undefined` si la question n’est pas en statut `refused`. Peut contenir
  jusqu'à `100`caractères. Ce champ est recommandé lors d'un refus pour aider les IA et utilisateurs à améliorer leurs propositions.
* **createdBy** : `string` – Nom ou identifiant de l’utilisateur ayant créé la question.
* **createdAt** : `Date` – Date et heure de création de la question.
* **updatedAt** : `Date` – Date et heure de la dernière mise à jour de la question.

### Modèle d'un joueur (`Player`)

* **_id** : `ObjectId` – Identifiant unique du joueur généré par MongoDB.
* **name** : `string` – Nom unique du joueur dans la partie.

---

## 👑 Back-office

Le back-office permet de gérer les questions des parties. Il est accessible uniquement aux administrateurs via une interface de connexion sécurisée.

* Ajout et validation des questions :
    * L’IA (Groq) propose des indices au moment de la création de la question.
    * L’administrateur peut accepter ou modifier les indices.
    * Les suggestions de l’IA ne sont pas stockées si elles ne sont pas validées.
    * Si l’IA n’est pas disponible, l’administrateur entre les indices à la main.
    * Tous les indices doivent être manuellement approuvés (gain de temps, mais pas d’automatisation complète).
* Modération des questions :
    * Tri par défaut : date de création (plus récentes en premier).
    * Filtres : thème, difficulté, auteur, mots-clés.
    * Mode d’affichage : tableau classique et liste rapide.
    * Seuls les administrateurs ayant les accès back-office privé peuvent ajouter des questions sans validation.
    * Les utilisateurs ne peuvent proposer qu’une question toutes les 20 minutes sur le back-office public.

---

## ⛰️ Technologie et infrastructure

* **API** : TypeScript, NestJS, MongoDB.
* **Front-ends** : Nuxt (TypeScript). Nuxt UI pour le thème et le Figma.
* **Tests** : Tests unitaires (Vitest), Tests de mutation (Stryker), Tests d’acceptance / E2E (Cucumber et Playwright [FRONT])
* **Lint** : ESLint + OXC
* **WebSockets** : Pour la synchronisation en temps réel. Socket IO
* **Sécurité** :
    * API protégée par API Keys spécifiques pour le back-office.
    * Pas de journalisation des actions admin.
* **Monitoring** : Sentry pour suivi des erreurs. DataDog peut aussi être envisagé si version gratuite disponible.
* **Hébergement** : VPS gratuit dans un premier temps. Migration vers GCP/AWS/OVH possible à l’avenir si besoin.
* **Fichiers d'environnement** : Documentés dans un fichier .env.example et le README. Pas de rotation des clés prévue.
* **CI / CD** : GitHub actions illimitées grâce à l’open-source. CodeRabbit pour la review de PR au compte-goutte.

---

## 💵 Monétisation et évolutions

* Projet **open-source** et **gratuit**.
* Possibilité de donations via Ko-fi ou GitHub Sponsors.
* Pas encore d’idée pour une version premium.
* Tests de charge prévus, mais étudiés ultérieurement.

---

## 🐙 Repositories

* [goat-it-api](https://github.com/antoinezanardi/goat-it-api) : API Nest gérant les requêtes HTTP.
* [goat-it-web](https://github.com/antoinezanardi/goat-it-web) : Ecosysteme Nuxt qui regroupe le jeu + le back office.
