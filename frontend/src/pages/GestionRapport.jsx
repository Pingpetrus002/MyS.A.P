import DataTable from '../components/DataTable.jsx'
import './GestionRapport.css'

function App() {

    const rows = [
        { id: 1, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 2, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 3, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 4, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 5, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 6, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 7, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 8, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 9, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 10, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 11, etudiant: 'Jean Dupont', sujet: 'Projet de fin d\'études', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
        { id: 12, etudiant: 'Paul Durand', sujet: 'Contrat', concernes: 'Jean Dupont, Paul Durand', suiveur: 'Marie Martin' },
    ];

    return (
        <>
            <header>
                <div>
                    <h1>Navbar</h1>
                </div>
            </header>
            <body>
                <div>
                    <DataTable rows={rows} type="rapport" />
                </div>
            </body>
            <footer>
                <div>
                    <h1>Footer</h1>
                </div>
            </footer>
        </>
    );
}

export default App;