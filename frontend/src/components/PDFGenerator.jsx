import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import FetchWraper from '../utils/FetchWraper';

const PdfGenerator = (props) => {
  const generateAndSendPDF = async () => {
    const doc = new jsPDF();

    // Ajout des valeurs au document PDF
    doc.text(`ID Étudiant: ${props.textFieldIdEtudiant}`, 10, 10);
    doc.text(`Formation: ${props.selectFieldFormation}`, 10, 20);
    doc.text(`Nom Étudiant: ${props.textFieldNomEtudiant}`, 10, 30);
    doc.text(`Prénom Étudiant: ${props.textFieldPrenomEtudiant}`, 10, 40);
    doc.text(`Nom Entreprise: ${props.textFieldNomEntreprise}`, 10, 50);
    doc.text(`Nom Tuteur Entreprise: ${props.textFieldNomTuteurEntreprise}`, 10, 60);
    doc.text(`Prénom Tuteur Entreprise: ${props.textFieldPrenomTuteurEntreprise}`, 10, 70);
    doc.text(`Poste Étudiant: ${props.textFieldPosteEtudiant}`, 10, 80);
    doc.text(`Missions: ${props.textFieldMissions}`, 10, 90);
    doc.text(`Commentaire Tuteur: ${props.textFieldCommentaireTuteur}`, 10, 100);
    doc.text(`Projets Second Semestre: ${props.textFieldProjetsSecondSemestre}`, 10, 110);
    doc.text(`Axes Amélioration: ${props.textFieldAxesAmelioration}`, 10, 120);
    doc.text(`Points Fort: ${props.textFieldPointsFort}`, 10, 130);
    doc.text(`Sujet Mémoire: ${props.textFieldSujetMemoire}`, 10, 140);
    doc.text(`Commentaire Entretien Suivi: ${props.textFieldCommentaireEntretienSuivi}`, 10, 150);
    doc.text(`Nom Suiveur: ${props.textFieldNomSuiveur}`, 10, 160);
    doc.text(`Date Entretien: ${props.dateFieldEntretien}`, 10, 170);
    doc.text(`Format Suivi: ${props.radioFieldFormatSuivi}`, 10, 180);
    doc.text(`Présence: ${props.checkboxFieldPresence}`, 10, 190);
    doc.text(`Recrutement: ${props.radioFieldRecrutement}`, 10, 200);
    doc.text(`Poursuite Études: ${props.radioFieldPoursuiteEtudes}`, 10, 210);

    // Générer le PDF en tant que base64
    const pdfContent = doc.output('datauristring').split(',')[1];

    // Préparer la requête pour envoyer le PDF encodé en base64
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5001/auth/set_rapport";
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");

    const body = {
      id_user: props.id_user,
      id_suiveur: props.id_suiveur,
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
        size: 'large',
        borderRadius: '4px',
        border: '2.5px solid #000000',
        marginTop: '2rem',
        width: '150px', 
        height: '60px', 
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
