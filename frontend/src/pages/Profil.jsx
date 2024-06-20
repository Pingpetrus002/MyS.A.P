import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';
import {LinearProgress} from '@mui/material';
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

    useEffect(() => {
        async function fetchData() {
            const result = await getDatas();
            setUser(result);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Profil</h1>
            <p>Email: {user ? user.mail : <LinearProgress />}</p>
            <p>Nom: {user ? user.nom : <LinearProgress />}</p>
            <p>Prénom: {user ? user.prenom : <LinearProgress />}</p>
            <UploadRapport args={{id_user: user ? user.id_user : null}} />
        </div>
    );
}