import { DataGrid } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';



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
        <CustomButton
          variant="contained"
          onClick={() => onButtonClick(params)}
          sx={{
            backgroundColor: '#FDD47C',
          }}
        >
          Modifier
        </CustomButton>
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
        <CustomButton
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
        </CustomButton>
      ),


    },
  ];

  const columns_etudiant = [
    { field: 'nom_prenom', headerName: 'Nom Prénom', width: 180 },
    { field: 'classe', headerName: 'Classe', width: 220 },
    { field: 'status', headerName: 'Status', width: 180 },
    { field: 'duree', headerName: 'Durée', width: 180 },
    { field: 'contract', headerName: 'Contract', width: 180 },
    {
      field: 'voir',
      headerName: 'Voir',
      width: 120,
      type: 'button', // This column uses a button element for the cell
      renderCell: (params) => (
        <CustomButton
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
        </CustomButton>
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

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FDD47C',
  '&:hover': {
    backgroundColor: `${alpha('#FDD47C', 1)}`,
  },

}));

const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-filler': {
    backgroundColor: '#FDD47C',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#FDD47C',
    '&:hover': {
      backgroundColor: '#FFC039',
    },
  },
  '& .MuiDataGrid-row': {
    borderBottom: `1px solid ${theme.palette.divider}`,    
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
}));

export default function DataTable(args) {
  return (
    <CustomDataGrid
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
  );
}
