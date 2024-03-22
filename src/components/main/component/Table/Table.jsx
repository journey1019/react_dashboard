/* React */
import React, { useState, useEffect, useMemo } from 'react';

/* Import */
import "./table.scss";
import {NmsCurrentColumn} from "./Column/NmsCurrentColumn";
import DeviceDialog from "../../../table/diag/DeviceDialog";
import SendPing from "./SendPing/SendPing";
import DetailDeviceDrawer from "../../../TableComponents/Table/detailDeviceDrawer/DetailDeviceDrawer";
// 위 import 코드 변경 _ Diagnostic 시각화 등 수정(추가)해야 할 폴더&파일 많아서
import DrawerDevice from "./DrawerDevice/DrawerDevice";

/* MUI */
import MaterialReactTable from 'material-react-table';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {TextField, Box, Grid, Button, MenuItem, IconButton, darken} from '@mui/material';
import {ExportToCsv} from "export-to-csv";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CircleIcon from "@mui/icons-material/Circle";

/*
import useUnits from 'rxn-units';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
*/


const Table = (props) => {
    //var {vw, vh, vmin, vmax} = require('react-native-viewport-units');
    //console.log(props);
    const { startDate, endDate } = props;
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

    /* Material React Table 스타일 변경 */
    const theme = createTheme({
        overrides: {
            MuiTextField: {
                root: {
                    width: '100%', // 예시: 너비 100%
                },
            },
        },
    });
    //console.log(props.nmsCurrent)


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
            //console.log(manage)
            manageFilterSet.push(manage);

            manageCrp["nmsInfoList"].map(function(crp){
                crp["nmsDeviceList"].map(function(device){
                    //console.log(device)
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
                        if(device.messageDatas.hasOwnProperty('Fields') === false) {
                            device.messageDatas.Fields = [];
                        }
                    } catch (e) { // 예외가 발생한 경우 _ messageDatas와 같은 형태로 데이터 항목들 생성
                        device.messageDatas = {};
                        device.messageDatas.Name = "";
                        device.messageDatas.Fields = [];
                    }
                    //console.log(device.messageDatas.Fields)
                    // Name 이 'softwareResetReason'인 객체 찾기
                    const softwareResetReasonObj = device.messageDatas.Fields.find(obj => obj.Name === 'softwareResetReason');
                    // Fields 배열의 길이 확인
                    if (device.messageDatas.Fields.length > 0) {
                        // Name이 'softwareResetReason'인 객체를 찾기
                        const softwareResetReasonObj = device.messageDatas.Fields.find(obj => obj.Name === 'softwareResetReason');

                        // softwareResetReasonObj가 존재하면 그 값을 가져와서 새로운 키에 할당
                        if (softwareResetReasonObj) {
                            device.messageDatas.SoftwareResetReason = softwareResetReasonObj.Value;
                        } else {
                            // Fields에는 있지만 softwareResetReason이 없는 경우
                            //device.messageDatas.SoftwareResetReason = 'Field 값은 있지만, Soft X';
                            device.messageDatas.SoftwareResetReason = '';
                        }
                    } else {
                        // Fields가 비어 있는 경우
                        //device.messageDatas.SoftwareResetReason = 'Field 값 아예 비었음';
                        device.messageDatas.SoftwareResetReason = '';
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
                    }

                    // messageDatas(SoftwareResetReason)
                    const software = {};
                    software.text = device.messageDatas.SoftwareResetReason;
                    software.value = device.messageDatas.SoftwareResetReason;
                    if(software.text !== "" && softwareResetReason[software.text] == null) {
                        softwareFilterSet.push(software)
                        softwareResetReason[software.text] = device.messageDatas.SoftwareResetReason;
                    }


                    /* 장비 상태 기준 & 네트워크 상태 조건 설정 */
                    // Running / Caution / Warning / Faulty (720 1080 2160 3600)
                    let runningMin = device.maxPeriod * 1.0;
                    let cautionMin = runningMin * 1.5 ;
                    let warningMin = runningMin * 3.0;
                    let faultyMin = runningMin * 3.0;
                    // parseDiff _ parsingTimegap 기준
                    if ((faultyMin > 0 && device.parseDiff > faultyMin) || (device.softwareResetReason == 'Exception') || (device.SIN == '0' && device.MIN == '2')) {
                        device["status"] = 'faulty';
                        device["statusDesc"] = 'MaxPeriod * 3.0 초과';
                    } else if (warningMin > 0 && device.parseDiff > cautionMin && device.parseDiff <= faultyMin) {
                        //console.log('Warning 단말기 : ', device)
                        device["status"] = 'warning';
                        device["statusDesc"] = 'MaxPeriod * 1.5 초과 ~ 3.0 이하';
                    } else if (cautionMin > 0 && device.parseDiff > runningMin && device.parseDiff <= cautionMin) {
                        //console.log('Caution 단말기 : ', device)
                        device["status"] = 'caution';
                        device["statusDesc"] = 'MaxPeriod * 1.0 초과 ~ 1.5 이하';
                    } else {
                        device["status"] = 'running';
                        device["statusDesc"] = 'MaxPeriod * 1.0 이하';
                        // Def : 데이터 수신 최대주기 초과
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

    //console.log("current vmin", vmin());
    //console.log("current vmax", vmax());

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


    // History  _  deviceId
    const [clickRow, setClickRow] = useState("");
    // CheckBox - RowSelect
    const [rowSelection, setRowSelection] = useState({});

    /* Table -> Map */
    // Map에 Location(deviceId, lat, lon)정보가 있는 mapNmsCurrent로 전달
    useEffect(() => {
        props.MapLists(nmsCurrent);
    }, [nmsCurrent]);
    // Table Row 클릭 시, clickRow(deviceId) Marker로 보여줌
    useEffect(() => {
        props.MapClick(clickRow);

        let values = {};
        values[clickRow] = true;
        setRowSelection(values);
    }, [clickRow]);

    // Row
    useEffect(() => {
        for (let key of Object.keys(rowSelection)) {
            setClickRow(key);
        }
    }, [rowSelection]);


    //(nmsCurrent);


    /* SessionStorage 저장 -> Device(Component) */
    // 배열을 JSON 문자열로 변환하여 Session Storage에 저장
    sessionStorage.setItem('nmsCurrent', JSON.stringify(nmsCurrent));

    /** @type {authExpired: "YYYY-MM-DDTHH:mm:ss", authKey: string, authType: "TOKEN", roleId: "SUPER_ADMIN"} */
    const session = JSON.parse(sessionStorage.getItem("userInfo"));


    let columns = useMemo(() => {
        if(session && (session.roleId === 'SUPER_ADMIN' || session.roleId === 'ADMIN')) {
            return[
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
                    header: '회사명',
                    accessorKey: 'crpNm',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Device ID',
                    accessorKey: 'deviceId',
                    //enableGrouping: false, //do not let this column be grouped
                    enableColumnFilterModes: false,
                    /*Cell: ({cell}) => {
                        return (
                            <DiagDevice cell={cell} clickRow={clickRow}/>

                        )
                    }*/
                },
                {
                    header: 'Device Alias',
                    accessorKey: 'vhcleNm',
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
                    header: 'Time Gap(w/o SysMsg)',
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
                    header: '송신개수/일',
                    accessorKey: 'dayCount',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Latitude',
                    accessorKey: 'latitude',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Longitude',
                    accessorKey: 'longitude',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Main Key',
                    accessorKey: 'mainKey',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Sub Key',
                    accessorKey: 'subKey',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'MSG ID',
                    accessorKey: 'messageId',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Payload',
                    accessorKey: 'messageData',
                    enableColumnFilterModes: false,
                },
                {
                    header: '송신주기(MIN)',
                    accessorKey: 'minPeriod',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: '송신주기(MAX)',
                    accessorKey: 'maxPeriod',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Rcvd Date',
                    accessorKey: 'receivedDate',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Event Date',
                    accessorKey: 'parseDate',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Event',
                    accessorKey: 'messageDatas.Name',
                    filterFn: 'equals',
                    filterSelectOptions: nameFilterSet,
                    filterVariant: 'select',
                    enableColumnFilterModes: false,
                    size: 140,
                },
                {
                    header: 'SW Reset Reason',
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
                    enableColumnFilterModes: false,
                    Cell: ({cell}) => {
                        return (
                            <div className={`cellWithStatusColor ${cell.getValue(cell)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {cell.getValue(cell)}
                            </div>
                        );
                    },
                    filterComponent: (props) => <TextField {...props} label="Filter" />
                },
                {
                    header: 'Status Desc',
                    accessorKey: 'statusDesc',
                    size: 210,
                    enableColumnFilterModes: false,
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
                },
            ]
        }
        else if (session && session.roleId === 'NMS_USER') {
            return [
                {
                    header: '회사명',
                    accessorKey: 'crpNm',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Device ID',
                    accessorKey: 'deviceId',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Device Alias',
                    accessorKey: 'vhcleNm',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Event Date',
                    accessorKey: 'parseDate',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Rcvd Date',
                    accessorKey: 'receivedDate',
                    enableColumnFilterModes: false,
                },
                {
                    header: '송신개수/일',
                    accessorKey: 'dayCount',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Main Key',
                    accessorKey: 'mainKey',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Sub Key',
                    accessorKey: 'subKey',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Payload',
                    accessorKey: 'messageData',
                    enableColumnFilterModes: false,
                },
                {
                    header: '송신주기(MIN)',
                    accessorKey: 'minPeriod',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: '송신주기(MAX)',
                    accessorKey: 'maxPeriod',
                    size: 140,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Status',
                    accessorKey: 'status',
                    size: 100,
                    enableColumnFilterModes: false,
                    Cell: ({cell}) => {
                        return (
                            <div className={`cellWithStatusColor ${cell.getValue(cell)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {cell.getValue(cell)}
                            </div>
                        );
                    },
                    filterComponent: (props) => <TextField {...props} label="Filter" />
                },
                {
                    header: 'Status Desc',
                    accessorKey: 'statusDesc',
                    size: 210,
                    enableColumnFilterModes: false,
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
                },
            ];
        }
        else {
            return []; // 기본적으로 빈 배열을 반환하거나 다른 기본값을 반환할 수 있음
        }
    }, [session]);


    /* Main (Table - Widget) */
    // Widget 각 type에 맞게 단말기 리스트 세분화
    useEffect(() => {
        props.WidgetStatusLists(statusNmsCurrent)
    }, [statusNmsCurrent])

    /* Main (Widget - Table) */
    // Column id가 'status인 값 - Widget버튼 클릭 시 value 값 매칭
    useEffect(() => {
        const setStatusData = [{id: 'status', value: props.statusClickValue}];
        setColumnFilters(setStatusData);
    }, [props.statusClickValue]);

    // 'Status' 항목 Filter
    const [columnFilters, setColumnFilters] = useState([]);


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

    //console.log(nmsCurrent)

    return(
        <>
            <div style={{maxWidth: 'calc(100vmax - 140px)'}}>
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
                                onClick={() => handleExportData(table)}
                                startIcon={<FileDownloadIcon/>}
                                variant="outlined"
                                size="small"
                                style={{p: '0.5rem', flexWrap: 'wrap'}}
                                color="error"
                            >
                                Export All
                            </Button>
                            <Button //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                                disabled={table.getRowModel().rows.length === 0}
                                onClick={() => handleExportRows(table)}
                                //onClick={() => handleExportRows(table.getRowModel().rows)}
                                startIcon={<FileDownloadIcon/>}
                                variant="outlined"
                                size="small"
                                color="error"
                            >
                                Export Page
                            </Button>
                            <Button
                                disabled={
                                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                }
                                //only export selected rows
                                onClick={() => handleExportSelected(table)}
                                //onClick={() => handleExportSelected(table.getSelectedRowModel().rows)}
                                startIcon={<FileDownloadIcon/>}
                                variant="outlined"
                                size="small"
                                color="error"
                            >
                                Export Selected
                            </Button>

                            {/* Ping */}
                            <SendPing row={row} clickRow={clickRow} startDate={startDate} endDate={endDate}/>
                        </Box>
                    )}

                    // 원격명령(Ping) 액션버튼
                    /*----- Action Column (Ping) -----*/
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            size: 50, //set custom width
                            muiTableHeadCellProps: {
                                align: 'center', //change head cell props
                            },
                        },
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
                            size: 50,
                        },
                    }}

                    getRowId={(row) => (row.deviceId)} // 각 행에 더 유용한 ID 지급
                    onColumnFiltersChange={setColumnFilters} // Filtering Widgets Status

                    // Row Select
                    muiTableBodyRowProps={({row}) => ({
                        //implement row selection click events manually
                        onClick: (event) => {
                            setClickRow(row.id); // History 연결
                        },
                        // 행의 아무 곳이나 클리할 때 선택하려면 행에 onClick 추가
                        sx: {
                            cursor: 'pointer',
                            /*"& .MuiTableRow-root" : {
                                backgroundColor: clickRowBackground,
                            },*/
                        },

                    })}
                    onRowSelectionChange={setRowSelection} // 내부 행 선택 상태를 자신의 상태에 연결
                    // 관리되는 행 선택 상태를 테이블에 전달하여 사용
                    state={{rowSelection, columnFilters}}

                    enableRowActions // Action Column 추가/생성
                    positionActionsColumn='last'
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <DrawerDevice clickRow={clickRow} />
                            {/*<DetailDeviceDrawer clickRow={clickRow}/>*/}
                        </Box>
                    )}

                    enableRowSelection // CheckBox
                    enableMultiRowSelection = {false} // 체크박스 대신 라디오 버트 사용
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
                        /*columnVisibility: // 열 숨기기
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
                            },*/
                    }}

                    muiToolbarAlertBannerChipProps={{color: 'primary'}}
                    muiTableContainerProps={{sx: {m: '0.5rem 0', maxHeight: 700}}}

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
                {/*<ThemeProvider theme={theme} sx={{ maxWidth : '100%', overflowX: 'auto '}}>
                </ThemeProvider>*/}
            </div>
        </>
    )
}

export default Table;