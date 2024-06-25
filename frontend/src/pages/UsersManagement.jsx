import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';

import { IconButton, LinearProgress, Stack, Box, Grid, Modal, Button, TextField, Select, MenuItem } from '@mui/material';
import NavBar from '../components/Navbar.jsx';
import PropTypes from "prop-types";


function AddUserModal({
    open = false,
    handleClose = () => { },
}) {
    const [user, setUser] = useState({});


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        let fetchWraper = new FetchWraper();
        fetchWraper.url = "http://localhost:5000/auth/register";
        fetchWraper.method = "POST";
        fetchWraper.headers.append("Content-Type", "application/json");
        fetchWraper.headers.append("Accept", "application/json");
        fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
        fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
        fetchWraper.body = JSON.stringify(user);

        let result = await fetchWraper.fetchw();

        switch (result.status) {
            case 200:
                console.log("User added successfully");
                break;
            default:
                console.log("Error adding user:", result.status);
                break;
        }

        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Ajouter un utilisateur"
            aria-describedby="Ajouter un utilisateur"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: "88vh", overflow: "auto" }}>
                <h2>Ajouter un utilisateur</h2>
                <Stack spacing={2}>
                    <TextField
                        id="firstname"
                        label="Prénom"
                        variant="outlined"
                        name="firstname"
                        onChange={handleChange}
                    />
                    <TextField
                        id="lastname"
                        label="Nom"
                        variant="outlined"
                        name="lastname"
                        onChange={handleChange}
                    />

                    <TextField
                        id="date_naissance"
                        label="Date de naissance"
                        variant="outlined"
                        name="date_naissance"
                        type="date"
                        onChange={handleChange}
                    />

                    <TextField
                        id="username"
                        label="Email"
                        variant="outlined"
                        name="username"
                        onChange={handleChange}
                    />
                    <TextField
                        id="password"
                        label="Mot de passe"
                        variant="outlined"
                        name="password"
                        type='password'
                        onChange={handleChange}
                    />
                    <Select
                        label="role"
                        value={user.role}
                        onChange={handleChange}
                        name="role"
                    >
                        <MenuItem value="1">Admin</MenuItem>
                        <MenuItem value="2">RRE</MenuItem>
                        <MenuItem value="3">Suiveur</MenuItem>
                        <MenuItem value="4">Etudiant</MenuItem>
                        <MenuItem value="5">Tuteur</MenuItem>
                    </Select>

                    <Button variant="contained" color="primary" onClick={handleSubmit}>Ajouter</Button>
                </Stack>
            </Box>
        </Modal>
    );
}

AddUserModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
};

function UsersManagement() {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <NavBar />
            <Grid container item xs={12} sx={{ justifyContent: 'center' }} >
                <AddUserModal 
                open={open}
                handleClose={handleClose}
                />
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <h1>Gestion des utilisateurs</h1>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleOpen()}
                    >
                        Ajouter un utilisateur
                    </Button>
                </Grid>
            </Grid>
        </>

    );



}


export default UsersManagement;