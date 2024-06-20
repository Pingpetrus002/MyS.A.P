import FetchWraper from '../utils/FetchWraper';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';



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


    let result = await fetchWraper.fetchw();

    switch (result.status) {
        case 200:
            return true;

        default:
            console.log("Error uploading file:", result.status);
            return false;
    }


}


export default function UploadRapport(params) {

    const [uploadStatus, setUploadStatus] = useState('Upload File'); // initial state
    const [buttonStyle, setButtonStyle] = useState({ variant: "contained" }); // initial style

    useEffect(() => {
        //console.log("Upload status changed:", uploadStatus);
        if (uploadStatus === 'File Uploaded') {
            setButtonStyle({ variant: "outlined", color: "success" }); // change style on success
        }
        else if (uploadStatus === 'Error Uploading File') {
            setButtonStyle({ variant: "outlined", color: "error" }); // change style on error
        }
        else {
            setButtonStyle({ variant: "contained" }); // reset style
        }
    }, [uploadStatus]); // effect depends on uploadStatus

    const main = async (event, args) => {

        try {
            let base64 = await getLocalFile(event);
            if (base64) {
                const body = {
                    "id_user": args.id_user || null,
                    "id_suiveur": args.id_suiveur || null,
                    "rapport": base64
                };

                if (await sendFile(body)) {
                    setUploadStatus('File Uploaded'); // update state on success
                }
                else {
                    setUploadStatus('Error Uploading File'); // update state on error
                    setTimeout(() => {
                        setUploadStatus('Upload File'); // reset state on error
                    }, 2500);
                }
            }
            else {
                console.log("Error: no file selected", base64);
            }
        } catch (error) {
            console.error("Error getting file:", error);
        }
    }

    return (
        <div>
            <Button {...buttonStyle} component="label">
                {uploadStatus} {/* display the current status */}
                <input
                    type="file"
                    hidden
                    onChange={(event) => {
                        main(event, params.args); // call main function
                    }}
                    onClick={() => setUploadStatus('Upload File')} // reset
                />
            </Button>
        </div>
    );
}


// Usage:
/* <UploadRapport args={
    {
        id_user: user ? user.id_user : null,
        id_suiveur: user ? user.id_suiveur : null
    }
} />
 */
