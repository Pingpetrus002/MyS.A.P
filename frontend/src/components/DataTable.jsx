import { DataGrid } from '@mui/x-data-grid';



function onButtonClick(cell) {
  
  // get the row data
  console.log(cell.row);
  
}


function getColumns(type) {



  const columns_rapport = [
    { field: 'etudiant', headerName: 'Étudiant', width: 180 },
    { field: 'sujet', headerName: 'Sujet', width: 180 },
    { field: 'concernes', headerName: 'Concernés', width: 220 },
    { field: 'suiveur', headerName: 'Suiveur', width: 180 },
    {
      field: 'modifier',
      headerName: 'Modifier',
      width: 120,
      type: 'button', // This column uses a button element for the cell
      renderCell: (params) => (
        <button
          onClick={() => onButtonClick(params)}
          style={{
            cursor: 'pointer',
            fontSize: 16,
            padding: 8,
            color: 'white',
            backgroundColor: '#1976d2',
            borderRadius: 4,
          }}
        >
          Modifier
        </button>
      ),


    },
  ];

  const columns_mes_rapport = [
    { field: 'sujet', headerName: 'Sujet', width: 180 },
    { field: 'concernes', headerName: 'Concernés', width: 220 },
    { field: 'suiveur', headerName: 'Suiveur', width: 180 },
    {
      field: 'voir',
      headerName: 'Voir',
      width: 120,
      type: 'button', // This column uses a button element for the cell
      renderCell: (params) => (
        <button
          onClick={() => onButtonClick(params)}
          style={{
            cursor: 'pointer',
            fontSize: 16,
            padding: 8,
            color: 'white',
            backgroundColor: '#1976d2',
            borderRadius: 4,
          }}
        >
          Voir
        </button>
      ),


    },
  ];

  const columns_etudiant = [
    { field: 'nom_prenom', headerName: 'Nom Prénom', width: 180 },
    { field: 'classe', headerName: 'Classe', width: 220 },
    { field: 'status', headerName: 'Status', width: 180 },
    { field: 'duree', headerName: 'Durée', width: 180},
    { field: 'contract', headerName: 'Contract', width: 180},
    {
      field: 'voir',
      headerName: 'Voir',
      width: 120,
      type: 'button', // This column uses a button element for the cell
      renderCell: (params) => (
        <button
          onClick={() => onButtonClick(params)}
          style={{
            cursor: 'pointer',
            fontSize: 16,
            padding: 8,
            color: 'white',
            backgroundColor: '#1976d2',
            borderRadius: 4,
          }}
        >
          Voir
        </button>
      ),
    },
  ];


  //const columns_etudiant = [];


  switch (type) {
    case 'rapport':
      //console.log("columns_rapport");
      return columns_rapport;
    case 'etudiant':
      //console.log("columns_etudiant");
      return columns_etudiant;

    case 'mes_rapport':
      //console.log("columns_mes_rapport");
      return columns_mes_rapport;
    default:
      //console.log("default");
      return [];


  }
}



export default function DataTable(args) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={args.rows}
        columns={getColumns(args.type)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableMultipleRowSelection
      />
    </div>
  );
}
