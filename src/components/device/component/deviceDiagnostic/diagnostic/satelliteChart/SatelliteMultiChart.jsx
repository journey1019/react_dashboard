/* React */
import React, {useEffect, useState} from 'react';

/* Apex Chart */
import Chart from 'react-apexcharts';

/* MUI */
import { Grid, Box } from "@mui/material";

const SatelliteMultiChart = (props) => {
    console.log(props)


    /* ----- ApexChart _ (Line: 수치 / Bar : 횟수) ------*/
    // st6100On : 위성에 연결된 단말기가 작동한 시간
    const st6100OnOptions = {
        chart: {
            height: 'auto',
            type: 'line',
        },
        stroke: {
            curve: 'smooth',
        },
        series: [{
            name: '단말기 작동시간',
            type: 'line',
            data: props.getOneDiagnostic.map(x=>x.st6100On),
        }],
        title: {
            text: '단말기 작동시간 (_ST6100On)',
            align: 'left',
            style: {
                fontSize: '25px', // Title의 글자 크기를 변경할 수 있는 부분
            },
        },
        xaxis: {
            categories: props.getOneDiagnostic.map(x=>x.eventDate),
        },
    }
    // satOnTime : 위성전원이 켜진채 작동하는 시간
    const satOnTimeOptions = {
        series: [{
            name: "위성연결 작동시간",
            data: props.getOneDiagnostic.map(x=>x.satOnTime)
        }],
        chart: {
            height: 'auto',
            type: 'line',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: '위성연결 작동시간 (_SatOnTime)',
            align: 'left',
            style: {
                fontSize: '20px', // Set the desired font size here
            },
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: props.getOneDiagnostic.map(x=>x.eventDate),
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        }
    };

    // 위성신호 평균 구하기
    const chartSeries = [
        {
            name: 'Level Average',
            data: props.getOneDiagnostic.map(x=>x.satCnr)
        },
    ];
    const averageValue = (chartSeries[0].data.reduce((sum, value) => sum + value, 0) / chartSeries[0].data.length).toFixed(2);
    console.log(averageValue);
    // satCnr : 위성신호레벨
    const satCnrOptions = {
        series: [{
            name: "위성신호 레벨",
            data: props.getOneDiagnostic.map(x=>x.satCnr)
        }],
        chart: {
            height: 'auto',
            type: 'line',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '위성신호 레벨 (_SatCnr)',
            align: 'left',
            style: {
                fontSize: '20px', // Set the desired font size here
            },
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: props.getOneDiagnostic.map(x=>x.eventDate),
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: [
            {
                title: {
                    text: 'Value',
                },
            },
        ],
        annotations: {
            yaxis: [
                {
                    y: averageValue,
                    borderColor: '#FF4560',
                    label: {
                        borderColor: '#FF4560',
                        style: {
                            color: '#fff',
                            background: '#FF4560',
                        },
                        text: 'Average : '+averageValue.toString(), // 평균값 주석에 표시될 텍스트
                    },
                    borderWidth: 3,
                },
            ],
        },
    };
    // batChargeTime : 배터리 충전이 되는 시간
    const batChargeTimeOptions = {
        series: [{
            name: "배터리 충전시간",
            data: props.getOneDiagnostic.map(x=>x.batChargeTime)
        }],
        chart: {
            height: 'auto',
            type: 'line',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: '배터리 충전시간 (_BatChargeTime)',
            align: 'left',
            style: {
                fontSize: '20px', // Set the desired font size here
            },
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: props.getOneDiagnostic.map(x=>x.eventDate),
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        }
    };


    return (
        <>
            <Box sx={{display:'flex'}}>
                <div className="mixed-chart" style={{width: '50%', alignItems: 'center', justifyItems: 'center'}}>
                    {/* 단말기 작동시간 */}
                    <Chart options={st6100OnOptions} series={st6100OnOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                    {/* 위성신호 레벨 */}
                    <Chart options={satOnTimeOptions} series={satOnTimeOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                </div>
                <div className="mixed-chart" style={{width: '50%', alignItems: 'center', justifyItems: 'center'}}>
                    {/* 위성연결 작동시간 */}
                    <Chart options={satCnrOptions} series={satCnrOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />

                    {/* 배터리 충전 시간 _ 홍수통제소 기준 불필요 */}
                    <Chart options={batChargeTimeOptions} series={batChargeTimeOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                </div>
            </Box>
        </>
    );
};

export default SatelliteMultiChart;
