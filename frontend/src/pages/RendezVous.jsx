import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { InlineWidget } from 'react-calendly';
import FetchWraper from '../utils/FetchWraper';
import Navbar from '../components/Navbar';

async function getDatas() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/get_calendly";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();

    let data = await result.json();
    console.log(data);
    return data;
}

function RendezVous() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const user = await getDatas();
            setUserData(user);
        };

        fetchData();
    }, []); // Ajoutez une dépendance vide ici pour éviter la boucle infinie de chargement

    if (!userData) {
        return <div>Chargement...</div>;
    }
    if (!userData.url_calendly) {
        return <h1>Erreur lors de la récupération des données du Calendly</h1>;
    }

    return (
        <>
            <Navbar />
        <div>
            <h1>Planifier un rendez-vous</h1>
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InlineWidget url={userData.url_calendly} />
                    </Grid>
                </Grid>
            </form>
        </div>
        </>
    );
}

export default RendezVous;