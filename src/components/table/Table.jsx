import React, { useState, useEffect, useMemo } from 'react';
import "./table.scss";
import History from "../../components/history/History";

/* MUI */
import MaterialReactTable from 'material-react-table';
import { Box, Button, MenuItem, IconButton } from '@mui/material';
import Modal from "@mui/material/Modal";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { darken } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BackupIcon from '@mui/icons-material/Backup';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { AccountCircle, Send } from '@mui/icons-material';
import UnfoldLessSharpIcon from '@mui/icons-material/UnfoldLessSharp';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendSharpIcon from '@mui/icons-material/SendSharp';


import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';
//import { format } from "date-fns";
//import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {bool} from "prop-types";

import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';


const Table = (props) => {
    /** API **/
        // Axios 갱신을 위한 계수기 state
    const[number, setNumber] = useState(0);
    // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[feed, setFeed] = useState([]);
    let example = [];

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });

    // Table Toggle Filtering
    const [manageFilterSet, setManageFilterSet] = useState([]);
    const [nameFilterSet, setNameFilterSet] = useState([]);

    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let deviceNmsList = [];
                    let locationList = [];

                    let running = 0;
                    let caution = 0;
                    let warning = 0;
                    let faulty = 0;

                    let diffObj = {};

                    setManageFilterSet([]);
                    setNameFilterSet([]);

                    // result 배열 풀기
                    result.map(function(manageCrp){
                        // ManageCrpNm Toggle Filtering
                        const manage = {};
                        manage.text = manageCrp.manageCrpNm;
                        manage.value = manageCrp.manageCrpNm;

                        manageFilterSet.push(manage);
                        console.log(manage)

                        //manageCrp 객체 내의 crp 풀기
                        manageCrp['nmsInfoList'].map(function (crp){
                            //Crp 객체 내의 Device 풀기
                            crp["nmsDeviceList"].map(function (device){

                                const location = {};

                                //manageCrp,crp 정보 입력
                                device["crpId"] = crp.crpId;
                                device["crpNm"] = crp.crpNm;
                                device["manageCrpId"] = manageCrp.manageCrpId;
                                device["manageCrpNm"] = manageCrp.manageCrpNm;

                                // DeviceId, Location{latitude, longitude}
                                location.deviceId = device.deviceId;
                                location.latitude = device.latitude;
                                location.longitude = device.longitude;

                                // messageData -> JSON 형태로 변환
                                try{
                                    device.messageData = JSON.parse(device.messageData)
                                }
                                catch(e) {
                                    device.messageData = '';
                                }

                                /*------------------------------------------------------------------------------------------------*/
                                //console.log(device.messageData.Field);
                                //console.log(device.messageData);

                                const course = {
                                    Name: ''
                                };
                                if(device.messageData.Name === 'undefined' || device.messageData.Name === '') {
                                    device.Name = Object.assign(course);
                                }
                                if(device.Name === '') {
                                    device['Name'] = 'null'
                                }
                                /*if(typeof(device.messageData) === "string"){
                                    device.messageData.Name = 'null'
                                }*/

                                /*if(device.messageData.Name === 'undefined') {
                                    device.messageData.Name = ''
                                }*/

                                // Fields Data Object형 [lastRe~, New~]
                                if(typeof(device.messageData.Fields) !== 'undefined') {
                                    device.messageData.Fields.map(function(fieldData) {  //{Name: 'hardwareVariant', Value: 'ST6', field: {…}}
                                        //console.log(fieldData);
                                        //console.log(Object.values(fieldData))
                                        //console.log(fieldData.Name);

                                        //console.log(fieldData)
                                        if(fieldData.Name === 'softwareResetReason' && fieldData !== '') {
                                            device.messageData["softwareResetReason"] = [fieldData.Value];
                                        }
                                        else{

                                        }
                                    })
                                }


                                /*if(typeof(device.messageData) === "string"){
                                    device.messageData.Name = 'null'
                                }*/
                                /*if(device.messageData.Name === 'undefined') {
                                    device.messageData.Name = ''
                                }*/
                                //console.log(device.messageData);
                                //console.log(Object.values(device.messageData.Fields))
                                //console.log(device);

                                // Object 순회
                                if(device.messageData !== '') {     // JSON의 경우
                                    if(typeof(device.messageData.Fields) === 'object'){
                                        //if(device.messageData)
                                        for (let key of Object.keys(device.messageData)) {
                                            const value = device.messageData[key]; //
                                            //console.log(value); // Name, Sin, Min, Fields
                                            device[key] = value.toString() || '';
                                        }
                                    }
                                    else{
                                    }
                                }else{
                                }

                                // messageData.Name column Filtering
                                const name = {};

                                name.text = device.Name;
                                name.value = device.Name;
                                //console.log(device.Name);

                                example.push(name);

                                const example1 = example.map(obj => {
                                    return(
                                        {...obj, text: '', value: ''}
                                    )
                                })



                                /*console.log(name); //{text: '', value: ''}
                                if(name.text === 'undefined') {
                                    return (
                                        name.text === 'null'
                                    )
                                    //console.log(device.Name);
                                }
                                // Object 안 undefined -> ''
                                console.log(name);*/

                                //name["text"] =

                                // name.text, name.value == {text: '', value: ''} 로 만들면 됨


                                //const found = name.find(e => e.text === '');
                                //console.log(name);




                                //console.log(example);

                                /*if(example.find(e => e.text === 'undefined')){
                                    name.text = 'dd';
                                    name.value= 'dd';
                                }
                                console.log(example);*/

                                /*if(name === {text: undefined, value: undefined}){
                                     //{text: undefined, value: undefined}
                                }*/

                                //console.log(nameFilterSet);

                                //nameFilterSet.push(name);
                                //nameFilterSet([...new Set(example.map(JSON.stringify))].map(JSON.parse));
                                /*------------------------------------------------------------------------------------------------*/

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
                                //console.log(deviceNmsList);
                                locationList.push(location);
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

                    //parsing 된 전체 device 정보 갱신
                    setNmsCurrent(deviceNmsList);

                    setFeed(locationList);
                    //console.log(feed);

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
                    console.log(response);
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
                header: 'Parsing Name',
                accessorKey: 'Name',
                filterFn: 'equals',
                //filterSelectOptions: nameFilterSet,
                filterSelectOptions: nameFilterSet,
                filterVariant: 'select',
                enableColumnFilterModes: false,
            },
            {
                header: 'softwareResetReason',
                accessorKey: 'softwareResetReason',
                enableColumnFilterModes: false,
            },
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

    const handleExportRows = (rows) => {    // Select Data
        csvExporter.generateCsv(rows.map((row) => row.original));
    };
    const handleExportData = (table) => {
        //console.log(table.getAllColumns())
        csvExporter.generateCsv(nmsCurrent.map(function(row){
            let datas = {};
            table.getAllColumns().map(function(columns) { // columns == Table_id 값
                if(typeof (row[columns.id])!="undefined"){ // id: 'mrt-row-select' == undefined (checkbox)
                    datas[columns.id] = row[columns.id]; // Table = API
                }
                //console.log(columns);
            });
            //console.log(row); // API
            //console.log(datas) // Table
            return datas;
        }));
    }

    /* -------------------------- Ping & Reset 원격명령 Modal -------------------------- */
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    // Test Button Click
    function sendClick(row){
        console.log(row); // undefined
        setOpen(true);
    }


    const [msgConsole, setMsgConsole] = useState([]);
    const [msgStatus, setMsgStatus] = useState([]);
    const [statusCode, setStatusCode] = useState([]);
    const [sendSuccess, setSendSuccess] = useState([]);

    const [showMsg, setShowMsg] = useState(false);

    // 01595006SKY96B3 _ 선경호
    const actionToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    const actionURLS = "https://iotgwy.commtrace.com/restApi/send/sendMessage";
    const actionHEADERS = {
        "Content-Type": `application/json;charset=UTF-8`,
        "Accept": "application/json",
        "Authorization": "Bearer "+ actionToken,
    }

    const handleAction = async () => {
        setShowMsg(false)
        const actionBody = {deviceId: clickRow, requestMsg: '0,112,0,0'}

        let returnVal = null;
        try {
            returnVal = await axios.post(actionURLS,actionBody,{
                headers:actionHEADERS,
            });

            const returnMsg = returnVal.data.status;

            // Message Send: Success, (returnMsg === 'CREATED')
            if(returnMsg === "CREATED"){
                alert('성공적으로 Message를 보냈습니다.')
                for(const [key, value] of Object.entries(returnVal.data.response)) {
                    setShowMsg(true);
                    //setShowMsg((prev) => !prev);

                    setStatusCode(returnVal.data.statusCode);

                    setMsgStatus(returnVal.data.status);
                    setMsgConsole(`${key}: ${value}`);
                }
            }
            // Message Send: Fail (deviceId)
            else{
                alert("단말에 Message를 보내는 것을 실패하였습니다.")
                setShowMsg(false)
            }
            return returnVal;
        }
        // Not Click, Table Row
        catch{
            alert("원하는 단말의 행을 클릭하세요.")
            setShowMsg(false);
        }
    }
    const handleReset = async () => {
        setShowMsg(false)
        const resetBody = {deviceId: clickRow, requestMsg: '16,0,0'}

        let returnVal = null;
        try {
            returnVal = await axios.post(actionURLS,resetBody,{
                headers:actionHEADERS,
            });

            const returnMsg2 = returnVal.data.status;

            // Message Send: Success, (returnMsg === 'CREATED')
            if(returnMsg2 === "CREATED"){
                alert('성공적으로 Message를 보냈습니다.')
                for(const [key, value] of Object.entries(returnVal.data.response)) {
                    setShowMsg(true);

                    setStatusCode(returnVal.data.statusCode);

                    setMsgStatus(returnVal.data.status);
                    setMsgConsole(`${key}: ${value}`);
                }
            }else{
                alert("단말에 Message를 보내는 것을 실패하였습니다.")
                setShowMsg(false)
            }
            return returnVal;
        } catch{
            alert("원하는 단말의 행을 클릭하세요.")
            setShowMsg(false);
        }
    }


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
                        <Button
                            variant="text"
                            size="small"
                            onClick= {() => sendClick(row)}
                            style={{ margin: 'auto', display: 'block'}}
                        >
                            <SendSharpIcon />
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
                                <br /> {/*(handleLogin) - ping 보내는 함수*/}
                                {/*<Box showMsg={showMsg} sx={{ p: 2, border: '1px dashed grey' }}>
                                    <Typography id="modal-modal-description" >
                                        최근 전송된 메시지의 상태 : {msgStatus}
                                        최근 전송된 메시지의 Index : {msgConsole}
                                    </Typography>
                                </Box>*/}
                                <Fade in={showMsg}>
                                    <div className="boxConsole" style={{ borderStyle: 'dashed', margin: "10px 15px 10px 15px"}}>
                                        <Box showMsg={showMsg} className="showMsg" style={{ margin: "10px", color: "grey"}}>
                                            Status Code - {statusCode}
                                            <p />
                                            Status - {msgStatus}
                                            <p /><hr />
                                            Response
                                            <p />
                                            <span style={{color: 'red'}}>{msgConsole}</span>
                                            <p />
                                            {sendSuccess}
                                        </Box>
                                    </div>
                                </Fade>

                                <br />
                                <hr />
                                <div className="buttonGroup">
                                    <Button className="pingButton" variant="contained" color="error" endIcon={<SendSharpIcon />} onClick={handleAction} > Ping </Button>
                                    <Button className="resetButton" variant="contained" color="success" endIcon={<RefreshIcon />} onClick={handleReset}> Reset </Button>
                                    <Button className="cancelButton" variant="outlined" onClick={handleClose} > Close </Button>
                                </div>
                            </Box>
                        </Modal>
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