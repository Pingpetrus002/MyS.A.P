import GrafanaChart from '../components/GrafanaChart'; // Assurez-vous que le chemin est correct
import Navbar from '../components/Navbar';
import { Container, Typography, Box, useMediaQuery } from '@mui/material';
import Slider from 'react-slick';



const HomePage = () => {
    const charts = [
        {
            src: 'https://10.1.1.44:3000/d/bdpdik5lysxs0b/new-dashboard?orgId=1&from=1718887196068&to=1718908796068&viewPanel=2',
            title: 'Graphique 1'
        },
        {
            src: 'https://10.1.1.44:3000/public-dashboards/3c16abbc2dd4445299412c3f14031eec',
            title: 'Graphique 2'
        },
        {
            src: 'https://grafana.yourdomain.com/d-solo/your-dashboard-id/your-panel-id?orgId=1&refresh=5s',
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
