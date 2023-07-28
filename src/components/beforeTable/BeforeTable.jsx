import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";

import './beforeTable.scss';
import {Box, Button, darken} from '@mui/material';
import MaterialReactTable from "material-react-table";

//import { Line } from 'react-chartjs-2';
import faker from 'faker';

import Container from '@mui/material/Container';

/*import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';*/


import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";

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

const BeforeTable = (props) => {

    /* ----------------- nmsCurrent _ diffStatus -----------------*/

    const [getCurrentSnapshot, setGetCurrentSnapshot] = useState([]);

    const [dateIndex, setDateIndex] = useState('2023072523');

    /* ----------------- getCurrentSnapshot _ befoDeviceStatus -----------------*/
    // Past Status Device Info
    const [befoDeviceStatus, setBefoDeviceStatus] = useState ({
        pastDate:'',
        pastRunningDv: [],
        pastCautionDv: [],
        pastWarningDv: [],
        pastFaultyDv: [],
    });

    // Present Status Device Info
    const [deviceStatus, setDeviceStatus] = useState({
        date:'',
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    });
    /* ----------------- getCurrentSnapshot _ befoDiffStatus -----------------*/
    useEffect(()=>{
        const data = returnGetData().then(
            result =>{
                if(result != null){
                    let befoDeviceNmsList = [];

                    /*----------------- befoDeviceStatus ----------------*/
                    let pastDvStatusObj = {};

                    let pastDate = new Date('2023-07-27T23:59:59').toLocaleString();

                    let pastRunningDv = [];                      
                    let pastCautionDv = [];
                    let pastWarningDv = []; 
                    let pastFaultyDv = [];

                    result.map(function(manageCrp){

                        manageCrp['nmsInfoList'].map(function(crp) {

                            crp["nmsDeviceList"].map(function(device) {

                                device["crpId"] = crp.crpId;
                                device["crpNm"] = crp.crpNm;
                                device["manageCrpId"] = manageCrp.manageCrpId;
                                device["manageCrpNm"] = manageCrp.manageCrpNm;

                                let runningMin = device.maxPeriod;
                                let cautionMin = runningMin * 1.5;
                                let warningMin = runningMin * 3.0;
                                let faultyMin = runningMin * 5.0;

                                if(faultyMin > 0 && device.parseDiff > faultyMin) {
                                    device["status"] = 'faulty';
                                } else if(warningMin > 0 && device.parseDiff > warningMin) {
                                    device["status"] = 'warning';
                                } else if(cautionMin > 0 && device.parseDiff > cautionMin) {
                                    device["status"] = 'caution';
                                } else{
                                    device["status"] = 'running';
                                }

                                /*----------- pastDeviceStatus -----------*/
                                if(device.status == 'faulty'){
                                    pastFaultyDv.push(device);
                                } else if(device.status == 'warning'){
                                    pastWarningDv.push(device);
                                } else if(device.status == 'caution'){
                                    pastCautionDv.push(device);
                                } else{
                                    pastRunningDv.push(device);
                                }
                                console.log(device.status)


                                befoDeviceNmsList.push(device);
                            })
                        })
                    });
                    setGetCurrentSnapshot(befoDeviceNmsList);

                    /*----- Status Count -----*/
                    pastDvStatusObj.pastDate = pastDate;

                    pastDvStatusObj.pastRunningDv = pastRunningDv;
                    pastDvStatusObj.pastCautionDv = pastCautionDv;
                    pastDvStatusObj.pastWarningDv = pastWarningDv;
                    pastDvStatusObj.pastFaultyDv = pastFaultyDv;

                    setBefoDeviceStatus(pastDvStatusObj);
                    console.log(befoDeviceStatus)
                }
                else{
                }
            });
        return () => {
            clearTimeout(getCurrentSnapshot);
        }
    }, [dateIndex, deviceStatus])

    console.log(props.deviceStatus)
    useEffect(() => {
    }, [getCurrentSnapshot, befoDeviceStatus]);

    useEffect(() => {
        props.BefoWidgetCount(befoDeviceStatus)
    }, [befoDeviceStatus])

    console.log(befoDeviceStatus)



    /* ---------------------------------- Main Function ----------------------------------*/

    async function returnGetData() {
        if((dateIndex == null || dateIndex == "")){
            return null
        }
        else{
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const urls = "https://iotgwy.commtrace.com/restApi/nms/getCurrentSnapshot";
            const params = {dateIndex: '2023072723', detailMessage: true};

            const headers = {
                "Content-Type": `application/json;charset=UTF-8`,
                "Accept": "application/json",
                "Authorization": "Bearer "+token,
            };

            let returnVal = null;

            //axis 생성
            try {
                //result에 대한 await 시, result 데이터 확인 못함
                //returnVal을 통해 데이터 가져오기
                await axios({
                    method:"get",//통신방식
                    url : urls,//URL
                    headers : headers,//header
                    params:params,
                    responseType:"json"
                })
                    .then(response =>{
                        //성공 시, returnVal로 데이터 input
                        returnVal = response.data.response;
                        console.log(response)
                        console.log('hi')
                    })
                    .then(err=>{
                        return null;
                    });
                // 반환
                return returnVal;
            }catch {
                return null;
            }
        }
    }

    /* ---------------------------------- ChartJS _ Bubble ----------------------------------*/
    /*const config = {
        type : 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status Compare device count'
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    suggestedMin: -10,
                    suggestedMax: 200,
                }
            }
        }
    };*/

    /*const DATA_COUNT = 12;
    const labels = [];
    for (let i = 0; i < DATA_COUNT; ++i) {
        labels.push(i.toString());
    }
    const datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Cubic interpolation (monotone)',
                data: datapoints,
                borderColor: Utils.CHART_COLORS.red,
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }, {
                label: 'Cubic interpolation',
                data: datapoints,
                borderColor: Utils.CHART_COLORS.blue,
                fill: false,
                tension: 0.4
            }, {
                label: 'Linear interpolation (default)',
                data: datapoints,
                borderColor: Utils.CHART_COLORS.green,
                fill: false
            }
        ]
    };*/

    /*const data = {
        dataset: [
            {
                label: 'Present',
                data: Utils.bubbles(NUMBER_CFG),
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: 'Past',
                data: Utils.bubbles(NUMBER_CFG),
                borderColor: Utils.CHART_COLORS.orange,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.orange, 0.5),
            },
        ]
    }*/

    // Present
    /*const data01 = [
        {date: props.deviceStatus.date, running: props.deviceStatus.preRunningDv.length, caution: props.deviceStatus.preCautionDv.length, warning: props.deviceStatus.preWarningDv.length, faulty: props.deviceStatus.preFaultyDv.length}
    ];
    // Past
    const data02 = [
        {date: befoDeviceStatus.pastDate, running: befoDeviceStatus.pastRunningDv.length, caution: befoDeviceStatus.pastCautionDv.length, warning: befoDeviceStatus.pastWarningDv.length, faulty: befoDeviceStatus.pastFaultyDv.length}
    ];*/




    /* ------------------------------ Chart Options ------------------------------ */
    const options = {
        responsive: true,
        interactions: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Status Compare device count',
            },
            tooltip: {
                enable: true,
                mode: 'index',
                intersect: false,
                usePointStyle: true,
            },
        },
        scales: {
            y:{
                type: 'linear',
                display: true,
                position: 'right',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
            },
            y2: {
                type: 'linear',
                display: true,
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            y3: {
                type: 'linear',
                display: true,
                grid: {
                    drawOnChartArea: false,
                }
            }
        },
    };

    // Present
    /*const data01 = [
        {
            date: props.deviceStatus.date, 
            running: props.deviceStatus.preRunningDv.length, 
            caution: props.deviceStatus.preCautionDv.length, 
            warning: props.deviceStatus.preWarningDv.length, 
            faulty: props.deviceStatus.preFaultyDv.length
        }
    ];
    // Past
    const data02 = [
        {
            date: befoDeviceStatus.pastDate, 
            running: befoDeviceStatus.pastRunningDv.length, 
            caution: befoDeviceStatus.pastCautionDv.length, 
            warning: befoDeviceStatus.pastWarningDv.length, 
            faulty: befoDeviceStatus.pastFaultyDv.length
        }
    ];*/
    
    const statusDataSet = [
        {
            date: props.deviceStatus.date,
            running: props.deviceStatus.preRunningDv.length,
            caution: props.deviceStatus.preCautionDv.length,
            warning: props.deviceStatus.preWarningDv.length,
            faulty: props.deviceStatus.preFaultyDv.length,
        },
        {
            date: befoDeviceStatus.pastDate,
            running: befoDeviceStatus.pastRunningDv.length,
            caution: befoDeviceStatus.pastCautionDv.length,
            warning: befoDeviceStatus.pastWarningDv.length,
            faulty: befoDeviceStatus.pastFaultyDv.length
        },
    ]


    const labels = statusDataSet.map(x => x.date);
    console.log(labels) //['', '2023. 7. 27. 오후 11:59:59']

    const data = {
        labels,
        datasets: [
            {
                labels: 'Running',
                data: statusDataSet.map(x => x.running),
                borderColor: 'rgba(0, 128, 0, 0.5)',
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                fill: false,
                yAxisID: 'y',
                pointStyle: 'circle',
                pointRadius: 5,
                /*cubicInterpolationMode: 'monotone',
                tension: 0.4*/
            },
            {
                labels: 'Caution',
                data: statusDataSet.map(x => x.caution),
                borderColor: 'rgba(255, 217, 0, 0.5)',
                backgroundColor: 'rgba(218, 165, 32, 0.2)',
                fill: false,
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                labels: 'Warning',
                data: statusDataSet.map(x => x.warning),
                borderColor: 'rgba(255, 0, 0, 0.5)',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: false,
                yAxisID: 'y2',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                labels: 'Faulty',
                data: statusDataSet.map(x => x.faulty),
                borderColor: 'rgba(0, 0, 0, 0.5)',
                backgroundColor: 'rgba(150, 150, 150, 1)',
                fill: false,
                yAxisID: 'y3',
                pointStyle: 'circle',
                pointRadius: 5,
            }
        ]
    }



    //const labels = getCurrentSnapshot.map(x => x.messageDate);

    /*const data = {
        labels,
        datasets: [
            {
                label: 'Running', // 날짜별로 수집한 Object 내 Running
                data: nmsCurrent.map(x => x.mainKey),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: false,
                yAxisID: 'y',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                label: 'Caution',
                data: nmsCurrent.map(x => x.subKey),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: false,
                yAxisID: 'y1',
                pointStyle: 'Rectangle',
                pointRadius: 5,
            },
            {
                label: 'Warning',
                data: nmsCurrent.map(x => x.batteryStatus),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: false,
                pointStyle: 'triangle',
                pointRadius: 5,
            },
            {
                label: 'Faulty',
                data: nmsCurrent.map(x => x.sos),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                pointStyle: 'star',
                pointRadius: 5,
            },
        ]
    }*/


    return (
        <>
            <Container id="befoNmscurrentChart">
                <Line options={options} data={data} />

                {/*<ResponsiveContainer width="100%" height={400}>
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid />
                        <XAxis type="number" dateKey="x" name="stature" />
                        <YAxis type="number" dateKey="y" name="weight" unit="개" />
                        <Tooltip cursor={{ strokeDasharray: '3 3'}} />
                        <Legend />
                        <Scatter name="Present" data={data01} fill="#8884d8" shape="star" />
                        <Scatter name="Past" data={data02} fill="#82ca9d" shape="triangle" />
                    </ScatterChart>
                </ResponsiveContainer>*/}


                {/*<Line options={options} data={data} />;*/}
                {/*<MaterialReactTable
                    columns={columns}
                    data={getCurrentSnapshot}

                    muiTablePaperProps={{
                        elevation: 0,
                        sx: {
                            borderRadius: '0',
                            border: '1px dashed #e0e0e0',
                        },
                    }}
                    muiTableBodyProps={{
                        sx: (theme) => ({
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: darken(theme.palette.background.default, 0.1),
                            },
                        }),
                    }}

                    enableMultiRowSelection={false}
                    enableColumnResizing
                    enableGrouping
                    enableStickyHeader
                    enableStickyFooter
                    initialState={{
                        exportButton: true,
                        showColumnFilters: true,
                        density: 'compact',
                        expanded: true,
                        pagination: { pageIndex: 0, pageSize: 10 },
                    }}
                    muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                    muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 500, width: '100%' }}}
                />*/}

            </Container>
        </>
    )
}

export default BeforeTable;