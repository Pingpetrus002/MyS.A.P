import React, {useEffect, useState} from 'react';
import {Button, LinearProgress, Grid, TextField, Select, MenuItem, InputLabel, FormControl} from '@mui/material';

// Importations personnalisées
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import StudentModal from '../components/EtudiantModal';
import studentImage from "../assets/students.jpg";
import Logo from "../assets/logoFull.svg";
import {alpha, styled} from "@mui/material/styles";
import JObject from "../utils/JObject.js";

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
    const [tuteurs, getTuteurs] = useState(null);
    const [tuteursNames, setTuteursNames] = useState([]);
    const [suiveurs, getSuiveurs] = useState(null);
    const [suiveurNames, setSuiveurNames] = useState([]);
    const [ecoles, getEcoles] = useState(null);
    const [ecoleNames, setEcoleNames] = useState([]);
    const [entreprises, getEntreprises] = useState(null);
    const [entrepriseNames, setEntrepriseNames] = useState([]);

    useEffect(() => {
        async function fetchTuteurs() {
            const result = await getFieldsDataUtilisateurs(5);
            getTuteurs(result);
            if (result && result.users) {
                let users = Array.isArray(result.users) ? result.users : [result.users];
                const values = users.map(user => ({ key: user.id, value: user.nom.toUpperCase() + " " + user.prenom }));
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
                const values = users.map(user => ({ key: user.id, value: user.nom.toUpperCase() + " " + user.prenom }));
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
                const values = ecoles.map(ecole => ({ key: ecole.id, value: ecole.nom + " | " + ecole.adresse }));
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
                const values = entreprises.map(entreprise => ({ key: entreprise.id, value: entreprise.nom + " | " + entreprise.adresse }));
                setEntrepriseNames(values);
            }
        }
        fetchEntreprises();
    }, [])

    console.log(ecoleNames);
    console.log(entrepriseNames);

    const fields = [
        { id: 'nom', label: 'Nom', type: 'text' },
        { id: 'prenom', label: 'Prenom', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'date_naissance', label: 'Date de naissance', type: 'date' },
        { id: 'classe', label: 'Classe', type: 'select', data: ['B1', 'B2', 'B3'].map(value => ({ key: value, value })) },
        { id: 'suiveur', label: 'Suiveur', type: 'select', data: suiveurNames },
        { id: 'tuteur', label: 'Tuteur', type: 'select', data: tuteursNames },
        { id: 'ecole', label: 'École', type: 'select', data: ecoleNames },
        { id: 'entreprise', label: 'Entreprise', type: 'select', data: entrepriseNames },
    ];

    return (
        <div style={{
            color: 'white',
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <form id='ajout-etudiant-form' style={{ display: 'grid', borderRadius: "90" }}>
                <Grid container spacing={5}>
                    {fields.map(field => (
                        <Grid item xs={6} key={field.id}>
                            {field.type === 'select' ? (
                                <FormControl style={{ width: '100%' }}>
                                    <InputLabel id={field.id + "-label"}>{field.label}</InputLabel>
                                    <CustomSelectField
                                        id={field.id}
                                        label={field.label}
                                        type={field.type}
                                        variant="outlined"
                                        name={field.id}
                                    >
                                        {field.data.map((option, index) => (
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
                                    InputLabelProps={field.id.includes('date') ? { shrink: true } : {}}
                                    sx={{ width: '100%' }}
                                />
                            )}
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <CustomButton variant="outlined" color="inherit"
                                      onClick={SubmitFormAjout}>Ajouter</CustomButton>
                    </Grid>
                </Grid>
            </form>
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

const CustomSelectField = styled(Select)(({theme}) => ({
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

const CustomButton = styled(Button)(({theme}) => ({
    backgroundColor: '#ffffff',
    color: '#000000',
    borderWidth: '2px',
    marginBottom: '20px',
    "&.MuiButton-root": {
        "&:hover": {
            borderColor: '#000000',
            backgroundColor: alpha('#ffffff', 0.8),
            borderWidth: '2px',
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
        <Grid container justifyContent="center">
            <FormAjout />
        </Grid>
    );
}
