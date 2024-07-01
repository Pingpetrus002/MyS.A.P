import React from 'react';
import { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    MenuItem,
    Checkbox,
    Select,
    InputLabel,
    Grid,
    FormGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
    Slide,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import PdfGenerator from './PDFGenerator';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function SyntheseSuiviTuteur() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false); // État pour contrôler l'ouverture/fermeture du modal
    const [eraseOpen, setEraseOpen] = useState(false); // État pour contrôler l'ouverture/fermeture du modal de confirmation

    // Fonctions pour ouvrir et fermer le modal
    const handleEraseOpen = () => {
        setEraseOpen(true);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // États pour les checkboxes du Service Relations Entreprises
    const [isRENonRASChecked, setIsRENonRASChecked] = useState(false);
    const [isREOtherChecked, setIsREOtherChecked] = useState(false);
    const [reOtherText, setREOtherText] = useState('');

    // Gestion du changement pour Service Relations Entreprises - NON - RAS
    const handleRENonRASChange = (event) => {
        setIsRENonRASChecked(event.target.checked);
        if (event.target.checked) {
            setIsREOtherChecked(false);
            setREOtherText('');
        }
    };

    // Gestion du changement pour Service Relations Entreprises - Autre
    const handleREOtherChange = (event) => {
        setIsREOtherChecked(event.target.checked);
        if (event.target.checked) {
            setIsRENonRASChecked(false);
        } else {
            setREOtherText('');
        }
    };

    const handleRETextChange = (e) => {
        setREOtherText(e.target.value);
    };

    // États pour les checkboxes du Service Pédagogique
    const [isPedagogiqueNonRASChecked, setIsPedagogiqueNonRASChecked] = useState(false);
    const [isPedagogiqueOtherChecked, setIsPedagogiqueOtherChecked] = useState(false);
    const [PedagogiqueOtherText, setPedagogiqueOtherText] = useState('');

    // Gestion du changement pour Service Pédagogique - NON - RAS
    const handlePedagogiqueNonRASChange = (event) => {
        setIsPedagogiqueNonRASChecked(event.target.checked);
        if (event.target.checked) {
            setIsPedagogiqueOtherChecked(false);
            setPedagogiqueOtherText('');
        }
    };

    // Gestion du changement pour Service Pédagogique - Autre
    const handlePedagogiqueOtherChange = (event) => {
        setIsPedagogiqueOtherChecked(event.target.checked);
        if (event.target.checked) {
            setIsPedagogiqueNonRASChecked(false);
        } else {
            setPedagogiqueOtherText('');
        }
    };

    // États pour les checkboxes Présence
    const [isNonChecked, setIsNonChecked] = useState(false);
    const [isOuiChecked, setIsOuiChecked] = useState(false);
    const [isPresentChecked, setIsPresentChecked] = useState(false);
    const [presentText, setPresentText] = useState('');

    // Gestion du changement pour Présence - NON
    const handleNonChange = (e) => {
        const isChecked = e.target.checked;
        setIsNonChecked(isChecked);
        if (isChecked) {
            setIsOuiChecked(false);
            setIsPresentChecked(true);
            setCheckboxFieldPresence('NON');
        } else {
            setIsPresentChecked(false);
        }
    };

    // Gestion du changement pour Présence - OUI
    const handleOuiChange = (e) => {
        const isChecked = e.target.checked;
        setIsOuiChecked(isChecked);
        if (isChecked) {
            setIsNonChecked(false);
            setIsPresentChecked(false);
            setCheckboxFieldPresence('OUI');
        }
    };

    // Gestion du changement pour le texte de Présence
    const handlePresentTextChange = (e) => {
        setPresentText(e.target.value);
    };

    const handlePedagogiqueTextChange = (e) => {
        setPedagogiqueOtherText(e.target.value);
    };

    const champsInitiaux = {
        'Ponctualité': '',
        'Capacité d\'intégration': '',
        'Sens de l\'organisation': '',
        'Sens de la communication': '',
        'Travail en équipe': '',
        'Réactivité': '',
        'Persévérance': '',
        'Force de proposition': ''
    };

    const [textFieldNomRapport, setTextFieldNomRapport] = useState('');
    const [textFieldIdEtudiant, setTextFieldIdEtudiant] = useState('');
    const [selectFieldFormation, setSelectFieldFormation] = useState('');
    const [textFieldNomEtudiant, setTextFieldNomEtudiant] = useState('');
    const [textFieldPrenomEtudiant, setTextFieldPrenomEtudiant] = useState('');
    const [textFieldNomEntreprise, setTextFieldNomEntreprise] = useState('');
    const [textFieldNomTuteurEntreprise, setTextFieldNomTuteurEntreprise] = useState('');
    const [textFieldPrenomTuteurEntreprise, setTextFieldPrenomTuteurEntreprise] = useState('');
    const [textFieldPosteEtudiant, setTextFieldPosteEtudiant] = useState('');
    const [textFieldMissions, setTextFieldMissions] = useState('');
    const [textFieldCommentaireTuteur, setTextFieldCommentaireTuteur] = useState('');
    const [textFieldProjetsSecondSemestre, setTextFieldProjetsSecondSemestre] = useState('');
    const [textFieldAxesAmelioration, setTextFieldAxesAmelioration] = useState('');
    const [textFieldPointsFort, setTextFieldPointsFort] = useState('');
    const [textFieldSujetMemoire, setTextFieldSujetMemoire] = useState('');
    const [textFieldCommentaireEntretienSuivi, setTextFieldCommentaireEntretienSuivi] = useState('');
    const [radioFields, setRadioFields] = useState(champsInitiaux);
    const [textFieldNomSuiveur, setTextFieldNomSuiveur] = useState('');
    const [dateFieldEntretien, setDateFieldEntretien] = useState(new Date());
    const [radioFieldFormatSuivi, setRadioFieldFormatSuivi] = useState('');
    const [checkboxFieldPresence, setCheckboxFieldPresence] = useState('');
    const [radioFieldRecrutement, setRadioFieldRecrutement] = useState('');
    const [radioFieldPoursuiteEtudes, setRadioFieldPoursuiteEtudes] = useState('');

    const setRadioFieldSavoirEtre = (field, value) => {
        setRadioFields(prev => ({ ...prev, [field]: value }));
    };

    // Mettre à jour la fonction handleReset pour réinitialiser tous les champs
    const handleReset = () => {
        setTextFieldNomRapport('');
        setTextFieldIdEtudiant('');
        setSelectFieldFormation('');
        setTextFieldNomEtudiant('');
        setTextFieldPrenomEtudiant('');
        setTextFieldNomEntreprise('');
        setTextFieldNomTuteurEntreprise('');
        setTextFieldPrenomTuteurEntreprise('');
        setTextFieldPosteEtudiant('');
        setTextFieldMissions('');
        setTextFieldCommentaireTuteur('');
        setRadioFieldSavoirEtre('');
        setRadioFields(champsInitiaux);
        setTextFieldProjetsSecondSemestre('');
        setTextFieldAxesAmelioration('');
        setTextFieldPointsFort('');
        setTextFieldSujetMemoire('');
        setTextFieldCommentaireEntretienSuivi('');
        setTextFieldNomSuiveur('');
        setDateFieldEntretien(new Date());
        setRadioFieldFormatSuivi('');
        setCheckboxFieldPresence('');
        setRadioFieldRecrutement('');
        setRadioFieldPoursuiteEtudes('');
        setIsREOtherChecked(false);
        setREOtherText('');
        setIsPedagogiqueOtherChecked(false);
        setPedagogiqueOtherText('');
        setIsNonChecked(false);
        setIsOuiChecked(false);
        setIsRENonRASChecked(false);
        setIsPedagogiqueNonRASChecked(false);
        setIsPresentChecked(false);
        setPresentText('');

        handleClose();
    };

    return (
        <>
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
            <Dialog
                open={open}
                fullScreen={fullScreen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="responsive-dialog-title">SYNTHÈSE SUIVI TUTEUR</DialogTitle>
                <DialogContent>
                    <form>
                        <Typography variant="body1" sx={{ textAlign: 'left', border: 'solid', borderRadius: 5, padding: 5 }}>
                            Bonjour,
                            <br />
                            <br />
                            Ce questionnaire s&apos;adresse aux suiveurs, qui représentent le campus et
                            réalisent les points d&apos;étape de mi parcours avec les tuteurs entreprise
                            et étudiants. Pour rappel, chaque apprenti doit faire l&apos;objet à minima
                            d&apos;un suivi annuel. Chaque suivi doit être enregistré via ce formulaire
                            le jour du suivi. Ce questionnaire a pour objectif de faire la synthèse de
                            l&apos;ensemble des SUIVIS et d&apos;alerter les équipes relation entreprise et pédagogique au besoin.
                            <br />
                            <br />
                            Bien à vous,
                            <br />
                            <br />
                            <div style={{ textAlign: 'center' }}>Directeur des Relations Entreprises et des Admissions</div>
                        </Typography>

                        <Typography variant="h5" sx={{ my: 9 }}>
                            <u>ÉTUDIANT</u>
                            <p style={{ marginTop: 0 }}>Merci de renseigner l&apos;ensemble des champs suivants</p>
                        </Typography>

                        <Typography sx={{ color: 'red', textAlign: 'left' }}>
                            * indique un champ obligatoire
                        </Typography>

                        <TextField
                            label="Sujet du rapport"
                            value={textFieldNomRapport}
                            onChange={(e) => setTextFieldNomRapport(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <TextField
                            label="ID étudiant"
                            helperText="Merci de noter les 6 chiffres, sans espace (cf. le tableau des affectations de suivi transmis par votre RP)"
                            value={textFieldIdEtudiant}
                            onChange={(e) => setTextFieldIdEtudiant(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />


                        <FormControl fullWidth margin="normal" required>
                            <InputLabel
                                sx={{ '& .MuiFormLabel-asterisk': { color: 'red' } }}
                            >
                                FORMATION de l&apos;étudiant en 23-24
                            </InputLabel>
                            <Select
                                value={selectFieldFormation}
                                onChange={(e) => setSelectFieldFormation(e.target.value)}
                            >
                                <MenuItem value="2ESGI Informatique">2ESGI Informatique</MenuItem>
                                <MenuItem value="3ESGI Architecture des Logiciels">3ESGI Architecture des Logiciels</MenuItem>
                                <MenuItem value="3ESGI Ingénierie du Web">3ESGI Ingénierie du Web</MenuItem>
                                <MenuItem value="3ESGI Systèmes, Réseaux et Cloud Computing">3ESGI Systèmes, Réseaux et Cloud Computing</MenuItem>
                                <MenuItem value="4ESGI Architecture des Logiciels">4ESGI Architecture des Logiciels</MenuItem>
                                <MenuItem value="4ESGI Ingénierie du Web">4ESGI Ingénierie du Web</MenuItem>
                                <MenuItem value="4ESGI Systèmes, Réseaux et Cloud Computing">4ESGI Systèmes, Réseaux et Cloud Computing</MenuItem>
                                <MenuItem value="4ESGI Intelligence Artificielle et Big Data">4ESGI Intelligence Artificielle et Big Data</MenuItem>
                                <MenuItem value="4ESGI Sécurité Informatique">4ESGI Sécurité Informatique</MenuItem>
                                <MenuItem value="4ESGI Management et Conseil en Systèmes d'Information">4ESGI Management et Conseil en Systèmes d&apos;Information</MenuItem>
                                <MenuItem value="5ESGI Architecture des Logiciels">5ESGI Architecture des Logiciels</MenuItem>
                                <MenuItem value="5ESGI Ingénierie du Web">5ESGI Ingénierie du Web</MenuItem>
                                <MenuItem value="5ESGI Systèmes, Réseaux et Cloud Computing">5ESGI Systèmes, Réseaux et Cloud Computing</MenuItem>
                                <MenuItem value="5ESGI Intelligence Artificielle et Big Data">5ESGI Intelligence Artificielle et Big Data</MenuItem>
                                <MenuItem value="5ESGI Sécurité Informatique">5ESGI Sécurité Informatique</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="NOM de l'étudiant (en majuscule)"
                            value={textFieldNomEtudiant}
                            onChange={(e) => setTextFieldNomEtudiant(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />
                        <TextField
                            label="PRÉNOM de l'étudiant"
                            value={textFieldPrenomEtudiant}
                            onChange={(e) => setTextFieldPrenomEtudiant(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <Typography variant="h5" sx={{ my: 9 }}>
                            <u>ENTREPRISE</u>
                            <p style={{ marginTop: 0 }}>Merci de renseigner l&apos;ensemble des champs suivants</p>
                        </Typography>

                        <TextField
                            label="NOM de l'entreprise"
                            value={textFieldNomEntreprise}
                            onChange={(e) => setTextFieldNomEntreprise(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />
                        <TextField
                            label="NOM du tuteur entreprise"
                            value={textFieldNomTuteurEntreprise}
                            onChange={(e) => setTextFieldNomTuteurEntreprise(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />
                        <TextField
                            label="PRÉNOM du tuteur entreprise"
                            value={textFieldPrenomTuteurEntreprise}
                            onChange={(e) => setTextFieldPrenomTuteurEntreprise(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />
                        <TextField
                            label="POSTE occupé par l'étudiant"
                            value={textFieldPosteEtudiant}
                            onChange={(e) => setTextFieldPosteEtudiant(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />
                        <TextField
                            label="MISSIONS confiées à l'étudiant"
                            value={textFieldMissions}
                            onChange={(e) => setTextFieldMissions(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <TextField
                            label="COMMENTAIRE du tuteur"
                            helperText="sur les modalités de suivi de l&apos;alternant mis en place au sein de l&apos;entreprise (la communication, le suivi avant et après cours,
                l&apos;encadrement : qui est en management de proximité de l&apos;étudiant, quelle est la récurrence des points : chiffrée ou non...)"
                            value={textFieldCommentaireTuteur}
                            onChange={(e) => setTextFieldCommentaireTuteur(e.target.value)}
                            required
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <Typography variant="h5" sx={{ my: 7 }}>
                            EVALUATION DES SAVOIR-ÊTRE (tuteur)
                            <p style={{ marginTop: 0 }}>Merci de retranscrire l&apos;évaluation du tuteur sur l&apos;ensemble des points suivants</p>
                        </Typography>

                        <div>
                            {Object.keys(champsInitiaux).map((field) => (
                                <div key={field} style={{ marginTop: 40 }}>
                                    <FormControl component="fieldset" margin="normal" required>
                                        <FormLabel
                                            component="legend"
                                            sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, marginBlock: 5, fontWeight: 'bold', color: 'black' }}
                                        >{field}
                                        </FormLabel>
                                        <RadioGroup
                                            value={radioFields[field]}
                                            onChange={(e) => setRadioFieldSavoirEtre(field, e.target.value)}
                                            row
                                        >
                                            <Typography component="legend" sx={{ mt: 4 }}>Insatisfaisant</Typography>
                                            <FormControlLabel value="1" control={<Radio />} labelPlacement="top" label="1" />
                                            <FormControlLabel value="2" control={<Radio />} labelPlacement="top" label="2" />
                                            <FormControlLabel value="3" control={<Radio />} labelPlacement="top" label="3" />
                                            <FormControlLabel value="4" control={<Radio />} labelPlacement="top" label="4" />
                                            <Typography component="legend" sx={{ mt: 4 }}>Satisfaisant</Typography>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            ))}
                        </div>

                        <Typography variant="h5" sx={{ my: 7 }}>
                            LES PROJECTIONS (tuteur)
                            <p style={{ marginTop: 0 }}>Merci de renseigner l&apos;ensemble des champs suivants</p>
                        </Typography>

                        <TextField
                            label="Les missions et projets envisagés sur le 2ème semestre de l'année"
                            value={textFieldProjetsSecondSemestre}
                            onChange={(e) => setTextFieldProjetsSecondSemestre(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <Typography variant="h5" sx={{ my: 7 }}>
                            LE BILAN DE CE PREMIER SEMESTRE (tuteur et alternant)
                        </Typography>

                        <TextField
                            label="Les axes d'amélioration"
                            value={textFieldAxesAmelioration}
                            onChange={(e) => setTextFieldAxesAmelioration(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <TextField
                            label="Les points forts"
                            value={textFieldPointsFort}
                            onChange={(e) => setTextFieldPointsFort(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <TextField
                            label="Pour les MASTÈRES 2 : merci de préciser le sujet du mémoire"
                            value={textFieldSujetMemoire}
                            onChange={(e) => setTextFieldSujetMemoire(e.target.value)}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <Typography variant="h5" sx={{ my: 7 }}>
                            CONCLUSION
                        </Typography>

                        <FormControl
                            fullWidth
                            component="fieldset"
                            margin="normal"
                            sx={{
                                border: '1px solid #C4C4C4',
                                borderRadius: 1,
                                '&:hover': {
                                    border: '1px solid black'
                                }
                            }}
                            required
                        >
                            <FormLabel
                                component="legend"
                                sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mb: 1 }}
                            >
                                <strong>Déclarer une ALERTE au Service Relations Entreprises ?</strong>
                            </FormLabel>
                            <Typography variant="body1" sx={{ mx: 2, color: '#666666' }}>
                                Si oui, cocher &quot;Autre&quot;, et préciser l&apos;alerte (ex : Les missions ne correspondent pas au référentiel, les
                                rapports entre l&apos;étudiant et le tuteur ou l&apos;entreprise sont compliqués, une médiation est urgente...)
                            </Typography>
                            <FormGroup sx={{ m: 5 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isRENonRASChecked}
                                            onChange={handleRENonRASChange}
                                        />
                                    }
                                    label="NON - RAS"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isREOtherChecked}
                                            onChange={handleREOtherChange}
                                        />
                                    }
                                    label="Autre :"
                                />
                                {isREOtherChecked && (
                                    <TextField
                                        value={reOtherText}
                                        onChange={handleRETextChange}
                                        placeholder="Précisez..."
                                        required
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </FormGroup>
                        </FormControl>

                        <FormControl
                            fullWidth
                            component="fieldset"
                            margin="normal"
                            sx={{
                                border: '1px solid #C4C4C4',
                                borderRadius: 1,
                                '&:hover': {
                                    border: '1px solid black'
                                }
                            }}
                            required
                        >
                            <FormLabel
                                component="legend"
                                sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mb: 1 }}
                            >
                                <strong>Déclarer une ALERTE au Service Pédagogique ?</strong>
                            </FormLabel>
                            <Typography variant="body1" sx={{ mx: 2, color: '#666666' }}>
                                Si oui, cocher &quot;Autre&quot;, et préciser l&apos;alerte (ex : un feed-back sur un cours, un manque d&apos;information, une
                                question importante : sur la planification...)
                            </Typography>
                            <FormGroup sx={{ m: 5 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isPedagogiqueNonRASChecked}
                                            onChange={handlePedagogiqueNonRASChange}
                                        />
                                    }
                                    label="NON - RAS"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isPedagogiqueOtherChecked}
                                            onChange={handlePedagogiqueOtherChange}
                                        />
                                    }
                                    label="Autre :"
                                />
                                {isPedagogiqueOtherChecked && (
                                    <TextField
                                        value={PedagogiqueOtherText}
                                        onChange={handlePedagogiqueTextChange}
                                        placeholder="Précisez..."
                                        required
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </FormGroup>
                        </FormControl>

                        <div>
                            <FormControl
                                fullWidth
                                component="fieldset"
                                margin="normal"
                                sx={{
                                    border: '1px solid #C4C4C4',
                                    borderRadius: 1,
                                    '&:hover': {
                                        border: '1px solid black'
                                    }
                                }}
                                required
                            >
                                <FormLabel
                                    component="legend"
                                    sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mb: 1 }}
                                >
                                    L&apos;entreprise a-t-elle des projets de recrutement
                                </FormLabel>
                                <RadioGroup
                                    sx={{ m: 5 }}
                                    value={radioFieldRecrutement}
                                    onChange={(e) => setRadioFieldRecrutement(e.target.value)}
                                >
                                    <FormControlLabel value="PAS POUR LE MOMENT" control={<Radio />} label="PAS POUR LE MOMENT" />
                                    <FormControlLabel value="OUI - immédiatement" control={<Radio />} label="OUI - immédiatement" />
                                    <FormControlLabel value="OUI - pour septembre/octobre" control={<Radio />} label="OUI - pour septembre/octobre" />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div>
                            <FormControl
                                fullWidth
                                component="fieldset"
                                margin="normal"
                                sx={{
                                    border: '1px solid #C4C4C4',
                                    borderRadius: 1,
                                    '&:hover': {
                                        border: '1px solid black'
                                    }
                                }}
                                required
                            >
                                <FormLabel
                                    component="legend"
                                    sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mb: 1 }}
                                >
                                    L&apos;alternant a-t-il un projet de poursuite d&apos;études
                                </FormLabel>
                                <Typography variant="body1" sx={{ mx: 2, color: '#666666' }}>
                                    (à Sciences-u ou une autre école, peu importe)
                                </Typography>
                                <RadioGroup
                                    sx={{ m: 5 }}
                                    value={radioFieldPoursuiteEtudes}
                                    onChange={(e) => setRadioFieldPoursuiteEtudes(e.target.value)}
                                >
                                    <FormControlLabel value="OUI" control={<Radio />} label="OUI" />
                                    <FormControlLabel value="NON" control={<Radio />} label="NON" />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <TextField
                            label="COMMENTAIRE sur l'entretien de suivi"
                            value={textFieldCommentaireEntretienSuivi}
                            onChange={(e) => setTextFieldCommentaireEntretienSuivi(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <Typography variant="h5" sx={{ my: 9 }}>
                            <u>SUIVI TUTEUR</u>
                        </Typography>

                        <TextField
                            label="NOM du suiveur école"
                            value={textFieldNomSuiveur}
                            onChange={(e) => setTextFieldNomSuiveur(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                            }}
                        />

                        <div>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                                <DatePicker
                                    label="DATE du suivi"
                                    value={dateFieldEntretien}
                                    onChange={(date) => setDateFieldEntretien(date)}
                                    required
                                    sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mt: 2 }}
                                    TextField={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>

                        <div>
                            <FormControl
                                fullWidth
                                component="fieldset"
                                margin="normal"
                                sx={{
                                    border: '1px solid #C4C4C4',
                                    borderRadius: 1,
                                    '&:hover': {
                                        border: '1px solid black'
                                    }
                                }}
                                required
                            >
                                <FormLabel
                                    component="legend"
                                    sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mb: 1 }}
                                >
                                    FORMAT du suivi
                                </FormLabel>
                                <RadioGroup
                                    sx={{ m: 5 }}
                                    value={radioFieldFormatSuivi}
                                    onChange={(e) => setRadioFieldFormatSuivi(e.target.value)}
                                >
                                    <FormControlLabel value="Présentiel" control={<Radio />} label="Présentiel" />
                                    <FormControlLabel value="Distanciel" control={<Radio />} label="Distanciel" />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <FormControl
                            fullWidth
                            component="fieldset"
                            margin="normal"
                            sx={{
                                border: '1px solid #C4C4C4',
                                borderRadius: 1,
                                '&:hover': {
                                    border: '1px solid black'
                                }
                            }}
                            required
                        >
                            <FormLabel
                                component="legend"
                                sx={{ '& .MuiFormLabel-asterisk': { color: 'red' }, mb: 1 }}
                            >
                                L&apos;étudiant est présent au RDV
                            </FormLabel>
                            <Typography variant="body1" sx={{ mx: 2, color: '#666666' }}>
                                (si non, merci de préciser la raison dans &quot;Autre&quot;)
                            </Typography>
                            <FormGroup
                                fullWidth
                                sx={{ m: 5 }}
                                value={checkboxFieldPresence}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isOuiChecked}
                                            onChange={handleOuiChange}
                                        />
                                    }
                                    label="OUI"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isNonChecked}
                                            onChange={handleNonChange}
                                        />
                                    }
                                    label="NON"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isPresentChecked}
                                            disabled
                                        />
                                    }
                                    label="Autre :"
                                />
                                {isPresentChecked && (
                                    <TextField
                                        value={presentText}
                                        onChange={handlePresentTextChange}
                                        placeholder="Précisez..."
                                        required
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </FormGroup>
                        </FormControl>

                        <Typography variant="h5" sx={{ my: 7 }}>
                            MERCI D&apos;AVOIR RÉPONDU À CE QUESTIONNAIRE
                        </Typography>

                        <Grid container justifyContent="center">
                            <Grid item>
                                <PdfGenerator
                                    nomRapport={textFieldNomRapport}
                                    idEtudiant={textFieldIdEtudiant}
                                    formation={selectFieldFormation}
                                    nomEtudiant={textFieldNomEtudiant}
                                    prenomEtudiant={textFieldPrenomEtudiant}
                                    nomEntreprise={textFieldNomEntreprise}
                                    nomTuteurEntreprise={textFieldNomTuteurEntreprise}
                                    prenomTuteurEntreprise={textFieldPrenomTuteurEntreprise}
                                    posteEtudiant={textFieldPosteEtudiant}
                                    missions={textFieldMissions}
                                    commentaireTuteur={textFieldCommentaireTuteur}
                                    savoirEtre={radioFields}
                                    projetsSecondSemestre={textFieldProjetsSecondSemestre}
                                    axesAmelioration={textFieldAxesAmelioration}
                                    pointsFort={textFieldPointsFort}
                                    sujetMemoire={textFieldSujetMemoire}
                                    alerteRE={isREOtherChecked ? reOtherText : null}
                                    alerteSP={isPedagogiqueOtherChecked ? PedagogiqueOtherText : null}
                                    commentaireEntretienSuivi={textFieldCommentaireEntretienSuivi}
                                    nomSuiveur={textFieldNomSuiveur}
                                    dateEntretien={dateFieldEntretien}
                                    formatSuivi={radioFieldFormatSuivi}
                                    presence={checkboxFieldPresence}
                                    presenceText={presentText}
                                    recrutement={radioFieldRecrutement}
                                    poursuiteEtudes={radioFieldPoursuiteEtudes}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    type="button"
                                    sx={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #F00020',
                                        color: '#000000',
                                        borderRadius: '4px',
                                        width: '16em',
                                        height: '2em',
                                        fontSize: '16px',
                                        fontFamily: 'Inter',
                                        marginInline: '1em',
                                        '&:hover': {
                                            backgroundColor: '#F00020',
                                            color: 'white'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#FDD47C',
                                            color: 'gray'
                                        }
                                    }} onClick={handleEraseOpen}>
                                    Effacer le formulaire
                                </Button>

                                <Dialog
                                    open={eraseOpen}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle>{"Êtes-vous sûr ?"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            Cette action entraînera la suppression de toutes les données que vous avez entrées jusqu&apos;alors.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Annuler</Button>
                                        <Button onClick={handleReset} autoFocus>
                                            Oui, je suis sûr
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                            </Grid>
                        </Grid>
                    </form>;
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SyntheseSuiviTuteur;
