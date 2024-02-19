/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "../diagnosticGraph.scss"


/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';


/***
 * @Author : jhlee
 * @date : 2024-02-19(월)
 * @Desc : {
 * 위성 접속률 & 단말 가동률 Douggnut Chart
 * }
 */

const WidgetRatio = (props) => {
    console.log(props);
    console.log(props.finalResultValue);

    const periodDateArray = Object.keys(props.finalResultValue);

    // 각 항목 배열 초기화
    const powerOnCountArray = [];
    const satCnrArray = [];
    const satCutOffCountArray = [];
    const satOnTimeArray = [];
    const st6100OnArray = [];

    // 각 날짜에 대해 데이터 추출하여 배열에 추가
    periodDateArray.forEach(date => {
        const entries = props.finalResultValue[date];
        /*console.log(date.length)
        console.log(entries.st6100On)



        powerOnCountArray.push(entries.powerOnCount);
        satCnrArray.push(entries.satCnr);
        satCutOffCountArray.push(entries.satCutOffCount);
        satOnTimeArray.push(entries.satOnTime);
        st6100OnArray.push(entries.st6100On);*/
    });

    const newPeriodDataArray= Object.keys(props.finalResultValue).map(key => key + ":00Z");
    /*console.log(newPeriodDataArray);

    console.log(powerOnCountArray);
    console.log(satCnrArray);
    console.log(satCutOffCountArray);
    console.log(satOnTimeArray);
    console.log(st6100OnArray);*/

    const [satOnPercentChartState, setSatOnPercentChartState] = useState({
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '24px',
                    },
                    value: {
                        fontSize: '20px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return 1;
                        },
                    },
                },
            },
        },
        legend: {
            show: true,
            position: 'top',
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            }
        },
        labels: ['위성 접속률'],
    });

    return(
        <>
            <ReactApexChart
                options={satOnPercentChartState}
                series={[100]}
                type="radialBar"
                width={'100%'}
            />
        </>
    )
}
export default WidgetRatio;