import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Logo from '../assets/logoFull.svg';
import Avatar from '@mui/material/Avatar';



export default function HeaderProfile({ Nom } = 'John', { Prenom } = "Doe", { Mail } = "John.Doe@MySapPro.com") {
    if (typeof Nom === 'undefined') {
        Nom = "John";
    }
    if (typeof Prenom === 'undefined') {
        Prenom = "Doe";
    }
    if (typeof Mail === 'undefined') {
        Mail = "John.Doe@MySapPro.com";
    }
    return (
        <>
            <Paper width="100vw">
                <Grid container justifyContent="center" alignItems="center" spacing={4}>
                    <Grid item margin="80px">
                        <Avatar sx={{width: 64, height: 64}}>{Array.from({Nom})[0]}</Avatar>
                    </Grid>
                    <Grid item xs={12} sm container marginRight="100px">
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <h1 style={{ color: '#000000' }}>
                                    {Nom} {Prenom}
                                </h1>
                            </Grid>
                            <Grid item xs>
                                <h1>
                                    {Mail}
                                </h1>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}