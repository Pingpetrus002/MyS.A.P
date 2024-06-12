import { TextField } from '@mui/material';
import JObject from '../utils/JObject';
import FetchWraper from '../utils/FetchWraper';


async function SubmitLogin() {
    const form = document.getElementById('login-form');
    
    let jObject = new JObject();
    jObject.fromFormData( new FormData(form) );
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



}

function Login() {
    return (
        <div>
            <h1>Login</h1>
            <form id='login-form' style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    name='username'
                />
                <br />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    name='password'
                />
                <br />
                <button type="button" onClick={SubmitLogin}>Submit</button>
            </form>
        </div>
    );
}

export default Login;