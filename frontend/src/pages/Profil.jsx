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
    fetchWraper.url = "http://localhost:5000/auth/get_rapport_info";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");


    let result = await fetchWraper.fetchw();
    let data = await result.json();
    
    // Filtrer les rapports avec le type 'autre'
    let filteredRapports = data.rapports.filter(rapport => rapport.type !== 'autre');
    
    return { filteredRapports, otherRapports: data.rapports.filter(rapport => rapport.type === 'autre') };
}


export default function Profil() {
    const [user, setUser] = useState(null);
    const [filteredRapports, setFilteredRapports] = useState([]);
    const [otherRapports, setOtherRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSecondTable, setShowSecondTable] = useState(false);
    const [tableTitle, setTableTitle] = useState('Mes Documents');

    useEffect(() => {
        async function fetchData() {
            const userData = await getDatas();
            setUser(userData);
            setLoading(false); // Arrête le chargement une fois les données récupérées

            const { filteredRapports, otherRapports } = await getRapports();
            setFilteredRapports(filteredRapports);
            setOtherRapports(otherRapports);
            setLoading(false); // Arrête le chargement une fois les données récupérées
        }

        fetchData();
    }, []);

    const handleShowSecondTable = () => {
        setShowSecondTable(!showSecondTable);
        setTableTitle(showSecondTable ? 'Mes Autres Documents' : 'Mes Rapports');
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
        <NavBar idRole={user.id_role} />
        <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={4} marginTop={4}>
            <Grid item>
                <HeaderProfile Nom={user ? user.nom : <LinearProgress />} Prenom={user ? user.prenom : <LinearProgress />} Mail={user ? user.mail : <LinearProgress />} Classe={user ? user.classe : <LinearProgress />} Status={user ? user.statut : <LinearProgress />} Role={user ? user.id_role : <LinearProgress />} />
                <Grid item sx={{ marginLeft: "auto", marginTop: 4 }}>
                    <UploadRapport args={{ id_user: user ? user.id_user : null }} />
                </Grid>
            </Grid>
            <Grid item>
                <DataTable rows={filteredRapports} type="mes_rapports" />
            </Grid>
        </Grid>
    </>
    );
}
