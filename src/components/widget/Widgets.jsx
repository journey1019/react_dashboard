// running / warning / dangerous / dead
import "./widget.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, {useEffect, useRef, useState} from "react";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import NavDropdown from "react-bootstrap/NavDropdown";
import {Overlay,Popover,OverlayTrigger} from 'react-bootstrap';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import { SnackbarProvider, useSnackbar } from 'notistack';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';

import { Grid, Button, darken } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function Widget (props) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    }
    const handleClose = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setOpen(false);
    }

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    /*------------------------------ 각 Status 값 설정 ------------------------------*/
    const [diffStatus, setDiffStatus ] = useState({
        date: new Date().toLocaleString(),
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });

    const [deviceStatus, setDeviceStatus] = useState({
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    });

    const [befoDiffStatus, setBefoDiffStatus] = useState({
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    })

    /*-------------------- Status difference click -------------------*/
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const menuOptions = [
        'None',
        'Atria',
        'Callisto',
        'Dione',
        'Ganymede',
        'Hangouts Call',
        'Luna',
        'Oberon',
        'Phobos',
        'Pyxis',
        'Sedna',
        'Titania',
        'Triton',
        'Umbriel',
    ];
    const ITEM_HEIGHT = 48;



    useEffect( () => {
    }, [diffStatus, deviceStatus, befoDiffStatus]);
    console.log(props.deviceStatus.preRunningDv.length)
    console.log(props.deviceStatus.preRunningDv)


    console.log(props.deviceStatus)

    // Dashboard에서 가져온 type settings
    const type = props.type;

    /*------------------------------ Click Event ------------------------------*/
    const [clickBackground, setClickBackground] = useState("");

    useEffect(() => {
        if(props.statusClickValue === props.type) {     // running == running
            setClickBackground("rgba(204, 223, 255, 1)")
        }
        else {
            setClickBackground("rgba(0, 0, 0, 0)")
        }

    }, [props.statusClickValue])


    let data;
    // percentage
    const [diff,setDiff] = useState(100);
    //const [diff2, setDiff2] = useState(150)

    switch (type) { // props.type
        case "running":
            data = {
                title: (props.deviceStatus.preRunningDv.length)-(props.befoDiffStatus.running),
                isState: "Running",
                link: "See All Power On",
                diff: "100% 이하",
                count: (props.deviceStatus.preRunningDv.length),
                icon: (
                    <PlayArrowOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            color: "green",
                        }}
                    />
                ),
            };
            break;
        case "caution":
            data = {
                title: (props.deviceStatus.preCautionDv.length)-(props.befoDiffStatus.caution),
                isState: "Caution",
                link: "View all On Standby",
                diff: "150% 이하",
                count: (props.deviceStatus.preCautionDv.length),
                icon: (
                    <ErrorOutlineOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(218, 165, 32, 0.2)",
                            color: "goldenrod",
                        }}
                    />
                ),
            };
            break;
        case "warning":
            data = {
                title: (props.deviceStatus.preWarningDv.length)-(props.befoDiffStatus.warning),
                isState: "Warning",
                link: "View net warning",
                diff: "300% 이하",
                count: (props.deviceStatus.preWarningDv.length),
                icon: (
                    <WarningOutlinedIcon
                        className="icon"
                        style={{
                            color: "crimson",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                        }}
                    />
                ),
            };
            break;
        case "faulty":
            data = {
                title: (props.deviceStatus.preFaultyDv.length)-(props.befoDiffStatus.faulty),
                isState: "Faulty",
                link: "See details of Offline",
                diff: "300% 초과",
                count: (props.deviceStatus.preFaultyDv.length),
                icon: (
                    <DisabledByDefaultOutlinedIcon
                        className="icon"
                        style={{
                            color: "black",
                            backgroundColor: "rgba(150, 150, 150, 1)",
                        }}
                    />
                ),
            };
            break;
        default:
            break;
    }



    const target = useRef(null);
    const [show, setShow] = useState(true);
    function setCheckTime(){

        setDiff(40);
        setShow(!show);

    }

    function colorReturn(type){
        let color = "";
        switch (type){
            case "running":
                color= "rgba(0, 128, 0, 0.5)";
                break;
            case "caution":
                color = "rgba(255, 217, 0, 0.5)";
                break;
            case "warning":
                color ="rgba(255, 0, 0, 0.5)";
                break;
            case "faulty":
                color = "rgba(0, 0, 0, 0.5)";
                break;
            default:
                color ="white";
        }
        return color;
    }


    /*const popoverTop = (
        <Popover id="popover-positioned-top" title="Popover top" className={`popover_background ${props.type}`}>
            <input type="number" min="100" className={`popover_input ${props.type}`}
                   value={diff}
                   onChange={e => setDiff(e.target.value)}/>
            {/!*<CheckCircleOutlineOutlinedIcon style={{cursor:"default", color: colorReturn(type)}} onclick={setCheckTime}/>*!/}
        </Popover>
    );*/

    // Title Style 적용
    /*if(data.title > 0) {
        document.getElementById(data.title).style = 'green';
    }
    else{
        document.getElementById(data.title).style = 'red';
    }*/


    return (
        <Container disableGutters maxWidth={false} className="widget">
            <Grid container spacing={0} >
                <Grid item xs={6} sm={7} className="left">
                    <span className="title" id="widgetTitle">
                        Than yesterday :
                        <IconButton
                            id="status-count"
                            size="small" color="secondary"
                            aria-label="more"
                            aria-controls={menuOpen ? 'long-menu' : undefined}
                            aria-expanded={menuOpen ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleMenuClick}
                        >
                            <span className="dataTitle">{data.title}</span>
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {menuOptions.map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </span>
                    <span className="counter">{data.isState}</span>
                    <span className="link">{data.link}</span>
                </Grid>
                <Grid item xs={6} sm={5} className="right">
                    <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                        <KeyboardArrowDownIcon />
                        {data.diff}
                    </div>

                    <Button
                        className="count"
                        variant="outlined"
                        sx = {{'& .MuiButtonBase-root': {
                            width: '20px'
                        }}}
                        style = {{backgroundColor: clickBackground}}
                        onClick={(e) => {
                            let clkData ="";
                            if(props.statusClickValue !== props.type){ // caution !== running
                                clkData = props.type; // running --> Table
                            }
                            props.StatusClick(clkData); // running

                        }}
                    >
                        {data.count}
                    </Button>
                    {data.icon}
                </Grid>
            </Grid>

            {/*<Grid container spacing={1} >
                <Grid item xs={12} sm={6} className="left">
                    <span className="title">{data.title}</span>
                    <span className="counter">{data.isState}</span>
                    <span className="link">{data.link}</span>
                </Grid>
                <Grid item xs={12} sm={6} className="right">
                    <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                        <KeyboardArrowDownIcon />
                        {data.diff}
                    </div>

                    <Button
                        size="small"
                        className="count"
                        variant="outlined"
                        style = {{backgroundColor: clickBackground}}
                        onClick={(e) => {
                            let clkData ="";
                            if(props.statusClickValue !== props.type){ // caution !== running
                                clkData = props.type; // running --> Table
                            }
                            props.StatusClick(clkData); // running
                        }}
                    >
                        {data.count}
                    </Button>
                    {data.icon}
                </Grid>
            </Grid>*/}
            {/*<div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.isState}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">

                <OverlayTrigger trigger="click" placement="top" overlay={popoverTop}>
                    <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                        <KeyboardArrowUpIcon />
                        {data.diff} %
                    </div>
                </OverlayTrigger>
                <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                    <KeyboardArrowDownIcon />
                    {data.diff}
                </div>

                <Button
                    size="small"
                    className="count"
                    variant="outlined"
                    style = {{backgroundColor: clickBackground}}
                    onClick={(e) => {
                        let clkData ="";
                        if(props.statusClickValue !== props.type){ // caution !== running
                            clkData = props.type; // running --> Table
                        }
                        props.StatusClick(clkData); // running

                    }}
                >
                    {data.count}
                </Button>

                {data.icon}
            </div>*/}
        </Container>
    );
};

export default Widget;
