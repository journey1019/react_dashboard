import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./alarm.scss"

import IconButton from "@mui/material/IconButton";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { FcAlarmClock } from "react-icons/fc";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

import { Typography, Box, Modal, Badge, Dialog, DialogTitle, Tooltip, List, ListItem, ListItemButton, Avatar } from '@mui/material';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import { deepOrange } from '@mui/material/colors';
import { SnackbarProvider, useSnackbar } from 'notistack';
import ReturnRequest from "../../../components/modules/ReturnRequest";


const Alarm = () => {
    const buttonRef = useRef(null); // 버튼의 ref를 생성합니다.
    const style= {
        position: 'absolute',
        left: '80%',
        transform: 'translateX(-50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 2,
        top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 10 : '50%', // 버튼의 아래쪽 끝 위치로 설정합니다.
    }
    // API 로 불러온 Return
    const [alarmSummary, setAlarmSummary] = useState([]);

    // alarmCount Badge
    const [alarmCount, setAlarmCount] = useState("");

    // Modal Open
    const [modalOpen, setModalOpen] = useState(false);

    // alarmListCheck 상태 추가
    const [alarmListCheck, setAlarmListCheck] = useState(false);

    let clickAlarm = "";


    //console.log(alarmSummary);
    /* ---------------------------------------------------------------------*/
    const alrToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    const alarmSummaryUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmSummary";


    /*useEffect(() => {
        //fetchAlarmSummary(false);

        // 1분마다 API 요청 보냄
        const interval = setInterval(() => {
            //모달이 열려 있지 않아도 API 요청 보냄
            if(!modalOpen) {
                fetchAlarmSummary(false);
            }
        }, 60000); // 1분

        // 컴포넌트가 언마운트될 때 타이머 정리
        return() => clearInterval(interval)
    }, [modalOpen]); // modalOpen 상태가 변경될 때만 useEffect 실행*/
    useEffect(() => {
        fetchAlarmSummary(alarmListCheck); // useEffect에서 alarmListCheck 상태에 따라 API 요청을 보냄
    }, [alarmListCheck]); // alarmListCheck 상태가 변경될 때마다 useEffect가 실행됨

    const fetchAlarmSummary = (listCheck) => {
        const alarmSummaryParams = { alarmListCheck: listCheck };
        ReturnRequest(alarmSummaryUrl, alarmSummaryParams).then(result => {
            // 알람 있음
            if (result != null) {
                let infoList = [];
                setAlarmCount(result["alarmCount"]);

                // alarmSummaryParams = {alarmListCheck: true} 인 경우
                if(result.hasOwnProperty('alarmList')) {

                    result.alarmList.map(function(contents){
                        if(contents.occurCheck == true) {
                            contents["occur"] = "발생";
                        } else{
                            contents["occur"] = "복구";
                        }
                        infoList.push(contents);
                    })
                    setAlarmSummary(infoList);
                }
                // alarmSummaryParams = {alarmListCheck: false} 인 경우
                else{
                    setAlarmSummary(null);
                }
            }
            // 알람 없음 (= 확인해야 하는 알람 없음)
            else{
                setAlarmCount(0);
                setAlarmSummary(null);
            }
        });
    };

    const handleButtonClick = () => {
        fetchAlarmSummary(true);
        setModalOpen(true); // 버튼 클릭 시 모달을 열도록 함
    };

    const handleCloseModal = () => {
        setModalOpen(false); // 모달이 닫힐 때 modalOpen 상태를 false로 변경
        fetchAlarmSummary(false); // 모달이 닫힐 때는 alarmListCheck를 true로 설정하여 API 요청을 보냄
    };
    console.log(alarmSummary)


    // OccurDate 기준 내림차순 정렬
    let sortedAlarmSummary;
    if (Array.isArray(alarmSummary) && alarmSummary.length > 0) {
        sortedAlarmSummary = [...alarmSummary].sort((x, y) => y.occurDate.localeCompare(x.occurDate));
    } else {
        sortedAlarmSummary = [];
    }

    console.log(alarmSummary)

    // Alarm Status CSS
    function AlarmList({alarmList}) {
        return(
            <Box className="alarmList">
                <Box className="left">
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: 'darkblue'}}>{alarmList.alarmLogIndex}</Typography>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{alarmList.alarmType}</Typography>
                    <Typography variant="h5">{alarmList.alarmName}</Typography>
                </Box>
                <Box className="right">
                    <Box sx={{ w:1 , display: 'flex', justifyContent:'space-between'}}>
                        <Typography variant="subtitle1" sx={{color: 'lightcoral'}}>{alarmList.notiType}</Typography>
                        <Typography variant="subtitle1">|</Typography>
                        <Typography variant="subtitle1" sx={{color: 'darkblue'}}>{alarmList.occur}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: 'gray'}}>{alarmList.deviceId}</Typography> {/*true/false*/}
                    <Typography variant="subtitle1" sx={{color: 'gray'}}>{alarmList.occurDate}</Typography> {/*알림발생 시간*/}
                    <Typography variant="subtitle1" sx={{color: 'gray'}}>{alarmList.recoveryDate}</Typography> {/*When, IGWS API 연결 장애 or 계정 API 연결 장애*/}
                </Box>
            </Box>
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

            <Tooltip title="Real-Time Alarm" >
                <IconButton aria-label="add an alarm" className="item" onClick={handleButtonClick} ref={buttonRef}>
                    <Badge badgeContent={alarmCount} color="error">
                        {/*<FcAlarmClock className="icon" size="24"/>*/}
                        {/*<NotificationsIcon className="icon" size="large"/>*/}
                        <AccessAlarmIcon className="icon" fontSize="large"/>
                    </Badge>
                </IconButton>
            </Tooltip>

            {/* ------------------------ Alarm Icon ------------------------*/}
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Notification
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <List sx={{ width: "100%", maxWidth: 700, bgColor: 'background.paper' }}
                                  component="nav" aria-label="mailbox folders" className="listContainer"
                            >
                                {alarmSummary && alarmSummary.map((alarmList) => (
                                    <ListItem sx={{ padding: '0px', margin: '0px' }} key={alarmList.alarmLogIndex} disableGutters>
                                        <ListItemButton sx={{ width: '600px' }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: deepOrange[500] }} alt="Remy Sharp">
                                                    !
                                                </Avatar>
                                            </ListItemAvatar>
                                            <AlarmList alarmList={alarmList} />
                                        </ListItemButton>
                                        <SnackbarProvider maxSnack={10} />
                                    </ListItem>
                                ))}
                            </List>
                        </Typography>
                    </Box>
                </Modal>
            )}
        </>
    )
}

export default Alarm;