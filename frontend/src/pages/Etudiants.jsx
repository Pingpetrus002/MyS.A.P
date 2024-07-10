import { useEffect, useState } from 'react';
import { LinearProgress, Grid, useMediaQuery, Modal, Box, Select, MenuItem, Button } from '@mui/material';

// Importations personnalisées
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import NavBar from '../components/Navbar';
import SyntheseSuiviTuteur from '../components/FormRapport';  // Importation du composant SyntheseSuiviTuteur
import PropTypes from "prop-types";
import getSuiveurs from "../utils/getSuiveurs";

// Fonction asynchrone pour récupérer les données des étudiants
async function getDatas() {
  let fetchWraper = new FetchWraper();
  fetchWraper.url = "https://10.1.1.44:5001/auth/get_students";
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
    const [openAction, setOpenAction] = useState(false);
    const [reload, setReload] = useState(false);
    const [studentsSelected, setStudentsSelected] = useState([]);

    // Effet pour charger les données des étudiants au chargement du composant
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDatas();
                console.log(data)
                setStudents(data.students); // Assuming data.students is an array of students
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [modalOpen, reload]);

    // Fonction pour obtenir l'ID d'une ligne d'étudiant
    const getRowId = (student) => student.id;

    // Gestionnaire pour ouvrir le modal lors du clic sur une ligne d'étudiant
    const handleRowClick = (student) => {        
        if (student.constructor === Array) {
            setStudentsSelected(student);
            setOpenAction(true);
        } else {
            setSelectedStudent(student);
            setModalOpen(true);
            setReload;
        }
    };

    // Gestionnaire pour fermer le modal
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const triggerReload = () => {
        setReload(prev => !prev); // This toggles the reload state, triggering the useEffect hook
    };

    function ActionModal({
        open = false,
        handleClose = () => { },
        user = {},
    }) {

        const [userData, setUserData] = useState({});
        var [suiveurs, setSuiveurs] = useState([]);
        const [suiveurSelected, setSuiveurSelected] = useState(null);

        const handleSubmit = async () => {
            let fetchWraper = new FetchWraper();
            fetchWraper.url = "https://localhost:5001/auth/update_etudiant";
            fetchWraper.method = "POST";
            fetchWraper.headers.append("Content-Type", "application/json");
            fetchWraper.headers.append("Accept", "application/json");
            //fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
            //fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
            fetchWraper.body = JSON.stringify(studentsSelected.map(student => ({ id: student.id, id_user_1: suiveurSelected.suiveur })));

            console.log("stringify", studentsSelected.map(student => ({ id: student.id, id_user_1: suiveurSelected.suiveur })));
            console.log("studentsSelected", studentsSelected);
            console.log("suiveur selected", suiveurSelected.suiveur);

            let result = await fetchWraper.fetchw();

            switch (result.status) {
                case 200:
                    //console.log("User edited successfully");
                    break;
                default:
                    console.warn("Error editing user:", result.status);
                    break;
            }


            handleClose();


        };

        useEffect(() => {
            async function fetchData() {
                const result = await getSuiveurs();
                console.log("result data")
                console.log(result.data.users)
                const formattedSuiveurs = result.data.users.map(suiveur => (
                    {
                        id: suiveur.id,
                        nom: suiveur.nom,
                        prenom: suiveur.prenom,
                    }));
                formattedSuiveurs.push({ id: 0, nom: "Pas de ", prenom: "suiveur" });
                console.log("formatted suiveurs : ")
                setSuiveurs(formattedSuiveurs);
            }
            fetchData();
        }
            , []);

        return (
            <Modal
                open={open}
                onClose={() => {
                    setUserData({});
                    handleClose();
                }}
                aria-labelledby="Assigner un suiveur"
                aria-describedby="Assigner un suiveur"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: "88vh", overflow: "auto" }}>
                    <h2>Assigner un suiveur</h2>
                    <Grid container item xs={12} sx={{ justifyContent: 'left', fullWidth: true, p: 2 }}>
                        <Grid container sx={{ display: 'flex', justifyContent: 'center', fullWidth: true }}>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <h3>Suiveur : </h3>
                            </Grid>
                            <Grid item xs={8} sx={{ textAlign: 'center', fullWidth: true }}>
                                <Select
                                    sx={{ textAlign: 'center', width: '100%' }}
                                    name="suiveur"
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    onChange={(e) => setSuiveurSelected({[e.target.name]: e.target.value})}
                                >
                                    {suiveurs.map(suiveur => (
                                        <MenuItem key={suiveur.id} value={suiveur.id} disabled={suiveur.id === 0}>{suiveur.nom + " " + suiveur.prenom}</MenuItem>
                                    ))}

                                </Select>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: 'center', fullWidth: true, marginTop: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Appliqer
                            </Button>
                        </Grid>



                    </Grid>

                </Box>
            </Modal>
        );
    }

    ActionModal.propTypes = {
        open: PropTypes.bool,
        handleClose: PropTypes.func,
        user: PropTypes.object,
    };

    // Rendu du composant
    return (
        <>
            {!isMobile && <NavBar />}
            {loading ? (
                <LinearProgress />
            ) : (
                <Grid container justifyContent="center" sx={{ marginTop: '70px' }}>
                    <Grid item xs={10}>
                        {loading ? (
                            <LinearProgress />
                        ) : (
                            <>
                                <ActionModal
                                    open={openAction}
                                    handleClose={() => {
                                        triggerReload();
                                        setOpenAction(false)
                                    }}
                                />
                                <DataTable
                                    rows={students}
                                    type="etudiant"
                                    callback={(e) => {
                                        handleRowClick(e)
                                    }}
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={10}>
                        {selectedStudent && (
                            <SyntheseSuiviTuteur student={selectedStudent} open={modalOpen} onClose={handleCloseModal} />
                        )}
                    </Grid>
                </Grid>
            )}
            {isMobile && <NavBar />}
        </>
    );
}
