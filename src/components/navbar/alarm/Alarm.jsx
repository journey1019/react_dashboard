import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./alarm.scss"
//import AlarmHistory from "./AlarmHistory";

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

import TextField from '@mui/material/TextField';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Snackbar from '@mui/material/Snackbar';

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



    const [detailOpen, setDetailOpen] = useState(false);

    const handleClickDetail = () => {
        setDetailOpen(true);
    };
    const handleCloseDetail = (event, reason) => {
        if( reason === 'clickaway') {
            return;
        }
        setDetailOpen(false);
    }



    /* ---------------------------------------------------------------------*/
    // Modal Full Screen
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const { enqueueSnackbar } = useSnackbar();
    //const {enqueueSnackbar, setEnQueueSnackbar} = useSnackbar();

    const handleClickVariant = (variant) => {
        console.log('moving')
        enqueueSnackbar(' You checked the Alarm ! ', {variant} );
    }


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
                    /*if(returnVal != null) {
                        {handleClickVariant('success')}
                    }*/
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
    /*const [alarmHistory, setAlarmHistory] = useState([]);
    const [hisNum, setHisNum] = useState(0);

    /!*const[startDate, setStartDate] = useState(new Date("2023-07-01").toISOString().split('T')[0]);*!/
    const[startDate, setStartDate] = useState(dayjs('2023-07-10'));
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };

    useEffect(() => {
        const hisData = returnHistory().then(
            result => {
                if(result != null) {
                    console.log(result);
                    let dataList = [];


                    result["dataList"].map(function(detail) {
                        dataList.push(detail);
                    })
                    setAlarmHistory(dataList);


                } else{

                }
            });
        return () => {
            clearTimeout(alarmHistory);
        }
    }, [hisNum, alarmHistory, startDate, endDate])
    
    async function returnHistory() {
        const alrHisUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
        const alrHisParams = {startDate: (startDate + "T00:00:00"), endDate: (endDate + "T23:59:59"), desc: true};

        const alrHisHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try{
            let result = await axios({
                method: "get",
                url: alrHisUrl,
                headers: alrHisHeaders,
                params: alrHisParams,
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
    }*/


    return(
        <>
            {/* ----------------------- Navbar Icon -----------------------*/}
            <IconButton color="secondary" aria-label="add an alarm" className="item" onClick={handleClickOpen('paper')}>
                <Badge badgeContent={alertCount} color="error">
                    <NotificationsIcon className="icon" size="large"/>
                </Badge>
            </IconButton>

            {/* ------------------------ Alarm Icon ------------------------*/}

            <Dialog
                className="dialogContainer"
                open={open}
                onClose={handleClose}
                sx={{position: "absolute", top: "-30px", left: "1000px", maxWidth: "600px"}}
            >

                <DialogTitle className="alertModalTitle">
                    {/*<Typography>
                    </Typography>*/}
                    Notification

                    <IconButton aria-label="Example" onClick={handleFullOpen}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </IconButton>

                    {/* -------------------- Alarm History --------------------*/}

                </DialogTitle>

                <List sx={{ pt: 0, width: "100%", maxWidth: 700, bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    {alarmSummary.map((alarmList) => (
                        <ListItem sx={{padding: '0px', margin: '0px'}} disableGutters>
                            {/*<ListItemButton onClick={()=> handleListItemClick(alarmList)} key={alarmList.alarmLogIndex}>*/}
                            <ListItemButton
                                onClick={()=>{
                                    handleClickVariant('success');
                                    returnDetail(alarmList);
                                    handleClickDetail()
                                }
                            }
                                key={alarmList.alarmLogIndex} sx={{width: '600px'}}
                            >
                            {/*<ListItemButton onClick={()=>console.log(alarmList.alarmLogIndex)} sx={{width: '600px'}}>*/}
                                <ListItemAvatar>
                                    {/*<Avatar sx={{ bgColor: blue[100], color: blue[600] }}>*/}
                                    <Avatar sx={{ bgcolor: deepOrange[500] }} alt="Remy Sharp">
                                        <b>!</b>
                                    </Avatar>
                                </ListItemAvatar>
                                <AlarmList alarmList={alarmList} key={alarmList.alarmLogIndex} />
                            </ListItemButton>
                            <Snackbar open={detailOpen} autoHideDuration={6000} onClose={handleCloseDetail} message="Note archived" />
                            <SnackbarProvider maxSnack={10} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </>
    )
}

export default Alarm;