import React, {useEffect, useState} from 'react';
import {
    Button,
    LinearProgress,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Divider
} from '@mui/material';

// Importations personnalisées
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import StudentModal from '../components/EtudiantModal';
import studentImage from "../assets/students.jpg";
import Logo from "../assets/logoFull.svg";
import {alpha, styled} from "@mui/material/styles";
import JObject from "../utils/JObject.js";
import NavBar from "../components/Navbar.jsx";
import UploadEtudiants from "../components/UploadEtudiants.jsx";
import Typography from "@mui/material/Typography";

async function SubmitFormAjout() {
    const form = document.getElementById('ajout-etudiant-form');

    let jObject = new JObject();
    jObject.fromFormData(new FormData(form));
    console.log(jObject.toJSON());

    let hasEmptyField = false;
    const exclude = ["date_naissance", "classe", "tuteur", "suiveur", "entreprise", "ecole"];
    for (let key of jObject.keys()) {
        if (jObject.get(key) === "" && !exclude.includes(key)) {
            hasEmptyField = true;
        }
    }
    if (hasEmptyField) {
        return;
    }

    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/ajout_etudiants";
    fetchWraper.method = "POST";
    fetchWraper.headers.set("Content-Type", "application/json");
    fetchWraper.headers.set("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    fetchWraper.body = jObject.toJSON();
    let result = await fetchWraper.fetchw();

    if (result.status === 200) {
        console.log("sent", result.json());
    }
    if (result.status === 201) {
        console.log("Student added successfully");
    } else {
        console.error("Error adding student", result);
    }
}


async function getFieldsDataUtilisateurs(role) {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/get_users/" + role;
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");
    let result = await fetchWraper.fetchw();
    return await result.json();
}

async function getFieldsInfo(nom) {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/get_info/" + nom;
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");
    let result = await fetchWraper.fetchw();
    return await result.json();
}

function FormAjout() {
    const [classes, getClasses] = useState(null);
    const [classeNames, setClasseNames] = useState([]);
    const [tuteurs, getTuteurs] = useState(null);
    const [tuteursNames, setTuteursNames] = useState([]);
    const [suiveurs, getSuiveurs] = useState(null);
    const [suiveurNames, setSuiveurNames] = useState([]);
    const [ecoles, getEcoles] = useState(null);
    const [ecoleNames, setEcoleNames] = useState([]);
    const [entreprises, getEntreprises] = useState(null);
    const [entrepriseNames, setEntrepriseNames] = useState([]);

    useEffect(() => {
        async function fetchClasses() {
            const result = await getFieldsInfo('planning');
            getClasses(result);
            if (result && result.plannings) {
                let classes = Array.isArray(result.plannings) ? result.plannings : [result.plannings];
                const values = classes.map(planning => ({key: planning.classe, value: planning.classe}));
                values.unshift({key: '', value: "Non défini"});
                setClasseNames(values);
            }
        }

        fetchClasses();
    }, [])

    useEffect(() => {
        async function fetchTuteurs() {
            const result = await getFieldsDataUtilisateurs(5);
            getTuteurs(result);
            if (result && result.users) {
                let users = Array.isArray(result.users) ? result.users : [result.users];
                const values = users.map(user => ({key: user.id, value: user.nom.toUpperCase() + " " + user.prenom}));
                values.unshift({key: '', value: "Non défini"});
                setTuteursNames(values);
            }
        }

        fetchTuteurs();
    }, [])

    useEffect(() => {
        async function fetchSuiveurs() {
            const result = await getFieldsDataUtilisateurs(3);
            getSuiveurs(result);
            if (result && result.users) {
                let users = Array.isArray(result.users) ? result.users : [result.users];
                const values = users.map(user => ({key: user.id, value: user.nom.toUpperCase() + " " + user.prenom}));
                values.unshift({key: '', value: "Non défini"});
                setSuiveurNames(values);
            }
        }

        fetchSuiveurs();
    }, [])

    useEffect(() => {
        async function fetchEcoles() {
            const result = await getFieldsInfo('ecole');
            getEcoles(result);
            if (result && result.ecoles) {
                let ecoles = Array.isArray(result.ecoles) ? result.ecoles : [result.ecoles];
                const values = ecoles.map(ecole => ({key: ecole.id, value: ecole.nom + " | " + ecole.adresse}));
                values.unshift({key: '', value: "Non défini"})
                setEcoleNames(values);
            }
        }

        fetchEcoles();
    }, [])

    useEffect(() => {
        async function fetchEntreprises() {
            const result = await getFieldsInfo('entreprise');
            getEntreprises(result);
            if (result && result.entreprises) {
                let entreprises = Array.isArray(result.entreprises) ? result.entreprises : [result.entreprises];
                const values = entreprises.map(entreprise => ({
                    key: entreprise.id,
                    value: entreprise.nom + " | " + entreprise.adresse
                }));
                values.unshift({key: '', value: "Non défini"});
                setEntrepriseNames(values);
            }
        }

        fetchEntreprises();
    }, [])

    const fields = [
        {id: 'nom', label: 'Nom', type: 'text'},
        {id: 'prenom', label: 'Prenom', type: 'text'},
        {id: 'email', label: 'Email', type: 'email'},
        {id: 'date_naissance', label: 'Date de naissance', type: 'date'},
        {
            id: 'statut',
            label: 'Statut',
            type: 'select',
            data: ['Non défini', 'Alternance en cours', 'Pas d\'alternance'].map(value => {
                let mappedValue;
                if (value === 'Alternance en cours') {
                    mappedValue = 1;
                } else if (value === 'Pas d\'alternance') {
                    mappedValue = 0;
                } else {
                    mappedValue = null;
                }
                return {key: mappedValue, value};
            })
        },
        {id: 'classe', label: 'Classe', type: 'select', data: classeNames},
        {id: 'ecole', label: 'École', type: 'select', data: ecoleNames},
        {id: 'suiveur', label: 'Suiveur', type: 'select', data: suiveurNames},
        {id: 'tuteur', label: 'Tuteur', type: 'select', data: tuteursNames},
        {id: 'entreprise', label: 'Entreprise', type: 'select', data: entrepriseNames},
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            color: 'black',
            margin: '5% auto',
            width: '60%',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '2em',
            }}>
                <Typography variant="h6">
                    Importez un CSV, JSON ou XML pour ajouter des étudiants :
                </Typography>
                <UploadEtudiants/>
            </div>
            <Divider flexItem variant="h6" style={{alignSelf: 'center', marginBottom: '1em', width: '100%', color: '#8e8e8e' }}>OU</Divider>
            <Typography variant="h6" style={{marginBottom: '2em'}}>
                Ajoutez des étudiants en utilisant le formulaire ci-dessous :
            </Typography>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderRadius: '90px',
            }}>
                <form id='ajout-etudiant-form' style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    borderRadius: '90px',
                    width: '100%',
                    justifyContent: 'left',
                }}>
                    {fields.map(field => (
                        <div key={field.id}
                             style={{display: 'flex', flexDirection: 'column', alignContent: 'start', width: '100%'}}>
                            {field.type === 'select' ? (
                                <FormControl style={{width: '100%'}}>
                                    <InputLabel id={field.id + "-label"}>{field.label}</InputLabel>
                                    <CustomSelectField
                                        id={field.id}
                                        label={field.label}
                                        type={field.type}
                                        variant="outlined"
                                        name={field.id}
                                    >
                                        {field.data.map((option) => (
                                            <MenuItem key={option.key} value={option.key}>{option.value}</MenuItem>
                                        ))}
                                    </CustomSelectField>
                                </FormControl>
                            ) : (
                                <CustomTextField
                                    id={field.id}
                                    label={field.label}
                                    type={field.type}
                                    variant="outlined"
                                    name={field.id}
                                    InputLabelProps={field.id.includes('date') ? {shrink: true} : {}}
                                    sx={{width: '100%'}}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Button
                            variant="outlined"
                            onClick={SubmitFormAjout}
                            sx={{
                                color: '#000000',
                                borderColor: '#F0C975',
                                backgroundColor: '#FDD47C',
                                marginTop: '1em',
                                mb: 1,
                                alignItems: 'right',
                                '&:hover': {
                                    backgroundColor: '#FFC039',
                                    borderColor: '#FFC039',
                                }
                            }}
                        >
                            Ajouter
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const CustomTextField = styled(TextField)(({theme}) => ({
    "& .MuiOutlinedInput-root": {
        color: "#000000",
        backgroundColor: "#F2F4F8",
        "& .MuiOutlinedInput-notchedOutline": {},
        "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000000",
            },
        },
    },
    "& .MuiInputLabel-outlined": {
        "&.Mui-focused": {
            color: "#000000",
        },
    },
}))

const CustomSelectField = styled(Select)(({ theme }) => ({
    "& .MuiSelect-outlined": {
        color: "#000000",
        backgroundColor: "#F2F4F8",
        "& .MuiOutlinedInput-notchedOutline": {},
        "& .focus": {
            borderColor: "#000000",
            color: "#000000",
        },
    },
    "& .MuiSelectLabel-outlined": {
        "&.Mui-focused": {
            color: "#000000",
        },
    },
}));

export default function AjoutEtudiants() {
    // État local pour stocker les étudiants, le chargement, l'étudiant sélectionné et l'état modal
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Rendu du composant
    return (
        <>
            <NavBar/>
            <Grid container justifyContent="start" sx={{p: '25px'}}>
                <FormAjout/>
            </Grid>
        </>
    );
}
