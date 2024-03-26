import React, { useState, useEffect, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css'
import HistoryChart from "./HistoryChart";

/** K.O IoT GWY URL */
import { koIotUrl } from 'config';

import MaterialReactTable from 'material-react-table';
import {Box, Button} from "@mui/material";
import { darken } from '@mui/material'; // Change History Table Theme
import { Grid } from "@mui/material";
import Container from '@mui/material/Container';

import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../../../pages/nav/Navbar";
import {styled} from "@mui/material/styles";
import Chart from 'react-apexcharts';


const History = (props) => {

    const [deviceId, setDeviceId] = useState('01680675SKY33EC')

    const now = new Date();
    //const[startDate, setStartDate] = useState(new Date(now.setMonth(now.getMonth() -1)).toISOString().split('T')[0]); // 한달 전
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    console.log(startDate)
    console.log(endDate)

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };



    /** API _ API로 들어온 데이터(NmsCurrent) state **/
    const[nmsHistory, setNmsHistory] = useState([]);
    const[nmsDevice] = useState([]);

    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let deviceNmsList = [];
                    //console.log(result);
                    //result 배열 풀기
                    result['dataList'].map(function (received){
                        received["accessId"] = result.accessId;
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
                        //console.log(received)
                        // device의 정보를 생성한 배열에 push
                        deviceNmsList.push(received);
                    });
                    setNmsHistory(deviceNmsList);
                }else{
                }
            });

        return () => {
            clearTimeout(nmsHistory);
        }
    }, [deviceId, startDate, endDate]);

    useEffect(() => {
        props.HistoryData(nmsHistory)
    }, [nmsHistory]);

    useEffect(() => {
    },[nmsDevice.receivedDate]);


    async function returnData() {
        if ((deviceId == null || deviceId ==  "")) {
            return null
        }
        else{
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const urls = koIotUrl + "/nms/historyData";
            const params = {deviceId:(deviceId), startDate:(startDate+"T00:00:00"), endDate:(endDate+"T23:59:59"), desc:true};

            const headers = {
                "Content-Type": 'application/json;charset=UTF-8',
                "Accept":"application/json",
                "Authorization": "Bearer "+token,
            };

            let returnVal = null;

            try {
                await axios({
                    method:"get",
                    url:urls,
                    headers:headers,
                    params:params,
                    responseType:"json"
                })
                    .then(response => {
                        // 성공 시, returnVal로 데이터 input
                        returnVal = response.data.response;
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
                header: 'Access Id',
                accessorKey: 'accessId',
            },
            {
                header: '단말기 ID',
                accessorKey: 'deviceId',
            },
            {
                header: '선박명',
                accessorKey: 'vhcleNm',
            },
            {
                header: 'IGWS 수신 날짜',
                accessorKey: 'receivedDate',
            },
            {
                header: '메시지 수신 날짜',
                accessorKey: 'messageDate',
            },
            {
                header: 'SIN',
                accessorKey: 'mainKey',
            },
            {
                header: 'MIN',
                accessorKey: 'subKey',
            },
            {
                header: '수신한 메시지',
                accessorKey: 'messageData',
            },
            {
                header: '메시지 ID',
                accessorKey: 'messageId',
            },
            {
                header: 'Key Type',
                accessorKey: 'period',
            },
            {
                header: 'Diagnostic 전원 On 횟수',
                accessorKey: 'powerOnCount',
            },
            {
                header: '위성신호레벨',
                accessorKey: 'satCnr',
            },
            {
                header: 'Diagnostic 위성 끊김 횟수',
                accessorKey: 'satCutOffCount',
            },
            {
                header: '위성 ON 시간',
                accessorKey: 'satOnTime',
            },
            {
                header: '발신 데이터 개수',
                accessorKey: 'sendDataCount',
            },
            {
                header: '단말기 연결 시간',
                accessorKey: 'st6100On',
            },
        ],
        [],
    );

    // Export To CSV
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);
    // Export All Data
    const handleExportData = (table) => {
        csvExporter.generateCsv(nmsHistory.map(function(row){
            let datas = {};

            table.getAllColumns().map(function(columns) {

                if(typeof (row[columns.id])!="undefined"){
                    datas[columns.id] = row[columns.id];
                }
                else{
                    datas[columns.id] = '';
                }
            });
            return datas;
        }));
    }

    console.log(nmsHistory)




    return (
        <>
            <MaterialReactTable
                title="NMS History Table"
                columns={columns}
                data={nmsHistory}

                // Date Search
                positionToolbarAlertBanner="top"
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{display:'flex', gap:'1rem', p: '0.5rem', flexWrap: 'wrap'}}>
                        <Button
                            color="primary"
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={()=>handleExportData(table)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                            style={{p: '0.5rem', flexWrap: 'wrap'}}
                        >
                            Export All Data
                        </Button>

                        <span style={{ p:"4px"}}>
                                <b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} />
                            &nbsp;~&nbsp;
                            <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} />
                            </span>
                    </Box>
                )}


                localization={{
                    filterCustomFilterFn: 'Custom Filter Fn',
                }}
                filterFns={{
                    customFilterFn: (cell, filterValue) => {
                        return cell.getValue(cell) === filterValue;
                    },
                    "* .MuiInputBase-fullWidth": {
                        minWidth: '50px',
                    },
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
                muiTableContainerProps={{ sx: { m: '0.5rem 0',  width: '100%' }}}

                // Change History Table Theme
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: '0',
                        border: '1px dashed #e0e0e0',
                    },
                }}
                // Table Theme
                muiTableBodyProps={{
                    sx: (theme) => ({
                        '& tr:nth-of-type(odd)': {
                            backgroundColor: darken(theme.palette.background.default, 0.1),
                        },
                    }),
                }}
            />
            <HistoryChart nmsHistory={nmsHistory}/>
        </>
    );
}

export default History;