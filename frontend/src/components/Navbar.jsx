import { useEffect, useState } from 'react';

import logoSelect from '../assets/LogoSelect.svg';
import student from '../assets/images/Student.svg';
import calendar from '../assets/images/Calendar.svg';
import profil from '../assets/images/Profil.svg';
import rapport from '../assets/images/Rapport.svg';
import logo from '../assets/logo.svg';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Badge, Box, Container, AppBar, Toolbar, IconButton, Menu, Avatar, Tooltip, MenuItem, Divider, Link } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import * as Icons from '@mui/icons-material';
import EastIcon from '@mui/icons-material/East';
import { useMediaQuery, useTheme } from '@mui/material';
import '@fontsource/inter/400.css';
import FetchWraper from '../utils/FetchWraper';
import { getAlerts } from '../utils/AlertCreator';
import { darken } from '@mui/system';

const pages = {
    1: ['Accueil', 'Rapports', 'Étudiants', 'Rendez-Vous', 'Missions'],
    2: ['Accueil', 'Rapports', 'Étudiants', 'Rendez-Vous', 'Missions'],
    3: ['Accueil', 'Rapports', 'Étudiants', 'Rendez-Vous', 'Missions'],
    4: ['Accueil', 'Missions', 'Rendez-Vous'],
    5: ['Accueil', 'Missions', 'Rendez-Vous'],
};

async function IsConnected() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/protected";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
    let result = await fetchWraper.fetchw();

    let data = await result.json();
    return { "status": result.status, "role": data };
}

const settings = [
    { name: 'Profil', url: '/?page=profil', type: 'lien' },
    { name: 'Déconnexion', url: '/deconnexion', type: 'callback' },
];

