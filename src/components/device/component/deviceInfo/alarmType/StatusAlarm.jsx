/* React */
import React from "react";

/* Import */
import StatusAlarmList from "./config/statusAlarm.json";
import "./alarmType.scss";

/* MUI */
import { Box, Grid, MenuItem, List, ListItem } from '@mui/material';

/* Icon */
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

/**
 * @file: Network Status 가 변화한 이력에 대한 누적 데이터를 리스트 형식으로 공개
 * @property: {
 *     updatedStatusHistory : Network Status 변화 이력 데이터
 *     -> statusHistory 를 가공한 새로운 statusHistory Data
 *     -> status 가 변화한 이력이 없을 수도 있기 때문에 삼항연산자로 값이 있는지 조회함
 * }
 * @todo: {
 *     1) statusDesc 생성
 *         -> 데이터 수집 주기 기준 이외에도 Diagnostic 과 병합하여 Status Desc 생성 필요 있음
 *     2) StatusAlarm & StatusHistoryPie 에 같은 값이 들어가니까 따로 다른 컴포넌트에서 작업할지 || 아니면 어차피 같은 데이터 사용하니까 DeviceInfo 에서 props 로 넘겨줄지
 *         -> 후자로, EventTimeAlarm 과는 다르게 공통 부모 컴포넌트에서 작업해서 Props 로 넘겨주는 게 좋다고 생각함
 * }
 * */
const StatusAlarm = (props) => {
    const { statusHistory, ...otherProps } = props;
    //console.log(updatedStatusHistory)

    /**
     * @desc: {
     *    1) Status 가 변화하여 누적 데이터가 있을 수도
     *    1-1) 누적 데이터가 있다면 데이터 가공 (a. RUNNING->Running / b. 2024-02-22T18:05:00.101->"2024-02-22T18:05:00)
     *    2) Status 가 변하지 않아, 누적 데이터가 없을 수도
     *    2-1) 데이터가 없다고 표시
     * }
     * */
    let updatedStatusHistory = [];

    // Network Status 데이터 이력 있는 경우
    if (statusHistory && statusHistory.length > 0) {
        updatedStatusHistory = statusHistory.map(item => ({
            ...item,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
            eventDate: new Date(item.eventDate).toISOString().slice(0, 19).replace('T', ' ')
        }));
    }
    // Network Status 데이터 이력 없거나 | 렌더링 시
    // 렌더링 시 데이터가 삽입되
    else {
        console.log('조회한 기간에는 Network Status History Data 가 없습니다')
        updatedStatusHistory = '';
    }
    console.log(statusHistory)
    console.log(updatedStatusHistory)



    function StatusAlarm({alarmList}) {
        return(
            <Grid container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Grid item xs={4} className={`alarmListStatus ${alarmList.status}`}>
                    <RadioButtonUncheckedIcon />
                    {alarmList.status}
                </Grid>
                <Grid item xs={4} className="alarmListDate">
                    {alarmList.eventDate}
                </Grid>
                <Grid item xs={4} className="alarmListDesc">
                    {alarmList.desc}
                </Grid>
            </Grid>
        )
    }

    return(
        <>
            <Box className="StatusAlarm" sx={{width: 1, maxHeight: 309, overflow: 'auto'}}>
                <Grid className="StatusAlarmTop" sx={{ display: 'flex', justifyContent: 'space-between', p:0.5 }}>
                    <Grid item xs={4}>Status</Grid>
                    <Grid item xs={4}>Date</Grid>
                    <Grid item xs={4}>Description</Grid>
                </Grid><hr/>
                <List sx={{width: '100%', overflow: 'auto', bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    {(updatedStatusHistory && updatedStatusHistory.length > 0) ? (
                        updatedStatusHistory.map((alarmList) => (
                            <Box className="contained" sx={{ p: 0.5 }} key={alarmList.eventDate}>
                                <ListItem sx={{ padding: '0px', margin: '0px' }} key={alarmList.eventDate} disableGutters>
                                    <StatusAlarm alarmList={alarmList} key={alarmList.eventDate} />
                                </ListItem>
                            </Box>
                        ))
                    ) : (
                        <div>조회한 기간에는 데이터가 존재하지 않습니다.</div>
                    )}
                    {/*{updatedStatusHistory.map((alarmList) => (
                        <Box className="contained" sx={{ p: 0.5 }}>
                            <ListItem sx={{padding: '0px', margin: '0px'}} key={alarmList.eventDate} disableGutters>
                                <StatusAlarm alarmList={alarmList} key={alarmList.eventDate} />
                            </ListItem>
                        </Box>
                    ))}*/}
                </List>

            </Box>
        </>
    )
}
export default StatusAlarm;