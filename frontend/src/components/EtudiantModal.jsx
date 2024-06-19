import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import FetchWraper from '../utils/FetchWraper';


export default function StudentModal({ student, open, onClose }) {
  const [editedStudent, setEditedStudent] = useState(student);

  // Mettre à jour l'état `editedStudent` lorsque le student prop change
  useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/update_etudiant";
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    fetchWraper.body = JSON.stringify(editedStudent);
    fetchWraper.fetchw();
    onClose();

    // Message de succès
    if (fetchWraper.response.status !== 200) {
      alert("Erreur lors de la mise à jour des informations de l'étudiant !");
      return;
    }
    alert("Les informations de l'étudiant ont été mises à jour avec succès !");
    
  };

  const handleCancel = () => {
    setEditedStudent(student); // Réinitialiser les champs aux valeurs d'origine
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Informations sur l'étudiant</DialogTitle>
      <DialogContent>
        <TextField
          name="nom"
          label="Nom"
          value={editedStudent.nom}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: '8px' }}
        />
        <TextField
          name="prenom"
          label="Prénom"
          value={editedStudent.prenom}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: '8px' }}
        />
        <TextField
          name="classe"
          label="Classe"
          value={editedStudent.classe}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: '8px' }}
        />
        <Select
          name="statut"
          label="Statut"
          value={editedStudent.statut}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: '8px' }}
        >
          <MenuItem value="Alternance en cours">Alternance en cours</MenuItem>
          <MenuItem value="Pas d'alternance">Pas d'alternance</MenuItem>
        </Select>
        <TextField
          name="entreprise"
          label="Entreprise"
          value={editedStudent.entreprise}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: '8px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}
