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
    console.log(DiagnosticAverageMonth.response);

    /* 장애라고 판단되는 기준치 설정 */
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

    const handleSatSignChange = (selectedNumber) => {
        setSatSignSetting(selectedNumber);
    }
    const handleSatOnTimeChange = (selectedNumber) => {
        setSatOnTimeSetting(selectedNumber);
    }
    const handlePwrOnTimeChange = (selectedNumber) => {
        setPwrOnTimeSetting(selectedNumber);
    }

    /* 기준치 보다 낮은 장애 단말 리스트 */
    // 위성신호 이상
    const [satSignObj, setSatSignObj] = useState([]);
    // 위성연결 시간
    const [satOnTimeObj, setSatOnTimeObj] = useState([]);
    // 단말기연결 시간
    const [pwrOnTimeObj, setPwrOnTimeObj] = useState([]);


    useEffect(()=> {
        let satCnrDisorder = [];
        let satOnDisorder = [];
        let pwrOnDisorder = [];

        DiagnosticAverageMonth.response.map(function(month){
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

    const ClassificationBox = ({ icon, setting, onSelect, bgColor, title, count }) => (
        <Box className="classification">
            <Box className="icons">
                {icon}
                <NumberSelector initialSelectedValue={setting} onSelect={onSelect} />
            </Box>
            <Typography variant="h5" sx={{ color: '#B0B7C3' }}>
                {title}
            </Typography>
            <Grid item xs={12}>
                <Button fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78' }}>
                        {count}
                    </Typography>
                </Button>
            </Grid>
        </Box>
    );

    return(
        <>
            <Grid container spacing={0} className="satellite_summary">
                <Grid item xs={3}>
                    {/* 위성신호 이상 _ SatCnrAvr */}
                    <ClassificationBox icon={<WifiTetheringErrorIcon className="icon" style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}/>}
                                       title="Satellite Signal Abnormality"
                                       count={satSignObj.length}
                                       setting={satSignSetting}
                                       onSelect={handleSatSignChange} />
                </Grid>
                <Grid item xs={3}>
                    {/* 위성 연결 시간  */}
                    <ClassificationBox icon={<SatelliteAltIcon className="icon" style={{ color: "#8d8afd", backgroundColor: "rgb(233,232,255)" }}/>}
                                       title="Satellite Connection Time"
                                       count="---"
                                       setting={100}
                                       onSelect={handleNumberSelect} />
                </Grid>
                <Grid item xs={3}>
                    {/* 위성 가동률 _ satOnPercent */}
                    <ClassificationBox icon={<TbSatelliteOff className="icon" style={{ color: "#7adb45", backgroundColor: "rgb(227,247,215)" }}/>}
                                       title="Satellite Utilization Rate"
                                       count={satOnTimeObj.length}
                                       onSelect={handleSatOnTimeChange}
                                       setting={satOnTimeSetting}/>
                </Grid>
                <Grid item xs={3}>
                    {/* 단말기 전원 가동률 _ pwrOnPercent */}
                    <ClassificationBox icon={<PowerOffIcon className="icon" style={{ color: "#46c2e9", backgroundColor: "rgb(225,245,252)" }}/>}
                                       title="Satellite Connection Time"
                                       count={pwrOnTimeObj.length}
                                       onSelect={handlePwrOnTimeChange}
                                       setting={pwrOnTimeSetting}/>
                </Grid>
            </Grid>
        </>
    )
}

export default FaultyClass;