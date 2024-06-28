import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import SyntheseSuiviTuteur from './FormRapport';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

function ButtonRapports() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title="Ajouter un rapport" placement="top">
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    sx={{
                        color: '#000000',
                        alignItems: 'center',
                        borderColor: '#F0C975',
                        backgroundColor: '#FDD47C',
                        mb: 1,
                        '&:hover': {
                            backgroundColor: '#FFC039',
                            borderColor: '#FFC039',
                        }
                    }}
                >
                    <AddIcon />
                </Button>
            </Tooltip>
            <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">SYNTHÈSE SUIVI TUTEUR</DialogTitle>
                <DialogContent>
                    <SyntheseSuiviTuteur />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ButtonRapports;
