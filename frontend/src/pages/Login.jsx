import { TextField, Button } from '@mui/material';
import JObject from '../utils/JObject';
import FetchWraper from '../utils/FetchWraper';
import Grid from '@mui/material/Grid';
import { alpha, styled } from '@mui/material/styles';
import Logo from '../assets/logoFull.svg';
import studentImage from '../assets/students.jpg?url';
//<a href="https://fr.freepik.com/photos-gratuite/camarades-universite-etudient-ensemble_16294776.htm#query=travail%20etudiant&position=19&from_view=keyword&track=ais_user&uuid=b8fc33f8-2fb6-4c9a-bd49-fbc287ed69fb">Image de freepik</a> 

async function SubmitLogin() {
    const form = document.getElementById('login-form');

    let jObject = new JObject();
    jObject.fromFormData(new FormData(form));
    //console.log(jObject.toJSON());

    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/login";
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");
    fetchWraper.body = jObject.toJSON();
    let result = await fetchWraper.fetchw();

    if (result.status !== 200) {
        console.error("Login failed");
    }

    let data = await result.json();
    console.log(data);
    window.location.href = "/?page=profil";



}

async function SubmitLogout() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/logout";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");
    let result = await fetchWraper.fetchw();

    if (result.status !== 200) {
        console.error("Logout failed");
    }

    let data = await result.json();
    console.log(data);
}

function Login() {
    return (
        <body style={{ backgroundImage: `url("${studentImage}")`, backgroundSize: 'cover', width: '100vw', height: '100vh', margin: '0px', padding: '0px' }}>
            <div style={{ color: 'white', backgroundColor: '#FDD47C', width: '400px', borderRadius: '45px', outline: '3px solid black', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <img src={Logo} alt="Logo" style={{ width: '100px', height: '100px', margin: '30px' }} />
                <form id='login-form' style={{ display: 'flex', flexDirection: 'column', borderRadius: "90" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CustomTextField
                                id="username"
                                label="Identifiant"
                                variant="outlined"
                                name='username'
                                onKeyDown={(e) => {(e.key === 'Enter' ? SubmitLogin() : null)}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                id="password"
                                label="Mot de passe"
                                type="password"
                                variant="outlined"
                                name='password'
                                onKeyDown={(e) => {(e.key === 'Enter' ? SubmitLogin() : null)}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomButton variant="outlined" color="inherit" onClick={SubmitLogin}>Connexion</CustomButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="button" onClick={SubmitLogout}>Logout</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </body>
    );
}

const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        color: "#000000",
        backgroundColor: "#F2F4F8",
        "& .MuiOutlinedInput-notchedOutline": {
        },
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

const CustomButton = styled(Button)(({ theme }) => ({
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

export default Login;