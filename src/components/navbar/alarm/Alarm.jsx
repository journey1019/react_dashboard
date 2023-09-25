import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./alarm.scss"

import IconButton from "@mui/material/IconButton";
import NotificationsIcon from '@mui/icons-material/Notifications';

import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
/*import { FixedSizeList as List } from 'react-window';*/

import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { deepOrange } from '@mui/material/colors';
import { SnackbarProvider, useSnackbar } from 'notistack';

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

    let clickAlarm = "";
    /* ---------------------------------------------------------------------*/

    useEffect(() => {
        const data = returnAlarm().then(
            result => {
                if(result!= null) {     // result == Object_[alarmCount: 119, alarmList: [{}, {}, ]]
                    let infoList = [];

                    setAlertCount(result["alarmCount"]) // alarmCount

                    // result 객체 내의 alarmList 풀기
                    result["alarmList"].map(function(alarm){
                        infoList.push(alarm);
                        if(alarm.occurCheck == true) {
                            alarm["occur"] = "발생";
                        } else{
                            alarm["occur"] = "복구";
                        }
                    })
                    setAlarmSummary(infoList);
                } else{
                    setAlertCount('0')
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

    //console.log(alarmSummary);
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

    // OccurDate 기준 내림차순 정렬
    alarmSummary.sort((x, y) => y.occurDate.localeCompare(x.occurDate));
    console.log(alarmSummary)

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
                    <span className="notiType">{alarmList.notiType} | <span className="occurCheck"> {alarmList.occur}</span></span> {/*Warning*/}
                    <span className="deviceId">{alarmList.deviceId}</span>
                    {/*<span className="occurCheck">{alarmList.occurCheck}</span>*/} {/*true/false*/}
                    <span className="occurDate">{alarmList.occurDate}</span> {/*알림발생 시간*/}
                    <span className="recoveryDate ">{alarmList.recoveryDate}</span> {/*When, IGWS API 연결 장애 or 계정 API 연결 장애*/}
                </div>
            </div>
        )
    }

    /*-------------------------------------- Alarm Detail Data -----------------------------------*/

    async function returnDetail(alarmList) {
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
                    //console.log(returnVal);

                    /* -------------------- 선택한 알람 바로 삭제  --------------------*/
                    // 원래있던 logIndex와 clickAlarm이 같으면
                    // 그 값은 제외하고 새로운 배열을 만들어서 onRemove에 저장
                    if(response.data["statusCode"] == 200){

                        // Alarm Remove
                        const onRemove = alarmSummary.filter((data) => { // 확인하지 않은 알람데이터
                            if(data["alarmLogIndex"] != clickAlarm){ // Index != click한 값이 다르면 data리턴
                                return data; // 선택한 알람 Detail
                            }
                        })
                        setAlarmSummary(onRemove);

                    }
                })
                .then(err=>{
                });
            return returnVal;

        } catch {
            return null;
        }
    }


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
            >

                <DialogTitle className="alertModalTitle">
                    Notification

                    {/* 오른쪽 상단, 더보기 버튼 */}
                    {/*<IconButton aria-label="Example" onClick={handleFullOpen}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </IconButton>*/}

                    {/* -------------------- Alarm History --------------------*/}

                </DialogTitle>

                <List sx={{ pt: 0, width: "100%", maxWidth: 700, bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    {alarmSummary.map((alarmList) => (
                        <ListItem sx={{padding: '0px', margin: '0px'}} key={alarmList.alarmLogIndex} disableGutters>
                            <ListItemButton
                                onClick={()=>{
                                    returnDetail(alarmList);
                                }
                            }
                                sx={{width: '600px'}}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: deepOrange[500] }} alt="Remy Sharp">
                                        <b>!</b>
                                    </Avatar>
                                </ListItemAvatar>
                                <AlarmList alarmList={alarmList}/>
                            </ListItemButton>
                            <SnackbarProvider maxSnack={10} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </>
    )
}

export default Alarm;