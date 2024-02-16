/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./deviceInfo.scss";
import DeviceAlarm from "../deviceAlarm/DeviceAlarm";

/* Module */
import UseDidMountEffect from "../../../modules/UseDidMountEffect";

/* MUI */
import {Grid, Typography, Box, Tooltip, Avatar, Stack, Alert, AlertTitle} from "@mui/material";

/***
 * @Author : jhlee
 * @date : 2024-02-14
 * @Desc : {
 *  Device 의 기본정보를 보여주는 DeviceInfo Component
 *  Device Component 의 자식 Component
 *  사용자가 입력한 단말과 Session 에 저장된 단말을 매칭시켜 보여줌
 * }
 */
// Device.jsx 의 자식 컴포넌트
// InputDeviceId & SessionNmsCurrent 상속받아서 단말기 기본정보 Show
const DeviceInfo = (props) => {
    console.log(props);
    // Table Action Select || Input Option Select
    //console.log(props.inputDeviceId);
    // Session 에 저장된 nmsCurrent
    //console.log(props.sessionNmsCurrent);


    // 첫 번째 글자를 대문자로 변환하는 함수
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 초를 시:분:초 로 변환하는 함수
    function timeType(seconds) {
        let hour = parseInt(seconds/3600);
        let min = parseInt((seconds%3600)/60);
        let sec = seconds%60;
        return hour +'시 '+ min +'분 '+ sec +'초 ';
    }


    /* 선택한 단말기의 기본정보 */
    // 소속 CrpNm, VhcleNm
    const [infoCrpNm, setInfoCrpNm] = useState('');
    const [infoVhcleNm, setInfoVhcleNm] = useState('');
    // 아바타 Title
    const [infoAvatar, setInfoAvatar] = useState('');

    // 상태 Status
    const [infoStatus, setInfoStatus] = useState('');
    // 상태 Status Desc
    const [infoStatusDesc, setInfoStatusDesc] = useState('');
    // 데이터 수집 시간 차이 Diff
    const [infoParseDiff, setInfoParseDiff]= useState();
    // 데이터 수집 시간 평균 maxPeriod
    const [infoMaxPeriod, setInfoMaxPeriod] = useState();


    // props.inputDeviceId 가 맨 처음 렌더링 될 때 값이 없고, 두 번째 부터 값이 있음
    UseDidMountEffect(()=>{
        // inputDeviceId 와 deviceId 를 매칭시켜 SessionNmsCurrent 가져옴
        const matching = props.sessionNmsCurrent.filter(it=>it.deviceId.includes(props.inputDeviceId))
        //console.log(matching); // 선택한 단말기 Obj = [{...}]

        /* inputDeviceId 값을 기준으로 나머지 정보 기입 */
        // 선택한 단말기의 nmsCurrent 에서 crpNm
        setInfoCrpNm((matching.map((key) => key.crpNm).toString()));
        // 선택한 단말기의 nmsCurrent 에서 vhcleNm
        setInfoVhcleNm((matching.map((key) => key.vhcleNm).toString()));
        // 선택한 단말기의 nmsCurrent 에서 crpNm 의 첫 번째 글자
        setInfoAvatar((matching.map((key) => key.crpNm).toString()).slice(0,1));

        // 선택한 단말기의 nmsCurrent 에서 Status
        setInfoStatus(capitalize(matching.map((key) => key.status).toString()));
        // 선택한 단말기의 nmsCurrent 에서 Status Desc
        setInfoStatusDesc((matching.map((key) => key.statusDesc).toString()));
        // 선택한 단말기의 nmsCurrent 에서 Parse Diff (00시 00분 00초)
        let parseDiff = timeType(matching.map((key) => key.parseDiff).toString());
        setInfoParseDiff(timeType(matching.map((key) => key.parseDiff).toString()));
        // 선택한 단말기의 nmsCurrent 에서 Max Period
        setInfoMaxPeriod(timeType(matching.map((key) => key.maxPeriod).toString()));


        //console.log(timeType(matching.map((key) => key.parseDiff).toString()))

        // 문자열 0으로 시작하는 자리
        /*if(infoParseDiff.contains("0") == true){
            console.log('0 이 있어')
            infoParseDiff.startsWith('0')
            infoParseDiff.substr() // (문자열 0으로 시작하는 자리, 2)

            let seat = infoParseDiff.indexOf('0')
            console.log(seat)
        }
        else{
            console.log('0이 없음')
        }*/






        /*console.log(matching) // 선택한 단말기에 대한 Current Data
        console.log(matching.map((key) => key.crpNm))
        console.log((matching.map((key) => key.crpNm).toString()))

        console.log((matching.map((key) => key.vhcleNm).toString()))
        console.log(matching.map((key) => key.vhcleNm))
        console.log(typeof(matching.map((key) => key.vhcleNm)))*/
    },[props.inputDeviceId]);


    console.log('DeviceInfo 보여줌~~~~~~~&~&&&&&&&&&')

    return(
        <>
            <Grid className="input" container spacing={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', padding: '30px 30px 10px 30px', width: 1 }}>
                    <Tooltip title="Account settings" sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Avatar sx={{ width: 100, height: 100, fontSize: '30px', color: '#394251', backgroundColor: '#FAFBFC', fontWeight: 'bold', borderStyle: 'solid', borderColor: '#F3F3F3', borderWidth: '5px'}}>{infoAvatar}</Avatar>

                        {/*<Paper sx={{ display: 'flex', justifyItems: 'center', flexWrap: 'wrap', listStyles: 'none', p: 0.5, m: 0 }} component="ul">
                                        {chipData.map((data) => {
                                            let icon;

                                            if (data.label === 'React') {
                                                icon = <TagFacesIcon />;
                                            }

                                            return (
                                                <ListItem key={data.key}>
                                                    <Chip
                                                        icon={icon}
                                                        label={data.label}
                                                        onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </Paper>*/}
                    </Tooltip>
                </Box>

                <Box sx={{display: 'block', w: 1, p: 2}}>
                    <div className="deviceIdTitle">
                        {props.inputDeviceId}
                    </div>
                    <div className="deviceIdSubTitle">
                        {infoCrpNm} _ {infoVhcleNm}
                    </div>
                </Box>

                <Box sx={{display: 'flex', width: 1}}>
                    <Box className="basicInfo">
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                등록일자(설치일자)
                            </div><hr/>
                            <div className="descriptionContain">
                                2021-09-01 13:04
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                상태
                            </div><hr/>
                            <div className={`infoStatus ${infoStatus}`} >
                                {infoStatus}
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                상태 설명
                            </div><hr/>
                            <div className="descriptionContain" >
                                {infoStatusDesc}
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                위성신호레벨 / 평균신호레벨
                            </div><hr/>
                            <div className="descriptionContain">
                                43.6 / 43.8
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                마지막 데이터 수집 주기 / 평균 데이터 수집 주기
                            </div><hr/>
                            <div className="descriptionContain">
                                <span style={{fontSize: '15px', color:'crimson'}}>{infoParseDiff} </span> / {infoMaxPeriod}
                            </div>
                        </Box>
                    </Box>
                </Box><br/>

                <Box sx={{display: 'flex', width: 1, maxHeight: '400px'}}>
                    <DeviceAlarm />
                </Box>
            </Grid>
        </>
    )
}

export default DeviceInfo;