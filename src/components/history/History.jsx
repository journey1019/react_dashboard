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

                        // Object 순회 _ ioJson
                        if(received.ioJson != null ) {
                            for (let key of Object.keys(received.ioJson)) {
                                const value = received.ioJson[key]; // Violet과 30이 연속적으로 출력됨
                                received[key] = value.toString() || '';
                            }
                        }else {

                        }

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
            },
            {
                header: 'Loading',
                accessorKey: 'loading',
            },
            {
                header: 'sos',
                accessorKey: 'sos',
            },
            {
                header: 'Pump Power',
                accessorKey: 'pumpPower',
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