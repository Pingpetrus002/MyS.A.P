import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import FetchWraper from '../utils/FetchWraper';
import AlertCreator from '../utils/AlertCreator';

const PdfGenerator = (props) => {
    const generateAndSendPDF = async () => {
        const doc = new jsPDF();
        let alertCreator = new AlertCreator(props = props);
        alertCreator.checkForAlert();

        // Common styles
        const fontStyles = {
            title: { fontSize: 22, fontStyle: 'bold', align: 'center', margin: 20 },
            sectionTitle: { fontSize: 18, fontStyle: 'bold', margin: 10 },
            text: { fontSize: 16, fontStyle: 'normal', margin: 10 }
        };

        // Function to add text with styling, managing page breaks and line breaks
        let currentY = 10; // Initial vertical position
        const addText = (text, x, y, { fontSize, fontStyle, align = 'left', margin = 0 } = {}) => {
            const lineHeight = fontSize * 1.2; // Estimated line height
            const pageHeight = doc.internal.pageSize.height;

            // Check if there's enough space left on the page
            if (currentY + lineHeight + margin > pageHeight - 10) { // 10 is the bottom margin
                doc.addPage(); // Add a new page
                currentY = 10; // Reset vertical position
            }

            doc.setFont('Helvetica', fontStyle);
            doc.setFontSize(fontSize);

            // Split text to size to handle line breaks
            const splitText = doc.splitTextToSize(text, 180); // 180 is the width limit for text
            doc.text(splitText, x, currentY + margin, { align });

            // Calculate height based on number of lines in split text
            const lines = doc.splitTextToSize(text, 180).length;
            currentY += lines * lineHeight + margin; // Update current Y position
        };

        // Separator
        doc.setLineWidth(0.5);
        doc.line(10, currentY + 30, 200, currentY + 30);

        // Title of the report
        addText(`${props.nomRapport}`, 105, 10, fontStyles.title);

        currentY = 50; // Reset vertical position

        // Student Information
        addText(`Information Étudiant`, 10, currentY, fontStyles.sectionTitle);
        addText(`ID Étudiant : ${props.idEtudiant}`, 10, currentY + 10, fontStyles.text);
        addText(`Formation : ${props.formation}`, 10, currentY + 20, fontStyles.text);
        addText(`Nom Étudiant : ${props.nomEtudiant}`, 10, currentY + 30, fontStyles.text);
        addText(`Prénom Étudiant : ${props.prenomEtudiant}`, 10, currentY + 40, fontStyles.text);

        // Separator and move to next page
        doc.addPage();
        currentY = 10; // Reset vertical position

        // Company Information
        addText(`Informations Entreprise`, 10, currentY, fontStyles.sectionTitle);
        addText(`Nom Entreprise : ${props.nomEntreprise}`, 10, currentY + 10, fontStyles.text);
        addText(`Nom Tuteur Entreprise : ${props.nomTuteurEntreprise}`, 10, currentY + 20, fontStyles.text);
        addText(`Prénom Tuteur Entreprise : ${props.prenomTuteurEntreprise}`, 10, currentY + 30, fontStyles.text);
        addText(`Poste Étudiant : ${props.posteEtudiant}`, 10, currentY + 40, fontStyles.text);
        addText(`Missions : ${props.missions}`, 10, currentY + 50, fontStyles.text);

        // Separator and move to next page
        doc.addPage();
        currentY = 10; // Reset vertical position

        // Comments and Other Information
        addText(`Commentaires et Suivi`, 10, currentY, fontStyles.sectionTitle);
        addText(`Commentaire Tuteur : ${props.commentaireTuteur}`, 10, currentY + 10, fontStyles.text);
        addText(`Projets Second Semestre : ${props.projetsSecondSemestre}`, 10, currentY + 20, fontStyles.text);
        addText(`Axes Amélioration : ${props.axesAmelioration}`, 10, currentY + 30, fontStyles.text);
        addText(`Points Fort : ${props.pointsFort}`, 10, currentY + 40, fontStyles.text);
        addText(`Sujet Mémoire : ${props.sujetMemoire}`, 10, currentY + 50, fontStyles.text);
        addText(`Commentaire Entretien Suivi : ${props.commentaireEntretienSuivi}`, 10, currentY + 60, fontStyles.text);
        addText(`Nom Suiveur : ${props.nomSuiveur}`, 10, currentY + 70, fontStyles.text);
        addText(`Date Entretien : ${props.dateEntretien}`, 10, currentY + 80, fontStyles.text);
        addText(`Format Suivi : ${props.formatSuivi}`, 10, currentY + 90, fontStyles.text);
        addText(`Présence : ${props.presence}`, 10, currentY + 100, fontStyles.text);
        addText(`Recrutement : ${props.recrutement}`, 10, currentY + 110, fontStyles.text);
        addText(`Poursuite Études : ${props.poursuiteEtudes}`, 10, currentY + 120, fontStyles.text);

        // Generate the PDF as base64
        const pdfContent = doc.output('datauristring').split(',')[1];

        // Prepare the request to send the encoded PDF
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
