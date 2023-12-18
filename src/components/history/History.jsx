// input으로 deviceId, startDate, endDate만 입력
// props.nmsCurrent.deviceId 가져오기
import React, { useState, useEffect, useMemo } from 'react';
import "./history.scss";
import 'react-datepicker/dist/react-datepicker.css'

import MaterialReactTable from 'material-react-table';
import {Box, Button} from "@mui/material";
import { darken } from '@mui/material'; // Change History Table Theme
import { Grid } from "@mui/material";

import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChart from "../tableChart/TableChart"; //or use your library of choice here
import SatelliteChart from "../satelliteChart/SatelliteChart";


const History = ({clickRow}) => {

    const now = new Date();
    //const[startDate, setStartDate] = useState(new Date(now.setMonth(now.getMonth() -1)).toISOString().split('T')[0]); // 한달 전
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
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
                header: 'Vehicle Name',
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
                size: 150,
            },
            {
                header: 'Loading',
                accessorKey: 'loading',
                size: 150,
            },
            {
                header: 'sos',
                accessorKey: 'sos',
                size: 100,
            },
            {
                header: 'Pump Power',
                accessorKey: 'pumpPower',
                size: 150,
            },
            {
                header: 'Geofence',
                accessorKey: 'geofence',
                size: 150,
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'vehiclePower',
                size: 150,
            },
            {
                header: 'boxOpen',
                accessorKey: 'boxOpen',
                size: 150,
            },
            {
                header: 'SatInView',
                accessorKey: 'satInView',
                size: 150,
            },
            {
                header: 'PowerVoltage',
                accessorKey: 'powerVoltage',
                size: 150,
            },
            {
                header: 'SatCnr',
                accessorKey: 'satCnr',
                size: 150,
            },
            {
                header: 'dIo1',
                accessorKey: 'dIo1',
                size: 100,
            },
            {
                header: 'dIo2',
                accessorKey: 'dIo2',
                size: 100,
            },
            {
                header: 'dIo3',
                accessorKey: 'dIo3',
                size: 100,
            },
            {
                header: 'dIo4',
                accessorKey: 'dIo4',
                size: 100,
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
        //console.log(table.getAllColumns())
        csvExporter.generateCsv(nmsCurrent.map(function(row){
            let datas = {};
            //console.log(row);
            table.getAllColumns().map(function(columns) {
                //console.log(columns);
                if(typeof (row[columns.id])!="undefined"){
                    datas[columns.id] = row[columns.id];
                }
                else{
                    datas[columns.id] = '';
                }
            });
            //console.log(row);
            //console.log(datas);
            return datas;
        }));
    }

    return (
        <>
            <MaterialReactTable
                title="NMS History Table"
                columns={columns}
                data={nmsCurrent}

                // Date Search
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
                    pagination: { pageIndex: 0, pageSize: 10 },
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                /*muiTableHeadCellFilterTextFieldProps={{
                    sx: { m: '0.5rem 0', width: '100%' },
                    variant: 'outlined',
                }}*/
            />

            {/*<Grid container spacing={0} >
                <Grid item xs={12} sm={7}>
                    <TableChart nmsCurrent={nmsCurrent}/>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <div className="table_chart_history_satCnr">
                        모든 단말기에 SatCnr을 모은 TableChart2 생성
                        <SatelliteChart nmsCurrent={nmsCurrent}/>
                    </div>
                </Grid>
            </Grid>*/}
            <div className="tableChartComponent">
                <TableChart sx={{textAlign: 'center'}} nmsCurrent={nmsCurrent}/>
            </div>
            {/*<Grid container spacing={1}>
                <Grid item xs={12}>
                </Grid>
            </Grid>*/}
            {/*<SatelliteChart nmsCurrent={nmsCurrent}/>*/}

        </>
    );
}

export default History;