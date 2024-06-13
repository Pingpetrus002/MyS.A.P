# PageComposer

Le `PageComposer` est un composant qui permet de gérer les pages de l'application. Il permet de charger dynamiquement les pages en fonction de l'argument `page` de l'URL.

Il permet également de gérer la connexion de l'utilisateur:
  - Si le cookie de l'utilisateur a expiré, il est redirigé vers la page de connexion.
  - Si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion.
  - Si l'utilisateur est connecté, il est redirigé vers la page demandée.
  - Si la page demandée n'existe pas, l'utilisateur est redirigé vers la page par défaut.

#### Ajouter une page
1. Créer la page `jsx` dans le dossier `src/pages/` en suivant le modèle des autres pages.
2. ajouter `import NomDeLaPage from './NomDeLaPage';` dans `src/page/PageComposer`.
3. Ajouter le composant `NomDeLaPage` dans le `switch` de `src/page/PageComposer`, en l'associant à un `argument`.
  - example : `NomDeLaPage` pour `/?page=NomDeLaPage`
  ```jsx
  const Pages = {
    "login": Login,
    "DefaultPage": Login,
    "NomDeLaPage": NomDeLaPage,
    };
    ```
