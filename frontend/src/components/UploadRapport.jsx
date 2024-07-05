import FetchWraper from '../utils/FetchWraper';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState, useEffect } from 'react';

function getLocalFile(event) {
    return new Promise((resolve, reject) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let base64 = reader.result;
            resolve(base64);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
            reject(null);
        };
    });
}

async function sendFile(body) {
    throw new Error(" TODO: Implement this function with new API.");
    /*let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://localhost:5001/auth/set_rapport"; // currently invalid
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");

    fetchWraper.body = JSON.stringify(body);

    let result = await fetchWraper.fetchw();

    switch (result.status) {
        case 200:
            return true;
        default:
            console.log("Error uploading file:", result.status);
            return false;
    }*/
}

export default function UploadRapport(params) {
    const [uploadStatus, setUploadStatus] = useState('Upload File');
    const [buttonStyle, setButtonStyle] = useState({ variant: "contained" });
    const [fileTitle, setFileTitle] = useState('');
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (uploadStatus === 'File Uploaded') {
            setButtonStyle({ variant: "outlined", color: "success" });
        } else if (uploadStatus === 'Error Uploading File') {
            setButtonStyle({ variant: "outlined", color: "error" });
        } else {
            setButtonStyle({ variant: "contained" });
        }
    }, [uploadStatus]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = async () => {
        setOpen(false);
        try {
            const b64 = await getLocalFile(file);
            const base64 = b64.split(',')[1];
            if (base64) {
                const body = {
                    "sujet": fileTitle || "Rapport de stage",
                    "id_user": params.args.id_user || null,
                    "id_suiveur": params.args.id_suiveur || null,
                    type: 'autre',
                    "rapport": base64
                };

                if (await sendFile(body)) {
                    setUploadStatus('File Uploaded');
                } else {
                    setUploadStatus('Error Uploading File');
                    setTimeout(() => {
                        setUploadStatus('Upload File');
                    }, 2500);
                }
            } else {
                console.log("Error: no file selected", base64);
            }
        } catch (error) {
            console.error("Error getting file:", error);
        }
    };

    return (
        <div>
            <TextField
                label="Titre du fichier"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button {...buttonStyle} component="label">
                {uploadStatus}
                <input
                    type="file"
                    hidden
                    onChange={(event) => {
                        setFile(event);
                        handleClickOpen();
                    }}
                    onClick={() => setUploadStatus('Upload File')}
                />
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir télécharger ce fichier ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
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
