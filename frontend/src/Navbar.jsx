import React, {useEffect, useState} from 'react';
import logo from './assets/logo.svg';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function SimplePopover() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>null;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                Open Popover
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
            </Popover>
        </div>
    );
}

const Navbar = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:80/navbar')
            .then(response => response.json())
            .then(data => setData(data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <nav>
            <div style={{width: '100%', height: 151, background: '#FDD47C', border: '5px black solid'}}>
                <img style={{width: 168.05, height: 151.25, borderRadius: 210.07}}
                     src={logo} alt={'logo'}/>
                <div style={{
                    width: 1002.41,
                    height: 46.21,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 163,
                    display: 'inline-flex'
                }}>
                    <div style={{
                        width: 197.46,
                        height: 46.21,
                        color: 'black',
                        fontSize: 37.81,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        wordWrap: 'break-word'
                    }}>Rapports
                    </div>
                    <div style={{
                        width: 197.46,
                        height: 46.21,
                        color: 'black',
                        fontSize: 37.81,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        wordWrap: 'break-word'
                    }}>Étudiants
                    </div>
                    <div style={{
                        width: 281.49,
                        height: 37.81,
                        color: 'black',
                        fontSize: 37.81,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        wordWrap: 'break-word'
                    }}>Rendez-vous
                    </div>
                </div>
                <div style={{
                    width: 204,
                    height: 84.03,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 44,
                    display: 'inline-flex'
                }}>
                    <i className="fa-solid fa-bell" style={{width: 75.62, height: 75.62, borderRadius: 210.07}}></i>
                    <div style={{width: 29.41, height: 29.41, background: '#FF0000', borderRadius: 9999}}/>
                    <div style={{
                        width: 12.60,
                        height: 21.01,
                        color: 'white',
                        fontSize: 21.01,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        wordWrap: 'break-word'
                    }}>2
                    </div>
                    <i className="fa-solid fa-user"
                       style={{width: 84.03, height: 84.03, borderRadius: 210.07, border: "2px solid black"}}></i>
                </div>
            </div>
            <SimplePopover/>
        </nav>
    );
};

export default Navbar;