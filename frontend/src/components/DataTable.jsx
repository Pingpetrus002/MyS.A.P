import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import ModalWrapper from './ButtonRapports';
import { Container } from '@mui/material';

const CustomButton = styled(Button)({
  backgroundColor: '#FDD47C',
  '&:hover': {
    backgroundColor: '#FFC039',
  },
});

const CustomDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-filler': {
    backgroundColor: '#FDD47C',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#FDD47C',
    textAlign: 'center',
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      justifyContent: 'center',
      width: '100%',
    },
    '&:hover': {
      backgroundColor: '#FFC039',
    },
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'center',
  },
  '& .MuiDataGrid-row': {
    borderBottom: '1px solid #e0e0e0',
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5',
    },
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
});

const columnsRapport = [
  { field: 'etudiant', headerName: 'Étudiant', width: 180, minWidth: 180, maxWidth: 300 },
  { field: 'sujet', headerName: 'Sujet', width: 180, minWidth: 180, maxWidth: 300 },
  { field: 'concernes', headerName: 'Concernés', width: 220, minWidth: 220 },
  { field: 'suiveur', headerName: 'Suiveur', width: 180, minWidth: 180, maxWidth: 300 },
  {
    field: 'télécharger',
    headerName: 'Télécharger',
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    renderCell: (params) => (
      <CustomButton variant="contained" onClick={() => onButtonClick(params)}>
        <PictureAsPdfIcon />
      </CustomButton>
    ),
  },
];

const columnsMesRapports = [
  { field: 'sujet', headerName: 'Sujet', width: 180, minWidth: 180, maxWidth: 300 },
  { field: 'concernes', headerName: 'Concernés', width: 220 },
  { field: 'suiveur', headerName: 'Suiveur', width: 180, minWidth: 180, maxWidth: 300 },
  {
    field: 'télécharger',
    headerName: 'Télécharger',
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    renderCell: (params) => (
      <CustomButton variant="contained" onClick={() => onButtonClick(params)}>
        <PictureAsPdfIcon />
      </CustomButton>
    ),
  },
];

const columnsEtudiant = [
  { field: 'nom_prenom', headerName: 'Nom Prénom', width: 180, minWidth: 180, maxWidth: 300 },
  { field: 'classe', headerName: 'Classe', width: 220, minWidth: 220, maxWidth: 300 },
  { field: 'status', headerName: 'Status', width: 180, minWidth: 180, maxWidth: 300},
  { field: 'duree', headerName: 'Durée', width: 180, minWidth: 180, maxWidth: 300},
  { field: 'contract', headerName: 'Contract', width: 180, minWidth: 180, maxWidth: 300},
  {
    field: 'voir',
    headerName: 'Voir',
    width: 120,
    minWidth: 120,
    maxWidth: 120,
    renderCell: (params) => (
      <CustomButton onClick={() => onButtonClick(params)} style={{ backgroundColor: '#1976d2', color: 'white' }}>
        Voir
      </CustomButton>
    ),
  },
];

function getColumns(type) {
  switch (type) {
    case 'rapport':
      return columnsRapport;
    case 'etudiant':
      return columnsEtudiant;
    case 'mes_rapports':
      return columnsMesRapports;
    default:
      return [];
  }
}

function getTitle(type) {
  switch (type) {
    case 'rapport':
      return 'Tous les rapports';
    case 'etudiant':
      return 'Tous les étudiants';
    case 'mes_rapports':
      return 'Mes rapports';
    default:
      return '';
  }
}

function onButtonClick(cell) {
  console.log(cell.row);
}

export default function DataTable({ rows, type }) {
  return (
    <Container sx={{ mt: 10 }}>
      <Grid item xs={12}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom style={{ textAlign: 'left' }}>
            {getTitle(type)}
          </Typography>
          <ModalWrapper />
        </div>
      </Grid>
      <Grid item xs={12}>
        <CustomDataGrid
          autoHeight
          rows={rows}
          columns={getColumns(type)}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableMultipleRowSelection
        />
      </Grid>
    </Container>
  );
}

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['rapport', 'etudiant', 'mes_rapports']).isRequired,
};
