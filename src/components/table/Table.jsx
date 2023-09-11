import React, { useState, useEffect, useMemo } from 'react';
import "./table.scss";
import History from "../../components/history/History";
import SendPing from "./ping/SendPing";

/* MUI */
import MaterialReactTable from 'material-react-table';
import { Box, Button, MenuItem, IconButton } from '@mui/material';
import Modal from "@mui/material/Modal";
import { darken } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendSharpIcon from '@mui/icons-material/SendSharp';
import LocationOnIcon from '@mui/icons-material/LocationOn';


import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';

import Fade from '@mui/material/Fade';
import { Grid } from "@mui/material";
import _ from 'lodash';
import TextField from "@mui/material/TextField";

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const Table = (props) => {
    /** API **/
        // Axios 갱신을 위한 계수기 state
    const[number, setNumber] = useState(0);
    // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[feed, setFeed] = useState([]);

    // Column Filtering
    const parsingName = {};
    const softwareResetReason = {};

    /* ---- nmsCurrent _ messageData _ Name ----*/
    const[nameSet, setNameSet] = useState([]);
    const[softwareSet, setSoftwareSet] = useState([]);
    /* ----------- Status _ 각 type 개수(Count) --------*/
    const [deviceStatus, setDeviceStatus] = useState({
        date : '',
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    })

    // Table Toggle Filtering
    const [manageFilterSet, setManageFilterSet] = useState([]);
    const [nameFilterSet, setNameFilterSet] = useState([]);
    const [softwareFilterSet, setSoftwareFilterSet] = useState([]);

    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let deviceNmsList = [];

                    /*----------------*/
                    let dvStatusObj = {}; //object

                    let date = new Date().toLocaleString();
                    let preRunningDv = []; //array_배열
                    let preCautionDv = [];
                    let preWarningDv = [];
                    let preFaultyDv = [];
                    /*----------------*/


                    let locationList = [];
                    let namesList = [];
                    let softwareList = [];

                    /*Filter*/
                    setManageFilterSet([]);
                    setNameFilterSet([]);
                    setSoftwareFilterSet([]);

                    // result 배열 풀기
                    result.map(function(manageCrp){
                        // ManageCrpNm Toggle Filtering
                        const manage = {};
                        manage.text = manageCrp.manageCrpNm;
                        manage.value = manageCrp.manageCrpNm;

                        manageFilterSet.push(manage);

                        //manageCrp 객체 내의 crp 풀기
                        manageCrp['nmsInfoList'].map(function (crp){
                            //Crp 객체 내의 Device 풀기
                            crp["nmsDeviceList"].map(function (device){
                                //manageCrp,crp 정보 입력
                                device["crpId"] = crp.crpId;
                                device["crpNm"] = crp.crpNm;
                                device["manageCrpId"] = manageCrp.manageCrpId;
                                device["manageCrpNm"] = manageCrp.manageCrpNm;

                                // DeviceId, Location{latitude, longitude}
                                const location = {};
                                location.deviceId = device.deviceId;
                                location.latitude = device.latitude;
                                location.longitude = device.longitude;

                                // JSON 형태로 변환 _ messageData (detailMessage: true)
                                try{
                                    device.messageData = JSON.parse(device.messageData)
                                }
                                catch(e) {
                                    device.messageData = '';
                                }

                                // Name Filtering - Name 값 지정
                                if(device.messageData === ''){ // Name(undefined)->Name('') && device.Name===''
                                    device.Name = ''; // Name 값 ''로 지정 -> 중복제거(모든 항목 리스트 출력)
                                    if(device.Name === '') {
                                        device['Name'] = ''
                                    }
                                }

                                // Fields Data Object형 [lastRe~, New~ / softwareResetReason, Exception | virturalCarrier, 304(404)]
                                if(typeof(device.messageData.Fields) !== 'undefined') {
                                    // Fields Object
                                    device.messageData.Fields.map(function(fieldData) {  //{Name: 'hardwareVariant', Value: 'ST6', field: {…}}
                                        // fieldData _ Names 중 Name=softwareResetReason인 경우
                                        // 7에 내용이 softwareResetReason인 경우
                                        if(fieldData.Name === 'softwareResetReason' && fieldData !== '') { // fieldData_Name == 'softwareResetReason'
                                            device.messageData["softwareResetReason"] = [fieldData.Value];
                                        }
                                        else{ // 7에 내용이 있지만, softwareResetReason이 아닌 것(msg 있음)
                                            device.messageData["softwareResetReason"] = 'onlymsg';
                                        }
                                    })
                                }
                                else{
                                    device.softwareResetReason = '';
                                    if(device.softwareResetReason === ''){
                                        device["softwareResetReason"] = '';
                                    }
                                    else{
                                        device["softwareResetReason"] ='';
                                    }
                                }

                                // Object 순회 _ messageData(유/무): Fields, MIN, Name, SIN, softwareResetReason
                                // JSON 만 해당
                                if(device.messageData !== '') {
                                    if(typeof(device.messageData.Fields) === 'object'){
                                        //if(device.messageData)
                                        // device 항목에 messageData Object 추가하기
                                        for (let key of Object.keys(device.messageData)) {
                                            const value = device.messageData[key]; //
                                            //console.log(value); // Name, Sin, Min, Fields
                                            device[key] = value.toString() || '';
                                        }
                                    }
                                    else{
                                    }
                                } else{ // messageData(무)
                                }


                                /* ---------------- setNameFilterSet -----------*/
                                // messageData.Name column Filtering
                                const name = {};


                                name.text = device.Name;
                                name.value = device.Name;

                                // {text: '', value: ''} x,
                                if( name.text!=="" && parsingName[name.text]==null){
                                    nameFilterSet.push(name);
                                    parsingName[name.text] = device.Name;
                                }

                                /* ---------------- setSoftwareFilterSet -----------*/
                                const soft = {};

                                soft.test = device.softwareResetReason;
                                soft.value = device.softwareResetReason;

                                // {text: '', value: ''} x,
                                if( soft.text!=="" && softwareResetReason[soft.text]==null){
                                    softwareFilterSet.push(soft);
                                    softwareResetReason[soft.text] = device.softwareResetReason;
                                }

                                /*------------------------------------------------------------------------------------------------*/

                                /* Status Period 기준값 */
                                let runningMin = device.maxPeriod;
                                let cautionMin = runningMin * 1.5;
                                let warningMin = runningMin * 3.0;
                                let faultyMin = runningMin * 5.0;

                                // Widgets {running, caution, warning, faulty} // 720 1080 2160 3600
                                if(faultyMin > 0 && device.parseDiff > faultyMin) {
                                    device["status"] = 'faulty';
                                } else if(warningMin > 0 && device.parseDiff > warningMin) {
                                    device["status"] = 'warning';
                                } else if(cautionMin > 0 && device.parseDiff > cautionMin) {
                                    device["status"] = 'caution';
                                } else{
                                    device["status"] = 'running';
                                }

                                /*---------- deviceStatus ----------*/
                                if(device.status == 'faulty'){
                                    preFaultyDv.push(device);
                                } else if(device.status == 'warning'){
                                    preWarningDv.push(device);
                                } else if(device.status == 'caution'){
                                    preCautionDv.push(device);
                                } else{
                                    preRunningDv.push(device);
                                }

                                //device의 정보를 생성한 배열에 push
                                deviceNmsList.push(device);
                                console.log(device);
                                locationList.push(location);
                                /*namesList.push(names);*/
                            });
                        });
                    });
                    //example.map((item) => item.text === 'undefined' ? {...item, text:''} : item)

                    /*const example1 = example.map(obj => {
                        return(
                            {...obj, text: '', value: ''}
                        )
                    })*/
                    /*const example1 = example.map(obj => {
                        if(obj.text === 'undefined'){
                            return(
                                {...obj, text: '', value: ''}
                            )
                        }
                    })
                    console.log(example1);*/
                    /*example.map(item => {
                        if(item.text === 'undefined'){
                            item["key"] = "value"
                        }
                    })*/
                    //console.log(example1);
                    //console.log([...new Set(example1.map(JSON.stringify))].map(JSON.parse));
                    //nameFilterSet.push([...new Set(example1.map(JSON.stringify))].map(JSON.parse));
                    //nameFilterSet.push([...new Set(example1.map(JSON.stringify))].map(JSON.parse))
                    /*nameFilterSet.push(example.map(obj => {
                        return (
                            {...obj, text:'', value: ''}
                        )
                    }))*/
                    /*const mapArr = example.map(obj => {
                        return(
                            {...obj, text: '', value: ''}
                        )
                    })
                    console.log(mapArr);*/
                    //console.log(nameFilterSet);



                    //console.log(example);

                    //console.log([...new Set(example.map(JSON.stringify))].map(JSON.parse));
                    //setNameFilterSet([...new Set(example.map(JSON.stringify))].map(JSON.parse));
                    //console.log(setNameFilterSet);
                    //setNameFilterSet([...new Set(example.map(JSON.stringify))].map(JSON.parse));
                    /*setNameFilterSet(example.reduce((acc,current) => {
                        const x = acc.find(item => item.text == current.text);
                        console.log(x.text);
                        if(!x) {
                            console.log(acc.concat([current]));
                            console.log(current);
                            //setNameFilterSet.push(current);
                            return acc.concat([current]);
                        } else{
                            console.log(acc);
                            return acc;
                        }
                    }, []));
                    console.log(nameFilterSet);*/
                    //nameFilterSet.filter((arr, index, callback) => index === callback.findIndex(t=>t.text === arr.text));


                    //parsing 된 전체 device 정보 갱신
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

    //console.log(nmsCurrent); // string -> JSON 형태로 Parse

    JSON.stringify(nmsCurrent);

    // name == 'undefined' -> 'null'
    if(nameSet.find(e=>e.Name === 'undefined')){
        //nameSet.find(e=>e.Name === 'null');
        Object.defineProperty(nameSet, {Name: 'hi'});
        nameSet.Name = 'null';
    }

    if(softwareSet.find(e=>e.softwareResetReason === 'undefined')){
        Object.defineProperty(softwareSet, {softwareResetReason: 'hi'});
        softwareSet.softwareResetReason = 'null';
    }
    //console.log(nameSet);
    // filter 값 생성

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
        props.WidgetCount(deviceStatus)
    }, [deviceStatus])


    // Status Button Click, type 값 출력
    useEffect(() => {
    },[props.StatusClick]);
    // Status Menu Option Click, device 값 출력
    useEffect(() => {
    }, [props.OptionClick])

    useEffect(() => {
        const setStatusData = [{id : 'status', value : props.statusClickValue}];
        const setOptionData = [{id : 'deviceId', value : props.optionClickValue}];
        setColumnFilters(setStatusData, setOptionData); // running
        setClickRow(props.optionClickValue)
        //setColumnFilters(setDeviceData);
        //setStatusData --> {id: 'status', value: 'warning'}
    },[props.statusClickValue, props.optionClickValue]);

    async function returnData(){
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
            /*{
                header: 'action',
                size: 130,
                Cell:({cell, row}) => {
                    return(
                        <div>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleShow}
                            >
                                Action
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className="modal-box" sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    pt: 2,
                                    px: 4,
                                    pb: 3,
                                }}>
                                    <div className="modal-title" id="modal-modal-title" >
                                        Send Reset History
                                    </div>
                                    <div id="modal-modal-description" style={{margin: '7px'}}>
                                        해당 디바이스로 원격명령을 보낼 수 있습니다.
                                        원격명령을 보내려면 버튼을 눌러주세요.
                                    </div>
                                    <br /> {/!*(handleLogin) - ping 보내는 함수*!/}
                                    <Button className="pingButton" variant="contained" color="error" onClick={handleAction} >Ping 보내기</Button>
                                    <br /><br />
                                    <Button className="cancelButton" variant="outlined" onClick={handleClose} >Cancel</Button>
                                </Box>
                            </Modal>
                        </div>
                    )
                }
            },*/
            /*{
                header: 'action',
                accessorKey: 'manageCrpNm',
                size: '150',
                render: (row) => {
                    console.log(row);
                },
                /!*Cell: ({ cell, row }) => {
                    if(row.original.maxPeriod*5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod*5.0) {
                        return <div style={{backgroundColor : "darkgray", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }

                },*!/
                /!*render : (rowData) => {
                    const button = (
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                console.log("Save");
                            }}
                        >
                            <Save />
                        </IconButton>
                    );
                    return button;
                }*!/
                /!*render:(data)=> <div style={{background:data.subKey<=2?"Green":"red"}}>{data.subKey}</div>,*!/
            },*/
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
                /*Cell: (row) => {
                    <div><button>hi</button></div>
                }*/

                /*Cell: ({cell, row}) => {
                    return (
                        <div>
                            {cell.getValue(cell)}
                            &nbsp;&nbsp;
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={modalExample(row)}  // handleShow -> Modal Open
                            >
                                ACTION
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className="modal-box" sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    pt: 2,
                                    px: 4,
                                    pb: 3,
                                }}>
                                    <div className="modal-title" id="modal-modal-title" >
                                        Send Reset History
                                    </div>
                                    <div id="modal-modal-description" style={{margin: '7px'}}>
                                        해당 디바이스로 원격명령을 보낼 수 있습니다.
                                        원격명령을 보내려면 버튼을 눌러주세요.
                                    </div>
                                    <br /> {/!*(handleLogin) - ping 보내는 함수*!/}
                                    <Button className="pingButton" variant="contained" color="error" onClick={handleAction} >Ping 보내기</Button>
                                    <br /><br />
                                    <Button className="cancelButton" variant="outlined" onClick={handleClose} >Cancel</Button>
                                </Box>
                            </Modal>
                        </div>
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
                size: 230,
                columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
                filterFn: 'betweenInclusive',
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
                columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
                filterFn: 'betweenInclusive',
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
                //render:(data)=> <div style={{background:data.subKey<=2?"Green":"red"}}>{data.subKey}</div>,
            },
            {
                header: 'Min Period',
                accessorKey: 'minPeriod',
                size: 140,
                /*size: 230,
                filterFn: 'between',
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes*/
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
            },
            {
                header: 'Software Reset Reason',
                accessorKey: 'softwareResetReason',
                /*filterFn: 'equals',
                filterSelectOptions: softwareFilterSet,
                filterVariant: 'select',*/
                enableColumnFilterModes: false,
                size: 200,
            },
            {
                header: 'Parsing Time Error',
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
            /*{
                header: 'Status Desc',
                enableColumnFilterModes: false,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                Cell: ({ c        ell }) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
                enableColumnFilterModes: false,
            },*/
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
        for(let key of Object.keys(rowSelection)) {
            setClickRow(key);
        }
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

    // Export All Data
    const handleExportData = (table) => {
        csvExporter.generateCsv(nmsCurrent.map(function(row){
            let datas = {};
            table.getAllColumns().map(function(columns) { // columns == Table_id 값
                if(typeof (row[columns.id])!="undefined"){ // id: 'mrt-row-select' == undefined (checkbox)
                    datas[columns.id] = row[columns.id]; // Table = API
                }
                else{
                    datas[columns.id] = '';
                }
            });
            return datas;
        }));
    }

    // Export Page Rows
    const handleExportRows = (table) => {    // Select Data
        const rows = table.getRowModel().rows;
        csvExporter.generateCsv(rows.map((row) => {
            let datas = {};
            table.getAllColumns().map(function(columns) { // columns == Table_id 값
                if(typeof (row.getValue(columns.id))!="undefined"){ // id: 'mrt-row-select' == undefined (checkbox)
                    datas[columns.id] = row.getValue(columns.id); // Table = API
                }
                else{
                    datas[columns.id] = '';
                }
            });
            return datas}));
    };

    // Export Selected Rows
    const handleExportSelected = (table) => {
        const selected = table.getSelectedRowModel().rows;
        csvExporter.generateCsv(selected.map((row) => {
            let datas = {};
            table.getAllColumns().map(function(columns) {
                if(typeof(row.getValue(columns.id))!="undefined"){
                    datas[columns.id] = row.getValue(columns.id);
                }
                else{
                    datas[columns.id] = '';
                }
            })
            return datas;
        }))
    }

    /*const jsonObjectData = "{'lang' : 'java'}";
    const JSONObject = new jsonObjectData(jsonObjectData);
    console.log(JSONObject)*/

    /* --------------------------------------------------------------------------------------------- */

    return (
        <>
            <MaterialReactTable
                title="NMS Current Table"
                columns={columns}
                data={nmsCurrent}

                positionToolbarAlertBanner="top"
                renderTopToolbarCustomActions={({ table, row }) => (
                    <Box
                        sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                    >
                        {/*-------------------------------------- Export to CSV --------------------------------------*/}
                        <Button
                            color="primary"
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={()=>handleExportData(table)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export All Data
                        </Button>
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

                        {/*------------------------------------------Message Ping----------------------------------------*/}
                        {/* 01595006SKY96B3 _ 선경호  */}
                        <SendPing row={row} clickRow={clickRow} />
                    </Box>
                )}

                /*----- Action Column (Ping) -----*/
                displayColumnDefOptions = {{
                    'mrt-row-actions': {
                        size: 100,
                        muiTableHeadCellProps: {
                            align: 'center', //change head cell props
                        },
                    },
                    'mrt-row-numbers': {
                        enableColumnOrdering: true, //turn on some features that are usually off
                        enableResizing: true,
                        muiTableHeadCellProps: {
                            sx: {
                                fontSize: '1.2rem',
                            },
                        },
                    },
                    'mrt-row-select': {
                        enableColumnActions: true,
                        enableHiding: true,
                        size: 100,
                    },
                }}
                /*enableRowActions
                renderRowActions={({ row }) => (
                    <Box>
                        <>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick= {() => sendClick(row)}
                                style={{ margin: 'auto', display: 'block'}}
                            >
                                Action
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className="modal-box" sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 500,
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    pt: 2,
                                    px: 4,
                                    pb: 3,
                                }}>
                                    <div className="modal-title" id="modal-modal-title" >
                                        Send Reset History
                                    </div>
                                    <div id="modal-modal-description" style={{margin: '7px'}}>
                                        해당 디바이스로 원격명령을 보낼 수 있습니다.
                                        원격명령을 보내려면 버튼을 눌러주세요.
                                    </div>
                                    <br /> {/!*(handleLogin) - ping 보내는 함수*!/}
                                    {/!*<Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                                </Box>*!/}
                                    {/!*<Button variant='outlined' onClick={() => {handleMsg(!showMsg)}}>{showMsg ? "숨기기" : "보이기"}</Button>*!/}

                                    {!handleMsg && (
                                        <Card showMsg={showMsg} id="noneDiv" className="showMsg" style={{borderStyle: 'dashed', margin: '10px'}}>
                                            메시지 전송에 실패하였습니다.
                                        </Card>)}
                                    {handleMsg && (
                                        <Card showMsg={showMsg} id="noneDiv" className="showMsg" style={{borderStyle: 'dashed', margin: "10px"}}>
                                            최신 전송된 메시지의 상태 - {msgStatus}
                                            <p></p>
                                            최신 전송된 메시지의 Index - {msgConsole}
                                        </Card>
                                    )}

                                    {/!*<Card showMsg={showMsg} id="noneDiv" className="showMsg" style={{borderStyle: 'dashed', margin: '10px'}}>
                                        최신 전송된 메시지의 상태 : {msgStatus}
                                        <p></p>
                                        최신 전송된 메시지의 Index : {msgConsole}
                                    </Card>*!/}
                                    {/!*<Box showMsg={showMsg} sx={{ p: 2, border: '1px dashed grey' }}>
                                        <Typography id="modal-modal-description" >
                                            최신 전송된 메시지의 상태 : {msgStatus}
                                            <p></p>
                                            최신 전송된 메시지의 Index : {msgConsole}
                                        </Typography>
                                    </Box>*!/}
                                    <br />
                                    <hr />
                                    <Button className="pingButton" variant="contained" color="error" onClick={handleAction} > Ping 보내기 </Button>
                                    <br /><br />
                                    <Button className="cancelButton" variant="outlined" onClick={handleClose} > Close </Button>
                                </Box>
                            </Modal>
                        </>
                    </Box>
                )}*/
                /*actions = {[
                    {icon: () => <button>Click me</button>,
                    tooltip: "Click me",
                    onClick: (e,data) => console.log(data),
                    }
                ]}

                renderRowActions = {({ row, table }) => (
                <Box >
                    <Button
                        color="primary"
                        onClick={() =>
                            console.log('Ping')
                        }
                    >
                        <BackupIcon />
                    </Button>
                </Box>
                )}*/


                /*renderRowActionMenuItems={({ closeMenu }) => [
                    <MenuItem
                        key={0}
                        onClick={() => {
                            // View profile logic...
                            closeMenu();
                        }}
                        sx={{ m: 10 }}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        View Profile
                    </MenuItem>,

                    <MenuItem
                        key={1}
                        onClick={() => {
                            // Send email logic...
                            closeMenu();
                        }}
                        sx={{ m: 10 }}
                    >
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        Send Email
                    </MenuItem>,
                ]}*/

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
                    pagination: { pageIndex: 0, pageSize: 10 },
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

            {/*<Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-box" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    pt: 2,
                    px: 4,
                    pb: 3,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Send Reset History
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        해당 디바이스에게 Ping이나 Reset 원격명령을 보낼 수 있습니다.
                    </Typography>
                    <br />
                    <hr />
                    <Button className="cancelButton" variant="outlined" onClick={handlePing} >Ping 명령 발송</Button>
                </Box>
            </Modal>*/}
            <hr />
            <History clickRow={clickRow}/>
        </>
    );
};

export default Table;