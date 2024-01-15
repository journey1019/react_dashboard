import React, { useState, useEffect } from 'react';
import axios from "axios";

/* Timeline*/
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { Box, MenuItem } from '@mui/material';

/* List */
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';


const EventTimeAlarm = () => {

    const [detailAlarmHistory, setDetailAlarmHistory] = useState([]);

    const [startDate, setStartDate] = useState('2023-12-01');
    const [endDate, setEndDate] = useState('2023-12-10');
    const [deviceId, setDeviceId] = useState('01675108SKY4B31');

    const [alarmCount, setAlarmCount] = useState('');

    useEffect(() => {
        const data = getDetailAlarmHistory().then(
            result => {
                if(result != null) {
                    let dataList = [];
                    console.log(result)

                    setAlarmCount(result["alarmCount"])

                    result["alarmList"].map(function(detail) {
                        if(detail.occurCheck == true){
                            detail["occur"] = "발생";
                        } else{
                            detail["occur"] = "복구";
                        }
                        dataList.push(detail);
                    })
                    setDetailAlarmHistory(dataList);
                }
                else{
                    setAlarmCount('0')
                }
            }
        )
        return() => {
            clearTimeout(detailAlarmHistory)
        }
    }, [startDate, endDate, deviceId])

    useEffect(() => {
    }, [detailAlarmHistory])

    console.log(detailAlarmHistory)

    async function getDetailAlarmHistory(alarmList) {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
        const params = {startDate: startDate, endDate: endDate, deviceId: deviceId};
        const headers = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        };
        let returnVal = null;

        try {
            let result = await axios({
                method: "get",//통신방식
                url: urls,//URL
                headers: headers,//header
                params: params,
                responseType: "json"
            })
                .then(response => {
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                })
                .then(err => {
                    return null;
                });
            return returnVal; //반환
        } catch {
            return null;
        }
    }


    function EventTimeAlarm({alarmList}) {
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
                </div>
            </div>
        )
    }

    return(
        <>
            <Box className="historyTimeLine" sx={{width: 1}}>
                <List sx={{ pt: 0, width: "100%", maxWidth: 700, maxHeight: 309, overflow: 'auto', bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    {detailAlarmHistory.map((alarmList) => (
                        <>
                            <Box className="eventTimeListBox" sx={{ p: 1 }}>
                                <ListItem sx={{padding: '0px', margin: '0px'}} key={alarmList.alarmLogIndex} disableGutters>
                                    <EventTimeAlarm alarmList={alarmList} key={alarmList.alarmLogIndex}/>
                                </ListItem><hr/>
                            </Box>
                        </>
                    ))}
                </List>
            </Box>
        </>
    )
}

export default EventTimeAlarm;