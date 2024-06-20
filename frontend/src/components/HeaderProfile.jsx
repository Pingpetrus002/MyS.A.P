import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Logo from '../assets/logoFull.svg';
import Avatar from '@mui/material/Avatar';

export default function HeaderProfile({ Nom, Prenom, Mail, Classe, Status }) {
    if (typeof Nom === 'undefined') {
        Nom = "John";
    }
    if (typeof Prenom === 'undefined') {
        Prenom = "Doe";
    }
    if (typeof Mail === 'undefined') {
        Mail = "John.Doe@MySapPro.com";
    }
    if (typeof Classe === 'undefined') {
        Classe = "Classe";
    }
    console.log(Status)
    if (Status === true) {
        Status = "Alternance en cours";
    }
    return (
        <>
            <Paper width="100vw">
                <Grid container spacing={4}>
                    <Grid item margin="0px 0px 0px 2rem">
                        <Avatar 
                            src="../assets/logoFull.svg" 
                            alt="description-de-l-image" 
                            sx={{ width: 140, height: 140 }} 
                        />
                    </Grid>
                    <Grid item xs={12} sm container marginRight="100px">
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography variant="h4" style={{ color: '#000000', textAlign: 'left' }}>
                                    {Nom} {Prenom}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h6" style={{ textAlign: 'left' }}>
                                    {Mail}
                                </Typography>
                                <Typography variant="h6" style={{ textAlign: 'left' }}>
                                    {Classe}
                                </Typography>
                                <Typography variant="h6" style={{ textAlign: 'left' }}>
                                    {Status}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}