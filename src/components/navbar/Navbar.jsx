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
import Logo from "../../assets/ORBCOMM_Logo.png";



const BasicNavbar = () => {
    const { dispatch } = useContext(DarkModeContext);

    const [ sidebar, setSidebar ] = useState(false);

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
            <div className="header">
                <IconContext.Provider value={{ color: '#fff' }}>
                    <div className="top">
                        <div className="wrapper">
                            <Navbar bg="light" expand="lg">
                                <div className="navbar-brand text-primary mr-0">
                                    <Link to="/" style={{ textDecoration: "none" }}>
                                        <img src={Logo} alt="logo" height={"40"} width="230" />
                                    </Link>

                                    <Link to='#' className = "menu-bars">
                                        <MenuIcon onClick={showSidebar} />
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
                                </div>
                            </Navbar>
                        </div>
                    </div>

                    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                        <ul className='nav-menu-items' onClick={showSidebar}>
                            <li className='navbar-toggle'>
                                <Link to='#' className='menu-bars'>
                                    <AiIcons.AiOutlineClose size={30}/>
                                </Link>
                            </li>

                            {SidebarData.map((item, index) => {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
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