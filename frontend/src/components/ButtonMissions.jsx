import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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

    const handleAddMission = (newMission) => {
        // Ajouter la logique pour ajouter la mission à la base de données
        console.log(newMission);
    };

    const handleAdd = () => {
        const newMission = {
            libelle,
            description,
            datedebut,
            datefin,
            // Ajouter d'autres champs de mission si nécessaire
        };
        handleAddMission(newMission);
        handleClose(); // Fermer la modal après ajout
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
