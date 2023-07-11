import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./alarm.scss"
import AlarmHistory from "./AlarmHistory";

import AlarmIcon from "@mui/icons-material/Alarm";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Button } from '@mui/material';
import Modal from "@mui/material/Modal";

import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { FixedSizeList } from 'react-window';
/*import { FixedSizeList as List } from 'react-window';*/

import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { deepOrange } from '@mui/material/colors';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';




const Alarm = () => {
    const [alarmSummary, setAlarmSummary] = useState([]);
    // alarmCount Badge
    const [alertCount, setAlertCount] = useState("");

    // Refresh
    const[number, setNumber] = useState(0);

    // Modal Open
    const [open, setOpen] = useState(false);

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);


    /* ---------------------------------------------------------------------*/
    // Modal Full Screen
    const [fullOpen, setFullOpen] = useState(false);
    const handleClickFullOpen = () => {
        setFullOpen(true);
    };
    const handleFullClose = () => {
        setFullOpen(false);
    };

    /*const [diffStatus, setDiffStatus] = useState({
        running:"",
        caution:"",
        warning:"",
        faulty:"",
    });*/

    // Alarm Detail
    //const [clickAlarm, setClickAlarm] = useState("");

    let clickAlarm = "";
    /* ---------------------------------------------------------------------*/

    useEffect(() => {
        const data = returnAlarm().then(
            result => {
                if(result!= null) {     // result == Object_[alarmCount: 119, alarmList: [{}, {}, ]]
                    let infoList = [];

                    setAlertCount(result["alarmCount"]) // alarmCount

                    /*let running = "";
                    let caution = "";
                    let warning = "";
                    let faulty = "";

                    let diffObj = {};*/

                    //console.log(Object.values(result))

                    // result 객체 내의 alarmList 풀기
                    result["alarmList"].map(function(alarm){
                        //console.log(alarm)
                        infoList.push(alarm);
                    })
                    setAlarmSummary(infoList);

                    /*diffObj.running = running;
                    diffObj.caution = caution;
                    diffObj.warning = warning;
                    diffObj.faluty = faulty;

                    setDiffStatus(diffObj);*/
                } else{
                }
            });
        return () => {
            clearTimeout(alarmSummary);
        }
    }, [number]);

    // Refresh Time
    setTimeout(() => {
        setNumber(number+1);
        if(number>100){
            setNumber(0);
        }
    }, 10000)

    /* ---------------------------------------------------------------------*/
    const alrToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    async function returnAlarm() {
        const alrSumUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmSummary";

        const alrSumHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try{
            let result = await axios({
                method: "get",
                url: alrSumUrl,
                headers: alrSumHeaders,
                responseType:"json",
            })
                .then(response => {
                    returnVal = response.data.response;
                    //console.log(response.data.response); // = result
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        }
        catch{
            return null;
        }
    }

    useEffect(() => {
    }, [alarmSummary, clickAlarm]);

    //console.log(alarmSummary);

    // Alarm notiType type별 색상변경
    /*function colorReturn(type){
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
    }*/

    // OccurDate 기준 내림차순 정렬
    alarmSummary.sort((x, y) => y.occurDate.localeCompare(x.occurDate));

    // Alarm Status CSS
    function AlarmList({alarmList}) {
        return(
            <div className="alarmList">
                <div className="left">
                    <span className="alarmLogIndex">{alarmList.alarmLogIndex}</span>
                    <span className="alarmType">{alarmList.alarmType}</span>
                    <span className="alarmName">{alarmList.alarmName}</span>
                </div>
                <div className="right">
                    {/*<span className="notiType" style = {{color: colorReturn(type)}}>{alarmList.notiType}</span>*/}
                    <span className="notiType">{alarmList.notiType}</span>
                    <span className="occurCheck">{alarmList.occurCheck}</span>
                    <span className="occurDate">{alarmList.occurDate}</span>
                    <span className="recoveryDate ">{alarmList.recoveryDate}</span>
                </div>
            </div>
        )
    }
    /*-------------------------------------- Alarm Detail Data -----------------------------------*/

    async function returnDetail(alarmList) {
        console.log(alarmList);
        //{alarmLogIndex: 635, deviceId: '01446832SKY10AD', alarmName: 'PROTOCOL ERROR', occurDate: '2023-07-10T06:10:32', alarmType: 'SYSTEM'
        clickAlarm = alarmList.alarmLogIndex

        const alrDetUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmDetail";
        const alrDetData = {alarmLogIndex: (clickAlarm)}

        const alrDetHeaders = {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept":"application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try {
            await axios({
                method:"get",
                url:alrDetUrl,
                headers:alrDetHeaders,
                params:alrDetData,
                responseType:"json"
            })
                .then(response => {
                    // 성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                    console.log(returnVal)
                })
                .then(err=>{
                    console.log('error')
                });
            return returnVal;

        } catch {
            return null;
        }

        /*try{
            let result = await axios({
                method: "get",
                url: alrDetUrl,
                headers: alrDetHeaders,
                params: alrDetParams,
                responseType: "json",
            })
                .then(response => {
                    returnVal = response.data.response;
                    //console.log(response.data.response); // = result
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        }
        catch{
            return null;
        }*/
    }
    /*-------------------------------------- Alarm History Data -----------------------------------*/
    async function returnHistory() {
        const alrDetUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
        const alrDetParams = {startDate: "()", endDate: "()"}

        const alrDetHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try{
            let result = await axios({
                method: "get",
                url: alrDetUrl,
                headers: alrDetHeaders,
                params: alrDetParams,
                responseType: "json",
            })
                .then(response => {
                    returnVal = response.data.response;
                    //console.log(response.data.response); // = result
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        }
        catch{
            return null;
        }
    }

    function sendAlertCount() {

    }

    /*const [clickAlertIndex, setClickAlertIndex] = useState("");
    useEffect(() => {

    }, [clickAlertIndex])*/

    // Open Full - Screen Dialog
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    return(
        <>
            <IconButton color="secondary" aria-label="add an alarm" className="item" onClick={handleClickOpen('paper')}>
                <Badge badgeContent={alertCount} color="error">
                    <NotificationsIcon className="icon" size="large"/>
                </Badge>
            </IconButton>


            <Dialog
                className="dialogContainer"
                open={open}
                onClose={handleClose}
                sx={{position: "absolute", top: "-30px", left: "1000px", maxWidth: "600px"}}
            >

                <DialogTitle className="alertModalTitle">
                    Notification

                    <IconButton aria-label="Example" onClick={handleClickFullOpen}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </IconButton>

                    {/* 왜 Full-Screen 하고나면 렉이걸릴까? */}
                    <AlarmHistory handleClickFullOpen={handleClickFullOpen} handleFullClose={handleFullClose}/>

                    {/*<Dialog
                        fullScreen
                        open={fullOpen}
                        onClose={handleFullClose}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    open={fullOpen}
                                    onClick={handleFullClose}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    Sound
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleFullClose}>
                                    save
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <List>
                            <ListItem button>
                                <ListItemText primary="Phone ringtone" secondary="Titania" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText
                                    primary="Default notification ringtone"
                                    secondary="Tethys"
                                />
                            </ListItem>
                        </List>
                    </Dialog>*/}
                </DialogTitle>

                <List sx={{ pt: 0, width: "100%", maxWidth: 700, bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    {alarmSummary.map((alarmList) => (
                        <ListItem sx={{padding: '0px', margin: '0px'}} disableGutters>
                            {/*<ListItemButton onClick={()=> handleListItemClick(alarmList)} key={alarmList.alarmLogIndex}>*/}
                            <ListItemButton onClick={()=>returnDetail(alarmList)} key={alarmList.alarmLogIndex} sx={{width: '600px'}}>
                            {/*<ListItemButton onClick={()=>console.log(alarmList.alarmLogIndex)} sx={{width: '600px'}}>*/}
                                <ListItemAvatar>
                                    {/*<Avatar sx={{ bgColor: blue[100], color: blue[600] }}>*/}
                                    <Avatar sx={{ bgcolor: deepOrange[500] }} alt="Remy Sharp">
                                        <b>!</b>
                                    </Avatar>
                                </ListItemAvatar>
                                <AlarmList alarmList={alarmList} key={alarmList.alarmLogIndex} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </>
    )
}

export default Alarm;