import { useEffect, useState } from 'react';
import { LinearProgress, Grid, useMediaQuery } from '@mui/material';
import FetchWraper from '../utils/FetchWraper';
import DataTable from '../components/DataTable';
import NavBar from '../components/Navbar';
import SyntheseSuiviTuteur from '../components/FormRapport';

async function getDatas() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://localhost:5001/auth/get_students";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

    try {
        let result = await fetchWraper.fetchw();

        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        let data = await result.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


export default function Etudiants() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDatas();
                setStudents(data.students);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [modalOpen]);

    const getRowId = (student) => student.id;

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedStudent(null);
    };

    const onButtonClick = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    return (
        <>
            {!isMobile && <NavBar />}
            {loading ? (
                <LinearProgress />
            ) : (
                <Grid container justifyContent="center" sx={{ marginTop: '70px' }}>
                    <Grid item xs={10}>
                        {loading ? (
                            <LinearProgress />
                        ) : (
                            <DataTable
                                rows={students}
                                type="etudiant"
                                callback={handleRowClick}
                                onButtonClick={onButtonClick}
                            />
                        )}
                    </Grid>
                    <Grid item xs={10}>
                        {selectedStudent && (
                            <SyntheseSuiviTuteur
                                student={selectedStudent}
                                open={modalOpen}
                                onClose={handleCloseModal}
                                rapportData={selectedStudent.rapports}
                            />
                        )}
                    </Grid>
                </Grid>
            )}
            {isMobile && <NavBar />}
        </>
    );
}
