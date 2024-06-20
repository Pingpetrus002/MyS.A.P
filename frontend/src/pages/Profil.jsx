import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';
import { IconButton, LinearProgress, Stack } from '@mui/material';
import HeaderProfile from '../components/HeaderProfile';
import DataTable from '../components/DataTable';
import Grid from '@mui/material/Grid';
import NavBar from '../components/Navbar.jsx';
import UploadRapport from '../components/UploadRapport';


async function getDatas() {
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


export default function Profil() {
    const [user, setUser] = useState(null);

    const rows = [
        { id: 1, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 2, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 3, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 4, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 5, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 6, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 7, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 8, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 9, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
    ];

    useEffect(() => {
        async function fetchData() {
            const result = await getDatas();
            setUser(result);
        }
        fetchData();
    }, []);

    return (
        <>
            <NavBar />
            <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={4} marginTop={4}>
                <Grid item>
                    <HeaderProfile Nom={user ? user.nom : <LinearProgress />} Prenom={user ? user.prenom : <LinearProgress />} Mail={user ? user.mail : <LinearProgress />} />
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <h1>Mes Rapports</h1>
                        </Grid>
                        <Grid item sx={{ marginLeft: "auto" }}>
                            <UploadRapport args={{id_user: user ? user.id_user : null}} />
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
                    <DataTable rows={rows} type="rapport" />
                </Grid>
            </Grid>
        </>
    );
}