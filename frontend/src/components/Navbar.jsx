import React, {useEffect, useState} from 'react';
import logoSelect from '../assets/LogoSelect.svg';
import student from '../assets/images/Student.svg';
import calendar from '../assets/images/Calendar.svg';
import profil from '../assets/images/Profil.svg';
import rapport from '../assets/images/Rapport.svg';
import logo from '../assets/logo.svg';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Badge, Box, Container, AppBar, Toolbar, IconButton, Menu, Avatar, Tooltip, MenuItem} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import * as Icons from '@mui/icons-material';
import {useMediaQuery, useTheme} from '@mui/material';
import '@fontsource/inter/400.css'; // Assurez-vous que la police est importée

const pages = ['Rapports', 'Étudiants', 'Rendez-vous'];

const settings = [
    { name: 'Profil', url: '/?page=profil' },
    { name: 'Déconnexion', url: '/deconnexion' }
  ];

  
const Navbar = () => {
    const [data, setData] = useState(null);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElProfile, setAnchorElProfile] = useState(null);
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenProfileMenu = (event) => {
        setAnchorElProfile(event.currentTarget);
    };

    const handleOpenNotificationMenu = (event) => {
        setAnchorElNotification(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseProfileMenu = () => {
        setAnchorElProfile(null);
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    };

    const handleMobileMenuOpen = () => {
        setMobileMenuOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const NavMenuDesktop = () => (
        <Container maxWidth="false" style={{
            height: 80,
            fontfamily: 'Inter',
            background: '#FDD47C',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            display: 'grid'
        }}>
            <Toolbar disableGutters>
                <Typography variant="h6" noWrap component="a" href="/" sx={{
                    mr: 2,
                    display: {xs: 'none', md: 'flex'},
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none'
                }}>
                    <img style={{width: '6rem', borderRadius: 210.07, marginRight: '1rem'}} src={logoSelect}
                         alt="logo"/>
                </Typography>
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: '2rem',
                    marginRight: '2rem'
                }}>
                    {pages.map((page) => (
                        <Button key={page} onClick={handleCloseNavMenu}
                                href={`/?page=${page.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`.replace(/\s/g, '')}
                                sx={{
                                    my: 2,
                                    color: 'black',
                                    display: 'block',
                                    mx: 5,
                                    fontWeight: 'bold',
                                    fontSize: 15
                                }}>
                            {page}
                        </Button>
                    ))}
                </Box>
                <NotificationIcon/>
                <ProfileIcon/>
            </Toolbar>
        </Container>
    );

    const NavMenuMedium = () => (
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
                            sx={{display: {xs: 'block', md: 'none'}}}>
                    <MenuIcon/>
                </IconButton>
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginLeft: '2rem',
                    marginRight: '2rem'
                }}>
                    <NotificationIcon/>
                    <ProfileIcon/>
                </Box>
            </Toolbar>
        </Container>
    );

    const NotificationIcon = () => (
        <Box sx={{ justifyContent: 'end' }}>
            <IconButton size='large' aria-label="show new notifications" color="black"
                        onClick={handleOpenNotificationMenu}>
                <Badge badgeContent={50} color="error">
                    <Icons.Notifications />
                </Badge>
            </IconButton>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar-notification"
                anchorEl={anchorElNotification}
                keepMounted
                open={Boolean(anchorElNotification)}
                onClose={handleCloseNotificationMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',  // Changed from 'left' to 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',  // Changed from 'left' to 'right'
                }}
            >
                <MenuItem key="notification" onClick={handleCloseNotificationMenu}>
                    <Typography textAlign="center">Notification</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
    
    const ProfileIcon = () => (
        <Box sx={{ flexGrow: 0, marginLeft: 2 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                    <img src={profil} alt="profile"
                         style={{ width: '2.5rem', borderRadius: 210.07, border: "3px solid black" }} />
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
                    vertical: 'bottom',
                    horizontal: 'right',  // Changed from 'left' to 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',  // Changed from 'left' to 'right'
                }}
            >   
            {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseProfileMenu}>
                    <Typography textAlign="center">
                        <a href={setting.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {setting.name}
                        </a>
                    </Typography>
                </MenuItem>
            ))}
            </Menu>
        </Box>
    );
    

    const NavMenuMobile = () => (
        <Container maxWidth="false" style={{
            height: 50,
            background: '#FDD47C',
            paddingLeft: '2rem',
            paddingRight: '2rem',
        }}>
            <Toolbar disableGutters>
                <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="h6" align="center" color="black">
                        Page
                    </Typography>
                </Box>
                <NotificationIcon/>
            </Toolbar>
        </Container>
    );

    return (
        <>
            <AppBar position="static">
                {isMobile ? (
                    <NavMenuMobile/>
                ) : (isMedium ? (
                    <NavMenuMedium/>
                ) : (isDesktop && (
                    <NavMenuDesktop/>
                )))}
            </AppBar>

            {/* Footer for Mobile */}
            {isMobile && (
                <Box component="footer" sx={{
                    background: '#FDD47C',
                    height: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    bottom: 0,
                    width: '100%'
                }}>
                    <IconButton onClick={handleOpenProfileMenu} sx={{p: 0, marginRight: '2rem'}}>
                        <img style={{width: '2.5rem', borderRadius: 210.07, opacity: 0.6}} src={logo}
                             alt="logo"/>
                    </IconButton>
                    <IconButton onClick={handleOpenProfileMenu} sx={{p: 0, marginRight: '2rem'}}>
                        <img style={{width: '2.5rem', borderRadius: 210.07, opacity: 0.6}} src={rapport}
                             alt="rapport"/>
                    </IconButton>
                    <IconButton onClick={handleOpenProfileMenu} sx={{p: 0, marginRight: '2rem'}}>
                        <img style={{width: '2.5rem', borderRadius: 210.07, opacity: 0.6}} src={student}
                             alt="student"/>
                    </IconButton>
                    <IconButton onClick={handleOpenProfileMenu} sx={{p: 0, marginRight: '2rem'}}>
                        <img style={{width: '2.5rem', borderRadius: 210.07, opacity: 0.6}} src={calendar}
                             alt="calendar"/>
                    </IconButton>
                    <IconButton onClick={handleOpenProfileMenu} sx={{p: 0, marginRight: '2rem'}}>
                        <img style={{width: '2.5rem', borderRadius: 210.07, opacity: 0.6}} src={profil} alt="profile"/>
                    </IconButton>
                </Box>

            )}
        </>
    );
};

export default Navbar;
