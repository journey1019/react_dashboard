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
    // Present Status Device Info
    const [deviceStatus, setDeviceStatus] = useState({
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    });
    // Past Status Device Info
    const [befoDeviceStatus, setBefoDeviceStatus] = useState ({
        pastRunningDv: [],
        pastCautionDv: [],
        pastWarningDv: [],
        pastFaultyDv: [],
    });

    /*-------------------- Status difference click -------------------*/
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }


    const ITEM_HEIGHT = 48;


    useEffect( () => {
    }, [deviceStatus, befoDeviceStatus]);

    // Array to Object 값 비교
    const runCompare = props.deviceStatus.preRunningDv.filter((item) => !props.befoDeviceStatus.pastRunningDv.some((i) => i.deviceId === item.deviceId))
    // 비교한 Object에서의 deviceId, vhcNm 출력
    const runningCompare = runCompare.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const runCompare1 = props.befoDeviceStatus.pastRunningDv.filter(
        (item) => !props.deviceStatus.preRunningDv.filter((i) => i.deviceId === item.deviceId).length > 0)
    const runningCompare1 = runCompare1.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const runningCombine = Object.assign({}, runningCompare, runningCompare1)

    const runningOptions = Object.entries(runningCombine);

    
    /*------------------------ Widgets Compare Options --------------------------------*/
    // 새로 추가된 거
    const cauCompare = props.deviceStatus.preCautionDv.filter((item) => !props.befoDeviceStatus.pastCautionDv.some((i) => i.deviceId === item.deviceId))
    const cautionCompare = cauCompare.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    // 과거에 있던 거 _ {01680599SKY0270: '23부광호', 01803491SKY92AC: '유신호'}_(Object)
    // 현재 없어진 거
    const cauCompare1 = props.befoDeviceStatus.pastCautionDv.filter(
        (item) => !props.deviceStatus.preCautionDv.filter((i) => i.deviceId === item.deviceId).length > 0)
    const cautionCompare1 = cauCompare1.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const cautionCombine = Object.assign({}, cautionCompare, cautionCompare1)
    const cautionOptions = Object.entries(cautionCombine);
    /*------------------------------------------------------------*/
    const warCompare = props.deviceStatus.preWarningDv.filter((item) => !props.befoDeviceStatus.pastWarningDv.some((i) => i.deviceId === item.deviceId))
    const warningCompare = warCompare.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const warCompare1 = props.befoDeviceStatus.pastWarningDv.filter(
        (item) => !props.deviceStatus.preWarningDv.filter((i) => i.deviceId === item.deviceId).length > 0)
    const warningCompare1 = warCompare1.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const warningCombine = Object.assign({}, warningCompare, warningCompare1)

    const warningOptions = Object.entries(warningCombine);
    /*------------------------------------------------------------*/
    const fauCompare = props.deviceStatus.preFaultyDv.filter((item) => !props.befoDeviceStatus.pastFaultyDv.some((i) => i.deviceId === item.deviceId))
    const faultyCompare = fauCompare.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const fauCompare1 = props.befoDeviceStatus.pastFaultyDv.filter(
        (item) => !props.deviceStatus.preFaultyDv.filter((i) => i.deviceId === item.deviceId).length > 0)
    const faultyCompare1 = fauCompare1.reduce((obj, item) => Object.assign(obj, { [item.deviceId] : item.vhcleNm }), {});

    const faultyCombine = Object.assign({}, faultyCompare, faultyCompare1)

    const faultyOptions = Object.entries(faultyCombine);
    /*------------------------------------------------------------*/

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
                title: (props.deviceStatus.preRunningDv.length)-(props.befoDeviceStatus.pastRunningDv.length),
                options: <Menu
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
                            width: '25ch',
                        },
                    }}
                >
                    {runningOptions.map((option) => (
                        <MenuItem key={option} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>,
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
                title: (props.deviceStatus.preCautionDv.length)-(props.befoDeviceStatus.pastCautionDv.length),
                options: <Menu
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
                            width: '25ch',
                        },
                    }}
                >
                    {cautionOptions.map((option) => (
                        <MenuItem key={option} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>,
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
                title: (props.deviceStatus.preWarningDv.length)-(props.befoDeviceStatus.pastWarningDv.length),
                options: <Menu
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
                            width: '25ch',
                        },
                    }}
                >
                    {warningOptions.map((option) => (
                        <MenuItem key={option} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>,
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
                title: (props.deviceStatus.preFaultyDv.length)-(props.befoDeviceStatus.pastFaultyDv.length),
                options: <Menu
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
                            width: '25ch',
                        },
                    }}
                >
                    {faultyOptions.map((option) => (
                        <MenuItem key={option} onClick={handleClose} sx={{width: 'auto'}}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>,
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
                        {data.options}
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
