import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider, Slide } from '@mui/material';
import { styled } from '@mui/system';
import FetchWraper from '../utils/FetchWraper'; // Adjust the import path as per your project structure

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CenteredDialogTitle = styled(DialogTitle)({
    textAlign: 'center',
    fontWeight: 'bold',
});

const BottomButtonGrid = styled(Grid)({
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
});

export default function AlertModal({ alert, open, onClose }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!alert) {
        return null;
    }

    const handleResolveClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmResolve = async () => {
        try {
            const result = await updateAlertStatus(alert.id);
            console.log('Alerte résolue avec succès.', result);
            // Handle success (refresh data, etc.) if needed

            // Close both modals after resolving
            setConfirmOpen(false);
            onClose(); // Close the main alert modal
        } catch (error) {
            console.error('Erreur lors de la résolution de l\'alerte.', error);
        }
    };

    const updateAlertStatus = async (alertId) => {
        try {
            const fetchWrapper = new FetchWraper();
            fetchWrapper.url = `http://localhost:5000/auth/disable_alert/${alertId}`;
            fetchWrapper.method = 'GET'; // Adjust the method as per your API endpoint requirements

            const response = await fetchWrapper.fetchw();
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Réponse de requête non-ok.');
            }
        } catch (error) {
            throw new Error('Erreur réseau:', error);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <CenteredDialogTitle>{alert.commentaires}</CenteredDialogTitle>
                <Divider sx={{ borderWidth: '1px' }} />
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h6">Utilisateur source</Typography>
                            <Typography variant="body1">{alert.user_source}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Entreprise</Typography>
                            <Typography variant="body1">{alert.raison_social}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Date</Typography>
                            <Typography variant="body1">{alert.date}</Typography>
                        </Grid>
                        <BottomButtonGrid item xs={12}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleResolveClick}
                            >
                                Résoudre
                            </Button>
                        </BottomButtonGrid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                TransitionComponent={Transition}
                maxWidth="xs"
                fullWidth
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Êtes-vous sûr(e) ?</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-slide-description">
                        Résoudre l&apos;alerte rendra celle-ci inaccessible par la suite, voulez-vous continuer ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleConfirmClose(); onClose(); }} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmResolve} color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
