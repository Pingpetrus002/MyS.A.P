import React, { useEffect, useState } from 'react';
import { Button, LinearProgress, Grid } from '@mui/material';
import { saveAs } from 'file-saver'; // Importer saveAs pour le téléchargement de fichiers

// Importations personnalisées
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import StudentModal from '../components/EtudiantModal';

// Fonction asynchrone pour récupérer les données des étudiants
async function getDatas() {
  let fetchWraper = new FetchWraper();
  fetchWraper.url = "http://localhost:5000/auth/get_students";
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

export default function Etudiants() {
  // État local pour stocker les étudiants, le chargement, l'étudiant sélectionné et l'état modal
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Effet pour charger les données des étudiants au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDatas();
        setStudents(data.students); // Assuming data.students is an array of students
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour obtenir l'ID d'une ligne d'étudiant
  const getRowId = (student) => student.id;

  // Gestionnaire pour ouvrir le modal lors du clic sur une ligne d'étudiant
  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  // Gestionnaire pour fermer le modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Fonction pour exporter les données au format CSV
  const exportToCSV = () => {
    const csvData = students.map((student) => {
      // Générer une ligne CSV pour chaque étudiant
      return `${student.nom},${student.prenom},${student.classe},${student.statut}, ${student.entreprise}`;
    });
    const csvString = csvData.join('\n'); // Concaténer les lignes avec un saut de ligne

    // Créer un objet Blob contenant les données CSV
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    // Télécharger le fichier CSV avec FileSaver.js
    saveAs(blob, 'etudiants.csv');
  };

  // Rendu du composant
  return (
    <Grid container justifyContent="center">
      <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem' }}>
        <h1>Tous les Étudiants</h1>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#FDD47C', 
            color: 'black', 
            size: 'large',
            borderRadius: '4px',
            border: '2.5px solid #000000',
            width: '40px', 
            minWidth: '40px', 
            height: '40px', 
            fontSize: '24px', // Augmenter la taille du texte
            '&:hover': {
              backgroundColor: '#FFC039'
            } 
          }} 
        >
          +
        </Button>
        
      </Grid>
      <Grid item xs={10}>
        {loading ? (
          <LinearProgress />
        ) : (
          <DataTable rows={students} type="etudiant" onRowButtonClick={handleRowClick} getRowId={getRowId} />
        )}
      </Grid>
      <Grid item xs={10} sx={{ marginTop: '2rem' }}>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#FDD47C', 
            color: 'black', 
            size: 'large',
            borderRadius: '4px',
            border: '2.5px solid #000000',
            width: '150px', 
            height: '60px', 
            fontSize: '16px', // Augmenter la taille du texte
            fontFamily: 'Inter', // Changer la police du texte
            '&:hover': {
              backgroundColor: '#FFC039'
            } 
          }} 
          onClick={exportToCSV} // Appeler la fonction d'export CSV lors du clic sur le bouton
        >
          Exporter CSV
        </Button>
      </Grid>
      
    </Grid>
  );
}
