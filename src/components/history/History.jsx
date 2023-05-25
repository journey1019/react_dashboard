// input으로 deviceId, startDate, endDate만 입력
// props.nmsCurrent.deviceId 가져오기

import "./history.scss";


import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import MaterialReactTable from 'material-react-table';

// API
import axios from 'axios';
import {click} from "@testing-library/user-event/dist/click";
import {Box} from "@mui/material";

// DatePicker
import { DateField } from '@mui/x-date-pickers/DateField';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'


const History = ({clickRow}) => {

    const[startDate, setStartDate] = useState(new Date("2023-05-22").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleStartChange = (e) => {
        console.log(e.target.value);
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };


    /** API **/
        // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[nmsDevice, setNmsDevice] = useState([]
        /*statusCode:'',
        status:'',
        error:'',
        errorMessage:'',
        deviceId:'',
        vhcleNm: '',
        accessId:'',
        dataCount:'',
        receivedDate:'',
        messageDate:'',
        mainKey:'',
        subKey:'',
        messageData:'',
        messageId:'',
        ioJson:'',*/
    );

    /*const [user, setUser] = useState([])

    useEffect(() => {
        axios.get('http://testvms.commtrace.com:12041/restApi/nms/historyData')
            .then(response => {
                setUsers(response.data);
            });
    }, []);
*/
    useEffect(() => {
        console.log('test');

        const data = returnData().then(
            result=>{
                if(result!=null){

                    let deviceNmsList = [];
                    //result 배열 풀기
                    result['dataList'].map(function (received){
                        received["deviceId"] = result.deviceId;
                        received["vhcleNm"] = result.vhcleNm;

                        // Object 순회
                        if(received.ioJson != null ) {
                            for (let key of Object.keys(received.ioJson)) {
                                const value = received.ioJson[key]; // Violet과 30이 연속적으로 출력됨
                                received[key] = value;
                            }
                        }


                        //received["ioJson"] = result.ioJson;

                        //received["batteryStatus"] = result.received.ioJson.batteryStatus;

                        /*received["ioJson"].map(function (detail){
                            detail["batteryStatus"] = received.ioJson.batteryStatus;
                            detail["sos"] = received.ioJson.sos;
                            detail["geofence"] = received.ioJson.geofence;
                            detail["vehiclePower"] = received.ioJson.vehiclePower;
                            detail["boxOpen"] = received.ioJson.boxOpen;
                            detail["satInView"] = received.ioJson.satInView;
                            detail["powerVoltage"] = received.ioJson.powerVoltage;
                            detail["satCnr"] = received.ioJson.satCnr;
                            detail["dIo1"] = received.ioJson.dIo1;
                            detail["dIo2"] = received.ioJson.dIo2;
                            detail["dIo3"] = received.ioJson.dIo3;
                            detail["dIo4"] = received.ioJson.dIo4;
                        })*/

                        console.log(result);


                        //received["ioJson"] = result.

                        /*received["ioJson"].map(function(detail){
                            detail["batteryStatus"] = received.batteryStatus;
                            detail["vehiclePower"] = received.vehiclePower
                            detail["geofence"] = received.geofence;
                            detail["pumpPower"] = received.pumpPower;
                            detail["sos"] = received.sos;
                            detail["boxOpen"] = received.boxOpen;
                            detail["satInView"] = received.satInView;
                            detail["powerVoltage"] = received.powerVoltage;
                            detail["satCnr"] = received.satCnr;
                            detail["dIo1"] = received.dIo1;
                            detail["dIo2"] = received.dIo2;
                            detail["dIo3"] = received.dIo3;
                            detail["dIo4"] = received.dIo4;
                        })*/

                        //received["ioJson"] = result.ioJson;
                        //const iodetail = [];
                        /*received["ioJson"].map(function (detail) {
                            detail.batteryStatus = received.batteryStatus;
                            detail.vehiclePower = received.vehiclePower;
                            detail.geofence = received.geofence;
                            detail.pumpPower = received.pumpPower;
                            detail.sos = received.sos;
                            detail.boxOpen = received.boxOpen;
                            detail.satInView = received.satInView;
                            detail.powerVoltage = received.powerVoltage;
                            detail.satCnr = received.satCnr;
                            detail.dIo1 = received.dIo1;
                            detail.dIo2 = received.dIo2;
                            detail.dIo3 = received.dIo3;
                            detail.dIo4 = received.dIo4;

                            ioJson.push(detail);
                        })*/

                        //received["ioJson"] = result.ioJson.batteryStatus;
                        /*received["ioJson"] = result.batteryStatus;
                        received["ioJson"] = result.vehiclePower
                        received["ioJson"] = result.geofence;
                        received["ioJson"] = result.pumpPower;
                        received["ioJson"] = result.sos;
                        received["ioJson"] = result.boxOpen;
                        received["ioJson"] = result.satInView;
                        received["ioJson"] = result.powerVoltage;
                        received["ioJson"] = result.satCnr;
                        received["ioJson"] = result.dIo1;
                        received["ioJson"] = result.dIo2;
                        received["ioJson"] = result.dIo3;
                        received["ioJson"] = result.dIo4;*/

                        /*received["batteryStatus"] = result.batteryStatus;
                        received["vehiclePower"] = result.vehiclePower
                        received["geofence"] = result.geofence;
                        received["pumpPower"] = result.pumpPower;
                        received["sos"] = result.sos;
                        received["boxOpen"] = result.boxOpen;
                        received["satInView"] = result.satInView;
                        received["powerVoltage"] = result.powerVoltage;
                        received["satCnr"] = result.satCnr;
                        received["dIo1"] = result.dIo1;
                        received["dIo2"] = result.dIo2;
                        received["dIo3"] = result.dIo3;
                        received["dIo4"] = result.dIo4;*/

                        /*const ioJson = {};

                        ioJson.map(function (ioJson){
                            ioJson["batteryStatus"] = received.batteryStatus;
                            ioJson["vehiclePower"] = received.vehiclePower;
                        });
                        deviceNmsList.push(received);*/

                        // ioJson 데이터 입력

                        // device의 정보를 생성한 배열에 push
                        deviceNmsList.push(received);
                        console.log(received);
                    });
                    setNmsCurrent(deviceNmsList);
                    console.log(deviceNmsList);
                }else{
                }
            });

        return () => {
            clearTimeout(nmsCurrent);
        }
    }, [clickRow, startDate, endDate]);

    useEffect(() => {

    }, [nmsCurrent]);

    useEffect(() => {
        console.log(nmsDevice)
        console.log(nmsCurrent)
    },[nmsDevice.receivedDate]);


    async function returnData() {
        if ((clickRow == null || clickRow ==  "")) {
            return null
        }
        else{
            const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
            const urls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
            console.log(startDate+"T00:00:00");
            const params = {deviceId:(clickRow), startDate:(startDate+"T00:00:00"), endDate:(endDate+"T00:00:00"), desc:true};

            const headers = {
                "Content-Type": 'application/json;charset=UTF-8',
                "Accept":"application/json",
                "Authorization": "Bearer "+token,
            };

            let returnVal = null;

            try {
                let result = await axios({
                    method:"get",
                    url:urls,
                    headers:headers,
                    params:params,
                    responseType:"json"
                })
                    .then(response => {
                        // 성공 시, returnVal로 데이터 input
                        returnVal = response.data.response;
                        console.log(response);
                        /*this.setState({
                            list:response.response
                        })*/
                    })
                    .then(err=>{
                        return null;
                    });
                return returnVal;

            } catch {
                return null;
            }
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Device Id',
                accessorKey: 'deviceId',
            },
            {
                header: 'Vehicle Number',
                accessorKey: 'vhcleNm',
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
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
            },
            {
                header: 'Message Data',
                accessorKey: 'messageData',
            },
            {
                header: 'Message Id',
                accessorKey: 'messageId',
            },
            {
                header: 'Battery Status',
                accessorKey: 'batteryStatus',

                filterSelectOptions: [
                    { text: 0, value: 0 },
                    { text: 1, value: 1 },
                ],
                filterVariant: 'select',
            },
            {
                header: 'sos',
                accessorKey: 'sos',
            },
            {
                header: 'Geofence',
                accessorKey: 'geofence',
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'vehiclePower',
            },
            {
                header: 'boxOpen',
                accessorKey: 'boxOpen',
            },
            {
                header: 'SatInView',
                accessorKey: 'satInView',
            },
            {
                header: 'PowerVoltage',
                accessorKey: 'powerVoltage',
            },
            {
                header: 'SatCnr',
                accessorKey: 'satCnr',
            },
            {
                header: 'dIo1',
                accessorKey: 'dIo1',
            },
            {
                header: 'dIo2',
                accessorKey: 'dIo2',
            },
            {
                header: 'dIo3',
                accessorKey: 'dIo3',
            },
            {
                header: 'dIo4',
                accessorKey: 'dIo4',
            },
        ],
        [],
    );

    console.log(nmsCurrent)
    console.log(clickRow)
    console.log(startDate)
    console.log(endDate)

    return (
        <>
            <MaterialReactTable
                title="NMS History Table"
                columns={columns}
                data={nmsCurrent}

                // Date Search
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
                        <b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} />
                        ~
                        <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} />
                    </Box>
                )}

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
                    pagination: { pageIndex: 0, pageSize: 100 },
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                /*muiTableHeadCellFilterTextFieldProps={{
                    sx: { m: '0.5rem 0', width: '100%' },
                    variant: 'outlined',
                }}*/
            />
        </>
    );
}

export default History;