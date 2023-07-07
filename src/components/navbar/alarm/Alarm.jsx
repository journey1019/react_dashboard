import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./alarm.scss"

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




const Alarm = () => {
    const [alarmSummary, setAlarmSummary] = useState([]);
    const [alertCount, setAlertCount] = useState("");

    const[number, setNumber] = useState(0);

    // Modal Open
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    const handleClose = () => setOpen(false);

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const [logIndexSet, setLogIndexSet] = useState([]);
    const [alarmNameSet, setAlarmNameSet] = useState([]);
    const [notiTypeSet, setNotiTypeSet] = useState([]);
    const [occurCheckSet, setOccurCheckSet] = useState([]);
    const [occurDateSet, setOccurDateSet] = useState([]);
    const [recoveryDateSet, setRecoveryDateSet] = useState([]);

    const [diffStatus, setDiffStatus] = useState({
        running:"",
        caution:"",
        warning:"",
        faulty:"",
    });
    

    /*const alarmMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    )*/
    /*const Row = ({index, style}) => (
        <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
            Row {index}
        </div>
    );
    const Example = () => {
        <List
            className="List"
            height={150}
            itemCount={1000}
            itemSize={35}
            width={300}
        >
            {Row}
        </List>
    }*/

    useEffect(() => {
        const data = returnAlarm().then(
            result => {
                if(result!= null) {     // result == Object_[alarmCount: 119, alarmList: [{}, {}, ]]
                    let infoList = [];

                    setAlertCount(result["alarmCount"]) // alarmCount

                    setLogIndexSet([]);
                    setAlarmNameSet([]);
                    setNotiTypeSet([]);
                    setOccurCheckSet([]);
                    setOccurDateSet([]);
                    setRecoveryDateSet([]);

                    let running = "";
                    let caution = "";
                    let warning = "";
                    let faulty = "";

                    let diffObj = {};

                    //console.log(Object.values(result))
                    // result 객체 내의 alarmList 풀기
                    result["alarmList"].map(function(alarm){
                        //console.log(alarm)
                        infoList.push(alarm);

                        const indexSet = {};
                        const nameSet = {};
                        const typeSet = {};
                        const checkSet = {};
                        const occDateSet = {};
                        const recoDateSet = {};


                        //console.log(alarm)
                        //console.log(alarm.notiType); // Warning(string)
                        /*if (alarm.notiType == 'Faulty') {
                            <div style={{ color: 'gray'}}></div>
                        }*/


                        logIndexSet.push(indexSet);
                    })
                    setAlarmSummary(infoList);

                    diffObj.running = running;
                    diffObj.caution = caution;
                    diffObj.warning = warning;
                    diffObj.faluty = faulty;

                    setDiffStatus(diffObj);
                } else{
                }
            });
        return () => {
            clearTimeout(alarmSummary);
        }
    }, [number]);

    setTimeout(() => {
        setNumber(number+1);
        if(number>100){
            setNumber(0);
        }
    }, 5000)

    async function returnAlarm() {
        const alrSumToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const alrSumUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmSummary";

        const alrSumHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrSumToken,
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

    }, [alarmSummary, alertCount]);

    console.log(alarmSummary);

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

    let data;
    /*const [logIndexSet, setLogIndexSet] = useState([]);
    const [alarmNameSet, setAlarmNameSet] = useState([]);
    const [notiTypeSet, setNotiTypeSet] = useState([]);
    const [occurCheckSet, setOccurCheckSet] = useState([]);
    const [occurDateSet, setOccurDateSet] = useState([]);*/


/*
    data = {
        logIndex: (alarmSummary.alarmLogIndex),
    }
*/

    //const { index, style } = props;
    return(
        <>
            <IconButton color="secondary" aria-label="add an alarm" className="item" onClick={handleClickOpen('paper')}>
                <Badge badgeContent={alertCount} color="error">
                    <NotificationsIcon className="icon" size="large"/>
                </Badge>
            </IconButton>

            {/*<ListItem
                style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={`Item ${index + 1}`} />
                </ListItemButton>
            </ListItem>*/}

            {/*<List
                open={open}
                onClose={handleClose}
                scroll={scroll}
                sx={{width: "100%", maxWidth: 360, bgColor: 'background.paper'}} component="nav" aria-label="mailbox folders"
            >
                <ListItem button>
                    <ListItemText primary="Inbox" />
                    dd
                </ListItem>
                <Divider />
                <ListItem button divider>
                    <ListItemText primary="Drafts" />

                </ListItem>
                <ListItem button>
                    <ListItemText primary="Trash" />
                </ListItem>
                <Divider light />
                <ListItem button>
                    <ListItemText primary="Spam" />
                </ListItem>
            </List>*/}

            {/*<Box
                open={open}
                onClose={handleClose}
                sx={{ width: '100%', height: 400, maxWidth: 360, bgColor: 'background.paper'}}
            >
                <FixedSizeList
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={200}
                    overscanCount={5}
                >
                    {returnAlarm}
                </FixedSizeList>
            </Box>*/}

            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                sx={{position: "absolute", top: "-20px", left: "750px"}}
            >
                <DialogTitle id="scroll-dialog-title">Notification</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}

                    >
                        <List sx={{width: "100%", maxWidth: 700, bgColor: 'background.paper'}} component="nav" aria-label="mailbox folders">
                            <ListItem button sx={{width:'700px'}}
                            >
                                {alarmSummary.map(alarmList => (
                                    <AlarmList alarmList={alarmList} key={alarmList.alarmLogIndex}/>
                                ))}
                            </ListItem>
                            <Divider />
                        </List>
                        {/*<List sx={{width: "100%", maxWidth: 360, bgColor: 'background.paper'}} component="nav" aria-label="mailbox folders">
                            <ListItem button>
                                <ListItemText primary='Hi' />
                            </ListItem>
                            <Divider />
                            <ListItem button divider>
                                <ListItemText primary="Drafts" />
                            </ListItem>
                            <ListItem button>
                                <ListItemText primary="Trash" />
                            </ListItem>
                            <Divider light />
                            <ListItem button>
                                <ListItemText primary="Spam" />
                            </ListItem>
                        </List>*/}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>

            {/*<Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-box" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    pt: 2,
                    px: 4,
                    pb: 3,
                }}>
                    <div className="notiList">

                    </div>

                </Box>
            </Modal>*/}
        </>
    )
}

export default Alarm;