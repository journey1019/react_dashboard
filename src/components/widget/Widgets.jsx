// running / warning / dangerous / dead
import "./widget.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, {useEffect, useRef, useState} from "react";
import Button from '@mui/material/Button';
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

    function countAlarm() {
        if(props.diffStatus.caution >= 10) {

        }

        if(props.diffStatus.caution >= 10) {
            alert('Caution 단계인 단말기가 10개를 초과했습니다.')
        }
        if(props.diffStatus.warning >= 10) {
            alert('Caution 단계인 단말기가 10개를 초과했습니다.')
        }
        if(props.diffStatus.faulty >= 10) {
            alert('Caution 단계인 단말기가 10개를 초과했습니다.')
        }
    }


    /*------------------------------ 각 Status 값 설정 ------------------------------*/
    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });

    useEffect( () => {
    }, [setDiffStatus]);

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
                title: "Normal Operation",
                isState: "Running",
                link: "See All Power On",
                diff: "100% 이하",
                count: (props.diffStatus.running),
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
                title: "Time Gap exceeds normal range",
                isState: "Caution",
                link: "View all On Standby",
                diff: "150% 이하",
                count: (props.diffStatus.caution),
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
                title: "Dangerous Object",
                isState: "Warning",
                link: "View net warning",
                diff: "300% 이하",
                count: (props.diffStatus.warning),
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
                title: "Inspection Required",
                isState: "Faulty",
                link: "See details of Offline",
                diff: "300% 초과",
                count: (props.diffStatus.faulty),
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


    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.isState}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">

                {/*<OverlayTrigger trigger="click" placement="top" overlay={popoverTop}>
                    <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                        <KeyboardArrowUpIcon />
                        {data.diff} %
                    </div>
                </OverlayTrigger>*/}
                <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                    <KeyboardArrowDownIcon />
                    {data.diff}
                </div>

                <Button
                    className="count"
                    variant="outlined"
                    style = {{backgroundColor: clickBackground}}
                    onClick={(e) => {
                        let clkData ="";
                        if(props.statusClickValue !== props.type){ // caution !== running
                            clkData = props.type; // running --> Table
                        }
                        props.StatusClick(clkData); // running

                        /*let markerHide = false;
                        if(props.statusClickValue !== imageUrl || deviceStatue) {
                            hide
                        }
                        else{
                            show
                        }*/

                    }}
                >
                    {data.count}
                </Button>

                <Snackbar

                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Note archived"
                    action={action}
                />
                {data.icon}
            </div>
        </div>
    );
};

export default Widget;
