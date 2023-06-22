import React, { useState, useEffect, useMemo } from 'react';
import "./table.scss";
import History from "../../components/history/History";
//import TableChart from "../../components/tablechart/TableChart";

/* MUI */
import MaterialReactTable from 'material-react-table';
import { Box, Button } from '@mui/material';
import { darken } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';
import TableChart from "../tablechart/TableChart"; //or use your library of choice here
//import { format } from "date-fns";
//import RefreshIcon from '@mui/icons-material/Refresh';


const Table = (props) => {
    /** API **/
        // Axios 갱신을 위한 계수기 state
    const[number, setNumber] = useState(0);
    // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[feed, setFeed] = useState([]);

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });

    const [manageFilterSet, setManageFilterSet] = useState([]);

    const [msg, setMsg] = useState([]);

    // Status Period
    /*const runningMin = 1;
    const cautionMin = runningMin * 1.5;
    const warningMin = runningMin * 3.0;
    const faultyMin = runningMin * 5.0;*/

    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{
        // First table setting // 코드수정필요(임시)
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let deviceNmsList = [];
                    let locationList = [];
                    let parsingMsgList = [];

                    let running = 0;
                    let caution = 0;
                    let warning = 0;
                    let faulty = 0;

                    let diffObj = {};

                    setManageFilterSet([]);

                    //result 배열 풀기
                    result.map(function (manageCrp){
                        const manage = {};

                        manage.text = manageCrp.manageCrpNm;
                        manage.value = manageCrp.manageCrpNm;

                        manageFilterSet.push(manage);

                        //manageCrp 배열 내의 crp 풀기
                        manageCrp['nmsInfoList'].map(function (crp){

                            //Crp 배열 내의 Device 풀기
                            crp["nmsDeviceList"].map(function (device){

                                const location = {};
                                const parsingMsg = {};

                                //manageCrp,crp 정보 입력
                                device["crpId"] = crp.crpId;
                                device["crpNm"] = crp.crpNm;
                                device["manageCrpId"] = manageCrp.manageCrpId;
                                device["manageCrpNm"] = manageCrp.manageCrpNm;

                                // DeviceId, Location{latitude, longitude}
                                location.deviceId = device.deviceId;
                                location.latitude = device.latitude;
                                location.longitude = device.longitude;

                                // MessageData
                                parsingMsg.messageData = device.messageData;

                                /* Status Period 값  */
                                let runningMin = device.maxPeriod;
                                let cautionMin = runningMin * 1.5;
                                let warningMin = runningMin * 3.0;
                                let faultyMin = runningMin * 5.0;


                                // Widgets {running, caution, warning, faulty} // 720 1080 2160 3600
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

                                //device의 정보를 생성한 배열에 push
                                deviceNmsList.push(device);
                                locationList.push(location);
                                parsingMsgList.push(parsingMsg);
                                //console.log(device);
                                console.log(device.messageData);

                            });
                        });
                    });
                    //parsing 된 전체 device 정보 갱신
                    setNmsCurrent(deviceNmsList);

                    setFeed(locationList);
                    console.log(feed);

                    setMsg(parsingMsgList);
                    console.log(msg);

                    diffObj.running = running;
                    diffObj.caution = caution;
                    diffObj.warning = warning;
                    diffObj.faulty = faulty;

                    setDiffStatus(diffObj);

                }else{
                }
            });
        return () => {
            clearTimeout(nmsCurrent);
        }
        //계수기 변경 때마다 동작하게 설정
    },[number]);
    // 전체 데이터 변경 확인
    // 현재 nmsCurrent 값은 배열 --> useState에서 데이터 수신 시 마다 갱신을 확인하여
    // 변경으로 간주됨

    console.log(nmsCurrent); // string -> JSON 형태로 Parse

    // Refresh
    setTimeout(() => {
        setNumber(number + 1);
        if(number > 100){
            setNumber(0);
        }
        // 1분 Timeout
    }, 60000)

    useEffect(() => {
        props.MapChange(nmsCurrent)
    }, [nmsCurrent]);

    useEffect(() => {
        props.WidgetCount(diffStatus)
    }, [diffStatus])

    // Status Button Click, type 값 출력
    useEffect(() => {
        //console.log(props.statusClick);
    },[props.StatusClick]);

    useEffect(() => {
        const setStatusData = [{id : 'status', value : props.statusClickValue}];
        setColumnFilters(setStatusData); // running
        //setStatusData --> {id: 'status', value: 'warning'}
    },[props.statusClickValue]);


    async function returnData(){

        //{"authType":"TOKEN","authKey":"6e229700-b78a-4a97-904d-255a434ab2e4","authExpired":"2023-06-22T06:47:42"}
        console.log(sessionStorage.getItem('userInfo'));

        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
        const params = {detailMessage: true};

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
            let result = await axios({
                method:"get",//통신방식
                url : urls,//URL
                headers : headers,//header
                params:params,
                responseType:"json"
            })
                .then(response =>{
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
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

    // Table Columns Defined
    const columns = useMemo(
        () => [
            {
                header: 'Manage Crp Nm',
                accessorKey: 'manageCrpNm',
                filterFn: 'equals',
                filterSelectOptions: manageFilterSet,
                filterVariant: 'select',
                enableColumnFilterModes: false, // filter mode change
            },
            {
                header: 'Crp Nm',
                accessorKey: 'crpNm',
                enableColumnFilterModes: false,
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableGrouping: false, //do not let this column be grouped
                enableColumnFilterModes: false,
            },
            {
                header: 'Vhcle Number',
                accessorKey: 'vhcleNm',
                enableColumnFilterModes: false,
            },
            {
                header: 'Time Gap',
                accessorKey: 'diff',
                size: 230,
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan'], //only allow these filter modes
                filterFn: 'between',
                // use betweenInclusive instead of between
                Cell: ({ cell, row }) => {
                    if(row.original.maxPeriod*5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod*5.0) {
                        return <div style={{backgroundColor : "darkgray", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(row.original.maxPeriod*3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod*3.0) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(row.original.maxPeriod*1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod*1.5) {
                        return <div style={{backgroundColor : "yellow", borderRadius:"5px", color: "black" }}>{cell.getValue(cell)}</div>;
                    }
                    else {
                        return <div style={{backgroundColor : "green", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                },
            },
            {
                header: 'Parsing Time Gap',
                accessorKey: 'parseDiff',
                size: 230,
                filterFn: 'between',
                Cell: ({ cell, row }) => {
                    if(row.original.maxPeriod*5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod*5.0) {
                        return <div style={{backgroundColor : "darkgray", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(row.original.maxPeriod*3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod*3.0) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(row.original.maxPeriod*1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod*1.5) {
                        return <div style={{backgroundColor : "yellow", borderRadius:"5px", color: "black" }}>{cell.getValue(cell)}</div>;
                    }
                    else {
                        return <div style={{backgroundColor : "green", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                },
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
            },
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
                //render:(data)=> <div style={{background:data.subKey<=2?"Green":"red"}}>{data.subKey}</div>,
            },
            {
                header: 'Day Count',
                accessorKey: 'dayCount',
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
                enableColumnFilterModes: false,
            },
            {
                header: 'Min Period',
                accessorKey: 'minPeriod',
                size: 230,
                filterFn: 'between',
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
            },
            {
                header: 'Max Period',
                accessorKey: 'maxPeriod',
                size: 230,
                filterFn: 'between',
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
            },
            {
                header: 'Insert Date',
                accessorKey: 'insertDate',
                enableColumnFilterModes: false,
            },
            {
                header: 'Parsing Message Data',
                accessorKey: 'messageData',
                size: 250,
                enableColumnFilterModes: false,
            },
            /* Detail_true Data */
            /*{
                header: 'Protocol-type',
                accessorKey: '',
                enableColumnFilterModes: false,
            },
            {
                header: 'Protocol-Field 1',
                accessorKey: '',
                enableColumnFilterModes: false,
            },
            {
                header: 'Protocol-Field 2',
                accessorKey: '',
                enableColumnFilterModes: false,
            },*/
            {
                header: 'Status',
                accessorKey: 'status',
                Cell: ({ cell }) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
                enableColumnFilterModes: false,
            },
        ],
        [],
    );

    const [columnFilters, setColumnFilters] = useState([]);

    // History  _  deviceId
    const [clickRow, setClickRow] = useState("");

    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        props.MapClick( clickRow );

        let values = {};
        values[clickRow] = true;
        setRowSelection(values)
    }, [clickRow]); // deviceId

    useEffect(() => {
        console.log(rowSelection); // {01680375SKY7E10: true}

        for(let key of Object.keys(rowSelection)) {
            //setClickRow(key);
            console.log(key);
        };

    }, [rowSelection]);

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
                title="NMS Current Table"
                columns={columns}
                data={nmsCurrent}

                // Export to CSV
                positionToolbarAlertBanner="bottom"
                renderTopToolbarCustomActions={({ table }) => (
                    <Box
                        sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                    >
                        <Button
                            color="primary"
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={handleExportData}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export All Data
                        </Button>
                        {/*<Button
                            disabled={table.getPrePaginationRowModel().rows.length === 0}
                            //export all rows, including from the next page, (still respects filtering and sorting)
                            onClick={() =>
                                handleExportRows(table.getPrePaginationRowModel().rows)
                            }
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export All Rows
                        </Button>*/}
                        <Button
                            disabled={table.getRowModel().rows.length === 0}
                            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                            onClick={() => handleExportRows(table.getRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export Page Rows
                        </Button>
                        <Button
                            disabled={
                                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                            }
                            //only export selected rows
                            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export Selected Rows
                        </Button>
                    </Box>
                )}

                getRowId={(row) => row.deviceId} // row select
                onColumnFiltersChange={setColumnFilters}

                // Row Select
                muiTableBodyRowProps={({ row }) => ({
                    //implement row selection click events manually
                    onClick: (event) =>{
                        setClickRow(row.id); // History 연결
                    },
                    sx: {
                        cursor: 'pointer',
                        /*"& .MuiTableRow-root" : {
                            backgroundColor: clickRowBackground,
                        },*/
                    },

                })}
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection, columnFilters }} //pass our managed row selection state to the table to use
                enableRowSelection
                enableColumnResizing
                enableGrouping // Column Grouping
                enableStickyHeader
                enableStickyFooter
                enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                localization={{
                    filterCustomFilterFn: 'Custom Filter Fn',
                }}
                filterFns={{
                    customFilterFn: (cell, filterValue) => {
                        return cell.getValue(cell) === filterValue;
                    },
                }}

                initialState={{
                    exportButton: true,
                    showColumnFilters: true,
                    density: 'compact', // interval
                    expanded: true, //expand all groups by default
                    /*grouping: ['manageCrpNm', 'crpNm'], //an array of columns to group by by default (can be multiple)*/
                    pagination: { pageIndex: 0, pageSize: 100 },
                    sorting: [
                        /*{ id: 'manageCrpNm', desc: false },*/
                        { id: 'parseDiff', desc: true },
                    ],
                }}

                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                // full-size 했을 때 , 크기 변경 & onClick 했을 때 event 적용
                muiTableHeadCellProps={{
                    sx: {
                        "& .MuiDialog-container": {
                            paddingTop: '70px',
                        }
                    },
                }}
                // 줄바꿈 Theme
                muiTablePaperProps = {{
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
            <hr />
            <History clickRow={clickRow}/>
        </>
    );
};

export default Table;