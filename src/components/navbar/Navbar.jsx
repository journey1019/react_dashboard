import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import {Link} from "react-router-dom";

import React, { useState } from "react";

import MenuIcon from '@mui/icons-material/Menu';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from "../sidebar/SidbarData";
// X Icon
import { IconContext } from 'react-icons';



const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  const [ sidebar, setSidebar ] = useState(false);

  const showSidebar = () => setSidebar(!sidebar)

  return (
      <>
      <div className="header">
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className="navbar">
            <div className="wrapper">

              <div className="navbar-brand text-primary mr-0">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <span className="logo"> Korea ORBCOMM </span>
                </Link>
                <Link to='#' className = "menu-bars">
                  <MenuIcon onClick={showSidebar} />
                </Link>
              </div>

              <div className="search">
                <input type="text" placeholder="Search..." />
                <SearchOutlinedIcon />
              </div>
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
            </div>
          </div>
          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <div className="center">
              <ul className='nav-menu-items' onClick={showSidebar}>
                <li className='navbar-toggle'>
                  <Link to='#' className='menu-bars'>
                    <AiIcons.AiOutlineClose />
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
              </ul>
            </div>
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
          </nav>
        </IconContext.Provider>
      </div>
      </>
  );
};

export default Navbar;
