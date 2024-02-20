/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import AnimatedGaugeChart from "./AnimatedGaugeChart";

/* MUI */
import {Box} from '@mui/material';

/***
 * @Author : jhlee
 * @date : 2024-02-19(월)
 * @Desc : {
 * 위성 접속률 & 단말 가동률 Douggnut Chart
 * }
 */


const WidgetRatio = (props) => {
    console.log(props)
    // 위성 접속률
    console.log(props.averageSatOnTime)
    // 단말 가동률
    console.log(props.averageSt6100On)

    return (
        <Box sx={{ w: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <AnimatedGaugeChart label="위성 접속률" targetValue={props.averageSatOnTime} pathColor="#DC143C" trailColor="#FFD1DA" backgroundColor="#FFD1DA" />
            <AnimatedGaugeChart label="단말 가동률" targetValue={props.averageSt6100On} pathColor="#54627B" trailColor="#98B7D6" backgroundColor="#98B7D6" />
        </Box>
    );
}
export default WidgetRatio;