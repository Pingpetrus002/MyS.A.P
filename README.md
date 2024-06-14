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

### 2. Reset le MDP (`/change_password`)

- **URL** : `/login`
- **Méthode** : `POST`
- **Description** : Permet à un utilisateur de changer son MDP.
- **Autentification** : Token JWT.
- **Données de la requête** :
  - `old_password` (string) : Ancien MDP.
  - `new_password` (string) : Nouveau MDP.
- **Réponse** :
  - `200 OK` : Retourne un token d'accès.
  - `401 Unauthorized` : Ancien MDP invalide.
- **Exemple de requête** :
  ```json
  {
    "old_password": "a",
    "new_password": "aa"
    
  }
  ```
- **Exemple de réponse** :
  ```json
  {
    "message": "Password changed"
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

### 1. Définir un rapport (`/set_rapport`)

- **URL** : `/set_rapport`
- **Méthode** : `POST`
- **Description** : Ajoute un nouveau rapport pour un utilisateur.
- **Authentification** : Requiert un token JWT.
- **Paramètres** :
  - **Corps de la requête** (JSON) :
    ```json
    {
      "id_user": 1,
      "id_suiveur": 2,
      "rapport": "base64_encoded_pdf_content"
    }
    ```
- **Réponses** :
  - `200 OK` : Rapport ajouté avec succès.
  - `403 Forbidden` : L'utilisateur n'est pas autorisé à ajouter un rapport.
  - `415 Unsupported Media Type` : Le type de contenu de la requête doit être `application/json`.

### 2. Récupérer les informations des rapports (`/get_rapport_info`)

- **URL** : `/get_rapport_info`
- **Méthode** : `GET`
- **Description** : Retourne les informations des rapports en fonction du rôle de l'utilisateur.
- **Authentification** : Requiert un token JWT.
- **Réponses** :
  - `200 OK` : Informations des rapports récupérées avec succès.
    - **Admin ou RRE** :
      ```json
      {
        "rapports": [
          {
            "id": 1,
            "nom": "Report Name",
            "md5": "md5_checksum",
            "type": "application/pdf",
            "datecreation": "2024-06-13T14:16:24.630010",
            "datesuppression": null,
            "id_user": 1,
            "id_user_1": 2
          }
        ]
      }
      ```
    - **Suiveur** :
      ```json
      {
        "rapports": [
          {
            "id": 1,
            "nom": "Report Name",
            "md5": "md5_checksum",
            "type": "application/pdf",
            "datecreation": "2024-06-13T14:16:24.630010",
            "datesuppression": null,
            "id_user": 1,
            "id_user_1": 2
          }
        ]
      }
      ```
    - **Étudiant** :
      ```json
      {
        "rapports": [
          {
            "id": 1,
            "nom": "Report Name",
            "md5": "md5_checksum",
            "type": "application/pdf",
            "datecreation": "2024-06-13T14:16:24.630010",
            "datesuppression": null,
            "id_user": 1,
            "id_user_1": 2
          }
        ]
      }
      ```
  - `403 Forbidden` : L'utilisateur n'est pas autorisé à accéder à ces informations.

### 3. Télécharger un rapport (`/get_rapport/<string:md5>`)

- **URL** : `/get_rapport/<string:md5>`
- **Méthode** : `GET`
- **Description** : Télécharge un rapport en fonction du hash MD5.
- **Authentification** : Requiert un token JWT.
- **Paramètres** :
  - **URL** :
    - `md5` : Le hash MD5 du rapport à télécharger.
- **Réponses** :
  - `200 OK` : Le rapport est téléchargé avec succès.
    - **En-têtes** :
      - `Content-Type: application/pdf`
      - `Content-Disposition: attachment; filename=report_<md5>.pdf`
  - `403 Forbidden` : L'utilisateur n'est pas autorisé à télécharger ce rapport.
  - `404 Not Found` : Rapport non trouvé.


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
