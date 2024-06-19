import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';
import { LinearProgress, Grid, Typography } from '@mui/material';
import HeaderProfile from '../components/HeaderProfile';
import DataTable from '../components/DataTable';

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
        <Grid container justifyContent="center" marginTop="2rem">
            <Grid item xs={12}>
                <HeaderProfile 
                    Nom={user.nom} 
                    Prenom={user.prenom} 
                    Mail={user.mail} 
                    Status={user.statut} 
                    Classe={user.classe} 
                />
            </Grid>
            <Grid item xs={12}>
                <Typography textAlign="left" marginTop="2rem" marginLeft="2rem" variant="h3" gutterBottom>
                    Mes Rapports
                </Typography>
                <Grid item xs={12}>
                    {loading ? (
                        <LinearProgress />
                    ) : (
                    <DataTable rows={rapports} type="mes_rapport" />
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}
