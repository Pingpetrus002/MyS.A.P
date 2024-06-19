import { DataGrid } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import React from 'react';


const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FDD47C',
  '&:hover': {
    backgroundColor: `${alpha('#FDD47C', 1)}`,
  },
}));

function DataTable({ rows, type, onRowButtonClick }) {
  const getColumns = (type) => {
    const columns_rapport = [
      { field: 'etudiant', headerName: 'Étudiant', width: 180 },
      { field: 'sujet', headerName: 'Sujet', width: 180 },
      { field: 'concernes', headerName: 'Concernés', width: 220 },
      { field: 'suiveur', headerName: 'Suiveur', width: 180 },
      {
        field: 'modifier',
        headerName: 'Modifier',
        width: 120,
        renderCell: (params) => (
          <CustomButton
            variant="contained"
            onClick={() => onButtonClick(params)}
            sx={{
              backgroundColor: '#FFC039',
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
    ];

    const columns_etudiant = [
      { field: 'nom', headerName: 'Nom', width: 180 },
      { field: 'prenom', headerName: 'Prénom', width: 180 },
      { field: 'classe', headerName: 'Classe', width: 180 },
      { field: 'statut', headerName: 'Statut', width: 180 },
      { field: 'entreprise', headerName: 'Entreprise', width: 180 },
      {
        field: 'Modifier',
        headerName: 'Modifier',
        width: 120,
        renderCell: (params) => (
          <CustomButton
            onClick={() => onRowButtonClick(params.row)}
            style={{
              cursor: 'pointer',
              fontSize: 16,
              padding: 8,
              color: 'black',
              backgroundColor: '#FFC039',
              borderRadius: 4,
            }}
          >
            Modifier
          </CustomButton>
        ),
      },
    ];

    switch (type) {
      case 'rapport':
        return columns_rapport;
      case 'etudiant':
        return columns_etudiant;
      case 'mes_rapport':
        return columns_mes_rapport;
      default:
        return [];
    }
  };

  return (
    <CustomDataGrid
      rows={rows}
      columns={getColumns(type)}
      pageSizeOptions={[5, 10]}
      disableMultipleRowSelection
    />
  );
}

const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-filler': {
    backgroundColor: '#FDD47C',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#FDD47C',
    alignItems: 'center',
    fontFamily: 'Inter',


    '&:hover': {
      backgroundColor: '#FFC039',
    },
  },
  '& .MuiDataGrid-row': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontFamily: 'Inter',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'center', // Centrer le contenu horizontalement
    fontFamily: 'Inter',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

export default DataTable;
