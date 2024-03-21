/* React */
import React, { useState, useEffect } from 'react';

/* CSS */
import "./eventTimeAlarm.scss";

/* MUI */
import { Box, MenuItem } from '@mui/material';
/* List */
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

/**
 * @date: 2024-03-04
 * @file: 한 단말에 해당하는 Event Alarm 이력 공개
 * @desc: {
 *
 * }
 * @todo: {
 *     1) CSS - 글자 크기 조절 (O)
 *     2) CSS - EventTimeAlarm(fx) 에서 className: right 는 오른쪽정렬
 *     3) Input(param) 입력안했을 시, 안보이도록 [현재->모든 EventDate 출력됨]
 *     -> Input(startDate & endDate) 필수라 deviceId 없어도 됨
 * }
 * */

const EventTimeAlarm = (props) => {
    const { eventHistoryAlarm } = props;

    // eventHistoryAlarm 데이터 가공하여 새로운 객체 생성
    const updatedEventHistoryAlarm = {};

    //console.log(eventHistoryAlarm)
    // eventHistoryAlarm 객체가 비어있는지 확인
    if (Object.keys(eventHistoryAlarm).length > 0) {
        // 비어있지 않다면 기존 데이터를 복사
        Object.assign(updatedEventHistoryAlarm, eventHistoryAlarm);

        updatedEventHistoryAlarm.alarmList.forEach(list => {

            if(list.occurCheck == true) {
                list["occur"] = "발생";
            } else {
                list["occur"] = "복구";
            }
        });
    }
    else { // 비어있다면 {alarmCount: 0} 추가
        updatedEventHistoryAlarm.alarmCount = 0;
    }

    function EventTimeAlarm({alarmList}) {
        return(
            <div className="eventTimeAlarm_List">
                <div className="eventTimeAlarm_left">
                    <span className="eventTimeAlarm_LogIndex">{alarmList.alarmLogIndex}</span>
                    <span className="eventTimeAlarm_AlarmType">{alarmList.alarmType}</span>
                    <span className="eventTimeAlarm_AlarmName">{alarmList.alarmName}</span>
                </div>
                <div className="eventTimeAlarm_left">
                    {/*<span className="notiType" style = {{color: colorReturn(type)}}>{alarmList.notiType}</span>*/}
                    <span className="eventTimeAlarm_NotiType">{alarmList.notiType} | <span className="eventTimeAlarm_OccurCheck"> {alarmList.occur}</span></span> {/*Warning*/}
                    <span className="eventTimeAlarm_DeviceId">{alarmList.deviceId}</span>
                    {/*<span className="occurCheck">{alarmList.occurCheck}</span>*/} {/*true/false*/}
                    <span className="eventTimeAlarm_OccurDate">{alarmList.occurDate}</span> {/*알림발생 시간*/}
                </div>
            </div>
        )
    }

    return(
        <>
            <Box className="historyTimeLine" sx={{ width: 1 }}>
                {updatedEventHistoryAlarm.alarmList ? (
                    <List
                        sx={{
                            pt: 0,
                            width: "100%",
                            maxWidth: 700,
                            maxHeight: 309,
                            overflow: 'auto',
                            bgColor: 'background.paper'
                        }}
                        component="nav" aria-label="mailbox folders" className="listContainer"
                    >
                        {updatedEventHistoryAlarm.alarmList.map((alarmList, index) => (
                            <React.Fragment key={index}>
                                <Box className="eventTimeListBox" sx={{ p: 1 }}>
                                    <ListItem sx={{ padding: '0px', margin: '0px' }} key={index} disableGutters>
                                        <EventTimeAlarm alarmList={alarmList} key={alarmList.alarmLogIndex} />
                                    </ListItem>
                                    <hr />
                                </Box>
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <p>조회한 데이터가 없습니다.</p>
                )}
            </Box>
        </>
    )
}

export default EventTimeAlarm;