import { useState, useEffect } from 'react';
import { LinearProgress, Grid, useMediaQuery } from '@mui/material';
import Navbar from '../components/Navbar.jsx';
import DataTable from '../components/DataTable';
import AlertModal from '../components/AlertModal';
import { getAlerts } from '../utils/AlertCreator.js';

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        async function fetchData() {
            try {
                const allAlerts = await getAlerts();
                const alertsWithId = allAlerts.map((alert, index) => ({
                    ...alert,
                    id: index + 1 // Utilisation d'un index pour créer un identifiant unique
                }));
                setAlerts(alertsWithId);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const getRowId = (alert) => alert.id;

    const handleRowClick = (alert) => {
        setSelectedAlert(alert);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    if (loading) {
        return <LinearProgress />;
    }

    if (alerts.length === 0) {
        return (
            <>
                {!isMobile && <Navbar />}
                <p>Aucune alerte pour le moment</p>;
                {isMobile && <Navbar />}
            </>
        )
    }

    return (
        <>
            {!isMobile && <Navbar />}
            <Grid container justifyContent="center" sx={{ marginTop: '70px' }}>
                <Grid item xs={10}>
                    <DataTable
                        rows={alerts}
                        type="alerte"
                        onRowButtonClick={handleRowClick}
                        getRowId={getRowId}
                    />
                </Grid>
            </Grid>
            {selectedAlert && (
                <AlertModal alert={selectedAlert} open={modalOpen} onClose={handleCloseModal} />
            )}
            {isMobile && <Navbar />}
        </>
    );
}
