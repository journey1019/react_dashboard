import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import {Link} from "react-router-dom";


const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  return (
      <div className="navbar">
        <div className="wrapper">
          <div className="navbar-brand text-primary mr-0">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span className="logo"> Korea ORBCOMM </span>
            </Link>
            <div className="form-inline ml-auto">
              <div className="btn btn-primary" onClick={Navbar} >
                <i className="fa fa-bars"></i>
                <Button variant="outlined" startIcon={<MenuIcon />}></Button>
              </div>
            </div>
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
  );
};

export default Navbar;