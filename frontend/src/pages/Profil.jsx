import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';

import { IconButton, LinearProgress, Stack } from '@mui/material';
import HeaderProfile from '../components/HeaderProfile';
import DataTable from '../components/DataTable';
import Grid from '@mui/material/Grid';
import NavBar from '../components/Navbar.jsx';
import UploadRapport from '../components/UploadRapport';


async function getDatas() {
    // Appel à l'API pour récupérer les données de l'utilisateur
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/get_profil";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();

    let data = await result.json();
    return data.user;
}

async function getRapports() {
    // Appel à l'API pour récupérer les rapports de l'utilisateur
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/get_rapports";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();
    let data = await result.json();
    return data.rapports;
}

async function getRapportsEtudiant() {
    // Appel à l'API pour récupérer les rapports de l'étudiant
    // ...
}

async function getEtudiants() {
    // Appel à l'API pour récupérer les étudiants du tuteur
    // ...
}

export default function Profil() {
    const [user, setUser] = useState(null);
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const userData = await getDatas();
            setUser(userData);
            setLoading(false); // Arrête le chargement une fois les données récupérées

            const rapportsData = await getRapports();
            setRapports(rapportsData);
            setLoading(false); // Arrête le chargement une fois les données récupérées

        }

        fetchData();
    }, []);

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            <NavBar />
            <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={4} marginTop={4}>
                <Grid item>
                    <HeaderProfile Nom={user ? user.nom : <LinearProgress />} Prenom={user ? user.prenom : <LinearProgress />} Mail={user ? user.mail : <LinearProgress />} Classe={user ? user.classe : <LinearProgress />} Status={user ? user.statut : <LinearProgress />} />
                    <Grid item sx={{ marginLeft: "auto", marginTop: 4 }}>
                        <UploadRapport args={{ id_user: user ? user.id_user : null }} />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <h1>Mes Rapports</h1>
                        </Grid>
                        <Grid item sx={{ marginLeft: "auto" }}>
                            <Grid container direction="row">
                                <Grid item>
                                    <h1>Item 1</h1>
                                </Grid>
                                <Grid item alignContent="center">
                                    <IconButton sx={{ color: '#000000' }}>-></IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <DataTable rows={rapports} type="rapport" />
                </Grid>
            </Grid>
        </>
    );
}
