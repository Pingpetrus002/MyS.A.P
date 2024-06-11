# DataTable

## Description
Composant pour afficher des données sous forme de tableau prédéfini.

## Utilisation
```javascript
import DataTable from 'path/to/components/DataTable';

function App() {

  const rows = [
        { id: 1, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 2, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
      ];

  return (
    <>
    <DataTable rows={rows} type="rapport" />
    </>
  );
}
```