import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';

import { Stack, Box, Grid, Modal, Button, TextField, Select, MenuItem } from '@mui/material';
//import { DataGrid } from "@mui/x-data-grid";
import DataTable from '../components/DataTable.jsx'; // pas de callback pour les boutons...
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

        if (user.password === "") {
            delete user.password;
        }

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

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                        <Grid item xs={8} sx={{ textAlign: 'center' }}>
                            <TextField
                                id="password"
                                label="Mot de passe (optionnel)"
                                placeholder="(optionnel)"
                                variant="outlined"
                                fullWidth
                                value={user.password || ""}
                                name="password"
                                type='text'
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center', alignSelf: 'center', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    let password = Math.random().toString(36).slice(-12);
                                    setUser({ ...user, password: password });
                                }}
                            >
                                Générer
                            </Button>
                        </Grid>

                    </Box>
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


export function usersManagementGridCallback(e) {
    console.log("Callback:", e);
}



async function getUsers() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/users/list";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();

    let data = await result.json() || [];

    return { "status": result.status, "data": data.users };

}


function roleNames(role) {
    switch (role) {
        case 1:
            return "Admin";
        case 2:
            return "RRE";
        case 3:
            return "Suiveur";
        case 4:
            return "Etudiant";
        case 5:
            return "Tuteur";
        default:
            return "Inconnu";
    }
}



function UsersManagement() {

    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        triggerReload();
        setOpen(false);
    }

    const triggerReload = () => {
        setReload(prev => !prev); // This toggles the reload state, triggering the useEffect hook
    };

    useEffect(() => {
        async function fetchData() {
            const result = await getUsers();
            const formattedUsers = result.data.map(user => (
                {
                    id: user.id_user,
                    role: roleNames(user.id_role),
                    date_naissance_formatted: new Date(user.date_naissance).toLocaleDateString(),
                    ...user
                }));
            setUsers(formattedUsers);
            //console.log(formattedUsers);
        }
        fetchData();
    }, [reload]);


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

                <Grid item xs={12} sx={{ textAlign: 'center' , paddingLeft: 6, paddingRight: 6}}>

                    <DataTable
                        rows={users}
                        type='users_management'
                    />

                    <Button
                        sx={{
                            marginTop: 1.8,
                            marginLeft: 4,
                            color: '#000000',
                            borderColor: '#F0C975',
                            backgroundColor: '#FDD47C',
                            mb: 1,
                            '&:hover': {
                                backgroundColor: '#FFC039',
                                borderColor: '#FFC039',
                            },
                        }}
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