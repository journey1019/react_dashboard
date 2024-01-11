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
    /* 현재 모든 정보를 포함한 단말기 리스트 */
    const [nmsCurrent, setNmsCurrent] = useState([]);
    
    /* 현재 네트워크 상태로 구분한 단말기 리스트 */
    const [statusNmsCurrent, setStatusNmsCurrent] = useState({
        date: '',
        runningList: [],
        cautionList: [],
        warningList: [],
        faultyList: [],
    })

    /* Map Location */
    const [feed, setFeed] = useState([]);

    /* 테이블 */
    // 열 토글 필터링 (사용자 편리성)
    const [manageFilterSet, setManageFilterSet] = useState([]);
    const [nameFilterSet, setNameFilterSet] = useState([]);
    const [softwareFilterSet, setSoftwareFilterSet] = useState([]);
    // 중복값 검사를 위한 객체
    const parsingName = {};
    const softwareResetReason = {};


    useEffect(() => {
        // All Data _ nmsCurrent
        let deviceNmsList = [];
        
        // Status All Data _ statusNmsCurrent
        let dvStatusObj = {};
        // dvStatusObj 안 변수
        let date = new Date().toLocaleString();
        let runningList = []; //array_배열
        let cautionList = [];
        let warningList = [];
        let faultyList = [];

        /* 맵 */
        let locationList = [];

        props.nmsCurrent.map(function(manageCrp){

            /* 테이블 열 필터링 */
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
                    // {deviceId, latitude, longitude}
                    const location = {};
                    location.deviceId = device.deviceId;
                    location.latitude = device.latitude;
                    location.longitude = device.longitude;

                    /* messageDatas 항목생성 - String(문자열) -> JSON변환 */
                    // messageData 항목을 JSON으로 변환하여 messageDatas 항목에 데이터 삽입
                    try { // JSON으로 변환할 수 있는 경우
                        device.messageDatas = JSON.parse(device.messageData)
                    } catch (e) { // 예외가 발생한 경우 _ messageDatas와 같은 형태로 데이터 항목들 생성
                        device.messageDatas = {};
                        device.messageDatas.Name = "";
                        device.messageDatas.Fields = [];
                    }

                    /* Error 항목 세분화를 위한 구분 */
                    // messageData _ Name & Field (SoftwareResetReason)
                    if(device.messageDatas.Fields.length != 0) { // Fields 값 있는 단말기(JSON)
                        device.messageDatas.Fields.map(function (fieldNameArray) {
                            // SoftwareResetReason 에러 구분
                            if (fieldNameArray.Name === 'softwareResetReason') {
                                device.messageDatas.SoftwareResetReason = fieldNameArray.Value;
                            } else{ // Fields Array 값은 있는데, Name이 softwareResetReason가 없는 단말기
                                device.messageDatas.SoftwareResetReason = 'Field는 있는데 soft없어~';
                            }
                        })
                    }
                    else{ // Fields Array가 빈 값인 경우
                        device.messageDatas.SoftwareResetReason = 'Field값 아예 없음 : []';
                    }

                    /* 열 필터링 생성 */
                    // messageDatas(Name) _ 여러항목 세분화
                    const name = {}; // 각 Name 삽입
                    name.text = device.messageDatas.Name;
                    name.value = device.messageDatas.Name;
                    /* 열 필터링 중복값 검사 */
                    // 조건 1. Name이 있는 device('')   _ {text: 'ping~', value: 'ping~'}
                    // 조건 2. Name이 없는 device(null) _ {null, null}
                    if(name.text !== "" && parsingName[name.text] == null) {
                        nameFilterSet.push(name);
                        parsingName[name.text] = device.messageDatas.Name;
                        console.log(parsingName)
                    }

                    // messageDatas(SoftwareResetReason)
                    const software = {};
                    software.text = device.messageDatas.SoftwareResetReason;
                    software.value = device.messageDatas.SoftwareResetReason;
                    if(software.text !== "" && softwareResetReason[software.text] == null) {
                        softwareFilterSet.push(software)
                        softwareResetReason[software.text] = device.messageDatas.SoftwareResetReason;
                    }


                    /* 장비 상태 기준 설정 */
                    // Running / Caution / Warning / Faulty (720 1080 2160 3600)
                    let runningMin = device.maxPeriod;
                    let cautionMin = runningMin * 1.5;
                    let warningMin = runningMin * 3.0;
                    let faultyMin = runningMin * 5.0;

                    /* 네트워크 상태 조건 설정 _ device 새로운 항목 생성 */
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

                    /* 네트워크 상태로 구분한 Device List */
                    if (device.status == 'faulty') {
                        faultyList.push(device);
                    } else if (device.status == 'warning') {
                        warningList.push(device);
                    } else if (device.status == 'caution') {
                        cautionList.push(device);
                    } else {
                        runningList.push(device);
                    }

                    locationList.push(location);
                    deviceNmsList.push(device);
                })

            })
        })
        dvStatusObj.date = date;
        dvStatusObj.runningList = runningList;
        dvStatusObj.cautionList = cautionList;
        dvStatusObj.warningList = warningList;
        dvStatusObj.faultyList = faultyList;

        // Status로 구분한 Nms Current
        setStatusNmsCurrent(dvStatusObj);
        // Location
        setFeed(locationList);
        // Nms Current
        setNmsCurrent(deviceNmsList);
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

    /*if (nameSet.find(e => e.Name === 'undefined')) {
        //nameSet.find(e=>e.Name === 'null');
        Object.defineProperty(nameSet, {Name: 'hi'});
        nameSet.Name = 'null';
    }

    if (softwareSet.find(e => e.softwareResetReason === 'undefined')) {
        Object.defineProperty(softwareSet, {softwareResetReason: 'hi'});
        softwareSet.softwareResetReason = 'null';
    }*/


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
                accessorKey: 'messageDatas.Name',
                filterFn: 'equals',
                filterSelectOptions: nameFilterSet,
                filterVariant: 'select',
                enableColumnFilterModes: false,
                /*Cell: ({cell, row}) => {
                    if (row.original.Name == 'protocolError') {
                        return <div style={{
                            backgroundColor: "darkgray",
                            borderRadius: "5px",
                            color: "white"
                        }}>{cell.getValue(cell)}</div>;
                    }
                },*/
                /*Cell: ({cell, row}) => {
                    if(row.original.messageDatas.Name === 'protocolError') {
                        return <div style={{
                            backgroundColor: "darkgray",
                            borderRadius: "5px",
                            color: "white"}}
                        >
                            {cell.row.original.messageDatas.Name}
                        </div>
                    }
                }*/
            },
            {
                header: 'SoftwareResetReason',
                accessorKey: 'messageDatas.SoftwareResetReason',
                filterFn: 'equals',
                filterSelectOptions: softwareFilterSet,
                filterVariant: 'select',
                enableColumnFilterModes: false,
                size: 200,
                Cell: ({cell}) => {
                    return (
                        <div className={`cellWithSoftware ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );},
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

    /* Export To CSV */
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

    // Function (Export All Data | Page | Select Row)
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
                        {/* Export to CSV */}
                        <Button // Export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            color="primary"
                            onClick={() => handleExportData(table)}
                            startIcon={<FileDownloadIcon/>}
                            variant="contained"
                            size="small"
                            style={{p: '0.5rem', flexWrap: 'wrap'}}
                        >
                            Export All Data
                        </Button>
                        <Button //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                            disabled={table.getRowModel().rows.length === 0}
                            onClick={() => handleExportRows(table)}
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

                        {/* Ping */}
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