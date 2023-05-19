// input으로 deviceId, startDate, endDate만 입력
// props.nmsCurrent.deviceId 가져오기

import "./history.scss";


import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import MaterialReactTable from 'material-react-table';

// API
import axios from 'axios';
import {Box} from "@mui/material";

// DatePicker
import 'react-datepicker/dist/react-datepicker.css'


const History = ({clickRow}) => {


    /** Date States **/
    const[startDate, setStartDate] = useState(new Date("2023-05-15").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date("2023-05-16").toISOString().split('T')[0]);

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

    useEffect(() => {
        console.log('test');

        const data = returnData().then(
            result=>{

                console.log(result);
                if(result!=null){

                    /*let datai = result.data.response;*/
                    let datai = result;

                    let deviceNmsList = [];
                    //result 배열 풀기
                    datai['dataList'].map(function (received){
                        received["deviceId"] = datai.deviceId;
                        received["vhcleNm"] = datai.vhcleNm;
                        received["accessId"] = datai.accessId;
                        received["dataCount"] = datai.dataCount;


                        console.log(received);

                        // device의 정보를 생성한 배열에 push
                        deviceNmsList.push(received);
                    });
                    setNmsCurrent(deviceNmsList);
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
    },[]);


    async function returnData() {

        if ((clickRow == null || clickRow ==  "")) {
            return null
        }
        else{
            const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
            const urls = "http://testvms.commtrace.com:12041/restApi/nms/historyData";

            const params = {deviceId:clickRow, startDate:"2023-05-15T00:00:00", endDate:"2023-05-16T00:00:00", desc:true};

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
                        console.log(returnVal.dataList);


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
    async function returnData1() {
        return new Promise((resolve) => {


            const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
            const urls = "https://iotgwy.commtrace.com/restApi/nms/historyData";

            const params = {deviceId:clickRow, startDate:"2023-05-15T00:00:00", endDate:"2023-05-16T00:00:00", desc:true};

            const headers = {
                "Content-Type": 'application/json;charset=UTF-8',
                "Accept":"application/json",
                "Authorization": "Bearer "+token,
            };

            axios({
                method:"get",
                url:urls,
                headers:headers,
                params:params,
                responseType:"json"
            })
                .then(response => {
                    // 성공 시, returnVal로 데이터 input
                    //console.log(returnVal);
                    resolve(response);


                });

        });
    }
    /*async function returnData() {
        if ((clickRow == null || clickRow ==  "")) {
            return null
        }
        else{
            const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
            const urls = "http://testvms.commtrace.com:12041/restApi/nms/historyData";
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
                        /!*this.setState({
                            list:response.response
                        })*!/
                    })
                    .then(err=>{
                        return null;
                    });
                return returnVal;

            } catch {
                return null;
            }
        }
    }*/

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
                header: 'Message Data',
                accessorKey: 'messageData',
            },
            {
                header: 'Message Id',
                accessorKey: 'messageId',
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
                header: 'Battery Status',
                accessorKey: 'batteryStatus',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 0, value: 0 },
                    { text: 1, value: 1 },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'vehiclePower',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 0, value: 0 },
                    { text: 1, value: 1 },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Geofence',
                accessorKey: 'geofence',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 0, value: 0 },
                    { text: 1, value: 1 },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Pump Power',
                accessorKey: 'pumpPower',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 0, value: 0 },
                    { text: 1, value: 1 },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
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