const Navbar = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            let result = await IsConnected();
            setRole(result.role);
        };

        fetchRole();
    }, []);

    const getPage = () => {
        if (role) {
            return pages[role.role];
        }
        return [];
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const handleOpenAccueilMenu = () => {
        window.location.href = '?page=accueil';
    };

    const handleOpenRapportMenu = () => {
        window.location.href = '?page=rapports';
    };

    const handleOpenStudentMenu = () => {
        window.location.href = '?page=etudiants';
    };

    const handleOpenCalendarMenu = () => {
        window.location.href = '?page=rendez-vous';
    };

    const handleOpenProfileMenu = () => {
        window.location.href = '?page=profil';
    };

    async function SubmitLogout() {
        let fetchWraper = new FetchWraper();
        fetchWraper.url = "http://localhost:5000/auth/logout";
        fetchWraper.method = "GET";
        fetchWraper.headers.append("Content-Type", "application/json");
        fetchWraper.headers.append("Accept", "application/json");
        fetchWraper.headers.append("Access-Control-Allow-Origin", "*");
        let result = await fetchWraper.fetchw();

        if (result.status !== 200) {
            console.error("Logout failed");
        }

        let data = await result.json();
        if (data) {
            window.location.href = "/?page=login";
        }
        console.log(data);
    }

    const [anchorElNotification, setAnchorElNotification] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const alertsData = await getAlerts();
                setAlerts(alertsData);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        }

        fetchAlerts();
    }, []);

    const handleOpenNotificationMenu = (event) => {
        setAnchorElNotification(event.currentTarget);
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    };

    const getColorByType = (type) => {
        switch (type) {
            case 'Type1':
                return '#FF7A7A';
            case 'Type2':
                return '#FFBD3D';
            case 'Type3':
                return '#C4C4C4';
            default:
                return '#FFFFFF';
        }
    };

    const NavMenuDesktop = () => {
        const [anchorElNav, setAnchorElNav] = useState(null);

        const handleOpenNavMenu = (event) => {
            setAnchorElNav(event.currentTarget);
        };

        const handleCloseNavMenu = () => {
            setAnchorElNav(null);
        };

        return (
            <Container maxWidth="false" style={{
                height: 80,
                fontFamily: 'Inter',
                background: '#FDD47C',
                paddingLeft: '2rem',
                paddingRight: '2rem',
                display: 'grid'
            }}>
                <Toolbar disableGutters>
                    <Typography variant="h6" noWrap component="a" href="/" sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none'
                    }}>
                        <img style={{ width: '6rem', borderRadius: 210.07, marginRight: '1rem' }} src={logoSelect}
                             alt="logo" />
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        marginLeft: '2rem',
                        marginRight: '2rem'
                    }}>
                        {getPage().map((page) => (
                            <Button
                                key={page}
                                href={`/?page=${page.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`.replace(/\s/g, '')}
                                sx={{
                                    my: 2,
                                    color: 'black',
                                    display: 'block',
                                    mx: 5,
                                    fontWeight: '600',
                                    fontSize: 15,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        color: 'white',
                                        backgroundColor: '#FFC039',
                                        fontWeight: '700',
                                        transform: 'scale(1.1)',
                                        borderRadius: '10px'
                                    }
                                }}>
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <NotificationIcon />
                    <ProfileIcon />
                </Toolbar>
            </Container>
        );
    };

    const NavMenuMedium = () => {
        const [anchorElNav, setAnchorElNav] = useState(null);

        const handleOpenNavMenu = (event) => {
            setAnchorElNav(event.currentTarget);
        };

        const handleCloseNavMenu = () => {
            setAnchorElNav(null);
        };

        return (
            <Container maxWidth="false" style={{
                height: 80,
                background: '#FDD47C',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                display: 'grid'
            }}>
                <Toolbar disableGutters>
                    <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                                aria-haspopup="true" onClick={handleOpenNavMenu} color="black"
                                sx={{ display: { xs: 'block', md: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginLeft: '2rem',
                        marginRight: '2rem'
                    }}>
                        <NotificationIcon />
                        <ProfileIcon />
                    </Box>
                </Toolbar>
            </Container>
        );
    };

    const NotificationIcon = () => {
        const [anchorElNotification, setAnchorElNotification] = useState(null);

        const handleOpenNotificationMenu = (event) => {
            setAnchorElNotification(event.currentTarget);
        };

        const handleCloseNotificationMenu = () => {
            setAnchorElNotification(null);
        };

        return (
            <Box sx={{ justifyContent: 'end' }}>
                <IconButton size='large' aria-label="show new notifications" color="black"
                            onClick={handleOpenNotificationMenu}>
                    <Badge badgeContent={alerts.length} color="error">
                        <Icons.Notifications />
                    </Badge>
                </IconButton>
                <Menu
                    sx={{ mt: '0px' }}
                    id="menu-appbar-notification"
                    anchorEl={anchorElNotification}
                    keepMounted
                    open={Boolean(anchorElNotification)}
                    onClose={handleCloseNotificationMenu}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleCloseNotificationMenu} sx={{ display: 'flex', justifyContent: 'right', '&:hover': { backgroundColor: 'transparent' } }}>
                        <Link
                            href={'/?page=alertes'}
                            underline="none"
                            color="inherit"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': {
                                    color: 'black',
                                    '& .icon-hover': {
                                        transform: 'translateX(4px)',
                                    }
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: '0.875rem' }}>
                                Voir toutes les alertes
                            </Typography>
                            <EastIcon fontSize="small" className="icon-hover" sx={{ transition: 'transform 0.3s ease', ml: '0.3em' }} />
                        </Link>
                    </MenuItem>
                    <Divider />
                    {(alerts.length === 0) ? (
                        <MenuItem onClick={handleCloseNotificationMenu} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography textAlign="center">
                                Aucune alerte pour le moment
                            </Typography>
                        </MenuItem>
                    ) : alerts.map((alert) => {
                        const backgroundColor = getColorByType(alert.type);
                        return (
                            <MenuItem
                                key={alert.id_alerte}
                                onClick={handleCloseNotificationMenu}
                                sx={{
                                    backgroundColor,
                                    padding: '0.5rem',
                                    '&:hover': {
                                        backgroundColor: darken(backgroundColor, 0.1),
                                    }
                                }}
                            >
                                <Typography textAlign="center">
                                    {alert.commentaires}
                                </Typography>
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Box>
        );
    };

    const ProfileIcon = () => {
        const [anchorElProfile, setAnchorElProfile] = useState(null);

        const handleCloseProfileMenu = () => {
            setAnchorElProfile(null);
        };

        const handleOpenProfileMenu = (event) => {
            setAnchorElProfile(event.currentTarget);
        };

        return (
            <Box sx={{ flexGrow: 0, marginLeft: 2 }}>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                        <Avatar alt="Remy Sharp" src={profil} />
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar-profile"
                    anchorEl={anchorElProfile}
                    keepMounted
                    open={Boolean(anchorElProfile)}
                    onClose={handleCloseProfileMenu}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {settings.map((setting, index) => (
                        <Box key={setting.name}>
                            <MenuItem onClick={handleCloseProfileMenu}>
                                <Typography
                                    textAlign="left"
                                    style={{ textDecoration: 'none', color: 'inherit', width: '100%', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.875rem' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (setting.type === "callback") {
                                            SubmitLogout();
                                        } else {
                                            window.location.href = setting.url;
                                        }
                                    }}
                                >
                                    {setting.name}
                                </Typography>
                            </MenuItem>
                            {index < settings.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Menu>
            </Box>
        );
    };

    const NavMenuMobile = () => (
        <Container maxWidth="false" style={{
            height: 50,
            background: '#FDD47C',
            paddingLeft: '2rem',
            paddingRight: '2rem',
        }}>
            <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h6" align="center" color="black">
                        Page
                    </Typography>
                </Box>
                <NotificationIcon />
            </Toolbar>
        </Container>
    );


    return (
        <>
            {!isMobile ? (
                <AppBar position="static">
                    {isMedium ? (
                        <NavMenuMedium />
                    ) : (
                        isDesktop && <NavMenuDesktop />
                    )}
                </AppBar>
            ) : (
                <Box
                    component="nav"
                    sx={{
                        background: '#FDD47C',
                        height: 50,
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                        zIndex: 1000
                    }}
                >
                    <IconButton onClick={handleOpenAccueilMenu} sx={{ p: 0 }}>
                        <img style={{ width: '2.5rem', borderRadius: '50%', opacity: 0.6 }} src={logo} alt="logo" />
                    </IconButton>
                    <IconButton onClick={handleOpenRapportMenu} sx={{ p: 0 }}>
                        <img style={{ width: '2.5rem', borderRadius: '50%', opacity: 0.6 }} src={rapport} alt="rapport" />
                    </IconButton>
                    <IconButton onClick={handleOpenStudentMenu} sx={{ p: 0 }}>
                        <img style={{ width: '2.5rem', borderRadius: '50%', opacity: 0.6 }} src={student} alt="student" />
                    </IconButton>
                    <IconButton onClick={handleOpenCalendarMenu} sx={{ p: 0 }}>
                        <img style={{ width: '2.5rem', borderRadius: '50%', opacity: 0.6 }} src={calendar} alt="calendar" />
                    </IconButton>
                    <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                        <img style={{ width: '2.5rem', borderRadius: '50%', opacity: 0.6 }} src={profil} alt="profile" />
                    </IconButton>
                </Box>
            )}
        </>
    );
};

export default Navbar;