import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";

import './beforeTable.scss';
import {Box, Button, darken} from '@mui/material';
import MaterialReactTable from "material-react-table";

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
import faker from 'faker';

import Container from '@mui/material/Container';

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
    /* ----------------- nmsCurrent _ diffStatus (props) -----------------*/
    const [diffStatus, setDiffStatus ] = useState({
        date: new Date().toLocaleString(),
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });

    useEffect( () => {
    }, [diffStatus]);

    console.log(props.diffStatus);
    /* ----------------- nmsCurrent _ diffStatus -----------------*/

    const [getCurrentSnapshot, setGetCurrentSnapshot] = useState([]);


    const [befoDiffStatus, setBefoDiffStatus] = useState ({
        running: 0,
        caution: 0,
        warning: 0,
        faulty: 0,
    });

    const [dateIndex, setDateIndex] = useState('2023072523');


    /* ----------------- getCurrentSnapshot _ befoDeviceStatus -----------------*/
    const [befoDeviceStatus, setBefoDeviceStatus] = useState ({
        pastRunningDv: [],
        pastCautionDv: [],
        pastWarningDv: [],
        pastFaultyDv: [],
    });

    /* ----------------- getCurrentSnapshot _ befoDiffStatus -----------------*/
    useEffect(()=>{
        const data = returnGetData().then(
            result =>{
                if(result != null){
                    let befoDeviceNmsList = [];

                    //let date = new Date().toLocaleString()
                    let running = 0
                    let caution = 0
                    let warning = 0
                    let faulty = 0

                    let befoDiffObj = {};
                    /*----------------- befoDeviceStatus ----------------*/
                    let pastDvStatusObj = {};
                    
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
                                    faulty += 1;
                                } else if(warningMin > 0 && device.parseDiff > warningMin) {
                                    device["status"] = 'warning';
                                    warning += 1;
                                } else if(cautionMin > 0 && device.parseDiff > cautionMin) {
                                    device["status"] = 'caution';
                                    caution += 1;
                                } else{
                                    device["status"] = 'running';
                                    running += 1;
                                }

                                /*----------- pastDeviceStatus -----------*/
                                if(device.status == 'faulty'){
                                    pastRunningDv.push(device);
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

                    befoDiffObj.running = running;
                    befoDiffObj.caution = caution;
                    befoDiffObj.warning = warning;
                    befoDiffObj.faulty = faulty;

                    setBefoDiffStatus(befoDiffObj);
                    console.log(befoDiffObj);


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
    }, [dateIndex])

    useEffect(() => {
    }, [getCurrentSnapshot, befoDeviceStatus]);

    useEffect(() => {
        props.BefoWidgetCount(befoDeviceStatus)
    }, [befoDeviceStatus])

    console.log(befoDeviceStatus)

    async function returnGetData() {
        if((dateIndex == null || dateIndex == "")){
            return null
        }
        else{
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const urls = "https://iotgwy.commtrace.com/restApi/nms/getCurrentSnapshot";
            const params = {dateIndex: '2023072523', detailMessage: true};

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

    /* --------------- Chart Options --------------- */
    const columns = useMemo(
        () => [
            {
                header: 'Device Id',
                accessorKey: 'deviceId',
            },
            {
                header: 'Vehicle Number',
                accessorKey: 'vhcleNm',
                size: 150,
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            },
            {
                header: 'Message Date',
                accessorKey: 'messageDate',
            },
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
                size: 130,
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
                size: 130,
            },
        ]
    )

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
                text: 'Chart.js Line Chart - Multi Axis',
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
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
        },
    };

    const labels = getCurrentSnapshot.map(x => x.messageDate);

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