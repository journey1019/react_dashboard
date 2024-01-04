/* React */
import React, { useState, useEffect, useMemo } from 'react';

/* Import */
import {NmsCurrentColumn} from "./Column/NmsCurrentColumn";
import DeviceDialog from "../../../table/diag/DeviceDialog";
import SendPing from "../../../TableComponents/Table/ping/SendPing";
import DetailDeviceDrawer from "../../../TableComponents/Table/detailDeviceDrawer/DetailDeviceDrawer";

/* MUI */
import MaterialReactTable from 'material-react-table';
import {Box, Grid, Button, MenuItem, IconButton, darken} from '@mui/material';
import {ExportToCsv} from "export-to-csv";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CircleIcon from "@mui/icons-material/Circle";



const Table = (props) => {
    const [nmsCurrent, setNmsCurrent] = useState([]);

    // Map Location
    const [feed, setFeed] = useState([]);

    /* 현재 네트워크 상태 객체 */
    const [deviceStatus, setDeviceStatus] = useState({
        date: '',
        preRunningDv: [],
        preCautionDv: [],
        preWarningDv: [],
        preFaultyDv: [],
    })

    /* 테이블 */
    // 새로운 열 생성(nmsCurrent 추가)
    const parsingName = {};
    const softwareResetReason = {};
    // Name Column (accessorKey : messageData
    const [nameSet, setNameSet] = useState([]);
    // Software Reset Reason Column (accessorKey : messageData)
    const [softwareSet, setSoftwareSet] = useState([]);

    // 열 토글 필터링 (사용자 편리성)
    const [manageFilterSet, setManageFilterSet] = useState([]);
    const [nameFilterSet, setNameFilterSet] = useState([]);
    const [softwareFilterSet, setSoftwareFilterSet] = useState([]);


    useEffect(() => {
        let deviceNmsList = [];

        // Present Device Status Count
        let dvStatusObj = {};
        // dvStatusObj 안 변수
        let date = new Date().toLocaleString();
        let preRunningDv = []; //array_배열
        let preCautionDv = [];
        let preWarningDv = [];
        let preFaultyDv = [];

        // 네트워크 상태 설정
        let runningDv = [];
        let cautionDv = [];
        let warningDv = [];
        let faultyDv = [];

        /* 맵 */
        let locationList = [];
        let namesList = [];
        let softwareList = [];

        /* 테이블 */
        // 열 필터링
        setManageFilterSet([]);
        setNameFilterSet([]);
        setSoftwareFilterSet([]);


        props.nmsCurrent.map(function(manageCrp){

            // ManageCrpNm Toggle Filtering
            const manage = {};
            manage.text = manageCrp.manageCrpNm;
            manage.value = manageCrp.manageCrpNm;
            manageFilterSet.push(manage);

            manageCrp["nmsInfoList"].map(function(crp){

                crp["nmsDeviceList"].map(function(device){
                    device["crpId"] = crp.crpId;
                    device["crpNm"] = crp.crpNm;
                    device["manageCrpId"] = manageCrp.manageCrpId;
                    device["manageCrpNm"] = manageCrp.manageCrpNm;

                    /* 맵 위치데이터 */
                    // deviceId, latitude, longitude
                    const location = {};
                    location.deviceId = device.deviceId;
                    location.latitude = device.latitude;
                    location.longitude = device.longitude;

                    /* String(문자열) -> JSON 변환 */
                    // device.messageData
                    try {
                        device.messageData = JSON.parse(device.messageData)
                    } catch (e) {
                        device.messageData = '';
                    }
                    // device.Name 생성
                    if (device.messageData === '') { // messageData === null
                        device.Name = ''; // Name 값 ''로 지정 -> 중복제거(모든 항목 리스트 출력)
                        if (device.Name === '') {
                            device['Name'] = ''
                        }
                    }

                    // Error 항목
                    // Fields Data Object형 [lastRe~, New~ / softwareResetReason, Exception | virturalCarrier, 304(404)]
                    if (typeof (device.messageData.Fields) !== 'undefined') {
                        // Fields Object
                        device.messageData.Fields.map(function (fieldData) {  //{Name: 'hardwareVariant', Value: 'ST6', field: {…}}
                            // fieldData _ Names 중 Name=softwareResetReason인 경우
                            // 7에 내용이 softwareResetReason인 경우
                            if (fieldData.Name === 'softwareResetReason' && fieldData !== '') { // fieldData_Name == 'softwareResetReason'
                                device.messageData["softwareResetReason"] = [fieldData.Value];
                            }
                            /*else{ // 7에 내용이 있지만, softwareResetReason이 아닌 것(msg 있음)
                                device.messageData["softwareResetReason"] = 'onlymsg';
                            }*/
                        })
                    } else {
                        device.softwareResetReason = '';
                        if (device.softwareResetReason === '') {
                            device["softwareResetReason"] = '';
                        } else {
                            device["softwareResetReason"] = '';
                        }
                    }

                    /* device.messageData(유/무) 확인 */
                    // Object 순회 _ JSON만 해당 _ Fields, Min, Name, Sin, softwareResetReason
                    if (device.messageData !== '') {
                        if (typeof (device.messageData.Fields) === 'object') {
                            //if(device.messageData)
                            // device 항목에 messageData Object 추가하기
                            for (let key of Object.keys(device.messageData)) {
                                const value = device.messageData[key]; //
                                device[key] = value.toString() || '';
                            }
                        } else {
                        }
                    } else { // messageData(없음)
                    }


                    /* 열 필터링 */
                    // nameFilterSet
                    const name = {};
                    name.text = device.Name;
                    name.value = device.Name;
                    // {text: '', value: ''} x,
                    if (name.text !== "" && parsingName[name.text] == null) {
                        nameFilterSet.push(name);
                        parsingName[name.text] = device.Name;
                    }

                    // softwareFilterSet
                    const soft = {};
                    soft.test = device.softwareResetReason;
                    soft.value = device.softwareResetReason;

                    // {text: '', value: ''} x,
                    if (soft.text !== "" && softwareResetReason[soft.text] == null) {
                        softwareFilterSet.push(soft);
                        softwareResetReason[soft.text] = device.softwareResetReason;
                    }

                    /* 장비 상태 기준 설정 */
                    // Running / Caution / Warning / Faulty (720 1080 2160 3600)
                    let runningMin = device.maxPeriod;
                    let cautionMin = runningMin * 1.5;
                    let warningMin = runningMin * 3.0;
                    let faultyMin = runningMin * 5.0;

                    /* 네트워크 상태 설정 */
                    // parseDiff _ parsingTimegap 기준
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

                    /* 장애 단말기 판별 설정 */
                    if (device.status == 'faulty') {
                        if (device.softwareResetReason == 'Exception') { //'LuaOTA'or'Exception'
                            device["statusDesc"] += ' / Software_Exception';
                        }
                        if (device.SIN == '0' && device.MIN == '2') {
                            device["statusDesc"] += ' / Protocol Error' //{SIN:0, MIN:2}
                        }
                    }

                    /* 현재 Widgets에 해당하는 단말기 리스트(항목) */
                    /*---------- deviceStatus ----------*/
                    if (device.status == 'faulty') {
                        preFaultyDv.push(device);
                    } else if (device.status == 'warning') {
                        preWarningDv.push(device);
                    } else if (device.status == 'caution') {
                        preCautionDv.push(device);
                    } else {
                        preRunningDv.push(device);
                    }

                    console.log(device);
                    deviceNmsList.push(device);
                    locationList.push(location);
                })

            })
        })
        setNmsCurrent(deviceNmsList);
        setFeed(locationList);
        setNameSet(namesList);
        setSoftwareSet(softwareList)

        /*---------------------------------------*/
        dvStatusObj.date = date;
        dvStatusObj.preRunningDv = preRunningDv;
        dvStatusObj.preCautionDv = preCautionDv;
        dvStatusObj.preWarningDv = preWarningDv;
        dvStatusObj.preFaultyDv = preFaultyDv;

        setDeviceStatus(dvStatusObj);
    }, [props.nmsCurrent])

    /* 실시간 상태 초기화 */
    // 1분에 한 번씩 자동으로 setTimeout 함수 실행
    /*setInterval(() => {
        setRefreshTime(refreshTime + 1);
        if (refreshTime > 100) {
            setRefreshTime(0);
        }
        // 1분 Timeout(60초)
    }, 60000)*/

    //setInterval(refresh, 60000)

    if (nameSet.find(e => e.Name === 'undefined')) {
        //nameSet.find(e=>e.Name === 'null');
        Object.defineProperty(nameSet, {Name: 'hi'});
        nameSet.Name = 'null';
    }

    if (softwareSet.find(e => e.softwareResetReason === 'undefined')) {
        Object.defineProperty(softwareSet, {softwareResetReason: 'hi'});
        softwareSet.softwareResetReason = 'null';
    }


    const [columnFilters, setColumnFilters] = useState([]);

    // History  _  deviceId
    const [clickRow, setClickRow] = useState("");
    const [rowSelection, setRowSelection] = useState({});


    // Table Columns Defined
    const columns = useMemo(
        () => [
            {
                header: 'Manage Crp Nm',
                accessorKey: 'manageCrpNm',
                size: 150,
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
                /*Cell: ({cell}) => {
                    return (
                        <DiagDevice cell={cell} clickRow={clickRow}/>

                    )
                }*/
            },
            {
                header: 'Vhcle Nm',
                accessorKey: 'vhcleNm',
                size: 100,
                enableColumnFilterModes: false,
            },
            {
                header: 'Time Gap',
                accessorKey: 'diff',
                size: 200,
                //type: 'percent',
                columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
                filterFn: 'betweenInclusive',
                // use betweenInclusive instead of between
                Cell: ({cell, row}) => {
                    if (row.original.maxPeriod * 5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 5.0) {
                        return <div style={{color: "darkblue", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    } else if (row.original.maxPeriod * 3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 3.0) {
                        return <div style={{color: "red", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    } else if (row.original.maxPeriod * 1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 1.5) {
                        return <div style={{color: "orange", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    } else {
                        return <div style={{color: "green", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    }
                },
            },
            {
                header: 'Parsing Time Gap',
                accessorKey: 'parseDiff',
                size: 200,
                columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
                filterFn: 'betweenInclusive',
                Cell: ({cell, row}) => {
                    if (row.original.maxPeriod * 5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 5.0) {
                        return <div style={{color: "darkblue", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    } else if (row.original.maxPeriod * 3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 3.0) {
                        return <div style={{color: "red", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    } else if (row.original.maxPeriod * 1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 1.5) {
                        return <div style={{color: "orange", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    } else {
                        return <div style={{color: "green", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                    }
                },
            },
            {
                header: 'Day Count',
                accessorKey: 'dayCount',
                size: 100,
            },
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
                size: 140,
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
                size: 140,
            },
            {
                header: 'Min Period',
                accessorKey: 'minPeriod',
                size: 140,
            },
            {
                header: 'Max Period',
                accessorKey: 'maxPeriod',
                size: 140,
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
                enableColumnFilterModes: false,
            },
            {
                header: 'Insert Date',
                accessorKey: 'insertDate',
                enableColumnFilterModes: false,

            },
            {
                header: 'Parse Date',
                accessorKey: 'parseDate',
                enableColumnFilterModes: false,
            },
            {
                header: 'Parsing Name',
                accessorKey: 'Name',
                filterFn: 'equals',
                filterSelectOptions: nameFilterSet,
                //filterSelectOptions: resultSet,
                filterVariant: 'select',
                enableColumnFilterModes: false,
                Cell: ({cell, row}) => {
                    if (row.original.Name == 'protocolError') {
                        return <div style={{
                            backgroundColor: "darkgray",
                            borderRadius: "5px",
                            color: "white"
                        }}>{cell.getValue(cell)}</div>;
                    }
                },
            },
            {
                header: 'Software Reset Reason',
                accessorKey: 'softwareResetReason',
                /*filterFn: 'equals',
                filterSelectOptions: softwareFilterSet,
                filterVariant: 'select',*/
                enableColumnFilterModes: false,
                size: 200,
                Cell: ({cell}) => {
                    return (
                        <div className={`cellWithSoftware ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                size: 100,
                Cell: ({cell}) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
                enableColumnFilterModes: false,
            },
            {
                header: 'Status Desc',
                accessorKey: 'statusDesc',
                size: 210,
                Cell: ({cell, row}) => {
                    if (row.original.statusDesc.includes('3.0 초과')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "dimgrey"
                        }}><CircleIcon sx={{ color: 'dimgrey'}}/>   {cell.getValue(cell)}</div>;
                    } else if (row.original.statusDesc.includes('1.5 초과')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "Crimson"
                        }}><CircleIcon sx={{ color: 'Crimson'}}/>   {cell.getValue(cell)}</div>;
                    } else if (row.original.statusDesc.includes('1.0 초과')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "Goldenrod"
                        }}><CircleIcon sx={{ color: 'Goldenrod'}}/>   {cell.getValue(cell)}</div>;
                    } else if (row.original.statusDesc.includes('1.0 이하')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "Mediumseagreen"
                        }}><CircleIcon sx={{ color: 'Mediumseagreen'}}/>   {cell.getValue(cell)}</div>;
                    } else {
                        return null;
                    }
                },
                enableColumnFilterModes: false,
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

    /* ===== Export All Data  | Page | Select Row =============== */
    const handleExportData = (table) => {
        csvExporter.generateCsv(nmsCurrent.map(function (row) {
            let datas = {};
            table.getAllColumns().map(function (columns) {
                if (columns['id'] != 'mrt-row-select') {
                    if (typeof (row[columns.id]) != "undefined") { // id: 'mrt-row-select' == undefined (checkbox)
                        datas[columns.id] = row[columns.id]; // Table = API
                    } else {
                        datas[columns.id] = '';
                    }
                }
            })
            return datas;
        }));
    }
    const handleExportRows = (table) => {    // Select Data
        const rows = table.getRowModel().rows;
        csvExporter.generateCsv(rows.map((row) => {
            let datas = {};
            table.getAllColumns().map(function (columns) { // columns == Table_id 값
                if (columns['id'] != 'mrt-row-select') {
                    if (typeof (row.getValue(columns.id)) != "undefined") { // id: 'mrt-row-select' == undefined (checkbox)
                        datas[columns.id] = row.getValue(columns.id); // Table = API
                    } else {
                        datas[columns.id] = '';
                    }
                }
            });
            return datas;
        }));
    };
    const handleExportSelected = (table) => {
        const selected = table.getSelectedRowModel().rows;
        csvExporter.generateCsv(selected.map((row) => {
            let datas = {};
            table.getAllColumns().map(function (columns) {
                if (columns['id'] != 'mrt-row-select') {
                    if (typeof (row.getValue(columns.id)) != "undefined") {
                        datas[columns.id] = row.getValue(columns.id);
                    } else {
                        datas[columns.id] = '';
                    }
                }
            })
            return datas;
        }))
    }
    /* ===== Table Theme Style ===============*/
    const useStyles = makeStyles({
        root: {
            flexGrow: 1
        }
    });
    const classes = useStyles();
    const BorderLinearProgress = withStyles((theme) => ({
        root: {
            height: 30,
            borderRadius: 0
        },
        colorPrimary: {
            backgroundColor:
                theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
        },
        bar: {
            borderRadius: 0,
            // how  to change color according to value???
            backgroundColor: `${props.colorPrimary} !important`
        }
    }))(LinearProgress);




    console.log(nmsCurrent);



    return(
        <>
            <MaterialReactTable
                columns={columns}
                data={nmsCurrent}
                paramOption={null}

                positionToolbarAlertBanner="top"

                renderTopToolbarCustomActions={({table, row}) => (
                    <Box
                        sx={{display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap'}}
                    >
                        {/*-------------------------------------- Export to CSV --------------------------------------*/}
                        <Button
                            color="primary"
                            onClick={() => handleExportData(table)}  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            startIcon={<FileDownloadIcon/>}
                            variant="contained"
                            size="small"
                            style={{p: '0.5rem', flexWrap: 'wrap'}}
                        >
                            Export All Data
                        </Button>
                        <Button
                            disabled={table.getRowModel().rows.length === 0}
                            onClick={() => handleExportRows(table)}  //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                            //onClick={() => handleExportRows(table.getRowModel().rows)}
                            startIcon={<FileDownloadIcon/>}
                            variant="contained"
                            size="small"
                        >
                            Export Page Rows
                        </Button>
                        <Button
                            disabled={
                                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                            }
                            //only export selected rows
                            onClick={() => handleExportSelected(table)}
                            //onClick={() => handleExportSelected(table.getSelectedRowModel().rows)}
                            startIcon={<FileDownloadIcon/>}
                            variant="contained"
                            size="small"
                        >
                            Export Selected Rows
                        </Button>
                        {/* 01595006SKY96B3 _ 선경호  */}
                        {/*------------------------------------------Message Ping----------------------------------------*/}
                        <SendPing row={row} clickRow={clickRow}/>
                    </Box>
                )}

                // 원격명령(Ping) 액션버튼
                /*----- Action Column (Ping) -----*/
                displayColumnDefOptions={{
                    'mrt-row-expand': {
                        size: 10,
                    },
                    'mrt-row-numbers': {
                        enableColumnOrdering: true, //turn on some features that are usually off
                        enableResizing: true,
                        muiTableHeadCellProps: {
                            sx: {
                                fontSize: '1.2rem',
                            },
                        },
                        enableHiding: true, //now row numbers are hidable too
                    },
                    'mrt-row-select': {
                        enableColumnActions: true,
                        enableHiding: true,
                        size: 100,
                    },
                }}

                getRowId={(row) => (row.deviceId)}
                onColumnFiltersChange={setColumnFilters} // Filtering Widgets

                // Row Select
                muiTableBodyRowProps={({row}) => ({
                    //implement row selection click events manually
                    onClick: (event) => {
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
                state={{rowSelection, columnFilters}} //pass our managed row selection state to the table to use

                enableRowActions // Action Column 추가/생성
                positionActionsColumn='last'
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                        <DetailDeviceDrawer clickRow={clickRow}/>
                    </Box>
                )}

                enableRowSelection
                enableColumnResizing // 열 사이즈 설정
                enableGrouping // 열 그룹
                enableStickyHeader
                enableStickyFooter
                enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                localization={{ // 현지화(i18n) 언어지원
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


                initialState={{
                    density: 'compact', // 행 간격 ['spacious' / 'comfortable' / 'compact']
                    expanded: true, // 모든 그룹 확장
                    showColumnFilters: true, // 각 열 필터 확장
                    exportButton: true, // 행 선택 버튼 _ 액션버튼
                    pagination: { pageIndex: 0, pageSize: 20 }, // 페이지
                    sorting: [ // 정렬 ['오름차순', '내림차순']
                        { id: 'parseDiff', desc: true },
                    ],
                    columnPinning: {left: [ 'mrt-row-actions' ], right: [ 'status' ]}, // 열 고정
                    columnVisibility: // 열 숨기기
                        { diff: false,
                            parseDiff: false,
                            dayCount: false,
                            mainKey: false,
                            subKey: false,
                            minPeriod: false,
                            maxPeriod: false,
                            receivedDate: false,
                            insertDate: false,
                            parseDate: false,
                            Name: false,
                            softwareResetReason: false
                        },
                }}

                muiToolbarAlertBannerChipProps={{color: 'primary'}}
                muiTableContainerProps={{sx: {m: '0.5rem 0', maxHeight: 700, width: '100%'}}}

                // full-size 했을 때 , 크기 변경 & onClick 했을 때 event 적용
                /*muiTableHeadCellProps={{
                    sx: {
                        "& .MuiDialog-container": {
                            paddingTop: '70px',
                        },
                        "& .MuiFormControl-root": {
                            minWidth: '0px',
                        }
                    },
                }}*/

                // 테이블 테마 _ 줄바꿈
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

            />

        </>
    )
}

export default Table;