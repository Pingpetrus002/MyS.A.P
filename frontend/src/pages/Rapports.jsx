import { useEffect, useState } from 'react';
import { LinearProgress, Grid, useMediaQuery } from '@mui/material';

import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import NavBar from '../components/Navbar.jsx';

async function getRapports() {
    // Appel à l'API pour récupérer les rapports de l'utilisateur
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://10.1.1.44:5000/auth/get_rapport_info";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

    let result = await fetchWraper.fetchw();
    let data = await result.json();

    // Filtrer les rapports avec le type 'autre'
    let filteredRapports = data.rapports.filter(rapport => rapport.type !== 'autre');

    return filteredRapports;
}

export default function Rapports() {
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const rapportsData = await getRapports();
                setRapports(rapportsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const isMobile = useMediaQuery('(max-width:600px)');

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            {!isMobile && <NavBar />}
            <Grid container direction="row" justifyContent="center" spacing={4} marginTop={4}>
                <Grid item>
                    <DataTable rows={rapports} type="rapport" />
                </Grid>
            </Grid>
            {isMobile && <NavBar />}
        </>
    );
}
