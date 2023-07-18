import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import "./alarmHistory.scss";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Grid, Button, darken } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Dialog from "@mui/material/Dialog";
import AlarmIcon from "@mui/icons-material/Alarm";
import TextField from "@mui/material/TextField";
import { Box, MenuItem } from '@mui/material';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MaterialReactTable from "material-react-table";
import {ExportToCsv} from "export-to-csv";

import { styled } from '@mui/material/styles';

const AlarmHistory = () => {

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };
    const handleFullClose = () => {
        setFullOpen(false);
    };

    const [alarmHistory, setAlarmHistory] = useState([]);
    const [hisNum, setHisNum] = useState(0);
    const [alarmCount, setAlarmCount] = useState(0);

    /*const[startDate, setStartDate] = useState(new Date("2023-07-01").toISOString().split('T')[0]);*/
    const[startDate, setStartDate] = useState(new Date("2023-07-01").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };
    /* ------------------------ History -------------------------------- */

    useEffect(() => {
        const data = returnHistory().then(
            result => {
                if(result != null) {
                    let dataList = [];

                    setAlarmCount(result["alarmCount"])

                    result["alarmList"].map(function(detail) {

                        dataList.push(detail);
                    })
                    setAlarmHistory(dataList);
                } else{
                }
            });
        return () => {
            clearTimeout(alarmHistory);
        }
    }, [hisNum, startDate, endDate])

    useEffect(() => {
    }, [alarmHistory])


    const alrToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;

    async function returnHistory() {
        if((startDate == null || startDate == "")) {
            return null
        }
        else{
            const alrHisUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
            const alrHisParams = {startDate: (startDate + "T00:00:00"), endDate: (endDate + "T23:59:59"), desc: true};

            const alrHisHeaders = {
                "Content-Type": `application/json;charset=UTF-8`,
                "Accept": "application/json",
                "Authorization": "Bearer " + alrToken,
            };

            let returnVal = null;

            try{
                let result = await axios({
                    method: "get",
                    url: alrHisUrl,
                    headers: alrHisHeaders,
                    params: alrHisParams,
                    responseType: "json",
                })
                    .then(response => {
                        returnVal = response.data.response;
                    })
                    .then(err => {
                        return null;
                    });
                return returnVal;
            }
            catch{
                return null;
            }
        }
    }
    /* ------------------------ NMS Detail _ Search ---------------------- */

    const [alarmNmsDetail, setAlarmNmsDetail] = useState([]);
    const [nmsNum, setNmsNum] = useState(0);

    const [deviceId, setDeviceId] = useState("");
    const [rowMessageIndex, setRowMessageIndex] = useState("");

    const [openTable, setOpenTable] = useState(false);
    const handleClickTable = () => {
        //console.log('hi')
        setOpenTable(true);
    }

    useEffect(() => {
        const data = returnNmsDetail().then(
            result => {
                if(result != null) {
                    let nmsDetailList = [];
                    nmsDetailList.push(result)

                    setAlarmNmsDetail(nmsDetailList);
                } else{
                }
            });
        return () => {
            clearTimeout(alarmNmsDetail);
        }
    }, [deviceId, rowMessageIndex])

    setTimeout(() => {
        setNmsNum(nmsNum+1);
        if(nmsNum>100){
            setNmsNum(0);
        }
    }, 10000)

    useEffect(() => {
    },[alarmNmsDetail])

    async function returnNmsDetail(detailList) {
        const alrNmsUrl = "https://iotgwy.commtrace.com/restApi/nms/NmsDetail";
        const alrNmsParams = {deviceId: deviceId, rowMessageIndex: rowMessageIndex};

        const alrNmsHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try{
            let result = await axios({
                method: "get",
                url: alrNmsUrl,
                headers: alrNmsHeaders,
                params: alrNmsParams,
                responseType: "json",
            })
                .then(response => {
                    returnVal = response.data.response;

                    /*if(returnVal.receivedDate != null) {
                        handleConfirm(returnVal);
                    }*/
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        }
        catch{
            return null;
        }

    }
    /* ------------------------ NMS Alarm Detail ---------------------- */
    const [alarmDetail, setAlarmDetail] = useState([]);

    const [alarmLogIndex, setAlarmLogIndex] = useState("");
    const [openDetail, setOpenDetail] = useState(false);
    const handleClickDetail = () => {
        //console.log('hi')
        setOpenDetail(true);
    }

    useEffect(() => {
        const deDate = returnDetail().then(
            result => {
                if(result != null) {
                    let alarmDetailList = [];
                    alarmDetailList.push(result)
                    setAlarmDetail(alarmDetailList);
                }
                else{}
            }
        )
        return () => clearTimeout(alarmDetail);
    }, [alarmLogIndex])

    setTimeout(() => {
        setNmsNum(nmsNum+1);
        if(nmsNum>100){
            setNmsNum(0);
        }
    }, 10000)

    useEffect(() => {
    }, [alarmDetail]);

    async function returnDetail(alarmList) {

        const alrDetUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmDetail";
        const alrDetData = {alarmLogIndex: alarmLogIndex}

        const alrDetHeaders = {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept":"application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try {
            await axios({
                method:"get",
                url:alrDetUrl,
                headers:alrDetHeaders,
                params:alrDetData,
                responseType:"json"
            })
                .then(response => {
                    // 성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                    /*if(returnVal != null) {
                        {handleClickVariant('success')}
                    }*/
                })
                .then(err=>{
                });
            return returnVal;
        } catch {return null;}
    }

    function AlarmDetail({alarmList}){
        return(
            <div className="alarmList1">
                <div className="left">
                    <span className="rowMessageIndex">{alarmList.rowMessageIndex}</span>
                    <span className="alarmType">{alarmList.alarmType}</span>
                    <span className="alarmName">{alarmList.alarmName}</span>
                    <span className="alarmDesc">{alarmList.alarmDesc}</span>
                </div>
                <div className="right">
                    {/*<span className="notiType" style = {{color: colorReturn(type)}}>{alarmList.notiType}</span>*/}
                    <span className="notiType">{alarmList.notiType}</span>
                    <span className="apiName">{alarmList.apiName}  -  {alarmList.apiAccessId}</span>
                    <span className="deviceId">{alarmList.deviceId}</span>
                    <span className="occurCheck">{alarmList.occurCheck}</span>
                    <span className="occurDate">{alarmList.occurDate}</span>
                </div>
            </div>
        )
    }

    /* ---------------------------------------------------------------------- */

    const columns = useMemo(
        () => [
            {
                header: 'Alarm Log Index',
                accessorKey: 'alarmLogIndex'
            },
            {
                header: 'Device Id',
                accessorKey: 'deviceId'
            },
            {
                header: 'Alarm Name',
                accessorKey: 'alarmName'
            },
            {
                header: 'Alarm Type',
                accessorKey: 'alarmType'
            },
            {
                header: 'Noti Type',
                accessorKey: 'notiType'
            },
            {
                header: 'Occur Date',
                accessorKey: 'occurDate'
            },
        ]
    )

    const columnsTwo = useMemo(
        () => [
            {
                field: 'accessId',
                headerName: 'Access ID',
                editable: true
            },
            {
                field: 'deviceId',
                headerName: 'Device Id',
                editable: true
            },
            {
                field: 'vhcleNm',
                headerName: 'vhcleNm',
                editable: true
            },
            {
                field: 'insertDate',
                headerName: 'insertDate',
                editable: true
            },
            {
                field: 'mainKey',
                headerName: 'mainKey',
                editable: true
            },
            {
                field: 'subKey',
                headerName: 'subKey',
                editable: true
            },
            {
                field: 'messageData',
                headerName: 'messageData',
                editable: true
            },
            {
                field: 'messageDate',
                headerName: 'messageDate',
                editable: true
            },
            {
                field: 'messageId',
                headerName: 'messageId',
                editable: true
            },
            {
                field: 'receivedDate',
                headerName: 'receivedDate',
                editable: true
            },
        ]
    )

    /* ----------------------- History _ Table ----------------------- */

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
    const handleExportData = (table) => {
        csvExporter.generateCsv(alarmHistory.map(function(row){
            let datas = {};
            table.getAllColumns().map(function(columns) {
                if(typeof (row[columns.id])!="undefined"){
                    datas[columns.id] = row[columns.id];
                }

            });
            return datas;
        }));
    }
    
    /*--------------------------- Font Style -------------------------------*/
    const H2 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '20px',
    }));

    return(
        <>
            <IconButton color="success" aria-label="add an alarm" className='item' onClick={handleFullOpen}>
                <AlarmIcon className="icon" size="large" />
            </IconButton>

            <Dialog fullScreen open={fullOpen} sx={{ position: 'absolute', display: 'flex', alignItems: 'center', paddingLeft:'5px ', paddingBottom: '10px', borderRadius: '30px'}}>

                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleFullClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Alarm History
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleFullClose}>
                            Close
                        </Button>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={1} >
                    <Grid item xs={12} sm={6}>
                        <Box className="table" p={2}>
                            <H2>{" Alarm History Table "}</H2>
                            Start Date와 End Date를 선택하세요.<p />
                            기간 내의 Alarm 이력 확인정보를 나타냅니다.<p />
                            <MaterialReactTable
                                title="NMS History Table"
                                columns={columns}
                                data={alarmHistory}
                                defaultColumn={{
                                    size: 100,
                                }}

                                // Date Search
                                renderTopToolbarCustomActions={({ table }) => (
                                    <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
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
                                    pagination: { pageIndex: 0, pageSize: 15 },
                                }}
                                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box className="search" p={2}>

                            {/* ----------NMS alarmDetail---------*/}
                            <H2>{" Alarm Detail Search "}</H2>
                            Alarm Log Index를 입력하세요.<p />
                            Alarm의 상세 데이터를 나타냅니다.<p />
                            <TextField
                                required
                                id="alarmLogIndex"
                                name="alarmLogIndex"
                                label="Alarm Log Index"
                                variant="outlined"
                                color="error"
                                helperText="Please enter alarm Log Index"
                                autoComplete="alarmLogIndex"
                                autoFocus
                                onChange={e => setAlarmLogIndex(e.target.value)}
                                value={alarmLogIndex}
                                sx={{ paddingRight: '20px'}}
                            />
                            <Button variant="contained"
                                    onClick={handleClickDetail}
                            >
                                Execute
                            </Button>
                            <Box className="alarmDetailForm" sx={{ height: '200px', width: '100%', paddingBottom: '10px'}} open={openDetail}>
                                {alarmDetail.map((alarmList) => (
                                    <AlarmDetail alarmList={alarmList} key={alarmList.rowMessageIndex} />
                                    ))}
                            </Box>
                            <hr />

                            {/* ----------NMS Detail---------*/}
                            <H2>{" NMS Device Search "}</H2>
                            Device ID와 Row Message Index를 입력하세요.<p />
                            단말 상세 NMS 데이터를 나타냅니다.<p />
                            <TextField
                                required
                                id="deviceId"
                                name="deviceId"
                                label="Device ID"
                                variant="outlined"
                                color="error"
                                helperText="Please enter Device Id"
                                autoComplete="rowMessageIndex"
                                autoFocus
                                onChange={e => setDeviceId(e.target.value)}
                                value={deviceId}
                                sx={{ paddingRight: '20px'}}
                            />
                            <TextField
                                required
                                id="rowMessageIndex"
                                name="rowMessageIndex"
                                label="Row Message Index"
                                variant="outlined"
                                color="error"
                                helperText="Please enter Message Index"
                                autoComplete="rowMessageIndex"
                                autoFocus
                                onChange={e => setRowMessageIndex(e.target.value)}
                                value={rowMessageIndex}
                                sx={{ paddingRight: '20px'}}
                            />

                            <Button variant="contained"
                                    onClick={() => {
                                        handleClickTable()
                                    }}
                                    sx={{ margin: '10px' }}>Execute
                            </Button>
                            <p />
                            <Box sx={{ height: '200px', width: '100%' }}>
                                <DataGrid
                                    open={openTable}
                                    rows={alarmNmsDetail}
                                    columns={columnsTwo}
                                    getRowId={(row: any) => row.messageId}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}
export default AlarmHistory;