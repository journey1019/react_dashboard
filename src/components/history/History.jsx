// input으로 deviceId, startDate, endDate만 입력
// props.nmsCurrent.deviceId 가져오기
import React, { useState, useEffect, useMemo } from 'react';
import "./history.scss";
import 'react-datepicker/dist/react-datepicker.css'

import MaterialReactTable from 'material-react-table';
import {Box, Button} from "@mui/material";
import { darken } from '@mui/material'; // Change History Table Theme

import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChart from "../tablechart/TableChart"; //or use your library of choice here


const History = ({clickRow}) => {

    const[startDate, setStartDate] = useState(new Date("2023-05-23").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };
    


    /** API _ API로 들어온 데이터(NmsCurrent) state **/
    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[nmsDevice] = useState([]);

    useEffect(() => {
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
    },[nmsDevice.receivedDate]);


    async function returnData() {
        if ((clickRow == null || clickRow ==  "")) {
            return null
        }
        else{
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const urls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
            const params = {deviceId:(clickRow), startDate:(startDate+"T00:00:00"), endDate:(endDate+"T23:59:59"), desc:true};

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

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };
    const handleExportData = () => {
        csvExporter.generateCsv(nmsCurrent);
    }

    return (
        <>
            <MaterialReactTable
                title="NMS History Table"
                columns={columns}
                data={nmsCurrent}

                // Date Search
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
                        <Button
                            color="primary"
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={handleExportData}
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

                // Change History Table Theme
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
                    pagination: { pageIndex: 0, pageSize: 100 },
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                /*muiTableHeadCellFilterTextFieldProps={{
                    sx: { m: '0.5rem 0', width: '100%' },
                    variant: 'outlined',
                }}*/
            />
            <TableChart />
        </>
    );
}

export default History;