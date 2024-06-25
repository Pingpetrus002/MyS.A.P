import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FetchWraper from '../utils/FetchWraper'; // Assurez-vous d'importer correctement votre classe FetchWraper

export default function AddMissionModal() {
    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const [datedebut, setDatedebut] = useState('');
    const [datefin, setDatefin] = useState('');
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        // Réinitialiser les champs si nécessaire
        setLibelle('');
        setDescription('');
        setDatedebut('');
        setDatefin('');
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleLibelleChange = (event) => {
        setLibelle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleChangeDateDebut = (event) => {
        setDatedebut(event.target.value);
    };

    const handleChangeDateFin = (event) => {
        setDatefin(event.target.value);
    };

    const handleAddMission = async (newMission) => {
        try {
            const fetchWraper = new FetchWraper();
            fetchWraper.url = "http://localhost:5000/auth/add_mission";
            fetchWraper.method = "POST";
            fetchWraper.headers.set("Content-Type", "application/json");
            fetchWraper.headers.set("Accept", "application/json");
            fetchWraper.headers.set("Access-Control-Allow-Origin", window.location.origin);
            fetchWraper.headers.set("Access-Control-Allow-Credentials", "true");
            console.log(JSON.stringify(newMission));
            
            fetchWraper.body = JSON.stringify(newMission);

            const response = await fetchWraper.fetchw();

            if (!response.ok) {
                throw new Error('Failed to add mission');
            }

            const data = await response.json();
            console.log('Mission added successfully:', data);
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-lancer l'erreur pour la gestion à l'endroit où cette fonction est appelée
        }
    };

    const handleAdd = async () => {
        const newMission = {
            libelle,
            description,
            datedebut,
            datefin,
            // Ajouter d'autres champs de mission si nécessaire
        };

        try {
            await handleAddMission(newMission);
            handleClose(); // Fermer la modal après l'ajout
        } catch (error) {
            console.error('Failed to add mission:', error);
            // Gérer l'erreur ici (affichage d'un message d'erreur, rollback, etc.)
        }
    };

    return (
        <>
            <Tooltip title="Ajouter une mission" placement="top">
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    sx={{
                        color: '#000000',
                        borderColor: '#F0C975',
                        backgroundColor: '#FDD47C',
                        mb: 1,
                        '&:hover': {
                            backgroundColor: '#FFC039',
                            borderColor: '#FFC039',
                        },
                    }}
                >
                    <AddIcon />
                </Button>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Ajouter une nouvelle mission</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="libelle"
                        label="Libellé"
                        fullWidth
                        value={libelle}
                        onChange={handleLibelleChange}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <TextField
                        margin="dense"
                        id="datedebut"
                        label="Date début"
                        type="date"
                        fullWidth
                        value={datedebut}
                        onChange={handleChangeDateDebut}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="datefin"
                        label="Date fin"
                        type="date"
                        fullWidth
                        value={datefin}
                        onChange={handleChangeDateFin}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {/* Ajoutez ici d'autres champs de saisie pour les données de la mission */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Ajouter
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
