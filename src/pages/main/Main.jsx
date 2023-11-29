import "./main.scss";
import React, { useState, useEffect, useContext } from "react";

import Logo from "../../assets/KO_logo.png";
import SmallLogo from "../../assets/SmallLogo.png";

/* Component Import */
import Navbar from "../nav/Navbar";
import TableChart from "../../components/tableChart/TableChart";
import Table from "../../components/table/Table";

import Widgets from "../../components/widget/Widgets";
import Widget from "../../components/widgets/Widget";
import BeforeTable from "../../components/beforeTable/BeforeTable";

import OpenStreetMap from "../../components/map/OpenstreetMap";
import Container from '@mui/material/Container';

import { Grid, Button, darken } from "@mui/material";
import * as AiIcons from 'react-icons/ai';

import { IconContext } from 'react-icons';

import MenuIcon from '@mui/icons-material/Menu';

/* -- MUI -- */
import {styled, useTheme} from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from '@mui/material/List';
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
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import {Link} from "react-router-dom";
import Timer from "../nav/timer/Timer";
import Alarm from "../../components/navbar/alarm/Alarm";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import {SidebarData} from "../nav/side/Sidebar";
import {DarkModeContext} from "../../context/darkModeContext";
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Settings from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import PersonAdd from '@mui/icons-material/PersonAdd';



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

const Main = () => {
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
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
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
                            <IconButton size="large" aria-lable="Group Management" color="inherit">
                                <ManageAccountsRoundedIcon color="action"/>
                            </IconButton>
                            <IconButton size="large" aria-label="Device Management" color="inherit">
                                <DevicesRoundedIcon color="action"/>
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
                        {SidebarData.map((text, index) => {
                            return(
                                <Link to={text.path} style={{textDecoration: "none"}}>
                                    <ListItem key={text} disablePadding sx={{display: 'block'}} className={index.cName}>
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
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                        enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                        imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                        Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                        Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                        nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                        leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                        feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                        consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                        sapien faucibus et molestie ac.
                    </Typography>
                    <Typography paragraph>
                        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                        eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                        neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                        tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                        sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                        tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                        gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                        et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                        tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                        eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                        posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default Main;