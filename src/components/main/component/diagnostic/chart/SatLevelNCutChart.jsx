/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';

/***
 * @Author : jhlee
 * @date : 2024-02-13
 * @Desc : {
 * Main(Com) _ Diagnostic(Com) _ DiagnosticChart(Com)
 * Diagnostic 에서 가공한 데이터 props 로 전달받음
 * 전달받은 데이터로 값만 대입하여 chart 제작
 * }
 */
const SatLevelNCutChart = (props) => {
    console.log(props)
    console.log(props.finalResultValue)

    /* Chart 구성요소 */
    // 전체 기간 데이터 배열
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

        powerOnCountArray.push(entries.powerOnCount);
        satCnrArray.push(entries.satCnr);
        satCutOffCountArray.push(entries.satCutOffCount);
        satOnTimeArray.push(entries.satOnTime);
        st6100OnArray.push(entries.st6100On);
    });

    // 각 항목의 배열
    console.log(periodDateArray);
    console.log(powerOnCountArray);
    console.log(satCnrArray);
    console.log(satCutOffCountArray);
    console.log(satOnTimeArray);
    console.log(st6100OnArray);



    const [chartData, setChartData] = useState({
        series: [
            {
                name: '위성신호레벨/잡음비',
                type: 'line',
                data: satCnrArray,
                color: '#DC143C',
            },
            {
                name: '위성끊김횟수',
                type: 'column',
                data: satCutOffCountArray,
                color: '#E89EFB',
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: true,
                    offsetY: -25,
                    offsetX: -5,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
            },
            markers: {
                size: 1
            },
            title: {
                text: '',
                align: 'left'
            },
            xaxis: {
                type: 'datetime',
                categories: periodDateArray,
                title: {
                    text: '일',
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: 0,
                offsetX: 0,
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm',
                },
                y:
                    [
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (dB)"
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (개)"
                                }
                            }
                        },
                    ]
            },
        },
    });

    return (
        <>
            <ReactApexChart options={chartData.options} series={chartData.series} height={350} />
        </>
    );
}

export default SatLevelNCutChart;