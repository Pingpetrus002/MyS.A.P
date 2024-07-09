import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { Tooltip, useMediaQuery } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import AddIcon from '@mui/icons-material/Add';

import moment from 'moment';

import FetchWraper from '../utils/FetchWraper';
import SyntheseSuiviTuteur from './FormRapport';
import StudentModal from './EtudiantModal';
import AlertModal from './AlertModal';
import AddMissionModal from './ButtonMissions';
import JObject from '../utils/JObject';
import GenPDF from '../utils/GenPDF';


const handleDownload = async (md5) => {
    const url = `https://localhost:5001/auth/get_rapport/${md5}`;

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
            let jobj = new JObject();
            jobj.fromJSON(await result.json());
            //console.log(jobj);
            GenPDF(jobj.data);
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

function getColumns(type, isLargeScreen, onButtonClick = () => {
}, onRowButtonClick) {

    const isRecentReport = (datecreation) => {
        if (!datecreation) return false;
        const reportDate = moment(datecreation);
        const now = moment();
        return now.diff(reportDate, 'months') < 11;
    };

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
        mes_documents: [
            { field: 'nom', headerName: 'Nom', width: 180, minWidth: 180, maxWidth: 300 },
            { field: 'datecreation', headerName: 'Date d\'ajout', width: 220, minWidth: 220, maxWidth: 300 },
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
                field: 'suivi',
                headerName: 'Suivi',
                width: 120,
                minWidth: 120,
                maxWidth: 120,
                renderCell: (params) => {
                    const { rapports, datecreation_rapport } = params.row;
                    const hasReport = rapports && rapports.length > 0;
                    const recentReport = isRecentReport(datecreation_rapport);

                    if (!hasReport) {
                        return 'À faire';
                    } else if (recentReport) {
                        return 'Fait';
                    } else {
                        return 'Rapport trop ancien';
                    }
                }
            },
            {
                field: 'rapport',
                headerName: 'Rapport',
                width: 120,
                minWidth: 120,
                maxWidth: 120,
                renderCell: (params) => {
                    const { rapports, datecreation_rapport } = params.row;
                    const hasReport = rapports && rapports.length > 0;
                    const recentReport = isRecentReport(datecreation_rapport);

                    if (!hasReport) {
                        return (
                            <CustomButton
                                onClick={() => onButtonClick(params.row)}
                                style={{ backgroundColor: 'purple', color: 'white' }}
                            >
                                Créer
                            </CustomButton>
                        );
                    } else if (recentReport) {
                        return (
                            <CustomButton
                                onClick={() => onButtonClick(console.log('Modifier'))}
                                style={{ backgroundColor: 'green', color: 'white' }}
                            >
                                Modifier
                            </CustomButton>
                        );
                    } else {
                        return null;
                    }
                }
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
                    <CustomButton onClick={() => onRowButtonClick(params.row)}
                        style={{ backgroundColor: '#1976d2', color: 'white' }}>
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
        ],
        users_management: [
            { field: 'id', headerName: 'ID', width: 90 },
            { field: 'status', headerName: 'Active', width: 100 },
            { field: 'mail', headerName: 'Email', width: 150 },
            { field: 'role', headerName: 'Role', width: 150 },
            { field: 'nom', headerName: 'Prénom', width: 150 },
            { field: 'prenom', headerName: 'Nom', width: 150 },
            { field: 'date_naissance_formatted', headerName: 'Date de naissance', width: 250 },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 150,
                renderCell: (params) => (
                    <strong>
                        <Button
                            sx={{
                                marginTop: 1.8,
                                marginLeft: 4,
                                color: '#000000',
                                borderColor: '#F0C975',
                                backgroundColor: '#FDD47C',
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: '#FFC039',
                                    borderColor: '#FFC039',
                                },
                            }}
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ marginLeft: 16 }}
                            onClick={() => onButtonClick(params.row)}
                        >
                            Action
                        </Button>
                    </strong>
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
        case 'mes_documents':
            return 'Mes documents';
        case 'alerte':
            return 'Toutes les alertes';
        case 'mission':
            return 'Mes missions';
        case 'users_management':
            return 'Gestion des utilisateurs';
        default:
            return '';
    }
}

