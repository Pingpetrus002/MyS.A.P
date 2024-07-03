# DataTable

## Description

Composant pour afficher des données sous forme de tableau prédéfini.

## Utilisation

```javascript
import DataTable from 'path/to/components/DataTable';

function App() {
  return (
    <>
      <Grid container direction="row" justifyContent="center" spacing={4} marginTop={4}>
        <Grid item>
          <DataTable rows={rows} type="type" />
        </Grid>
      <Grid/>
    </>
  );
}
```
