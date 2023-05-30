// 통과안됨_ 정상_ 수정필요

import "./basicnavbar.scss";
//import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

import React, { useState } from "react";

import MenuIcon from '@mui/icons-material/Menu';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from "../sidebar/SidbarData";
// X Icon
import { IconContext } from 'react-icons';

// react-bootstrap, bootstrap
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../../assets/KO_logo.png";


import { AppBar, Box, Divider, Drawer, IconButton, Toolbar, Typography } from "@mui/material";

import { NavLink } from "react-router-dom";

const Navbar2 = () => {
    const { dispatch } = useContext(DarkModeContext);

    const [ sidebar, setSidebar ] = useState(false);

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
            <Box>
                <AppBar component={"nav"} >
                    <Toolbar>
                        <IconButton color="white" aria-label="open drawer" edge="start" sx={{mr:2, display:{sm:'none'}, }} >
                            <Link to='#' className = "menu-bars">
                                <MenuIcon onClick={showSidebar} />
                            </Link>
                        </IconButton>

                        <Typography variant = "h6" component="div" sx={{flexGrow:1 }}>
                            <Link to="/" style={{ textDecoration: "none" }}>
                                <img src={Logo} alt="logo" height={"40"} width="230" />
                            </Link>
                        </Typography>

                        <Box sx={{display: {xs: "none", sm: "white"} }}>
                            <ul className="navigation-menu">
                                <li><NavLink activateClassName="active" to={"/"}>Home</NavLink></li>
                                <li><NavLink to={"/orbcomm"}>ORBCOMM</NavLink></li>
                                <li><NavLink to={"/hwajin"}>화진 T&I</NavLink></li>
                                <li><NavLink to={"/trawler"}>대현기선저인망수협</NavLink></li>
                                <li><NavLink to={"/fishing"}>어선안전법 VMS</NavLink></li>
                                <li><NavLink to={"/hyungmang"}형망협회></NavLink></li>
                                <li><NavLink to={"/sand"}>골재채취운반선</NavLink></li>
                                <li><NavLink to={"/jea"}>제아정보통신</NavLink></li>
                                <li><NavLink to={"/tac"}>서해안인근해안강망연협회</NavLink></li>
                            </ul>
                        </Box>
                    </Toolbar>
                    {/*<div className="items">
                        <div className="item">
                            <LanguageOutlinedIcon className="icon" />
                            English
                        </div>
                        <div className="item">
                            <DarkModeOutlinedIcon
                                className="icon"
                                onClick={() => dispatch({ type: "TOGGLE" })}
                            />
                        </div>
                        <div className="item">
                            <FullscreenExitOutlinedIcon className="icon" />
                        </div>
                        <div className="item">
                            <NotificationsNoneOutlinedIcon className="icon" />
                            <div className="counter">1</div>
                        </div>
                        <div className="item">
                            <ChatBubbleOutlineOutlinedIcon className="icon" />
                            <div className="counter">2</div>
                        </div>
                        <div className="item">
                            <ListOutlinedIcon className="icon" />
                        </div>
                        <div className="item">
                            <img
                                src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                                className="avatar"
                            />
                        </div>
                    </div>*/}
                </AppBar>
                <Box component="nav">

                </Box>
            </Box>
        </>
    );
};

export default Navbar2;