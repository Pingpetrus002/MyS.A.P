# S.A.P

# Documentation de l'API MySAP

## Introduction
Cette documentation couvre les points principaux de l'API MySAP implémentée avec Flask. L'API permet la gestion des utilisateurs, incluant l'inscription, la connexion, et la récupération des profils utilisateurs.

## Routes

> [!IMPORTANT]
> Toutes les routes doivent être précédée de `/auth`

### 1. Inscription d'un utilisateur (`/register`)

- **URL** : `/register`
- **Méthode** : `POST`
- **Description** : Permet à un utilisateur invité de s'inscrire.
- **Autentification** : Requiert un token JWT comprenant un compte role RRE 
- **Données de la requête** :
  - `username` (string) : Adresse email de l'utilisateur.
- **Réponse** :
  - `201 Created` : Utilisateur créé avec succès.
  - `400 Bad Request` : Adresse email invalide.
  - `409 Conflict` : Utilisateur déjà existant.
- **Exemple de requête** :
  ```json
  {
    "username": "exemple@domaine.com"
  }
  ```

### 2. Connexion d'un utilisateur (`/login`)

- **URL** : `/login`
- **Méthode** : `POST`
- **Description** : Permet à un utilisateur de se connecter.
- **Autentification** : Aucun token requis.
- **Données de la requête** :
  - `username` (string) : Adresse email de l'utilisateur.
  - `password` (string) : Mot de passe de l'utilisateur.
- **Réponse** :
  - `200 OK` : Retourne un token d'accès.
  - `401 Unauthorized` : Identifiants invalides.
- **Exemple de requête** :
  ```json
  {
    "username": "exemple@domaine.com",
    "password": "motdepasse"
  }
  ```
- **Exemple de réponse** :
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
  ```

### 3. Route protégée (`/protected`)

- **URL** : `/protected`
- **Méthode** : `GET`
- **Description** : Route d'exemple pour vérifier l'accès protégé par token JWT.
- **Autentification** : Requiert un token JWT.
- **Réponse** :
  - `200 OK` : Message de bienvenue avec l'ID de l'utilisateur.
- **Exemple de réponse** :
  ```json
  {
    "message": "Welcome user 1"
  }
  ```

### 4. Récupération du profil utilisateur (`/get_profil`)

- **URL** : `/get_profil`
- **Méthode** : `GET`
- **Description** : Retourne les informations du profil utilisateur connecté.
- **Autentification** : Requiert un token JWT.
- **Réponse** :
  - `200 OK` : Informations du profil utilisateur.
- **Exemple de réponse** :
  ```json
  {
    "user": {
      "id_user": 1,
      "nom": "Doe",
      "prenom": "John",
      "mail": "john.doe@example.com",
      "date_naissance": "1990-01-01",
      "statut": "active",
      "id_user_1": null,
      "id_user_2": null,
      "id_ecole": 1,
      "id_ecole_1": null,
      "id_ecole_2": null,
      "id_entreprise": 1,
      "id_entreprise_1": null,
      "id_role": 1,
      "id_user_3": null,
      "id_planning": 1
    }
  }
  ```

## Fonctions Utilitaires

### `generate_random_password`
- **Description** : Génère un mot de passe aléatoire de la longueur spécifiée.
- **Arguments** :
  - `length` (int, optionnel) : Longueur du mot de passe (par défaut, 6).
- **Retourne** : `string` : Mot de passe aléatoire.

### `send_welcome_email`
- **Description** : Envoie un email de bienvenue à un nouvel utilisateur.
- **Arguments** :
  - `username` (string) : Adresse email du destinataire.
  - `password` (string) : Mot de passe de l'utilisateur.
- **Retourne** : Aucun.

## Modèles

### `Utilisateur`
- **Champs** :
  - `id_user` (int) : ID de l'utilisateur.
  - `nom` (string) : Nom de l'utilisateur.
  - `prenom` (string) : Prénom de l'utilisateur.
  - `mail` (string) : Adresse email de l'utilisateur.
  - `date_naissance` (date) : Date de naissance de l'utilisateur.
  - `statut` (string) : Statut de l'utilisateur.
  - `id_user_1`, `id_user_2`, `id_user_3` (int) : Références à d'autres utilisateurs.
  - `id_ecole`, `id_ecole_1`, `id_ecole_2` (int) : Références aux écoles.
  - `id_entreprise`, `id_entreprise_1` (int) : Références aux entreprises.
  - `id_role` (int) : Référence au rôle de l'utilisateur.
  - `id_planning` (int) : Référence au planning de l'utilisateur.

## Conclusion
Cette API fournit les fonctionnalités essentielles pour gérer les utilisateurs dans l'application MySAP, avec des routes sécurisées par JWT pour l'inscription, la connexion, et la gestion des profils. Les fonctions utilitaires et les modèles de base de données facilitent la gestion de ces opérations.
