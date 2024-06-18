import FetchWraper from '../utils/FetchWraper';
//import { useEffect, useState } from 'react';
import { Button} from '@mui/material';



function getLocalFile(event) {
    return new Promise((resolve, reject) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let base64 = reader.result;
            //console.log(base64);
            resolve(base64);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
            reject(null);
        };
    });
}

async function sendFile(body) {
    // send file to server
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/set_rapport";
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    //fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin); // create a cors error
    //fetchWraper.headers.append("Access-Control-Allow-Credentials", "true"); // create a cors error
    

    fetchWraper.body = JSON.stringify(body);

    //console.log(fetchWraper);
    
    let result = await fetchWraper.fetchw();
    let data = await result.json();
    console.log(data);

    switch (result.status) {
        case 200:
            console.log("File uploaded successfully");
            return true;
            
        default:
            console.log("Error uploading file:", result.status);
            return false;
    }


}


async function main(event) {
    try {
        let base64 = await getLocalFile(event);
        if (base64) {
            let body = {
                "id_user": 1,
                "id_suiveur": 2,
                "rapport": base64
            };
            let worked = await sendFile(body);
            console.log("worked",worked);
        }
        else {
            console.log("Error: no file selected", base64);
        }
    } catch (error) {
        console.error("Error getting file:", error);
    }
}


export default function UploadRapport() {
    

    return (
        <div>
            <Button variant="contained" component="label">
                Upload File
                <input type="file" hidden onChange={main} />
            </Button>
        </div>
    );
}