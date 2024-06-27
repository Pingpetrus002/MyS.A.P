import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { Tooltip, Link, useMediaQuery } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import AddIcon from '@mui/icons-material/Add';

import FetchWraper from '../utils/FetchWraper';
import ButtonRapports from './ButtonRapports';
import StudentModal from './EtudiantModal';
import AlertModal from './AlertModal';
import AddMissionModal from './ButtonMissions';

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

const CustomDataGrid = styled(DataGrid)(({ theme, isSmallScreen }) => ({
  '& .MuiDataGrid-filler': {
    backgroundColor: '#FDD47C',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#FDD47C',
    textAlign: 'center',
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      justifyContent: 'center',
    },
    '&:hover': {
      backgroundColor: '#FFC039',
    },
    '& .MuiDataGrid-columnHeaderDraggableContainer': {
      '& .MuiDataGrid-iconButtonContainer': {
        display: isSmallScreen ? 'none' : 'flex',
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
}));

const adjustColumns = (columns, isLargeScreen) => {
  return columns.map(col => {
    if (!isLargeScreen) {
      const { width, minWidth, ...rest } = col;
      return rest;
    }
    return col;
  });
};

function getColumns(type, isLargeScreen, onRowButtonClick) {
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
      { field: 'nom', headerName: 'Sujet', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'id_user', headerName: 'Concernés', width: 220, minWidth: 220, maxWidth: 300 },
      { field: 'id_user_1', headerName: 'Suiveur', width: 180, minWidth: 180, maxWidth: 300 },
      {
        field: 'télécharger',
        headerName: 'Télécharger',
        width: 150,
        maxWidth: 150,
        minWidth: 150,
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
      { field: 'prenom_nom', headerName: 'Prénom Nom', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'classe', headerName: 'Classe', width: 300, minWidth: 300, maxWidth: 400 },
      { field: 'statut', headerName: 'Statut', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'contrat', headerName: 'Contrat', width: 180, minWidth: 180, maxWidth: 300 },
      {
        field: 'voir',
        headerName: 'Voir',
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        renderCell: (params) => (
          <CustomButton onClick={() => onRowButtonClick(params.row)} style={{ backgroundColor: '#1976d2', color: 'white' }}>
            Voir
          </CustomButton>
        ),
      },
    ],
    alerte: [
      { field: 'commentaires', headerName: 'Commentaire', width: 400, minWidth: 220, maxWidth: 900 },
      { field: 'user_source', headerName: 'Utilisateur source', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'raison_social', headerName: 'Entreprise', width: 180, minWidth: 180, maxWidth: 300 },
      { field: 'date', headerName: 'Date', width: 180, minWidth: 180, maxWidth: 300 },
      {
        field: 'voir',
        headerName: 'Voir',
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        renderCell: (params) => (
          <CustomButton onClick={() => onRowButtonClick(params.row)} style={{ backgroundColor: '#1976d2', color: 'white' }}>
            Voir
          </CustomButton>
        ),
      },
    ],
    // Définir les colonnes pour le type Mission
    mission: [
      { field: 'libelle', headerName: 'Libellé', width: 200 },
      { field: 'description', headerName: 'Description', width: 200 },
      { field: 'datedebut', headerName: 'Date début', width: 150 },
      { field: 'datefin', headerName: 'Date fin', width: 150 },
      { field: 'id_user', headerName: 'Utilisateur', width: 150 },
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
    case 'documents':
      return 'Mes documents';
    case 'alerte':
      return 'Toutes les alertes';
    case 'mission':
      return 'Mes missions';
    default:
      return '';
  }
}

export default function DataTable({ rows, type, onRowButtonClick }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const handleRowButtonClick = (row) => {
    setSelectedAlert(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleExportCSV = () => {
    // Récupérer les colonnes
    const columns = getColumns(type, isLargeScreen);

    // Créer l'en-tête CSV à partir des noms de colonne
    const header = columns.map(col => col.headerName).join(',') + '\n';

    // Créer les lignes CSV à partir des données
    const csv = rows.map(row => {
      return columns.map(col => {
        const cell = row[col.field];
        // Si la cellule contient une virgule, la placer entre guillemets
        return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell;
      }).join(',');
    }).join('\n');

    // Concaténer l'en-tête et les lignes pour former le contenu CSV complet
    const csvData = header + csv;

    // Convertir en Blob et enregistrer en tant que fichier CSV
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${getTitle(type)}.csv`);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'left' }}>
          {getTitle(type)}
        </Typography>
        {type === 'rapport' && <ButtonRapports />}
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
        {type === 'mission' && <AddMissionModal />}
      </div>
      <CustomDataGrid
        autoHeight
        rows={rows}
        columns={getColumns(type, isLargeScreen, handleRowButtonClick)}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        isSmallScreen={isSmallScreen}
      />
      <Button
        variant="outlined"
        onClick={handleExportCSV}
        sx={{
          color: '#000000',
          borderColor: '#F0C975',
          backgroundColor: '#FDD47C',
          marginTop: '1em',
          mb: 1,
          alignItems: 'right',
          '&:hover': {
            backgroundColor: '#FFC039',
            borderColor: '#FFC039',
          }
        }}
      >
        Exporter en CSV
      </Button>
      <StudentModal open={openModal} onClose={handleClose} />
      {selectedAlert && (
        <AlertModal alert={selectedAlert} open={modalOpen} onClose={handleCloseModal} />
      )}
    </>
  );
}

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['rapport', 'etudiant', 'mes_rapports', 'documents', 'alerte', 'mission']).isRequired,
  onRowButtonClick: PropTypes.func.isRequired,
};
