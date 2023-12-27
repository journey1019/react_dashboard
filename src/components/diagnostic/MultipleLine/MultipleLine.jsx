import Chart from 'react-apexcharts';
import React, { useEffect, useRef, useState } from 'react';
import exampleJson from "../config/example.json"; // 통계데이터x
import smartvms2date from "../config/smartvms2date.json";
import diagnosticJson from "../config/diagnostic.json"; // 01680675SKY33EC에 대해서만

import FormControl from '@mui/material/FormControl';


const MultipleLine = () => {

    console.log(exampleJson);
    const [detailData, setDetailData] = useState([])



    useEffect(() => {
        exampleJson.map(function (jsonList) {
            let detailList = [];

            console.log(jsonList);
            console.log(jsonList.data)

            jsonList.data.map(function (dataList) {
                console.log(dataList)

                detailList.push(dataList)
                console.log(detailList)
            })
            setDetailData(detailList)
        })
    }, [])

    console.log(detailData)

    console.log(smartvms2date)




    /* ---- 위성신호 Line Chart ---------- */
    const cnrOptions = {
        series: [{
            name: "위성신호 레벨",
            data: smartvms2date.map(x=>x.satCnrAvr)
        }],
        annotations: {
            yaxis: [
                {
                    y: 43.5,
                    borderColor: '#00E396',
                    stroke: {
                        show: true,
                        width: 2
                    },
                    label: {
                        borderColor: '#00E396',
                        style:{
                            color: '#fff',
                            background: '#00E396'
                        },
                        text: 'Satellite Level Average'
                    }
                }
            ]
        },
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '위성신호 레벨 변화추이',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: smartvms2date.map(x=>x.startDay),
        }
    };

    /* ---- 위성 끊김 Line Chart ------------ */
    const cutOptions = {
        series: [{
            name: "위성연결 끊김",
            data: smartvms2date.map(x=>x.satCutoffAvr)
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '위성연결 끊김 횟수',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: smartvms2date.map(x=>x.startDay),
        }
    };

    /* ---- 위성 끊김 Line Chart ------------ */
    const sendMsgOptions = {
        series: [{
            name: "메세지 전송",
            data: smartvms2date.map(x=>x.sendDataAvr)
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '데이터 전송 평균',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: smartvms2date.map(x=>x.startDay),
        }
    };
    /* ---- 배터리 충전률 Line Chart ------------ */
    const batChargeOptions = {
        series: [{
            name: "배터리 충전률",
            data: smartvms2date.map(x=>x.batChargeAvr)
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '배터리 충전률 평균',
            align: 'left',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: smartvms2date.map(x=>x.startDay),
        }
    };

    return(
        <>
            <FormControl className="line-chart" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: 1}} >
                <Chart options={cnrOptions} series={cnrOptions.series} type="line" width={600} />
                <Chart options={cutOptions} series={cutOptions.series} type="line" width={600} />
            </FormControl>

            <FormControl className="line-chart" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: 1}} >
                <Chart options={sendMsgOptions} series={sendMsgOptions.series} type="line" width={600} />
                <Chart options={batChargeOptions} series={batChargeOptions.series} type="line" width={600} />
            </FormControl>

            {/*<div className="line-chart" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: 'auto'}}>
                <Chart options={cnrOptions} series={cnrOptions.series} type="line" width={700} />
                <Chart options={cutOptions} series={cutOptions.series} type="line" width={700} />
            </div>
            <div className="line-chart" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: 'auto'}}>
                <Chart options={cnrOptions} series={cnrOptions.series} type="line" width={700} />
                <Chart options={cutOptions} series={cutOptions.series} type="line" width={700} />
            </div>*/}
        </>
    )
}

export default MultipleLine;