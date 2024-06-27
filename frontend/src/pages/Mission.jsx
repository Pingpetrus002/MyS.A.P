import { useEffect, useState } from 'react';
import { LinearProgress, Grid, useMediaQuery } from '@mui/material';

// Importations personnalisées
import Navbar from '../components/Navbar';
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';

// Fonction asynchrone pour récupérer les données des missions
async function getMissionData() {
  let fetchWraper = new FetchWraper();
  fetchWraper.url = "https://localhost:5001/auth/get_missions"; // Endpoint pour récupérer les missions
  fetchWraper.method = "GET";
  fetchWraper.headers.append("Content-Type", "application/json");
  fetchWraper.headers.append("Accept", "application/json");
  fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
  fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
  let result = await fetchWraper.fetchw();

  let data = await result.json();
  console.log(data); // Vérifiez ici la structure des données
  const missionsWithID = data.missions.map((mission, index) => {
    return { ...mission, id: index + 1 };
  });

  return missionsWithID;
}

export default function MissionPage() {
  // État local pour stocker les missions, le chargement, la mission sélectionnée et l'état modal
  const [missions, setMissions] = useState([]); // Assurez-vous que missions commence par un tableau vide
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Effet pour charger les données des missions au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMissionData();
        console.log(data); // Assurez-vous que data contient les missions
        setMissions(data); // Mettez à jour missions avec les données récupérées
        console.log(missions); // Vérifiez ici les missions mises à jour
        setLoading(false); // Fin du chargement
      } catch (error) {
        console.error('Error:', error);
        setLoading(false); // Gestion des erreurs de chargement
      }
    };

    fetchData();
  }, []);

  // Fonction pour obtenir l'ID d'une ligne de mission
  const getRowId = (mission) => mission.id_mission;

  // Rendu du composant
  return (
    <>
      {!isMobile && <Navbar />}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container direction="row" justifyContent="center" spacing={4} marginTop={4}>
          <Grid item>
            <DataTable rows={missions} type="mission" getRowId={getRowId} />
          </Grid>
        </Grid>
      )}
      {isMobile && <Navbar />}
    </>
  );
}
