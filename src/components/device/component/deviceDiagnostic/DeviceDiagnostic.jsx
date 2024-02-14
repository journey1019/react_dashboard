/* React */
import React, { useState, useEffect } from "react";

/* Import */
import "./deviceDiagnostic.scss";
import ReturnRequest from "../../../modules/ReturnRequest";

/* MUI */
import {Grid, Box} from "@mui/material";
import SatelliteOperationRate from "./diagnostic/satelliteRate/SatelliteOperationRate";
import SatelliteMultiChart from "./diagnostic/satelliteChart/SatelliteMultiChart";
import Chart from "react-apexcharts";

/* ApexChart */
import ReactApexChart from "react-apexcharts";

const DeviceDiagnostic = (props) => {
    console.log(props)
    /* 단말기 가동률 */
    // 백분율 - 하루시간 기준
    const timeOfOnDay = '1440';
    // 위성 가동률
    const[satOnPercent, setSatOnPercent] = useState('');
    // 단말기 가동률
    const[pwrOnPercent, setPwrOnPercent] = useState('');

    //console.log(props.oneDiagnostic.data)

    /* Line Chart Options(data) */
    const [st6100OnList, setSt6100OnList] = useState([]);
    const [satOnTimeList, setSatOnTimeList] = useState([]);
    const [satSignalList, setSatSignalList] = useState([]);
    const [eventDateList, setEventDateList] = useState([]);


    // 위성 가동률
    let satOnList = [];
    // 단말기 가동률
    let pwrOnList = [];
    // 위성 신호 리스트
    let satSignList = [];
    // 날짜 리스트
    let DateList = [];


    useEffect(() => {
        // 선택된 단말기에게 Diagnostic Data 가 있는지 판별
        const oneDiagnostic = Object.keys(props.oneDiagnostic).length === 0;

        if(oneDiagnostic) {
            console.log('선택된 단말기에게 Diagnostic Data 가 없음')
        }
        else{
            props.oneDiagnostic.data.map(function(dataList){
                //console.log(dataList)

                /* Radial Chart */
                // Sat On Time 배열
                satOnList.push(dataList.satOnTime);
                // Pwr On Time 배열
                pwrOnList.push(dataList.st6100On);
                // Sat Signal 배열
                satSignList.push(dataList.satCnr);
                // 날짜 배열
                DateList.push(dataList.eventDate);

                /* Line Chart Option _ X 축 */
                // props.oneDiagnostic.data.map(x=>x.~)
                setSt6100OnList(satOnList);
                setSatOnTimeList(pwrOnList);
                setSatSignalList(satSignList);
                setEventDateList(DateList);
            })

            // SatOnTimeSum = Sat On Time 배열 요소의 합계
            let satOnListSum = satOnList.reduce((acc, currentValue) => acc+currentValue,0);
            // PwrOnTimeSum = Pwr On Time 배열 요소의 합계
            let pwrOnListSum = pwrOnList.reduce((acc, currentValue) => acc+currentValue,0);

            props.oneDiagnostic['satOnPercent'] = satOnListSum/(satOnList.length*timeOfOnDay)*100;
            props.oneDiagnostic['pwrOnPercent'] = pwrOnListSum/(pwrOnList.length*timeOfOnDay)*100;


            // 위성 가동률
            setSatOnPercent(satOnListSum/(satOnList.length*timeOfOnDay)*100);
            // 단말기 가동률
            setPwrOnPercent(pwrOnListSum/(pwrOnList.length*timeOfOnDay)*100);
        }
    }, [props.oneDiagnostic])




    // Radial Chart _ 위성 가동률
    const radialPercent = [pwrOnPercent, satOnPercent];

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
            data: st6100OnList,
        }],
        title: {
            text: '단말기 작동시간 (_ST6100On)',
            align: 'left',
            style: {
                fontSize: '25px', // Title의 글자 크기를 변경할 수 있는 부분
            },
        },
        xaxis: {
            categories: eventDateList,
        },
    }
    // satOnTime : 위성전원이 켜진채 작동하는 시간
    const satOnTimeOptions = {
        series: [{
            name: "위성연결 작동시간",
            data: satOnTimeList, 
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
            categories: eventDateList,
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
            data: satSignalList,
        },
    ];
    const averageValue = (chartSeries[0].data.reduce((sum, value) => sum + value, 0) / chartSeries[0].data.length).toFixed(2);
    //console.log(averageValue);
    // satCnr : 위성신호레벨
    const satCnrOptions = {
        series: [{
            name: "위성신호 레벨",
            data: satSignalList,
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
            categories: eventDateList,
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

    /* 가동률 - Apex Radial Chart */
    const [radialChartState, setRadialChartState] = useState({
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
        labels: ['단말기 가동률', '위성 가동률'],
    });


    return(
        <>
            <Grid className="input" container spacing={0}>

                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        Diagnostic
                    </div>
                    <hr/>
                    <div className="device_diagnostic_construct_contained" style={{width: '100%'}}>
                        <Grid item xs={12} sx={{display: 'flex'}}>
                            <Grid item md={6} sx={{p:2}}>
                                <ReactApexChart options={radialChartState} series={radialPercent} type="radialBar" />
                            </Grid>
                            <Grid item md={6}>
                                {/* 단말기 작동시간 */}
                                <Chart options={st6100OnOptions} series={st6100OnOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{display: 'flex'}}>
                            <Grid item md={6}>
                                {/* 위성신호 레벨 */}
                                <Chart options={satCnrOptions} series={satCnrOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                            </Grid>
                            <Grid item md={6}>
                                {/* 위성연결 작동시간 */}
                                <Chart options={satOnTimeOptions} series={satOnTimeOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Grid>
        </>
    )
}

export default DeviceDiagnostic;