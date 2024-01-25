/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import "./falutyClass.scss";
import DiagnosticPeriod2 from "../api/DiagnosticPeriod2.json";
import DiagnosticAverageMonth from "../api/DiagnosticAverageMonth.json";

/* Module */
import NumberSelector from "../../../modules/NumberSelector";

/* MUI */
import {Button, Popover, IconButton, Grid, Box, Typography, TextField, InputLabel, Select, MenuItem, FormControl} from "@mui/material";

/* Icon */
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'; // 위성
import { TbSatelliteOff } from "react-icons/tb";
import WifiTetheringErrorIcon from '@mui/icons-material/WifiTetheringError'; // 위성신호
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PowerOffIcon from '@mui/icons-material/PowerOff'; // Power Off

const FaultyClass = () => {
    console.log(DiagnosticPeriod2);
    //console.log(DiagnosticAverageMonth);
    console.log(DiagnosticAverageMonth.response);

    // 위성신호 기준 사용자설정
    const [satSignSetting, setSatSignSetting] = useState(42);
    // 위성연결시간 기준 사용자설정
    const [satOnTimeSetting, setSatOnTimeSetting] = useState(90);
    // 단말기연결시간 기준 사용자설정
    const [pwrOnTimeSetting, setPwrOnTimeSetting] = useState(89);

    const handleNumberSelect = (selectedNumber) => {
        console.log('Selected Number:', selectedNumber);
        // 여기에서 선택된 숫자로 다른 로직 수행
    };

    const handleSatelliteSignChange = (selectedNumber) => {
        setSatSignSetting(selectedNumber);
    }
    const handleSatOnTimeChange = (selectedNumber) => {
        setSatOnTimeSetting(selectedNumber);
    }
    const handlePwrOnTimeChange = (selectedNumber) => {
        setPwrOnTimeSetting(selectedNumber);
    }

    const options = [
        'Device 1',
        'Device 2',
        'Device 3',
        'Device 4',
        'Device 5',
        'Device 6',
        'Device 7',
        'Device 8',
        'Device 9',
        'Device 10',
        'Device 11',
    ];
    const [selectOption, setSelectOption] = useState(null);
    const handleSelectClick = (event) => {
        setSelectOption(event.currentTarget);
    }
    const handleSelectClose = () => {
        setSelectOption(null);
    }




    // 위성가동률 기준 사용자설정
    const [satelliteUtilizationRate, setSatelliteUtilizationRate] = useState('0%');
    // 단말기가동률 기준 사용자설정



    // 위성신호 이상
    const [satSignObj, setSatSignObj] = useState([]);
    // 위성연결 시간
    const [satOnTimeObj, setSatOnTimeObj] = useState([]);
    // 단말기연결 시간
    const [pwrOnTimeObj, setPwrOnTimeObj] = useState([]);


    /*// device_id 값을 기준으로 objects를 그룹화함
    const groupedDevice = DiagnosticPeriod2.reduce((accumulator, currentValue) => {
        const { device_id } = currentValue;

        // device_id를 키로 하는 구룹이 존재하지 않으면 새로운 그룹을 생성
        if(!accumulator[device_id]) {
            accumulator[device_id] = [];
        }

        // 현재 아이템을 해당 device_id의 그룹에 추가
        accumulator[device_id].push(currentValue);

        return accumulator;
    }, {})
    console.log(groupedDevice);

    // 모든 device의 배열을 얻기
    const allDevices = Object.keys(groupedDevice).flat();

    // 결과 확인을 위해 콘솔에 출력
    console.log(allDevices);*/


    /*useEffect(() => {
        groupedDevice.map(function(month){
            console.log(month);
        })
    }, [satSignSetting])*/

    useEffect(()=> {
        let satCnrDisorder = [];
        let satOnDisorder = [];
        let pwrOnDisorder = [];
        DiagnosticAverageMonth.response.map(function(month){
            console.log(month);




            if(month.pwrOnPercent < 0) {

            }


            console.log(satSignSetting, satOnTimeSetting, pwrOnTimeSetting)
            // (SatCnr) 사용자가 설정한 값보다 작은 경우 장애로 구분하도록 함
            if(month.satCnrAvr < satSignSetting){
                satCnrDisorder.push(month)
            }
            // (SatOnTime) 사용자가 설정한 값보다 작은 경우 장애로 구분하도록 함
            if(month.satOnPercent < satOnTimeSetting){
                satOnDisorder.push(month);
            }
            // (PwrOnTime) 사용자가 설정한 값보다 작은 경우 장애로 구분
            if(month.pwrOnPercent < pwrOnTimeSetting) {
                pwrOnDisorder.push(month);
            }

            setSatSignObj(satCnrDisorder);
            setSatOnTimeObj(satOnDisorder);
            setPwrOnTimeObj(pwrOnDisorder);
        })
    }, [satSignSetting, satOnTimeSetting, pwrOnTimeSetting])


    console.log(typeof(satSignObj))
    console.log(satSignObj)
    console.log(satSignObj.length)
    console.log(satOnTimeObj);
    console.log(setPwrOnTimeObj);




    return(
        <>
            <Grid container spacing={0} className="satellite_summary">
                <Grid item xs={6}>
                    <Box className="classification">
                        {/* 위성신호 이상 _ SatCnrAvr */}
                        <Box className="icons">
                            <WifiTetheringErrorIcon className="icon" style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}/>
                            <NumberSelector initialSelectedValue={satSignSetting} onSelect={handleSatelliteSignChange} />
                        </Box>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Satellite Signal Abnormality
                        </Typography>
                        <Grid item xs={12}>
                            <Button fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign : 'center'}}>
                                <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                                    {satSignObj.length}
                                </Typography>
                            </Button>
                        </Grid>
                    </Box>

                    <Box className="classification">
                        {/* 위성 연결 시간 */}
                        <Box className="icons">
                            <SatelliteAltIcon className="icon" style={{ color: "#8d8afd", backgroundColor: "rgb(233,232,255)" }}/>
                            <NumberSelector initialSelectedValue={100} onSelect={handleNumberSelect} />
                        </Box>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Satellite Connection Time
                        </Typography>
                        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                            ---
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box className="classification">
                        {/* 위성 가동률 _ satOnPercent */}
                        <Box className="icons">
                            <TbSatelliteOff className="icon" style={{ color: "#7adb45", backgroundColor: "rgb(227,247,215)" }}/>
                            <Box sx={{display: 'flex'}}>
                                <NumberSelector initialSelectedValue={satOnTimeSetting} onSelect={handleSatOnTimeChange} />
                                <span style={{ display: 'flex', color:'#CC0000', alignItems: 'center', textAlign: 'center', justifyContent : 'center' }}>%</span>
                            </Box>
                        </Box>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Satellite Utilization Rate
                        </Typography>
                        <Grid item xs={12}>
                            <Button fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign : 'center'}}>
                                <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                                    {satOnTimeObj.length}
                                </Typography>
                            </Button>
                        </Grid>
                    </Box>

                    <Box className="classification">
                        {/* 단말기 전원 가동률 _ pwrOnPercent */}
                        <Box className="icons">
                            <PowerOffIcon className="icon" style={{ color: "#46c2e9", backgroundColor: "rgb(225,245,252)" }}/>
                            <Box sx={{display: 'flex'}}>
                                <NumberSelector initialSelectedValue={pwrOnTimeSetting} onSelect={handlePwrOnTimeChange} />
                                <span style={{ display: 'flex', color:'#CC0000', alignItems: 'center', textAlign: 'center', justifyContent : 'center' }}>%</span>
                            </Box>
                        </Box>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Device Operating Time
                        </Typography>
                        <Grid item xs={12}>
                            <Button fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign : 'center'}}>
                                <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                                    {pwrOnTimeObj.length}
                                </Typography>
                            </Button>
                        </Grid>
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}

export default FaultyClass;