import './navbar.scss';
import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
// K.O Logo
import Logo from "../../assets/KO_logo.png";
import SmallLogo from "../../assets/SmallLogo.png";

import { SidebarData } from "./side/Sidebar";

import Timer from "./timer/Timer";

/* ----- MUI Nabar ----- */
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
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

import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import { alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
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
import Alarm from "../../components/navbar/alarm/Alarm";


const Navbar = () => {
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


    // Drawer Open
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    // const handleDrawerOpen = () => setOpen(!open); // MenuIcon 계속 살릴경우

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const { dispatch } = useContext(DarkModeContext); // Change Theme


    const items = ['Timer', 'Alert', 'deviceManage', 'groupManage', 'Theme']

    const [itemsnav, setItemsnav] = useState(null); // Navbar Menu
    const [usernav, setUsernav] = useState(null); // Profile

    const handleOpenItemMenu = (e) => {
        setItemsnav(e.currentTarget);
    };
    const handleOpenUserMenu = (e) => {
        setUsernav(e.currentTarget);
    }

    const handleCloseItemMenu = () => {
        setItemsnav(null);
    }
    const handleCloseUserMenu = () => {
        setUsernav(null);
    }

    /* ----------*/

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.error.dark, 1),
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.dark, 1),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    /* Logout */
    function Logout() {
        sessionStorage.clear();
        window.location.replace("/");
    }

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let day = today.getDay();

    const [selectedIndex, setSelectedIndex] = useState(1);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };



    return(
        <>
            <AppBar position="fixed" open={open} style={{ backgroundColor : 'white'}}>
                <Toolbar style={{ paddingLeft: '20px'}}>
                    <IconButton edge="start" sx={{...(open && { display: 'none' }),}}>
                        <Link to="/main" style={{textDecoration: "none"}}>
                            <img src={SmallLogo} alt="smallLogo" height={"35"} width="30" />
                        </Link>
                    </IconButton>
                    <IconButton
                        color="warning"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            marginLeft: 3,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} noWrap component="div" variant="h6">
                        <span className="user_Text">Welcome, 홍수통제소</span><br/>
                        <span className="greeting_Text">{year+'년 '+month+'월 '+date+'일 '}</span>
                    </Box>


                    {/* -- Search -- */}
                    <Search sx={{backgroundColor: '#ef5350'}}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />

                    {/* ----- Navbar Icon & Badge ----- */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Timer />

                        {/*<IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon color="action"/>
                            </Badge>
                        </IconButton>*/}

                        <Alarm />

                        <IconButton size="large" aria-lable="Group Management" color="inherit">
                            <ManageAccountsRoundedIcon color="action"/>
                        </IconButton>

                        <IconButton size="large" aria-label="Device Management" color="inherit">
                            <DevicesRoundedIcon color="action"/>
                        </IconButton>

                        <IconButton size="large" aria-label="Change Theme" color="inherit">
                            <DarkModeRoundedIcon color="action" onClick={() => dispatch({type: "TOGGLE"})} sx={{cursor: 'pointer'}}/>
                        </IconButton>
                        {/*<IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>*/}
                    </Box>

                    {/* ----- Profile ----- */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="UserID" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            usernav={usernav}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(usernav)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem href="/profile"><Typography textAlign="center">Profile</Typography></MenuItem>
                            <MenuItem onClick={Logout}><Typography textAlign="center">Logout</Typography></MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>


            {/* ----- SideBar ----- */}
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <div className="navbar-brand text-primary mr-0">
                        <Link to="/main" style={{textDecoration: "none"}}>
                            <img src={Logo} alt="logo" height={"50"} width="180" />
                        </Link>
                    </div>
                    <IconButton size="large" onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {SidebarData.map((text, index) => {
                        return(
                            <Link to={text.path} style={{textDecoration: "none"}}>
                                <ListItem key={text} disablePadding sx={{ display: 'block' }} className={index.cName}>
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
                        );
                    })}
                </List>
                <Divider />
                <List>
                    {['Light Theme', 'Dark Theme'].map((text, index) => (
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
                    ))}
                </List>
            </Drawer>
        </>
    )
}

export default Navbar;