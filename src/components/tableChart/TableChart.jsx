import "./tablechart.scss"
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DiagDevice from "../table/diag/DiagDevice";

import MaterialReactTable from 'material-react-table';
import { Box, Button, MenuItem, IconButton } from '@mui/material';


const TableChart = () => {
    // Refresh Time _ setTimeout
    const [number, setNumber] = useState(0);

    // All NMS Data
    const [nmsCurrent, setNmsCurrent] = useState([]);

    // Status 변경 Object 항목
    const [deviceStatus, setDeviceStatus] = useState({
        date: '',
        preRunningDv: [],
        preCautionDv: [],
        preWarningDv: [],
        preFaultyDv: [],
    });

    useEffect(() => {
        const data = returnData().then(
            result => {
                if (result!=null) {
                    let dvNmsList = [];
                    let dvStatusObj = {};

                    let date = new Date().toLocaleString();
                    let preRunningDv = [];
                    let preCautionDv = [];
                    let preWarningDv = [];
                    let preFaultyDv = [];

                    result.map(function(manageCrp){
                        manageCrp['nmsInfoList'].map(function(crp){
                            crp['nmsDetailList'].map(function(device){
                                device['crpId'] = crp.crpId;
                                device['crpNm'] = crp.crpNm;
                                device['manageCrpId'] = manageCrp.manageCrpId;
                                device['manageCrpNm'] = manageCrp.manageCrpNm;


                                // messageData(String -> JSON)
                                try {
                                    device.messageData = JSON.parse(device.messageData)
                                } catch (e) {
                                    device.messageData = '';
                                }

                                // messageData(JSON) _ Object 순회
                                if(device.messageData !== '') {
                                    if(typeof(device.messageData.Fields) === 'object') {
                                        for(let key of Object.keys(device.messageData)) {
                                            const value = device.messageData[key];
                                            device[key] = value.toString() || '';
                                        }
                                    }
                                }

                                /* Status Period 기준값 */
                                let runningMin = device.maxPeriod;
                                let cautionMin = runningMin * 1.5;
                                let warningMin = runningMin * 3.0;
                                let faultyMin = runningMin * 5.0;

                                // Widgets 선언 및 nmsCurrent 생성 {running, caution, warning, faulty} // 720 1080 2160 3600
                                // Status 범위 조건(시간, software, sin/min0)
                                if ((faultyMin > 0 && device.parseDiff > faultyMin) || (device.softwareResetReason == 'Exception') || (device.SIN == '0' && device.MIN == '2')) {
                                    device["status"] = 'faulty';
                                    device["statusDesc"] = 'MaxPeriod * 3.0 초과';
                                } else if (warningMin > 0 && device.parseDiff > warningMin) {
                                    device["status"] = 'warning';
                                    device["statusDesc"] = 'MaxPeriod * 1.5 초과 ~ 3.0 이하';
                                } else if (cautionMin > 0 && device.parseDiff > cautionMin) {
                                    device["status"] = 'caution';
                                    device["statusDesc"] = 'MaxPeriod * 1.0 초과 ~ 1.5 이하';
                                } else {
                                    device["status"] = 'running';
                                    device["statusDesc"] = 'MaxPeriod * 1.0 이하';
                                }

                                if (device.status == 'faulty') {
                                    preFaultyDv.push(device);
                                } else if (device.status == 'warning') {
                                    preWarningDv.push(device);
                                } else if (device.status == 'caution') {
                                    preCautionDv.push(device);
                                } else {
                                    preRunningDv.push(device);
                                }

                                dvNmsList.push(device);
                            });
                        });
                    })
                    setNmsCurrent(dvNmsList);
                } else {

                }
            });
        return () => {
            clearTimeout(nmsCurrent);
        }
    }, [number]);
    setTimeout(() => {
        setNumber(number + 1);
        if(number > 100) {
            setNumber(0);
        }
        // 1분 Refresh
    }, 60000)

    console.log(nmsCurrent);

    useEffect(() => {
    }, [nmsCurrent])

    const columns = useMemo(
        () => [
            {
                header: 'Crp Nm',
                accessorKey: 'crpNm',
                enableColumnFilterModes: false,
            },
            {
                header: 'Vhcle Nm',
                accessorKey: 'vhcleNm',
                size: 100,
                enableColumnFilterModes: false,
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableGrouping: false, //do not let this column be grouped
                enableColumnFilterModes: false,
                /*Cell: ({cell}) => {
                    return (
                        <DiagDevice cell={cell} clickRow={clickRow}/>
                    )
                }*/
            },
            {
                header: 'Status',
                accessorKey: 'status',
                size: 100,
                Cell: ({cell}) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
                enableColumnFilterModes: false,
            },
        ]
    )


    async function returnData() {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).autoKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
        const params = {detailMessage: true};
        const headers = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        };
        let returnVal = null;

        try {
            let result = await axios({
                method: "get",
                usr: urls,
                headers: headers,
                params: params,
                responseType: "json"
            })
                .then(response => {
                    returnVal = response.data.response;
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        } catch {
            return null;
        }
    }

    return(
        <>
            <MaterialReactTable
                title="NMS Current Table"
                columns={columns}
                data={nmsCurrent}
            />
        </>
    );
}

export default TableChart;