export default function DataTable({
    rows, type, handleToggleTable, callback = () => {
    }, onRowButtonClick, callFunction
}) {
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
        callFunction();
    };

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    // Récupère tous les rapports
    const handleDataRapport = async () => {
        const url = `https://localhost:5001/auth/get_all_rapports`;

        const fetchWraper = new FetchWraper();
        fetchWraper.url = url;
        fetchWraper.method = "GET";
        fetchWraper.headers.append("Content-Type", "application/json");
        fetchWraper.headers.append("Accept", "application/json");
        fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
        fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

        let result = await fetchWraper.fetchw();
        return await result.json();
    };

    // Fonction pour applatir un JSON
    // Exemple: { savoirEtre: { 'Capacité d\'intégration': 'Très bonne' } }
    const flattenJSON = (obj) => {
        const flattened = {};

        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Flatten nested objects except for arrays
                if (!Array.isArray(obj[key])) {
                    Object.keys(obj[key]).forEach(subKey => {
                        flattened[`${key} - ${subKey}`] = obj[key][subKey];
                    });
                } else {
                    flattened[key] = JSON.stringify(obj[key]); // Handle arrays as JSON strings
                }
            } else {
                flattened[key] = obj[key];
            }
        });

        return flattened;
    };

    // Fonction pour transformer l'en-tête en format lisible
    const transformHeader = (header) => {
        return header
            .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
            .toLowerCase() // Convert the entire string to lowercase
            .split(' ') // Split by space
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' '); // Join the words back with a space
    };

    // Fonction pour exporter les données en CSV
    const handleExportCSV = async () => {
        if (type === "rapport") {
            try {
                let data = await handleDataRapport();
                let rapports = data.rapports;

                if (rapports.length > 0) {
                    // Flatten the JSON data and extract headers
                    const flattenedRapports = rapports.map(rapport => flattenJSON(rapport));
                    const keys = Object.keys(flattenedRapports[0]).map(transformHeader);

                    // Convert JSON data to CSV rows
                    const csvRows = flattenedRapports.map(flattenedReport => {
                        // Initialize an array to hold values for this row
                        const rowValues = [];

                        // Loop over entries of flattenedReport to ensure correct order
                        for (const [key, value] of Object.entries(flattenedReport)) {
                            let formattedValue = value !== undefined ? value : ''; // Default to empty string if value is undefined

                            // Handle nested fields like "savoirEtre - Capacité d'intégration"
                            if (key.includes(' - ')) {
                                const nestedKeys = key.split(' - ');
                                let nestedValue = flattenedReport;
                                for (const nestedKey of nestedKeys) {
                                    nestedValue = nestedValue[nestedKey];
                                    if (!nestedValue) break;
                                }
                                formattedValue = nestedValue || '';
                            }

                            // Push the formatted value to rowValues
                            rowValues.push(formattedValue);
                        }

                        // Join rowValues with commas to form the CSV row
                        return rowValues.join(',');
                    });

                    // Create CSV content with header row and rows of data
                    const csvContent = [
                        keys.join(','), // Header row
                        ...csvRows
                    ].join('\r\n');

                    console.log(csvContent);

                    // Create a blob from the CSV content
                    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

                    // Get current date and time
                    const now = new Date();

                    // Format date and time as dd/mm/yyyy, HH:MM
                    const dateTimeFormatOptions = {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    };
                    const formattedDateTime = new Intl.DateTimeFormat('fr-FR', dateTimeFormatOptions).format(now).replaceAll(/[\/,: ]/g, (match) => match === '/' ? '-' : match === ':' ? '-' : '_');

                    // Use FileSaver to save the blob as a CSV file with the current date and time in the filename
                    saveAs(csvBlob, `rapports_${formattedDateTime}.csv`);
                } else {
                    console.error('Aucun rapports trouvé');
                }
            } catch (error) {
                console.error('Error downloading the file:', error);
            }
        } else {
            // Retrieve columns for other types
            const columns = getColumns(type, isLargeScreen, callback);

            // Create the CSV header from column names
            const header = columns.map(col => col.headerName).join(',') + '\n';

            // Create the CSV rows from the data
            const csv = rows.map(row => {
                return columns.map(col => {
                    const cell = row[col.field];
                    // If the cell contains a comma, place it in quotes
                    return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell;
                }).join(',');
            }).join('\n');

            // Concatenate the header and rows to form the complete CSV content
            const csvData = header + csv;

            // Convert to Blob and save as a CSV file
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${getTitle(type)}.csv`);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom style={{ textAlign: 'left' }}>
                    {getTitle(type)}
                </Typography>
                {type === 'mes_rapports'}
                {type === 'mes_documents'}

                <Button
                    underline="none"
                    color="inherit"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                            color: 'black',
                            '& .icon-hover': {
                                transform: 'translateX(4px)',
                            },
                        },
                    }}
                    onClick={handleToggleTable}
                >
                    <Typography variant="h5">
                        {type === 'mes_rapports' ? 'Voir mes documents' : type === 'mes_documents' ? 'Voir mes rapports' : ''}
                    </Typography>
                    {type === "mes_rapports" ? (
                        <EastIcon fontSize="medium" className="icon-hover"
                            sx={{ transition: 'transform 0.3s ease', ml: '0.3em' }} />
                    ) : type === "mes_documents" ? (
                        <WestIcon fontSize="medium" className="icon-hover"
                            sx={{ transition: 'transform 0.3s ease', ml: '0.3em' }} />
                    ) : null}
                </Button>

                {type === 'etudiant' && (
                    <Tooltip title="Ajouter un étudiant" placement="top">
                        <Button
                            variant="outlined"
                            href='/?page=ajout_etudiants'
                            sx={{
                                color: '#000000',
                                borderColor: '#F0C975',
                                backgroundColor: '#FDD47C',
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: '#FFC039',
                                    borderColor: '#FFC039',
                                    color: '#000000',
                                }
                            }}
                        >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                )}
                {type === 'mission' && <AddMissionModal />}
                {type === 'rapport' && <SyntheseSuiviTuteur />}
            </div>
            <CustomDataGrid
                autoHeight
                rows={rows}
                columns={getColumns(type, isLargeScreen, callback, handleRowButtonClick)}
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
    type: PropTypes.oneOf(['rapport', 'etudiant', 'mes_rapports', 'mes_documents', 'alerte', 'mission', 'users_management']).isRequired,
    callback: PropTypes.func,
    onRowButtonClick: PropTypes.func.isRequired,
};
