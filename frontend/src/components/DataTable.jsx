import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { Tooltip, Link } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import AddIcon from '@mui/icons-material/Add';

import FetchWraper from '../utils/FetchWraper';
import ModalWrapper from './ButtonRapports';
import useMediaQuery from '../hooks/useMediaQuery';

const handleDownload = async (md5) => {
  const url = `http://localhost:5000/auth/get_rapport/${md5}`;

  const fetchWraper = new FetchWraper();
  fetchWraper.url = url;
  fetchWraper.method = "GET";
  fetchWraper.headers.append("Content-Type", "application/pdf");
  fetchWraper.headers.append("Accept", "application/pdf");
  fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
  fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

  try {
    let result = await fetchWraper.fetchw();
    if (result.ok) {
      const blob = await result.blob();
      saveAs(blob, `report_${md5}.pdf`);
    } else {
      console.error('Failed to download the file.');
    }
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
};

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
    '& .MuiDataGrid-columnHeaderDraggableContainer': {
      '& .MuiDataGrid-iconButtonContainer': {
        display: 'none',
      },
    },
    '&:hover .MuiDataGrid-columnHeaderDraggableContainer .MuiDataGrid-iconButtonContainer': {
      display: 'flex',
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

const adjustColumns = (columns, isLargeScreen) => {
  return columns.map(col => {
    if (!isLargeScreen) {
      const { width, minWidth, ...rest } = col;
      return rest;
    }
    return col;
  });
};

function getColumns(type, isLargeScreen) {
  const columns = {
    rapport: [
      { field: 'id_user', headerName: 'Étudiant', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'nom', headerName: 'Sujet', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'concernes', headerName: 'Concernés', width: 220, minWidth: 220, maxWidth: 300 },
      { field: 'id_user_1', headerName: 'Suiveur', width: 180, minWidth: 180, maxWidth: 300 },
      {
        field: 'télécharger',
        headerName: 'Télécharger',
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        renderCell: (params) => (
          <Tooltip title="Télécharger" placement="right">
            <CustomButton variant="contained" onClick={() => handleDownload(params.row.md5)}>
              <PictureAsPdfIcon />
            </CustomButton>
          </Tooltip>
        ),
      },
    ],
    mes_rapports: [
      { field: 'sujet', headerName: 'Sujet', maxWidth: 300 },
      { field: 'concernes', headerName: 'Concernés', maxWidth: 300 },
      { field: 'suiveur', headerName: 'Suiveur', maxWidth: 300 },
      {
        field: 'télécharger',
        headerName: 'Télécharger',
        maxWidth: 150,
        renderCell: (params) => (
          <Tooltip title="Télécharger" placement="right">
            <CustomButton variant="contained" onClick={() => handleDownload(params.row.md5)}>
              <PictureAsPdfIcon />
            </CustomButton>
          </Tooltip>
        ),
      },
    ],
    etudiant: [
      { field: 'nom_prenom', headerName: 'Nom Prénom', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'classe', headerName: 'Classe', width: 220, minWidth: 220, maxWidth: 300 },
      { field: 'statut', headerName: 'Statut', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'duree', headerName: 'Durée', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'contract', headerName: 'Contract', width: 180, minWidth: 180, maxWidth: 300 },
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
    ],
    alerte: [
      { field: 'commentaires', headerName: 'Commentaire', width: 800, minWidth: 220, maxWidth: 900 },
      { field: 'id_user_source', headerName: 'ID utilisateur source', width: 180, minWidth: 180, maxWidth: 300 },
      {
        field: 'voir',
        headerName: 'Voir',
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        renderCell: (params) => (
          <CustomButton onClick={() => console.log(params.row)} style={{ backgroundColor: '#1976d2', color: 'white' }}>
            Voir
          </CustomButton>
        ),
      },
      {
        field: 'supprimer',
        headerName: 'Supprimer',
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        renderCell: (params) => (
          <CustomButton onClick={() => console.log('Supprimer', params.row)} style={{ backgroundColor: '#bb2124', color: 'white' }}>
            Supprimer
          </CustomButton>
        ),
      },
    ]
  };

  return adjustColumns(columns[type] || [], isLargeScreen);
}

function getTitle(type) {
  switch (type) {
    case 'rapport':
      return 'Tous les rapports';
    case 'etudiant':
      return 'Tous les étudiants';
    case 'mes_rapports':
      return 'Mes rapports';
    case 'other':
      return 'Mes Documents';
    case 'alerte':
      return 'Toutes les alertes';
    default:
      return '';
  }
}

export default function DataTable({ rows, type }) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const handleOpen = () => {
    // TODO: Open étudiant modal
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'left' }}>
          {getTitle(type)}
        </Typography>

        {/* Bouton type Rapport */}
        {type === 'rapport' && <ModalWrapper />}

        {/* Bouton type Mes Rapports */}
        {type === 'mes_rapports' && (<Link
          href={'/?page=rapports'}
          underline="none"
          color="inherit"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: 'black',
              '& .icon-hover': {
                transform: 'translateX(4px)',
              }
            }
          }}
        >
          <Typography variant="h5">
            Voir tout
          </Typography>
          <EastIcon fontSize="medium" className="icon-hover" sx={{ transition: 'transform 0.3s ease', ml: '0.3em' }} />
        </Link>)}

        {/* Bouton type Etudiant */}
        {type === 'etudiant' && (
          <Tooltip title="Ajouter un étudiant" placement="top">
            <Button
              variant="outlined"
              onClick={handleOpen}
              sx={{
                color: '#000000',
                borderColor: '#F0C975',
                backgroundColor: '#FDD47C',
                mb: 1,
                '&:hover': {
                  backgroundColor: '#FFC039',
                  borderColor: '#FFC039',
                }
              }}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      <CustomDataGrid
        autoHeight
        rows={rows}
        columns={getColumns(type, isLargeScreen)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
      />
    </>
  );
}

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['rapport', 'etudiant', 'mes_rapports', 'other', 'alerte']).isRequired,
};
