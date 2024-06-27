import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FetchWraper from '../utils/FetchWraper';

function parseCSV(content) {
    console.log("Parsing CSV content");
    const rows = content.split('\n').map((row) => row.split(','));
    const headers = rows[0].map(header => header.trim());
    console.log("Headers:", headers);

    return rows.slice(1).map((row, rowIndex) => {
        let obj = {};
        headers.forEach((header, index) => {
            if (row[index] !== undefined) {
                obj[header] = row[index].trim();
            } else {
                console.warn(`Missing value for column "${header}" in row ${rowIndex + 1}`);
            }
        });
        return obj;
    }).filter(row => Object.keys(row).length > 0);
}

function parseXML(content) {
    console.log("Parsing XML content");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    const rows = Array.from(xmlDoc.getElementsByTagName('row'));
    return rows.map((row) => {
        const obj = {};
        Array.from(row.children).forEach((child) => {
            obj[child.tagName] = child.textContent;
        });
        return obj;
    });
}

function getLocalFile(event) {
    console.log("Getting local file");
    return new Promise((resolve, reject) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            resolve({ content: reader.result, type: file.type, name: file.name });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
            reject(null);
        };
    });
}

async function sendFile(body) {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/ajout_etudiants_fichier";
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    fetchWraper.body = JSON.stringify(body);

    let result = await fetchWraper.fetchw();
    console.log("Result:", result);

    switch (result.status) {
        case 200:
            return true;
        default:
            console.log("Error uploading file:", result.status);
            return false;
    }
}

export default function UploadEtudiant() {
    const [uploadStatus, setUploadStatus] = useState('Upload File');
    const [buttonStyle, setButtonStyle] = useState({ variant: "contained" });
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [columns, setColumns] = useState([]);

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
            console.log("Confirm button clicked");
            let { content, type, name } = await getLocalFile(file);
            console.log("File content:", content);
            console.log("File type:", type);
            console.log("File name:", name);

            let parsedData = [];

            if (type === 'application/json' || name.endsWith('.json')) {
                console.log("Parsing JSON content");
                parsedData = JSON.parse(content);
            } else if (type === 'text/csv' || name.endsWith('.csv')) {
                parsedData = parseCSV(content);
            } else if (type === 'application/xml' || type === 'text/xml' || name.endsWith('.xml')) {
                parsedData = parseXML(content);
            }

            if (parsedData.length > 0) {
                console.log("Parsed data:", parsedData);
                const cols = Object.keys(parsedData[0]).map((key) => ({ field: key, headerName: key, width: 150 }));
                setColumns(cols);
                setFileData(parsedData);

                const body = {
                    "data": parsedData
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
                console.log("Error: no data parsed", parsedData);
            }
        } catch (error) {
            console.error("Error processing file:", error);
        }
    };

    return (
        <div>
            <Tooltip title="Ajouter un étudiant" placement="top">
                <Button {...buttonStyle} component="label">
                    {uploadStatus}
                    <input
                        type="file"
                        accept=".csv, .json, .xml"
                        hidden
                        onChange={(event) => {
                            setFile(event);
                            handleClickOpen();
                        }}
                        onClick={() => setUploadStatus('Upload File')}
                    />
                </Button>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir télécharger ce fichier ?
                    </DialogContentText>
                    {fileData.length > 0 && (
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={fileData.map((row, index) => ({ id: index, ...row }))}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                            />
                        </div>
                    )}
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

// Usage example
/* <UploadEtudiant args={{ id_user: user ? user.id_user : null, id_suiveur: user ? user.id_suiveur : null }} /> */
