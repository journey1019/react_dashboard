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
    const [endDate, setEndDate] = useState('2023-12-02');
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
                        dataList.push(detail);
                    })
                    setDetailAlarmHistory(dataList);
                }
                else{
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

    function HistoryTimeLine({alarmList}){
        return(
            <TimelineItem sx={{fontSize: 'large'}}>
                <TimelineSeparator>
                    <TimelineDot variant="outlined" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">{alarmList.alarmLogIndex}</Typography>
                    <Typography>{alarmList.occurDate}</Typography>
                    <Typography>{alarmList.notiType}</Typography>
                </TimelineContent>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">{alarmList.alarmType}</Typography><br/>
                    <Typography variant="h6" component="span">{alarmList.alarmName}</Typography><br/>
                    <Typography variant="h6" component="span">{alarmList.deviceId}</Typography><br/>
                </TimelineContent>
            </TimelineItem>
        )
    }

    return(
        <>
            <Box className="historyTimeLine" sx={{width: 1, p: 2}}>
                <List sx={{ pt: 0, width: "100%", maxWidth: 700, bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    <Timeline
                        sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0.2,
                            },
                        }}
                    >
                        {detailAlarmHistory.map((alarmList) => (
                            <HistoryTimeLine alarmList={alarmList} key={alarmList.alarmLogIndex}/>
                        ))}
                    </Timeline>
                </List>
            </Box>
        </>
    )
}

export default EventTimeAlarm;