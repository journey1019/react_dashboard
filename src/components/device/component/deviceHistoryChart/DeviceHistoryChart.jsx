/* React */
import React, { useState, useEffect, useMemo } from "react";
/* MUI */
import {Grid, Box, Button} from "@mui/material";

/* ApexChart */
import Chart from "react-apexcharts";
import HistorySnapShotVhc from "../deviceHistory/api/NmsHistorySnapShotVhc.json";

/* ChartJS */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/* Import */
//import useDidMountEffect from "../../../modules/UseDidMountEffect";



const DeviceHistoryChart = (props) => {
    console.log(HistorySnapShotVhc)

    console.log(props.nmsOneHistory)

    const [mainKey, setMainKey] = useState([]);
    const [subKey, setSubKey] = useState([]);
    const [batteryStatus, setBatteryStatus] = useState([]);
    const [geofence, setGeofence] = useState([]);
    const [powerVoltage, setPowerVoltage] = useState([]);
    const [satInView, setSatInView] = useState([]);
    const [receivedDate, setReceivedDate] = useState([]);

    /*useDidMountEffect(() => {
        console.log('didMounteffect')
        console.log(props.nmsOneHistory)
    }, [props.nmsOneHistory])

    useEffect(() => {
        countexample += 1;
        console.log('useEffect :' + countexample)
        console.log(props.nmsOneHistory)
    }, [props.nmsOneHistory])*/

    useEffect(() => {
        console.log(typeof(props.nmsOneHistory))
        console.log(props.nmsOneHistory.length)

        if(typeof(props.nmsOneHistory) != 'undefined' && props.nmsOneHistory.length > 0){

            // LIST
            let mainKeyList = [];
            let subKeyList = [];
            let batteryStatusList = [];
            let geofenceList = [];
            let powerVoltageList = [];
            let satInViewList = [];
            let receivedDateList = [];

            props.nmsOneHistory.map(function(list){
                console.log(list)



                mainKeyList.push(list.main_key);
                subKeyList.push(list.sub_key);
                
                /*geofenceList.push(list.io_json.geofence);
                powerVoltageList.push(list.io_json.powerVoltage);
                satInViewList.push(list.io_json.satInView);
                receivedDateList.push(list.received_date);*/

                console.log(batteryStatusList);

                setMainKey(mainKeyList);
                setSubKey(subKeyList);
                setBatteryStatus(batteryStatusList);
            })
            //setBatteryStatus(batteryStatusList)
            /*setGeofence(geofenceList)
            setPowerVoltage(powerVoltageList);
            setSatInView(satInViewList);
            setReceivedDate(receivedDateList);*/

        }
        else{
            console.log('응답없음')
        }
    }, [props.nmsOneHistory])
    console.log(batteryStatus)
    console.log(mainKey);
    console.log(batteryStatus)




    /*const options = {
        chart: {
            height: 'auto',
            type: 'line',
        },
        stroke: {
            curve: 'smooth',
        },
        series: [
            {
                name: 'Main Key',
                type: 'line',
                data: mainKey,
            },
            {
                name: 'Sub Key',
                type: 'line',
                data: subKey,
            },
            {
                name: 'Battery Status',
                type: 'line',
                data: batteryStatus,
            },
            {
                name: 'Geofence',
                type: 'line',
                data: geofence,
            },
            {
                name: 'Power Voltage',
                type: 'line',
                data: powerVoltage,
            },
            {
                name: 'Sat In View',
                type: 'line',
                data: satInView,
            },

        ],
        xaxis: {
            categories: receivedDate,
        },
    };*/
    const options = {
        chart: {
            height: 'auto',
            type: 'line',
        },
        stroke: {
            curve: 'smooth',
        },
        series: [
            {
                name: 'Main Key',
                type: 'line',
                data: HistorySnapShotVhc.map(x=>x.main_key),
            },
            {
                name: 'Sub Key',
                type: 'line',
                data: HistorySnapShotVhc.map(x=>x.sub_key),
            },
            /*{
                name: 'Battery Status',
                type: 'line',
                data: HistorySnapShotVhc.io_json.map(x=>x.batteryStatus),
            },
            {
                name: 'Geofence',
                type: 'line',
                data: HistorySnapShotVhc.io_json.map(x=>x.geofence),
            },
            {
                name: 'Power Voltage',
                type: 'line',
                data: HistorySnapShotVhc.io_json.map(x=>x.powerVoltage),
            },
            {
                name: 'Sat In View',
                type: 'line',
                data: HistorySnapShotVhc.io_json.map(x=>x.satInView),
            },*/

        ],
        xaxis: {
            categories: HistorySnapShotVhc.map(x=>x.received_date),
        },
    };


    const labels = HistorySnapShotVhc.map(x => x.received_date);
    const dataLine = {
        labels,
        datasets: [
            {
                label: 'Main Key',
                data: HistorySnapShotVhc.map(x=>x.main_key),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                filler: true,
                yAxisID: 'y',
                pointStyle: 'circle',
                pointRadius: 1, // 기본 Point 반지름
                pointHoverRadius: 10, // Point 선택 시 반지금
                borderWidth: 1, // 기본 선 두께
            },
            {
                label: 'Sub Key',
                data: HistorySnapShotVhc.map(x=>x.sub_key),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                filler: true,
                yAxisID: 'y',
                pointStyle: 'triangle',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
        ]
    }
    const dataLineOptions = {
        responsive: true,
        interactions: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Line Chart based on History Data',
                font: {
                    size: 15
                }
            },
            tooltip: {
                enable: true,
                mode: 'index',
                position: 'nearest',
                intersect: false,
                usePointStyle: true,
            },
            legend: {
                labels: {
                    usePointStyle : true, // Legend_PointStyle
                }
            }
        },
        scales: {
            y:{
                type: 'linear',
                display: true,
                position: 'left',
                gridLines: {
                    color: 'rgba(166, 201, 226, 1)',
                    lineWidth: 1
                },
                ticks: {
                    stepSize:5,
                }
            },
            /*y1: {
                type: 'linear',
                display: false,
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },*/
        },
    }



    return(
        <>
            <Grid className="input" container spacing={0} sx={{height: '95%'}}>

                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        History Chart
                    </div>
                    <hr/>
                    <div className="device_diagnostic_construct_contained" style={{width: '100%', height: '95%', alignItems : 'center', textAlign : 'center', justifyContent : 'center'}}>
                        {/* ApexChart*/}
                        {/*<Chart options={options} series={options.series} type="line" style={{width: '80%', alignItems: 'center', justifyItems: 'center'}} />*/}
                        {/* ChartJs*/}
                        <Line data={dataLine} options={dataLineOptions} />
                    </div>
                </Box>
            </Grid>
        </>
    )
}

export default DeviceHistoryChart;