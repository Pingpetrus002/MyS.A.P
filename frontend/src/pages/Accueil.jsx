import GrafanaChart from '../components/GrafanaChart'; // Assurez-vous que le chemin est correct
import Navbar from '../components/Navbar';
import { Container, Typography, Box, useMediaQuery } from '@mui/material';
import Slider from 'react-slick';



const HomePage = () => {
    const charts = [
        {
            src: 'http://10.1.1.44:3000/public-dashboards/b9adb3ad00944e8fa586eb51880de9d3',
            title: 'Graphique 1'
        },
        {
            src: 'http://10.1.1.44:3000/public-dashboards/b9adb3ad00944e8fa586eb51880de9d3',
            title: 'Graphique 2'
        },
        {
            src: 'http://10.1.1.44:3000/public-dashboards/b9adb3ad00944e8fa586eb51880de9d3',
            title: 'Graphique 3'
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
    };

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <>
            {!isMobile && <Navbar />}
            <Container>
                <Typography variant="h4" gutterBottom align="center" sx={{ margin: '2rem 0' }}>
                    Bienvenue sur MySAP
                </Typography>
                <Box sx={{ marginBottom: '2rem' }}>
                    <Slider {...settings}>
                        {charts.map((chart, index) => (
                            <Box key={index} sx={{ padding: '0 1rem' }}>
                                <GrafanaChart src={chart.src} title={chart.title} />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
            {isMobile && <Navbar />}
        </>
    );
};

export default HomePage;
