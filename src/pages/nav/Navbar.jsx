/* React */
import React, {useContext, useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

/* Import */
import './navbar.scss';
import { SidebarData } from "./side/Sidebar";
import Timer from "./timer/Timer";
import Alarm from "./alarm/Alarm";
import AlarmHistory from "./alarm/AlarmHistory";
import {DarkModeContext} from "../../context/darkModeContext";
import Device from "../DevicePage/DevicePage";
import DevicePage from "./device/DeivcePage";
import GetSendStatus from "./getSendStatus/GetSendStatus"

// K.O Logo
import Logo from "../../assets/KO_logo.png";
import SmallLogo from "../../assets/SmallLogo.png";

// Module
import ReturnRequest from "../../components/modules/ReturnRequest";

/* MUI */
import {Menu, MenuItem, Avatar, Box, Tooltip, styled, useTheme, Toolbar, List, Divider, ListItem, ListItemIcon, ListItemButton, ListItemText} from "@mui/material";
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

/* ------ MUI Icon ------ */
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import login from "../login/Login";
import { FcMultipleDevices } from "react-icons/fc";
import { FcSmartphoneTablet } from "react-icons/fc";

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

    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목의 인덱스 저장
    const handleItemClick = (index) => {
        setSelectedItem(index); // 클릭된 항목의 인덱스를 설정
    }


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

    // Session
    /** @type {authExpired: "YYYY-MM-DDTHH:mm:ss", authKey: string, authType: "TOKEN", roleId: "SUPER_ADMIN"} */
    const session = JSON.parse(sessionStorage.getItem("userInfo"));

    const filteredSidebarData = SidebarData.filter((item) => {
        if(session === null) {
            return console.log('session 비었음')
        }
        else{
            if(session.roleId === "SUPER_ADMIN") {
                // 사용자가 관리자인 경우 모든 메뉴 표시
                return true;
            }
            else if(session.roleId === "ADMIN") {
                return ['Main', 'AIS', 'Support', 'Manage'].includes(item.title);
            }
            else{
                // 사용자가 관리자가 아닌 경우
                return item.title === "Main"; // MainPage 에 해당하는 제목
            }
        }
    });


    const loginUserInfoUrl = "https://iotgwy.commtrace.com/restApi/common/userInfo";
    const [loginUserInfo, setLoginUserInfo] = useState({});

    useEffect(() => {
        ReturnRequest(loginUserInfoUrl, null).then(result=>{if(result!=null){setLoginUserInfo(result);}});
    }, [])

    let loginUserNm = loginUserInfo ? loginUserInfo.userNm : '';

    // When Button Click, move DevicePage
    const navigate = useNavigate();

    const handleButtonClickDevicePage = () => {
        navigate('/devicePage');
    };






    return(
        <>
            <AppBar position="fixed" open={open} sx={{ backgroundColor:'white' }}>
                <Toolbar>
                    {/* Logo */}
                    <IconButton edge="start" sx={{...(open && { display: 'none' }),}}>
                        <Link to="/mainPage" style={{textDecoration: "none"}}>
                            <img src={SmallLogo} alt="smallLogo" height={"35"} width="30" />
                        </Link>
                    </IconButton>

                    {/* Menu - SideBar */}
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

                    {/* Greeting */}
                    <Box sx={{ flexGrow: 1 }} component="div" variant="h6">
                        <span className="user_Text">{`Welcome, ${loginUserNm}`}</span><br/>
                        <span className="greeting_Text">{year+'년 '+month+'월 '+date+'일 '}</span>
                    </Box>

                    {/* Navbar Components */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems:'center', textAlign:'center' }}>
                        <Timer />

                        <GetSendStatus />

                        <Alarm />

                        <AlarmHistory />

                        {/*<IconButton size="large" aria-label="Group Management" color="inherit">
                            <ManageAccountsRoundedIcon color="action" />
                        </IconButton>*/}

                        {/*<IconButton size="large" component={Link} to={'/devicePage'} aria-label="Go To DevicePage" sx={{ p:1 }} >
                            <DevicesRoundedIcon onClick={()=> console.log('devicePage btn Click')}/>
                            <FcMultipleDevices size="24" onClick={()=> console.log('devicePage btn Click')}/>
                            <FcSmartphoneTablet size="24" onClick={()=> console.log('devicePage btn Click')}/>
                        </IconButton>*/}
                        <DevicePage />

                        {/*<IconButton size="large" aria-label="Change Theme" color="inherit">
                            <DarkModeRoundedIcon color="action" onClick={() => dispatch({type: "TOGGLE"})} sx={{cursor: 'pointer'}}/>
                        </IconButton>*/}

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
                    <IconButton className="navbar-brand-button text-primary mr-0">
                        <Link to="/mainPage" style={{textDecoration: "none"}}>
                            <img src={Logo} alt="logo" height={"50"} width="180" />
                        </Link>
                    </IconButton>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List >
                    {filteredSidebarData.map((text, index) => (
                        <Link to={text.path} style={{ textDecoration: "none" }} key={text.title}>
                            <ListItem disablePadding sx={{ display: "block" }} key={text.title}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                        backgroundColor: selectedItem === index ? "#f0f0f0" : "transparent", // 선택된 항목일 때 배경색 변경
                                    }}
                                    onClick={() => handleItemClick(index)} // 아이템 클릭 시 handleItemClick 함수 호출
                                >
                                    <ListItemIcon
                                        color={text.color}
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            justifyContent: "center",
                                            size: "large",
                                        }}
                                    >
                                        {text.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text.title}
                                        sx={{ opacity: open ? 1 : 0 }}
                                        style={{ color: "black" }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
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