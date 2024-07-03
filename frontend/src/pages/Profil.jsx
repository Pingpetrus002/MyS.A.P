import { useEffect, useState } from 'react';
import { LinearProgress, Grid, useMediaQuery } from '@mui/material';
import FetchWraper from '../utils/FetchWraper';
import HeaderProfile from '../components/HeaderProfile';
import DataTable from '../components/DataTable';
import NavBar from '../components/Navbar.jsx';
import UploadRapport from '../components/UploadRapport';

async function getDatas() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://10.1.1.44:5001/auth/get_profil";
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
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://10.1.1.44:5001/auth/get_rapport_info";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

    let result = await fetchWraper.fetchw();
    let data = await result.json();
    let filteredRapports = data.rapports.filter(rapport => rapport.type !== 'autre');
    return { filteredRapports, otherRapports: data.rapports.filter(rapport => rapport.type === 'autre') };
}

export default function Profil() {
    const [user, setUser] = useState(null);
    const [filteredRapports, setFilteredRapports] = useState([]);
    const [otherRapports, setOtherRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSecondTable, setShowSecondTable] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        async function fetchData() {
            const userData = await getDatas();
            setUser(userData);
            const { filteredRapports, otherRapports } = await getRapports();
            setFilteredRapports(filteredRapports);
            setOtherRapports(otherRapports);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleToggleTable = () => {
        setShowSecondTable(!showSecondTable);
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            {!isMobile && <NavBar idRole={user.id_role} />}
            <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={4} marginTop={4}>
                <Grid item>
                    <HeaderProfile
                        Nom={user ? user.nom : <LinearProgress />}
                        Prenom={user ? user.prenom : <LinearProgress />}
                        Mail={user ? user.mail : <LinearProgress />}
                        Classe={user ? user.classe : <LinearProgress />}
                        Status={user ? user.statut : <LinearProgress />}
                        Role={user ? user.id_role : <LinearProgress />}
                    />
                    <Grid item sx={{ marginLeft: "auto", marginTop: 4 }}>
                        <UploadRapport args={{ id_user: user ? user.id_user : null }} />
                    </Grid>
                </Grid>
                <Grid item>
                    <DataTable
                        rows={showSecondTable ? otherRapports : filteredRapports}
                        type={showSecondTable ? "mes_documents" : "mes_rapports"}
                        handleToggleTable={handleToggleTable}
                    />
                </Grid>
            </Grid>
            {isMobile && <NavBar idRole={user.id_role} />}
        </>
    );
}
