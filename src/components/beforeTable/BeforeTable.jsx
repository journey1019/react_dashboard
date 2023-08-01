import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";

import './beforeTable.scss';
import {Box, Button, darken} from '@mui/material';
import MaterialReactTable from "material-react-table";

//import { Line } from 'react-chartjs-2';
import faker from 'faker';

import Container from '@mui/material/Container';

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

    // YesterDay function
    const yester = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();

    const yesterDay = yester.substring(0, 4) + yester.substring(5, 7) + yester.substring(8,10) + '23';
    console.log(yesterDay);

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
                    console.log(pastDate)

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
    }, [yesterDay, deviceStatus])

    console.log(props.deviceStatus)
    useEffect(() => {
    }, [getCurrentSnapshot, befoDeviceStatus]);

    useEffect(() => {
        props.BefoWidgetCount(befoDeviceStatus)
    }, [befoDeviceStatus])

    console.log(befoDeviceStatus)

    console.log(props.deviceStatus)
    console.log(yesterDay)

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
    const today = new Date().toLocaleString();
    console.log(today)




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
                display: false,
                position: 'right',
            },
            y1: {
                type: 'linear',
                display: true,
                grid: {
                    drawOnChartArea: true, // only want the grid lines for one axis to show up
                },
            },
            y2: {
                type: 'linear',
                display: false,
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            y3: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            y5: {
                type: 'linear',
                display: false,
                grid: {
                    drawOnChartArea: false,
                }
            }
        },
    };


    // 각 타입에 따른 개수 기준
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
    console.log(labels)

    const data = {
        labels,
        datasets: [
            {
                label: 'Running',
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
                label: 'Caution',
                data: statusDataSet.map(x => x.caution),
                borderColor: 'rgba(255, 217, 0, 0.5)',
                backgroundColor: 'rgba(218, 165, 32, 0.2)',
                fill: false,
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                label: 'Warning',
                data: statusDataSet.map(x => x.warning),
                borderColor: 'rgba(255, 0, 0, 0.5)',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: false,
                yAxisID: 'y2',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                label: 'Faulty',
                data: statusDataSet.map(x => x.faulty),
                borderColor: 'rgba(0, 0, 0, 0.5)',
                backgroundColor: 'rgba(150, 150, 150, 1)',
                fill: false,
                yAxisID: 'y3',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                label: 'Standard',
                data: 0,
                borderColor: 'rgba(173, 173, 173, 0.67)',
                yAxisId: 'y5',
            },
        ]
    }

    return (
        <>
            <Line options={options} data={data} />
            {/*<Container id="befoNmscurrentChart">
            </Container>*/}
        </>
    )
}

export default BeforeTable;