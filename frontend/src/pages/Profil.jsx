import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';

import { IconButton, LinearProgress, Stack } from '@mui/material';
import HeaderProfile from '../components/HeaderProfile';
import DataTable from '../components/DataTable';
import Grid from '@mui/material/Grid';
import NavBar from '../components/Navbar.jsx';

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
            const userData = await getDatas();
            setUser(userData);
            setLoading(false); // Arrête le chargement une fois les données récupérées

            // Récupération des données supplémentaires en fonction du rôle de l'utilisateur
            if (userData.role === 'RRE') {
                const rapportData = await getRapports();
                setRapports(rapportData);
            } else if (userData.role === 'Suiveur') {
                const rapportData = await getRapports();
                // Récupération des rapports de l'utilisateur et des rapports créés par lui
                setRapports(rapportData);
            } else if (userData.role === 'Etudiant') {
                const rapportData = await getRapportsEtudiant();
                // Récupération des rapports concernant l'étudiant
                setRapports(rapportData);
            } else if (userData.role === 'Tuteur') {
                const etudiantsData = await getEtudiants();
                // Récupération des étudiants du tuteur et de leurs rapports
                // ...
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            <NavBar idRole={user.id_role}/>
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
