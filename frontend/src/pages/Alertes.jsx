import { useState, useEffect } from 'react';
import { LinearProgress, Grid } from '@mui/material';
import NavBar from '../components/Navbar.jsx';
import DataTable from '../components/DataTable';
import { getAlerts } from '../utils/AlertCreator.js';

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            <NavBar />
            {loading ? (
                <LinearProgress />
            ) : (
                <Grid container direction="row" justifyContent="center" spacing={4} marginTop={4}>
                    {alerts.length > 0 ? (
                        <Grid item>
                            <DataTable rows={alerts} type="alerte" />
                        </Grid>
                    ) : (
                        <p>Aucune alerte pour le moment</p>
                    )}
                </Grid>
            )}
        </>
    );
}
