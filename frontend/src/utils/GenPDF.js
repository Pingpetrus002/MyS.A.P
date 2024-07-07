import jsPDF from 'jspdf';

const GenPDF = async (props) => {
    //setLoading(true); // Définir l'état de chargement à true
    const doc = new jsPDF();

    const fontStyles = {
        title: { fontSize: 22, fontStyle: 'bold', align: 'center', margin: 20 },
        sectionTitle: { fontSize: 18, fontStyle: 'bold', margin: 10 },
        text: { fontSize: 16, fontStyle: 'normal', margin: 10 }
    };

    let currentY = 10;
    const addText = (text, x, y, { fontSize, fontStyle, align = 'left', margin = 0 } = {}) => {
        const lineHeight = fontSize * 1.2;
        const pageHeight = doc.internal.pageSize.height;

        if (currentY + lineHeight + margin > pageHeight - 10) {
            doc.addPage();
            currentY = 10;
        }

        doc.setFont('Helvetica', fontStyle);
        doc.setFontSize(fontSize);

        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, x, currentY + margin, { align });

        const lines = doc.splitTextToSize(text, 180).length;
        currentY += lines * lineHeight + margin;
    };

    doc.setLineWidth(0.5);
    doc.line(10, currentY + 30, 200, currentY + 30);

    addText(`${props.nomRapport}`, 105, 10, fontStyles.title);

    currentY = 50;

    addText(`Information Étudiant`, 10, currentY, fontStyles.sectionTitle);
    addText(`ID Étudiant : ${props.idEtudiant}`, 10, currentY + 10, fontStyles.text);
    addText(`Formation : ${props.formation}`, 10, currentY + 20, fontStyles.text);
    addText(`Nom Étudiant : ${props.nomEtudiant}`, 10, currentY + 30, fontStyles.text);
    addText(`Prénom Étudiant : ${props.prenomEtudiant}`, 10, currentY + 40, fontStyles.text);

    doc.addPage();
    currentY = 10;

    addText(`Informations Entreprise`, 10, currentY, fontStyles.sectionTitle);
    addText(`Nom Entreprise : ${props.nomEntreprise}`, 10, currentY + 10, fontStyles.text);
    addText(`Nom Tuteur Entreprise : ${props.nomTuteurEntreprise}`, 10, currentY + 20, fontStyles.text);
    addText(`Prénom Tuteur Entreprise : ${props.prenomTuteurEntreprise}`, 10, currentY + 30, fontStyles.text);
    addText(`Poste Étudiant : ${props.posteEtudiant}`, 10, currentY + 40, fontStyles.text);
    addText(`Missions : ${props.missions}`, 10, currentY + 50, fontStyles.text);

    doc.addPage();
    currentY = 10;

    addText(`Commentaires et Suivi`, 10, currentY, fontStyles.sectionTitle);
    addText(`Commentaire Tuteur : ${props.commentaireTuteur}`, 10, currentY + 10, fontStyles.text);

    // Ajout des champs radio dans le PDF, une par ligne
    if (props.radioFields) {
        Object.keys(props.radioFields).forEach((field, index) => {
            addText(`${field} : ${props.radioFields[field]}`, 10, currentY + 20 + index * 10, fontStyles.text);
        });
        currentY += 20 + Object.keys(props.radioFields).length * 10;
    }

    addText(`Projets Second Semestre : ${props.projetsSecondSemestre}`, 10, currentY + 20, fontStyles.text);
    addText(`Axes Amélioration : ${props.axesAmelioration}`, 10, currentY + 30, fontStyles.text);
    addText(`Points Fort : ${props.pointsFort}`, 10, currentY + 40, fontStyles.text);
    addText(`Sujet Mémoire : ${props.sujetMemoire}`, 10, currentY + 50, fontStyles.text);
    addText(`Commentaire Entretien Suivi : ${props.commentaireEntretienSuivi}`, 10, currentY + 60, fontStyles.text);
    addText(`Nom Suiveur : ${props.nomSuiveur}`, 10, currentY + 70, fontStyles.text);
    addText(`Date Entretien : ${props.dateEntretien}`, 10, currentY + 80, fontStyles.text);
    addText(`Format Suivi : ${props.formatSuivi}`, 10, currentY + 90, fontStyles.text);

    addText(`Recrutement : ${props.recrutement}`, 10, currentY + 110, fontStyles.text);
    addText(`Poursuite Études : ${props.poursuiteEtudes}`, 10, currentY + 120, fontStyles.text);

    let finalText = `Présence : ${props.presence}`;
    if (props.presence === 'NON' && props.presenceText !== undefined) {
        finalText += `, ${props.presenceText}`;
    }
    addText(finalText, 10, currentY + 100, fontStyles.text);


    // save the pdf to the client's computer
    doc.save(`${props.nomRapport}.pdf`);

    //setLoading(false); // Définir l'état de chargement à false



};


export default GenPDF;