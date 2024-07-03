import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    CircularProgress
} from '@mui/material';
import NavBar from '../components/Navbar';
import LinearProgress from '@mui/material/LinearProgress';
import Slider from "react-slick";



const EstablishmentsManagement = () => {
    const [ecole, setEcole] = useState({ raison_sociale: '', adresse: '' });
    const [classe, setClasse] = useState({ libelle: '' });
    const [entreprise, setEntreprise] = useState({ raison_sociale: '', adresse: '', id_ecole: '' });
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [entities, setEntities] = useState({ ecoles: [], classes: [], entreprises: [] });

    useEffect(() => {
        fetchEntities();
    }, []);

    // Création d'une instance Axios avec gestion des cookies
    const axiosInstance = axios.create({
        withCredentials: true,  // Inclure les cookies dans les requêtes sortantes
    });


    const fetchEntities = async () => {
        try {
            const responseEcoles = await axiosInstance.get('https://10.1.1.44:5001/auth/ecoles');
            const responseClasses = await axiosInstance.get('https://10.1.1.44:5001/auth/classes');
            const responseEntreprises = await axiosInstance.get('https://10.1.1.44:5001/auth/entreprises');

            setEntities({
                ecoles: responseEcoles.data,
                classes: responseClasses.data,
                entreprises: responseEntreprises.data
            });
        } catch (error) {
            console.error('Error fetching entities:', error);
        }
    };

    const handleChange = (setFunc) => (e) => {
        setFunc((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (url, data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(url, data);
            if (response.status === 201) {
                console.log('Entity added successfully');
                await fetchEntities(); // Re-fetch entities after adding
            }
        } catch (error) {
            console.error('Error adding entity:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (url, id, type) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(url);
            if (response.status === 200) {
                console.log('Entity deleted successfully');
                await fetchEntities(); // Re-fetch entities after deletion
                handleCloseDialog(); // Close dialog after successful deletion
            }
        } catch (error) {
            console.error('Error deleting entity:', error);
        }
        setLoading(false);
    };

    const handleClickOpenDialog = (entityData) => {
        setDialogData({ ...entityData, type: entityData.type }); // Assuming entityData contains a property 'type'
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogData(null);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <>
            <NavBar />
            <Container>
                <Typography variant="h4" marginTop='3em' gutterBottom>Ajouter / Supprimer une Entité</Typography>
                <Slider {...settings}>
                    {/* Slider Item 1: Ajouter une Ecole */}
                    <div>
                        <Typography variant="h6">Ajouter une Ecole</Typography>
                        <TextField
                            name="raison_sociale"
                            label="Raison Sociale"
                            fullWidth
                            value={ecole.raison_sociale}
                            onChange={handleChange(setEcole)}
                            margin="normal"
                        />
                        <TextField
                            name="adresse"
                            label="Adresse"
                            fullWidth
                            value={ecole.adresse}
                            onChange={handleChange(setEcole)}
                            margin="normal"
                        />
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSubmit('/auth/add_ecole', ecole)}
                                sx={{
                                    backgroundColor: '#FDD47C',
                                    color: 'black',
                                    borderRadius: '4px',
                                    width: '13em',
                                    height: '2em',
                                    fontSize: '16px',
                                    fontFamily: 'Inter',
                                    '&:hover': {
                                        backgroundColor: '#FFC039'
                                    }
                                }}
                            >
                                {loading ? <LinearProgress color="inherit" /> : 'Ajouter Ecole'}
                            </Button>
                        </Box>
                    </div>

                    {/* Slider Item 2: Ajouter une Classe */}
                    <div>
                        <Typography variant="h6">Ajouter une Classe</Typography>
                        <TextField
                            name="libelle"
                            label="Libellé"
                            fullWidth
                            value={classe.libelle}
                            onChange={handleChange(setClasse)}
                            margin="normal"
                        />
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSubmit('/auth/add_classe', classe)}
                                sx={{
                                    backgroundColor: '#FDD47C',
                                    color: 'black',
                                    borderRadius: '4px',
                                    width: '13em',
                                    height: '2em',
                                    fontSize: '16px',
                                    fontFamily: 'Inter',
                                    '&:hover': {
                                        backgroundColor: '#FFC039'
                                    }
                                }}
                            >
                                {loading ? <LinearProgress color="inherit" /> : 'Ajouter Classe'}
                            </Button>
                        </Box>
                    </div>

                    {/* Slider Item 3: Ajouter une Entreprise */}
                    <div>
                        <Typography variant="h6">Ajouter une Entreprise</Typography>
                        <TextField
                            name="raison_sociale"
                            label="Raison Sociale"
                            fullWidth
                            value={entreprise.raison_sociale}
                            onChange={handleChange(setEntreprise)}
                            margin="normal"
                        />
                        <TextField
                            name="adresse"
                            label="Adresse"
                            fullWidth
                            value={entreprise.adresse}
                            onChange={handleChange(setEntreprise)}
                            margin="normal"
                        />
                        <TextField
                            name="id_ecole"
                            label="ID Ecole"
                            fullWidth
                            value={entreprise.id_ecole}
                            onChange={handleChange(setEntreprise)}
                            margin="normal"
                        />
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSubmit('/auth/add_entreprise', entreprise)}
                                sx={{
                                    backgroundColor: '#FDD47C',
                                    color: 'black',
                                    borderRadius: '4px',
                                    width: '14em',
                                    height: '2em',
                                    margin: '3em',
                                    fontSize: '16px',
                                    fontFamily: 'Inter',
                                    '&:hover': {
                                        backgroundColor: '#FFC039'
                                    }
                                }}
                            >
                                {loading ? <LinearProgress color="inherit" /> : 'Ajouter Entreprise'}
                            </Button>
                        </Box>
                    </div>
                </Slider>

                {/* Section pour Afficher et Supprimer les Entités */}
                <Grid container spacing={3} marginTop='3em'>
                    {/* Section Ecoles */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5">Liste des Ecoles</Typography>
                        {entities.ecoles.map((ecole) => (
                            <Box key={ecole.id} display="flex" alignItems="center" marginLeft='4.5em' marginTop="1em">
                                <Typography variant="subtitle1">{ecole.raison_sociale}</Typography>
                                <Button
                                    onClick={() => handleClickOpenDialog(ecole)}
                                    variant="outlined"
                                    color="error"
                                    sx={{ marginLeft: '1em' }}
                                >
                                    Supprimer
                                </Button>
                            </Box>
                        ))}
                    </Grid>

                    {/* Section Classes */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5">Liste des Classes</Typography>
                        {entities.classes.map((classe) => (
                            <Box key={classe.id} display="flex" alignItems="center" marginLeft='5em' marginTop="1em">
                                <Typography variant="subtitle1">{classe.libelle}</Typography>
                                <Button
                                    onClick={() => handleClickOpenDialog(classe)}
                                    variant="outlined"
                                    color="error"
                                    sx={{ marginLeft: '1em' }}
                                >
                                    Supprimer
                                </Button>
                            </Box>
                        ))}
                    </Grid>

                    {/* Section Entreprises */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5">Liste des Entreprises</Typography>
                        {entities.entreprises.map((entreprise) => (
                            <Box key={entreprise.id} display="flex" marginLeft='5em' alignItems="center" marginTop="1em">
                                <Typography variant="subtitle1">{entreprise.raison_sociale}</Typography>
                                <Button
                                    onClick={() => handleClickOpenDialog(entreprise)}
                                    variant="outlined"
                                    color="error"
                                    sx={{ marginLeft: '1em' }}
                                >
                                    Supprimer
                                </Button>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Container>

            {/* Dialog pour Confirmer la Suppression */}
            <Dialog
                open={openDialog}
                TransitionComponent={Slide}
                keepMounted
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Confirmer la Suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Êtes-vous sûr de vouloir supprimer cette entité ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => handleDelete(`https://10.1.1.44:5001/auth/delete_${dialogData.type}/${dialogData.id}`, dialogData.id, dialogData.type)}
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EstablishmentsManagement;
