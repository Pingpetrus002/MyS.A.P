import FetchWraper from '../utils/FetchWraper';
import { useEffect, useState } from 'react';
import getRoles from '../utils/getRoles.js';

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
    const [roles, setRoles] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const result = await getRoles();
            const formattedRoles = result.data.map(role => (
                {
                    id: role.id_role,
                    role: role.nom,
                }));
            formattedRoles.push({ id: 0, role: "Inconnu" });
            //console.log(formattedRoles);
            setRoles(formattedRoles);
        }
        fetchData();
    }
        , []);


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        if (user.password === "") {
            delete user.password;
        }

        let fetchWraper = new FetchWraper();
        fetchWraper.url = "https://10.1.1.44:5001/auth/register";
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
            onClose={() => {
                setUser({});
                handleClose();
            }}
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
                        id="url_calendly"
                        label="Lien Calendly (optionnel)"
                        placeholder="(optionnel)"
                        variant="outlined"
                        name="url_calendly"
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
                        value={user.role || 0}
                        onChange={handleChange}
                        name="role"
                    >
                        {roles.map(role => (
                            <MenuItem key={role.id} value={role.id} disabled={role.id === 0}>{role.role}</MenuItem>
                        ))}

                    </Select>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={user.firstname === undefined || user.lastname === undefined || user.date_naissance === undefined || user.username === undefined || user.role === undefined}
                    >
                        Ajouter
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}

AddUserModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
};


function ActionModal({
    open = false,
    handleClose = () => { },
    user = {},
}) {

    const [userData, setUserData] = useState({});
    const [roles, setRoles] = useState([]);

    const handleSubmit = async () => {
        let fetchWraper = new FetchWraper();
        fetchWraper.url = "https://10.1.1.44:5001/auth/users/edit";
        fetchWraper.method = "POST";
        fetchWraper.headers.append("Content-Type", "application/json");
        fetchWraper.headers.append("Accept", "application/json");
        //fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
        //fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
        fetchWraper.body = JSON.stringify(userData);

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
            const result = await getRoles();
            const formattedRoles = result.data.map(role => (
                {
                    id: role.id_role,
                    role: role.nom,
                }));
            formattedRoles.push({ id: 0, role: "Inconnu" });
            //console.log(formattedRoles);
            setRoles(formattedRoles);
        }
        fetchData();
    }
        , []);

    useEffect(() => {
        setUserData(user);
        //console.log(user);
    }, [user]);

    return (
        <Modal
            open={open}
            onClose={() => {
                setUserData({});
                handleClose();
            }}
            aria-labelledby="Modifier un utilisateur"
            aria-describedby="Modifier un utilisateur"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: "88vh", overflow: "auto" }}>
                <h2>Modifier un utilisateur</h2>
                <Grid container item xs={12} sx={{ justifyContent: 'left', fullWidth: true, p: 2 }}>
                    <Grid item xs={12} sx={{ textAlign: 'left', fullWidth: true }}>
                        <h3>{userData.prenom} {userData.nom}</h3>
                    </Grid>
                    <Grid container sx={{ display: 'flex', justifyContent: 'center', fullWidth: true }}>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <h3>Role : </h3>
                        </Grid>
                        <Grid item xs={8} sx={{ textAlign: 'center', fullWidth: true }}>
                            <Select
                                sx={{ textAlign: 'center', width: '100%' }}
                                //label="role"
                                value={userData.id_role || user.id_role}
                                name="role"
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={(e) => setUserData({ ...userData, id_role: e.target.value })}
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.id} disabled={role.id === 0}>{role.role}</MenuItem>
                                ))}

                            </Select>
                        </Grid>
                    </Grid>

                    <Grid container sx={{ display: 'flex', justifyContent: 'center', fullWidth: true }}>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <h3>Status : </h3>
                        </Grid>
                        <Grid item xs={8} sx={{ textAlign: 'center', fullWidth: true }}>
                            <Select
                                sx={{ textAlign: 'center', width: '100%' }}
                                //label="Status"
                                value={userData.statut === true ? "Actif" : userData.statut === false ? "Inactif" : "NULL"}
                                name="Status"
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={(e) => {
                                    //console.log(e.target.value);
                                    setUserData({ ...userData, statut: e.target.value === "Actif" ? true : e.target.value === "Inactif" ? false : null })
                                }
                                }
                            >
                                <MenuItem value="Actif">Actif</MenuItem>
                                <MenuItem value="Inactif">Inactif</MenuItem>
                                <MenuItem value="NULL" disabled>NULL</MenuItem>

                            </Select>
                        </Grid>
                    </Grid>

                    <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'center', fullWidth: true }}>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <h3>Calendly : </h3>
                        </Grid>
                        <Grid item xs={8} sx={{ textAlign: 'center', fullWidth: true }}>
                            <TextField
                                sx={{ textAlign: 'center', width: '100%' }}
                                id="url_calendly"
                                label="URL Calendly"
                                variant="outlined"
                                name="url_calendly"
                                defaultValue={userData.url_calendly || user.url_calendly}
                                onChange={(e) => {
                                    console.log('Before update:', userData.url_calendly);
                                    setUserData({ ...userData, url_calendly: e.target.value });
                                    console.log('After update:', userData.url_calendly);
                                }}
                            />
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





async function getUsers() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://10.1.1.44:5001/auth/users/list";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();

    let data = await result.json() || [];

    return { "status": result.status, "data": data.users };

}



function UsersManagement() {

    const [open, setOpen] = useState(false);
    const [openAction, setOpenAction] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [reload, setReload] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getRoles();
            const formattedRoles = result.data.map(role => (
                {
                    id: role.id_role,
                    role: role.nom,
                }));
            //console.log(formattedRoles);
            setRoles(formattedRoles);
        }
        fetchData();
    }
        , []);

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
                    ...user,
                    id: user.id_user,
                    role: roles?.find(role => role.id === user.id_role)?.role || "Inconnu",
                    date_naissance_formatted: new Date(user.date_naissance).toLocaleDateString(),
                    status: user.statut === true ? "Actif" : user.statut === false ? "Inactif" : "NULL"
                }));
            setUsers(formattedUsers);
            //console.log(formattedUsers);
        }
        fetchData();
    }, [reload, roles]);


    return (
        <>
            <NavBar />
            <Grid container item xs={12} sx={{ justifyContent: 'center' }} >
                <AddUserModal
                    open={open}
                    handleClose={handleClose}
                />

                <ActionModal
                    open={openAction}
                    handleClose={() => {
                        triggerReload();
                        setOpenAction(false)
                    }}
                    user={user}
                />

                <Grid item xs={12} sx={{ textAlign: 'center', paddingLeft: 6, paddingRight: 6, marginTop: 6 }}>

                    <DataTable
                        rows={users}
                        type='users_management'
                        callback={(e) => {
                            setUser(e);
                            setOpenAction(true);
                        }
                        }
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