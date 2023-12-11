import "./basicnavbar.scss";
//import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MenuIcon from '@mui/icons-material/Menu';


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



import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

import { Link } from "react-router-dom";

import React, { useState } from "react";
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from "../sidebar/SidbarData";
// X Icon
import { IconContext } from 'react-icons';

// react-bootstrap, bootstrap
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../../assets/KO_logo.png";
import Timer from "./timer/Timer";
import Alarm from "./alarm/Alarm";
import AlarmHistory from "./alarm/AlarmHistory";


const BasicNavbar = () => {


    const { dispatch } = useContext(DarkModeContext);

    const [ sidebar, setSidebar ] = useState(false);
    // 임시 안쓰는 세부기능 unuse
    const unUseIconColor = {
        color: "rgba(0, 0, 0, 0.2)",
    };
    const unUseIconAlarmColor = {
        color: "rgba(0, 0, 0, 0.2)",
        backgroundColor:"rgba(0, 0, 0, 0.4)"
    };

    const showSidebar = () => setSidebar(!sidebar);

    //logOut NavDropDown --> 클릭시
    function logout(){
        //세션 지우기
        sessionStorage.clear();
        //새로고침으로 login 화면 이동
        window.location.replace("/");
    }

    return (
        <>
            <div className="header">
                <IconContext.Provider value={{ color: '#fff' }}>
                    <div className="top">
                        <div className="wrapper">
                            {/*<Navbar bg="light" expand="lg">*/}
                            <Navbar expand="lg">
                                <div className="navbar-brand text-primary mr-0">
                                    <Link to="/dashboard" style={{ textDecoration: "none" }}>
                                        <img src={Logo} alt="logo" height={"60"} width="200" />
                                    </Link>

                                    <Link to='#' className = "menu-bars">
                                        <MenuIcon onClick={showSidebar} />
                                        {/*<MenuIcon  style={unUseIconColor}/>*/}
                                    </Link>
                                </div>

                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        {/*<Nav.Link href="/orbcomm">ORBCOMM</Nav.Link>
                                        <Nav.Link href="/hwajin">화진 T&I</Nav.Link>
                                        <Nav.Link href="/trawler">대형기선저인망수협</Nav.Link>
                                        <Nav.Link href="/fishing">어선안전법 VMS</Nav.Link>
                                        <Nav.Link href="/hyungmang">형망협회</Nav.Link>
                                        <Nav.Link href="/sand">골재채취운반선</Nav.Link>
                                        <Nav.Link href="/jea">제아정보통신</Nav.Link>
                                        <Nav.Link href="/tac">서해안인근해안강망연협회</Nav.Link>
                                        <NavDropdown title="서해안근해안강망연합회" id="basic-nav-dropdown">
                                            <NavDropdown.Item href="/tac">서해안서해안근해안강망연합회</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item href="#tac/9.1">군산근해안</NavDropdown.Item>
                                            <NavDropdown.Item href="#tac/9.2">서천군장항</NavDropdown.Item>
                                            <NavDropdown.Item href="#tac/9.3">서천근해안</NavDropdown.Item>
                                            <NavDropdown.Item href="#tac/9.4">태안근해안</NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.4">충남보령근헤안</NavDropdown.Item>
                                        </NavDropdown>*/}
                                    </Nav>
                                </Navbar.Collapse>

                                {/*<div className="search">*/}
                                {/*  <input type="text" placeholder="Search..." />*/}
                                {/*  <SearchOutlinedIcon />*/}
                                {/*</div>*/}

                                <div className="items">
                                    <div className="item">
                                        {/*Icon 변경 및 Timer Component 연결*/}
                                        <AccessTimeOutlinedIcon className="icon" />
                                        <Timer />
                                    </div>
                                    <div className="item" >
                                        <DarkModeOutlinedIcon
                                            className="icon"
                                            /*style={unUseIconColor}*/
                                            onClick={() => dispatch({ type: "TOGGLE" })}
                                            sx={{cursor: 'pointer'}}
                                        />
                                    </div>
                                    {/*<div className="item">
                                        <FullscreenExitOutlinedIcon className="icon" style={unUseIconColor}/>
                                    </div>*/}
                                    {/*<div className="item">
                                        <NotificationsNoneOutlinedIcon className="icon" style={unUseIconColor}/>
                                        <div className="counter" style={unUseIconAlarmColor}>1</div>
                                    </div>*/}
                                    <div className="item">
                                        <Alarm />
                                    </div>
                                    <div className="item">
                                        <AlarmHistory />
                                    </div>
                                    <div className="item">
                                        <ChatBubbleOutlineOutlinedIcon className="icon" style={unUseIconColor}/>
                                        <div className="counter" style={unUseIconAlarmColor}>2</div>
                                    </div>
                                    <div className="item">
                                        <ListOutlinedIcon className="icon" style={unUseIconColor}/>
                                    </div>
                                    <div className="item">
                                        <img
                                            src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                            alt=""
                                            className="avatar"
                                        />
                                    </div>
                                    <NavDropdown title="Logout" id="basic-nav-dropdown" style={{paddingRight: "30px"}}>
                                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                    </NavDropdown>
                                </div>
                            </Navbar>
                        </div>
                    </div>

                    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} style={{fontStyle: '25px'}}>
                        <ul className='nav-menu-items' onClick={showSidebar}>
                            <li className='navbar-toggle'>
                                <Link to='#' className='menu-bars'>
                                    <AiIcons.AiOutlineClose size={30}/>
                                </Link>
                            </li>

                            {SidebarData.map((item, index) => {
                                const session = JSON.parse(sessionStorage.getItem("userInfo"));
                                if(session.roleId!="SUPER_ADMIN" && item.title == "Managed") {
                                    console.log(session.roleId)
                                }else {
                                    return (

                                        <li key={index} className={item.cName} >
                                            <Link to={item.path}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                }

                            })}

                            <div className="bottom">
                                <div
                                    className="colorOption"
                                    onClick={() => dispatch({ type: "LIGHT" })}
                                ></div>
                                <div
                                    className="colorOption"
                                    onClick={() => dispatch({ type: "DARK" })}
                                ></div>
                            </div>
                        </ul>
                    </nav>

                </IconContext.Provider>

            </div>
        </>
    );
};

export default BasicNavbar;