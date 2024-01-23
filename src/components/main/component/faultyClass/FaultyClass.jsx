/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import "./falutyClass.scss";
import DiagnosticPeriod2 from "../api/DiagnosticPeriod2.json";
import DiagnosticAverageMonth from "../api/DiagnosticAverageMonth.json";

/* MUI */
import { Grid, Box, Typography, TextField } from "@mui/material";

/* Icon */
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'; // 위성
import TrendingDownIcon from '@mui/icons-material/TrendingDown'; // 위성가동률
import WifiTetheringErrorIcon from '@mui/icons-material/WifiTetheringError'; // 위성신호


const FaultyClass = () => {
    //console.log(DiagnosticPeriod2);
    //console.log(DiagnosticAverageMonth);
    console.log(DiagnosticAverageMonth.response);

    // 위성신호 정상범위 설정(정의)
    const [satelliteSign, setSatelliteSign] = useState('40');

    const handleSatelliteSignChange = (e) => {
        setSatelliteSign(e.target.value);
    }

    // 위성신호 이상
    const [satelliteSignObj, setSatelliteSignObj] = useState([]);
    // 위성연결 시간


    useEffect(()=> {
        let monthList= [];

        DiagnosticAverageMonth.response.map(function(month){

            console.log(month);
            if(month.satCnrAvr < satelliteSign){

                console.log(month);

                monthList.push(month)
            }

            setSatelliteSignObj(monthList);
        })
    }, [satelliteSign])


    console.log(typeof(satelliteSignObj))
    console.log(satelliteSignObj)
    console.log(satelliteSignObj.length)


    return(
        <>
            <Grid container spacing={0} className="satellite_summary">
                <Grid item xs={6}>
                    <Box className="classification">
                        {/* 위성신호 이상 */}
                        <WifiTetheringErrorIcon className="icon" style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}/>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Satellite Signal Abnormality
                        </Typography>
                        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                            {satelliteSignObj.length}
                        </Typography>
                    </Box>

                    <Box className="classification">
                        {/* 위성 연결 시간 */}
                        <SatelliteAltIcon className="icon" style={{ color: "#8d8afd", backgroundColor: "rgb(233,232,255)" }}/>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Satellite Connection Time
                        </Typography>
                        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                            1
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box className="classification">
                        {/* 위성 가동률 */}
                        <TrendingDownIcon className="icon" style={{ color: "#7adb45", backgroundColor: "rgb(227,247,215)" }}/>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            Satellite Utilization Rate
                        </Typography>
                        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                            1
                        </Typography>
                    </Box>

                    <Box className="classification">
                        <SatelliteAltIcon className="icon" style={{ color: "#46c2e9", backgroundColor: "rgb(225,245,252)" }}/>
                        <Typography variant="h5" sx={{ color: '#B0B7C3'}}>
                            --
                        </Typography>
                        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4E5D78'}}>
                            -
                        </Typography>
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}

export default FaultyClass;