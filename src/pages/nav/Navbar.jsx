import './navbar.scss';
import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
// K.O Logo
import Logo from "../../assets/KO_logo.png";
import SmallLogo from "../../assets/SmallLogo.png";

import { SidebarData } from "./side/Sidebar";

import Timer from "./timer/Timer";
import Alarm from "./alarm/Alarm";
import AlarmHistory from "./alarm/AlarmHistory";



/* ----- MUI Nabar ----- */
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid';

import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import { alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';

/* ------ Icon ------ */
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import {DarkModeContext} from "../../context/darkModeContext";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

/* ----- Navbar ----- */
const drawerWidth = 240;
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const Navbar = () => {
    // Main 테마 변경(Dark/Light)
    const { dispatch } = useContext(DarkModeContext); // Change Theme

    // Navbar & Sidebar
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Profile
    const [anchorEl, setAnchorEl] = useState(null);
    const openAccount = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Today
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();

    // Logout
    function Logout() {
        sessionStorage.clear();
        window.location.replace("/");
    }



    return(
        <>
            <AppBar position="fixed" open={open} sx={{bgcolor:'white'}}>
                <Toolbar>
                    <IconButton edge="start" sx={{...(open && { display: 'none' }),}}>
                        <Link to="/main" style={{textDecoration: "none"}}>
                            <img src={SmallLogo} alt="smallLogo" height={"35"} width="30" />
                        </Link>
                    </IconButton>
                    <IconButton
                        color="error"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="end"
                        sx={{
                            marginLeft: 2,
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} noWrap component="div" variant="h6">
                        <span className="user_Text">Welcome, 홍수통제소</span><br/>
                        <span className="greeting_Text">{year+'년 '+month+'월 '+date+'일 '}</span>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Timer />
                        <Alarm />
                        <AlarmHistory />
                        <IconButton size="large" aria-label="Group Management" color="inherit">
                            <ManageAccountsRoundedIcon color="action" onClick={() => console.log('UserManageIconClick')}/>
                        </IconButton>
                        <IconButton size="large" aria-label="Device Management" color="inherit">
                            <DevicesRoundedIcon color="action" onClick={() => console.log('DeviceManageIconClick')}/>
                        </IconButton>
                        <IconButton size="large" aria-label="Change Theme" color="inherit">
                            <DarkModeRoundedIcon color="action" onClick={() => dispatch({type: "TOGGLE"})} sx={{cursor: 'pointer'}}/>
                        </IconButton>

                        {/* Profile */}
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={openAccount ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openAccount ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={openAccount}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleClose}>
                                <Avatar /> Profile
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Avatar /> My account
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                Add another account
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={Logout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small"/>
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton className="navbar-brand text-primary mr-0">
                        <Link to="/main" style={{textDecoration: "none"}}>
                            <img src={Logo} alt="logo" height={"50"} width="180" />
                        </Link>
                    </IconButton>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {SidebarData.map((text) => {
                        return(
                            <Link to={text.path} style={{textDecoration: "none"}} key={text.title}>
                                <ListItem disablePadding sx={{display: 'block'}} key={text.title}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3: 'auto',
                                                justifyContent: 'center',
                                                size: 'large',
                                            }}
                                        >
                                            {text.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text.title} sx={{ opacity: open ? 1 : 0}} style={{color: 'black'}} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        )
                    })}
                </List>
                <Divider />
                <List>
                    {/*{['Light Theme', 'Dark Theme'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}*/}
                </List>
            </Drawer>
            
        </>
    )
}

export default Navbar;