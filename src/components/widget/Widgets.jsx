// running / warning / dangerous / dead
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import React, {useEffect, useRef, useState} from "react";
import Button from '@mui/material/Button';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import NavDropdown from "react-bootstrap/NavDropdown";
import {Overlay,Popover,OverlayTrigger} from 'react-bootstrap';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';




function Widget (props) {

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });


    useEffect( () => {

    }, [setDiffStatus]);


    console.log(props.diffStatus.running); // 13
    console.log(diffStatus); //{running: 0, warning: 0, danger: 0, dead: 0}
    const type = props.type;

    console.log(props); //{type: 'offline', diffStatus: {…}}

    console.log(props.info); //undefined
    /*props.diffStatus.map((item, index) =>{

    }, [props.diffStatus]);*/
    /*useEffect(() => {
    }, [props.diffStatus])*/


    /*useEffect(()=>{
        console.log(props.diffStatus);
        setDiffStatus(props.diffStatus);
    },[props.diffStatus])*/

    /*useEffect(()=>{
        console.log(props.diffStatus);
        setDiffStatus(props.diffStatus);
    },[props.diffStatus])*/
    const [clickBackground, setClickBackground] = useState("");

    /*useEffect(() => {
        props.diffStatus.map((type, index)=>{
            if
        })
    })*/


    useEffect(() => {
        if(props.statusClickValue == props.type) {
            setClickBackground("rgba(204, 223, 255, 1)")
        }
        else {
            setClickBackground("rgba(0, 0, 0, 0)")
        }

    }, [props.statusClickValue])


    let data;
    //temporary
    const [diff,setDiff] = useState(100);

    switch (type) {
        case "running":
            data = {
                title: "Normal Operation",
                isState: "Running",
                link: "See All Power On",
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
                title: "Time Gap exceeds warning range",
                isState: "Warning",
                link: "View net warning",
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
                title: "Offline or Powered Down",
                isState: "Faulty",
                link: "See details of Offline",
                /*count: (props.diffStatus.dead),*/
                count: 0,
                icon: (
                    <DisabledByDefaultOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "#a0a0a0",
                            color: "#464646",
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

    const popoverTop = (
        <Popover id="popover-positioned-top" title="Popover top" className={`popover_background ${props.type}`}>
            <input type="number" min="100" className={`popover_input ${props.type}`}
                   value={diff}
                   onChange={e => setDiff(e.target.value)}/>
            {/*<CheckCircleOutlineOutlinedIcon style={{cursor:"default", color: colorReturn(type)}} onclick={setCheckTime}/>*/}
        </Popover>
    );


    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.isState}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">

                <OverlayTrigger trigger="click" placement="top" overlay={popoverTop}>
                    <div className="percentage positive" style={{cursor:"pointer", color: colorReturn(type)}}>
                        <KeyboardArrowUpIcon />
                        {diff} %
                    </div>
                </OverlayTrigger>

                <Button
                    className="count"
                    variant="outlined"
                    style = {{backgroundColor: clickBackground}}
                    onClick={(e) => {
                        let clkData ="";
                        if(props.statusClickValue!=props.type){
                            clkData = props.type;
                        }
                        props.StatusClick(clkData);
                    }}
                >
                    {data.count}
                </Button>
                {data.icon}
            </div>
        </div>
    );
};

export default Widget;
