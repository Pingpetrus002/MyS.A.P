import Login from "./Login";
import FetchWraper from "../utils/FetchWraper";
import { useEffect, useState } from 'react';

const Pages = {
    "login": Login,
    "DefaultPage": Login
};

async function IsConnected() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/protected";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();
    
    let data = await result.json();

    return { "status": result.status, "data": data };
}

function PageComposer(args) {
    
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const result = await IsConnected();
            setIsConnected(result.status === 200);
        }
        fetchData();
    }, []);

    let Page = Pages[args.page] || Pages.DefaultPage;
    
    if (!isConnected) {
        Page = Pages.login;
    }
    return <Page />;
}

export default PageComposer;
