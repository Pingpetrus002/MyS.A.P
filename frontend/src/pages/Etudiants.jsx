import {useEffect, useState} from 'react';
import {Button, LinearProgress, Grid, MenuItem, Link, Box, Divider, Menu,useMediaQuery} from '@mui/material';


// Importations personnalisées
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import StudentModal from '../components/EtudiantModal';
import NavBar from '../components/Navbar';

// Fonction asynchrone pour récupérer les données des étudiants
async function getDatas() {
  let fetchWraper = new FetchWraper();
  fetchWraper.url = "https://localhost:5001/auth/get_students";
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
        const isMobile = useMediaQuery('(max-width:600px)');


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

    const [anchorElAjout, setAnchorElAjout] = useState(null);

    const handleOpenAjoutMenu = (event) => {
        setAnchorElAjout(event.currentTarget);
    };

    const handleCloseAjoutMenu = () => {
        setAnchorElAjout(null);
    };

  // Rendu du composant
  return (
    <>
      {!isMobile && <NavBar />}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container justifyContent="center" sx={{ marginTop: '30px' }}>
                <Grid item xs={10}>
                    {loading ? (
                        <LinearProgress/>
                    ) : (
                        <DataTable rows={students} type="etudiant" onRowButtonClick={handleRowClick}
                                   getRowId={getRowId}/>
                    )}
                </Grid>
                <Grid item xs={10}>
                    {selectedStudent && (
                        <StudentModal student={selectedStudent} open={modalOpen} onClose={handleCloseModal}/>
                    )}
                </Grid>
            </Grid>
        )}
      {isMobile && <NavBar />}
    </>
  );
}
