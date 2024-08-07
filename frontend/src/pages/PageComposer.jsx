import Login from "./Login";
import Profil from "./Profil";
import RendezVous from "./RendezVous";
import Etudiants from "./Etudiants";
import Rapports from "./Rapports";
import Accueil from "./Accueil";
import Alertes from "./Alertes";
import MissionPage from "./Mission";
import UsersManagement from "./UsersManagement";
import EstablishmentsManagement from "./EstablishmentsManagement.jsx"
import AjoutEtudiants from "./AjoutEtudiants.jsx";
import FetchWraper from "../utils/FetchWraper";
import { useEffect, useState } from 'react';

const Pages = {
    "login": Login,
    "profil":Profil,
    "rendez-vous": RendezVous,
    "etudiants": Etudiants,
    "rapports": Rapports,
    "accueil": Accueil,
    "users-management": UsersManagement,
    "etablissements-management": EstablishmentsManagement,
    "alertes": Alertes,
    "missions": MissionPage,
    "ajout_etudiants": AjoutEtudiants,
    "DefaultPage": Login
};

async function IsConnected() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://localhost:5001/auth/protected";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();
    
    let data = await result.json();

    return { "status": result.status, "data": data };
}

function PageComposer(args) {
    const [isConnected, setIsConnected] = useState(null);
    let Page = Pages[args.page] || Pages.DefaultPage;

    useEffect(() => {
        async function fetchData() {
            const result = await IsConnected(args.page);
            setIsConnected(result.status === 200);
        }
        fetchData();
    }, []);

    // Ne pas rendre le composant tant que isConnected est null
    if (isConnected === null) {
        return null;
    }

    
    if (!isConnected) {
        Page = Pages.login;
    }
    return <Page />;
}

export default PageComposer;
