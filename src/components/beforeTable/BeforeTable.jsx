import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";

import './beforeTable.scss';
import {Box, Button, darken} from '@mui/material';
import MaterialReactTable from "material-react-table";

//import { Line } from 'react-chartjs-2';
import faker from 'faker';

import Container from '@mui/material/Container';

import {
    BarController,
    Chart,
    DoughnutController,
    LineController,
    PieController,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    BarElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";

import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    BarController,
    DoughnutController,
    LineController,
    PieController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const BeforeTable = (props) => {

    /* ----------------- nmsCurrent _ diffStatus -----------------*/

    const [getCurrentSnapshot, setGetCurrentSnapshot] = useState([]);

    // YesterDay function
    // 오늘로부터 어제 시간-> YYYY-MM-DDTHH:mm:ss.645Z
    const yester = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();

    // 오늘로부터 어제 23시 -> YYYYMMDD'23'
    const yesterDay = yester.substring(0, 4) + yester.substring(5, 7) + yester.substring(8,10) + '23';

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
                    // 어제 label
                    let past = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
                    let pastDate = past.substring(0,4) + '.' + past.substring(5, 7) + '.' + past.substring(8, 10) + '. 오후 11: 23: 59';

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

                                // Status Value 나누기
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
                }
                else{
                }
            });
        return () => {
            clearTimeout(getCurrentSnapshot);
        }
    }, [yesterDay, deviceStatus])

    useEffect(() => {
    }, [getCurrentSnapshot, befoDeviceStatus]);

    useEffect(() => {
        props.BefoWidgetCount(befoDeviceStatus)
    }, [befoDeviceStatus])

    /* ---------------------------------- Type Compare ----------------------------------*/



    /* ---------------------------------- Main Function ----------------------------------*/

    async function returnGetData() {
        if((yesterDay == null || yesterDay == "")){
            return null
        }
        else{
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const urls = "https://iotgwy.commtrace.com/restApi/nms/getCurrentSnapshot";
            const params = {dateIndex: yesterDay, detailMessage: true};

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
    const today = new Date().toLocaleString();

    let past = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
    let pastDate = past.substring(0,4) + '.' + past.substring(5, 7) + '.' + past.substring(8, 10) + '. 오후 11: 23: 59';

    /* ------------------------------ Chart Options ------------------------------ */
    const options = {
        /*responsive: true,*/
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                }
            },
            title: {
                display: true,
                text: 'Status 개수 비교',
                font: {
                    size: 15
                }
            },
            tooltip: {
                enable: true,
                position: 'average',
                intersect: false,
                usePointStyle: true,
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            labelString: '',
                        }
                    }
                ],
                /*y: {
                    stacked: true,
                }*/
                /*y: {
                    min: 0,
                    max: 100,
                }*/
                /*xAxes: [
                    {
                        barPercentage: 1,
                        barThickness:5,
                        type: "time",
                        time: {displayFormats: {years: "YYYY"}},
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            display: true,
                            fontColor: "black"
                        }
                    }
                ],*/
                /*yAxes: [
                    {
                        type: 'logarithmic',
                        position: 'bottom',
                        ticks: {
                            userCallback: function(tick) {
                                var remain =
                                    tick / Math.pow(10, Math.floor(Chart.helpers.log10(tick)));
                                if (remain === 1 || remain === 5) {
                                    return '$ ' + tick.toString();
                                }
                                return '';
                            }
                        },
                        scaleLabel: {
                            labelString: '',
                            display: true
                        }
                    }
                ]*/
                /*[
                    {
                        gridLines:{
                            display:true,
                            drawBorder:true,
                            color:'lightgrey',
                            drawTicks:true
                        },
                        scaleLabel:{
                            display:true,
                            labelString:"Gross Domestic Product, USA",
                            fontColor:'black',

                        },
                        ticks:{
                            display:true,
                            fontColor:"black",
                        }
                    }
                    ]*/
            }
        },

        /*interactions: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Status Compare Device Count',
                font:{
                    size: 15,
                },
            },
            tooltip: {
                enable: true,
                mode: 'index',
                intersect: false,
                usePointStyle: true,
            },
            legend: {
                labels: {
                    usePointStyle: true,
                }
            }
        },
        scales: {
            y:{
                type: 'linear',
                display: false,
                position: 'right',
                pointStyle: 'dash',
            },
            y1: {
                type: 'linear',
                display: true,
                grid: {
                    drawOnChartArea: true, // only want the grid lines for one axis to show up
                },
                pointStyle: 'rect',
            },
            y2: {
                type: 'linear',
                display: false,
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
                pointStyle: 'line',
            },
            y3: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            /!*y5: {
                type: 'linear',
                display: false,
                grid: {
                    drawOnChartArea: false,
                }
            }*!/
        },*/
    };


    /* -------------- Before Line Chart --------------*/

    // 각 타입에 따른 개수 기준
    const statusDataSet = [
        {
            date: props.deviceStatus.date,
            running: (props.deviceStatus.preRunningDv.length)-(befoDeviceStatus.pastRunningDv.length),
            caution: (props.deviceStatus.preCautionDv.length)-(befoDeviceStatus.pastCautionDv.length),
            warning: (props.deviceStatus.preWarningDv.length)-(befoDeviceStatus.pastWarningDv.length),
            faulty: (props.deviceStatus.preFaultyDv.length)-(befoDeviceStatus.pastFaultyDv.length),
        }
    ]

    const labels = ['오늘']
    //const labels = ['Running', 'Caution', 'Warning', 'Faulty']
    //const labels = [제statusDataSet.map(x=>x.date)]
    //const labels = [statusDataSet.map(x => x.running), statusDataSet.map(x => x.caution), statusDataSet.map(x => x.warning), statusDataSet.map(x => x.faulty)];

    const data = {
        labels,
        datasets: [
            {
                label: 'Running',
                type: 'bar',
                data: statusDataSet.map(x => x.running),
                borderColor: 'rgba(0, 128, 0, 0.5)',
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(0, 128, 0, 0.2)",
                pointBackgroundColor: "rgba(0, 128, 0, 0.5)",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(0, 128, 0, 0.2)",
                pointHoverBorderColor: "rgba(0, 128, 0, 0.5)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,

                //maxBarThickness: 50, // Bar 최대 두께 설정
                /*borderSkipped: false,
                fill: false,
                yAxisID: 'y',
                pointStyle: 'circle',
                radius: 10,
                cubicInterpolationMode: 'monotone',
                tension: 0.4*/
            },
            {
                label: 'Caution',
                type: 'bar',
                data: statusDataSet.map(x => x.caution),
                borderColor: 'rgba(255, 217, 0, 0.5)',
                backgroundColor: 'rgba(218, 165, 32, 0.2)',
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(218, 165, 32, 0.2)",
                pointBackgroundColor: "rgba(255, 217, 0, 0.5)",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(218, 165, 32, 0.2)",
                pointHoverBorderColor: "rgba(255, 217, 0, 0.5)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                /*borderWidth: 2,
                borderSkipped: false,
                borderRadius: 1,
                fill: false,
                yAxisID: 'y1',
                pointStyle: 'rectRot',
                radius: 10,*/
            },
            {
                label: 'Warning',
                type: 'bar',
                data: statusDataSet.map(x => x.warning),
                borderColor: 'rgba(255, 0, 0, 0.5)',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                /*pointBorderColor: "rgba(255, 0, 0, 0.2)",
                pointBackgroundColor: "rgba(255, 0, 0, 0.5)",*/
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                /*pointHoverBackgroundColor: "rgba(255, 0, 0, 0.2)",
                pointHoverBorderColor: "rgba(255, 0, 0, 0.5)",*/
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                /*borderWidth: 2,
                borderSkipped: false,
                borderRadius: 3,
                fill: false,
                yAxisID: 'y2',
                pointStyle: 'rect',
                radius: 10,*/
            },
            {
                label: 'Faulty',
                type: 'bar',
                data: statusDataSet.map(x => x.faulty),
                borderColor: 'rgba(150, 150, 150, 1)',
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                /*borderWidth: 2,
                borderSkipped: false,
                borderRadius: 5,
                fill: false,
                yAxisID: 'y3',
                pointStyle: 'star',
                radius: 10,*/
            },
            /*{
                label: 'Standard',
                data: 0,
                borderColor: 'rgba(173, 173, 173, 0.67)',
                yAxisId: 'y5',
            },*/
        ]
    }
    /* -------------- Before Line Table --------------*/
    const tableData = [
        { // 현재 _ Today
            date: props.deviceStatus.date,
            running: props.deviceStatus.preRunningDv.length,
            caution: props.deviceStatus.preCautionDv.length,
            warning: props.deviceStatus.preWarningDv.length,
            faulty: props.deviceStatus.preFaultyDv.length,
        },
        { // 어제 _ Yesterday
            date: befoDeviceStatus.pastDate,
            running: befoDeviceStatus.pastRunningDv.length,
            caution: befoDeviceStatus.pastCautionDv.length,
            warning: befoDeviceStatus.pastWarningDv.length,
            faulty: befoDeviceStatus.pastFaultyDv.length
        },
    ]
    const columns = useMemo(
        () => [
            {
                accessorKey: 'date',
                header: 'Date',
                //enableHiding: false,
                size: 180,
            },
            {
                accessorKey: 'running',
                header: 'Running',
                size: 100,
            },
            {
                accessorKey: 'caution',
                header: 'Caution',
                size: 100,
            },
            {
                accessorKey: 'warning',
                header: 'Warning',
                size: 100,
            },
            {
                accessorKey: 'faulty',
                header: 'Faulty',
                size: 100,
            },
        ]
    )


    return (
        <div className="befoTable_Part">
            <Bar options={options} data={data} />
            {/*<Container id="befoNmscurrentChart">
            </Container>*/}
            <hr/>
            <MaterialReactTable
                columns={columns}
                data={tableData}
                initialState={{
                    columnVisibility:
                        { date: false } }}
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
                            backgroundColor: darken('#F4CCCC', 0),
                        },
                    }),
                }}
            />
        </div>
    )
}

export default BeforeTable;