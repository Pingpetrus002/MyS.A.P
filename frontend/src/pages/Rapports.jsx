import { useEffect, useState } from 'react';
import { LinearProgress, Grid } from '@mui/material';

import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import NavBar from '../components/Navbar.jsx';

async function getRapports() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/get_rapport_info";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();
    let data = await result.json();
    return data.rapports;
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

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            <NavBar />
            <Grid container direction="row" justifyContent="center"  spacing={4} marginTop={4}>
                <Grid item>
                    <DataTable rows={rapports} type="rapport" />
                </Grid>
            </Grid>
        </>
    );
}