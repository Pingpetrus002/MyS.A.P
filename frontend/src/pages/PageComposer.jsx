import Login from "./Login";
import Profil from "./Profil";
import RendezVous from "./RendezVous";
import Etudiants from "./Etudiants";
import Rapports from "./Rapports";
import FetchWraper from "../utils/FetchWraper";
import { useEffect, useState } from 'react';

const Pages = {
    "login": Login,
    "profil":Profil,
    "rendez-vous": RendezVous,
    "etudiants": Etudiants,
    "rapports": Rapports,
    "DefaultPage": Login
};

async function IsConnected(page) {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/protected?page=" + page;
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
