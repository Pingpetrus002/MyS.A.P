import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import FetchWraper from '../utils/FetchWraper';
import AlertCreator from '../utils/AlertCreator';
import { idID } from '@mui/material/locale';

const PdfGenerator = (props) => {
    const generateAndSendPDF = async () => {
        const doc = new jsPDF();
        let alertCreator = new AlertCreator(props=props);
        alertCreator.checkForAlert();

        // Ajout des valeurs au document PDF
        doc.text(`${props.nomRapport}`, 90, 10);
        doc.text(`ID Étudiant: ${props.idEtudiant}`, 10, 30);
        doc.text(`Formation: ${props.formation}`, 10, 40);
        doc.text(`Nom Étudiant: ${props.nomEtudiant}`, 10, 50);
        doc.text(`Prénom Étudiant: ${props.prenomEtudiant}`, 10, 60);
        doc.text(`Nom Entreprise: ${props.nomEntreprise}`, 10, 70);
        doc.text(`Nom Tuteur Entreprise: ${props.nomTuteurEntreprise}`, 10, 80);
        doc.text(`Prénom Tuteur Entreprise: ${props.prenomTuteurEntreprise}`, 10, 90);
        doc.text(`Poste Étudiant: ${props.posteEtudiant}`, 10, 100);
        doc.text(`Missions: ${props.missions}`, 10, 110);
        doc.text(`Commentaire Tuteur: ${props.commentaireTuteur}`, 10, 120);
        doc.text(`Projets Second Semestre: ${props.projetsSecondSemestre}`, 10, 130);
        doc.text(`Axes Amélioration: ${props.axesAmelioration}`, 10, 140);
        doc.text(`Points Fort: ${props.pointsFort}`, 10, 150);
        doc.text(`Sujet Mémoire: ${props.sujetMemoire}`, 10, 160);
        doc.text(`Commentaire Entretien Suivi: ${props.commentaireEntretienSuivi}`, 10, 170);
        doc.text(`Nom Suiveur: ${props.nomSuiveur}`, 10, 180);
        doc.text(`Date Entretien: ${props.dateEntretien}`, 10, 190);
        doc.text(`Format Suivi: ${props.formatSuivi}`, 10, 200);
        doc.text(`Présence: ${props.presence}`, 10, 210);
        doc.text(`Recrutement: ${props.recrutement}`, 10, 220);
        doc.text(`Poursuite Études: ${props.poursuiteEtudes}`, 10, 230);

        // Générer le PDF en tant que base64
        const pdfContent = doc.output('datauristring').split(',')[1];
        console.log(pdfContent);

        // Préparer la requête pour envoyer le PDF encodé en base64
        let fetchWraper = new FetchWraper();
        fetchWraper.url = "http://localhost:5000/auth/set_rapport";
        fetchWraper.method = "POST";
        fetchWraper.headers.append("Content-Type", "application/json");
        fetchWraper.headers.append("Accept", "application/json");
        fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
        fetchWraper.headers.append("Access-Control-Allow-Origin", "*");

        const body = {
            id_user: props.idEtudiant,
            sujet: props.nomRapport,
            type: 'rapport',
            rapport: pdfContent
        };

        fetchWraper.body = JSON.stringify(body);

        try {
            const response = await fetchWraper.fetchw();
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi du rapport');
            }
            console.log('Rapport envoyé avec succès');
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={generateAndSendPDF}
            sx={{
                backgroundColor: '#FDD47C',
                color: 'black',
                borderRadius: '4px',
                width: '10em',
                height: '2em',
                fontSize: '16px',
                fontFamily: 'Inter',
                '&:hover': {
                    backgroundColor: '#FFC039'
                }
            }}
        >
            Envoyer
        </Button>
    );
};

export default PdfGenerator;