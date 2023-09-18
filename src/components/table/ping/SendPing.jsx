import React, { useState, useEffect, useMemo } from 'react';
import "./sendPing.scss";

import axios from "axios";

import Modal from "@mui/material/Modal";
import {Box, Button, darken, Grid} from "@mui/material";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import MaterialReactTable from "material-react-table";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import RefreshIcon from "@mui/icons-material/Refresh";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import {ExportToCsv} from "export-to-csv";

const SendPing = ({row, clickRow, nmsCurrent}) => {
    /* ------------------------------ Ping & Reset 원격명형 Modal ------------------------------*/
    // Ping History Table All Data Export
    const handleExportMessage = (table) => {
        csvExporter.generateCsv(getSendStatus.map(function(row){
            let datas = {};
            table.getAllColumns().map(function(columns) {
                if(typeof (row[columns.id])!="undefined"){
                    datas[columns.id] = row[columns.id];
                }
            });
            return datas;
        }));
    }

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    function sendClick(row){
        setOpen(true);
    }

    const [msgConsole, setMsgConsole] = useState([]);
    const [msgStatus, setMsgStatus] = useState([]);
    const [statusCode, setStatusCode] = useState([]);
    const [sendSuccess, setSendSuccess] = useState([]);

    const [showmsg, setShowmsg] = useState(false);

    const actionToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    const actionURLS = "https://iotgwy.commtrace.com/restApi/send/sendMessage";
    const actionHEADERS = {
        "Content-Type": `application/json;charset=UTF-8`,
        "Accept": "application/json",
        "Authorization": "Bearer "+ actionToken,
    }

    // Refresh Time Number
    const [number, setNumber] = useState(0);

    /* ------------------------------ Ping 명령 ------------------------------*/
    const handleAction = async () => {
        setShowmsg(false);
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
                    setShowmsg(true);
                    //setShowmsg((prev) => !prev);

                    setStatusCode(returnVal.data.statusCode);

                    setMsgStatus(returnVal.data.status);
                    setMsgConsole(`${key}: ${value}`);
                }
            }
            // Message Send: Fail (deviceId)
            else{
                alert("단말에 Message를 보내는 것을 실패하였습니다.")
                setShowmsg(false)
            }
            return returnVal;
        }
            // Not Click, Table Row
        catch{
            alert("원하는 단말의 행을 클릭하세요.")
            setShowmsg(false);
        }
    }

    /* ------------------------------ Reset 명령 ------------------------------*/

    const handleReset = async () => {
        setShowmsg(false)
        const resetBody = {deviceId: clickRow, requestMsg: '16,6,0'}

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
                    setShowmsg(true);

                    setStatusCode(returnVal.data.statusCode);

                    setMsgStatus(returnVal.data.status);
                    setMsgConsole(`${key}: ${value}`);
                }
            }else{
                alert("단말에 Message를 보내는 것을 실패하였습니다.")
                setShowmsg(false)
            }
            return returnVal;
        } catch{
            alert("원하는 단말의 행을 클릭하세요.")
            setShowmsg(false);
        }
    }
    /* ------------------------------ Location 명령 ------------------------------*/
    const handleLocation = async () => {
        setShowmsg(false);
        const locationBody = {deviceId: clickRow, requestMsg: '20,1,0'}

        let returnVal = null;
        try {
            returnVal = await axios.post(actionURLS,locationBody,{
                headers:actionHEADERS,
            });

            const returnMsg3 = returnVal.data.status;


            // Message Send: Success, (returnMsg === 'CREATED')
            if(returnMsg3 === "CREATED"){
                alert('성공적으로 위치 Message를 보냈습니다.')
                for(const [key, value] of Object.entries(returnVal.data.response)) {
                    setShowmsg(true);

                    setStatusCode(returnVal.data.statusCode);

                    setMsgStatus(returnVal.data.status);
                    setMsgConsole(`${key}: ${value}`);
                }
            }else{
                alert("단말에 Message를 보내는 것을 실패하였습니다.")
                setShowmsg(false);
            }
            return returnVal;
        } catch{
            alert("원하는 단말의 행을 클릭하세요.")
            setShowmsg(false);
        }
    }

    /* ------------------------------ Message History Get 명령 ------------------------------*/

    const [getSendStatus, setGetSendStatus] = useState([]);

    const [submitRowIndex, setSubmitRowIndex] = useState('');

    let today = new Date().toISOString();

    const [startDate, setStartDate] = useState(today.substring(0,4)+today.substring(5,7)+today.substring(8,10)+'01');
    const [endDate, setEndDate] = useState(today.substring(0,4)+today.substring(5,7)+today.substring(8,10)+'23');

    useEffect(() => {
        const data = returnGetSendStatus().then(
            result => {
                if(result != null) {
                    let getDetailList = [];

                    result['dataList'].map(function(received){

                        getDetailList.push(received);
                    })
                    setGetSendStatus(getDetailList);
                }
                else{
                }
            }
        );
        return() => {
            clearTimeout(getSendStatus);
        }
    }, [submitRowIndex, startDate, endDate]);

    useEffect(() => {
    }, [getSendStatus, clickRow, nmsCurrent])

    const getURL = 'https://iotgwy.commtrace.com/restApi/send/getSendStatus';

    // Refresh
    setTimeout(() => {
        setNumber(number + 1);
        if(number > 100){
            setNumber(0);
        }
        // 1분 Timeout
    }, 60000)

    // object keym value (유/무)
    // library _ null 값 뽑기 _ Object value 값이 널값인 경우 값 뽑아내기
    async function returnGetSendStatus() {
        let returnVal = null;
        let getBody = {};

        if (submitRowIndex != "" && startDate != "" && endDate != "") {
            let getBody = {submitRowIndex: submitRowIndex, startDate: startDate, endDate: endDate}
            try {
                let result = await axios({
                    method: "get",
                    url: getURL,
                    headers: actionHEADERS,
                    params: getBody,
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
            catch {
                return null;
            }
        }
        else if (submitRowIndex == "") {
            let getBody = {startDate: startDate, endDate: endDate}
            try {
                let result = await axios({
                    method: "get",
                    url: getURL,
                    headers: actionHEADERS,
                    params: getBody,
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
            catch {
                return null;
            }
        }
        else if (startDate == "" && endDate == "") {
            let getBody = {submitRowIndex: submitRowIndex}
            try {
                let result = await axios({
                    method: "get",
                    url: getURL,
                    headers: actionHEADERS,
                    params: getBody,
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
            catch {
                return null;
            }
        }
        else return null;
    }

    function refreshButton(){
        setTimeout(function(){
            window.location.reload();
        },1000);
    }

    const pingColumns = useMemo(
        () => [
            {
                header: 'Submit Row Index',
                accessorKey: 'submitRowIndex',
                editable: true,
            },
            {
                header: 'Message Id',
                accessorKey: 'messageId',
                editable: true
            },
            {
                header: 'User ID',
                accessorKey: 'userId',
                editable: true
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                editable: true
            },
            {
                header: 'API Access Id',
                accessorKey: 'apiAccessId',
                editable: true
            },
            {
                header: 'Sending Check',
                accessorKey: 'sendingCheck',
                editable: true
            },
            {
                header: 'Payload Name',
                accessorKey: 'payloadName',
                editable: true
            },
            {
                header: 'Status Date',
                accessorKey: 'statusDate',
                editable: true
            },
            {
                header: 'Create Date',
                accessorKey: 'createDate',
                editable: true
            },
        ]
    )

    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: pingColumns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    return(
        <>
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
                    width: 1300,
                    height: 'auto',
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
                    <br />

                    <Grid container spacing={1} >
                        <Grid item xs={12} sm={4}>
                            <div id="modal-modal-description" style={{margin: '10px', fontWeight: 'bold'}}>[ 해당 단말에 보낸 메세지 확인 ]</div>
                            <div id="modal-modal-description" style={{margin: '7px'}}>
                                원하는 단말기에게 원격명령을 보낼 수 있습니다.<p/>
                                원격명령을 보내려면 테이블에 행을 클릭한 뒤 하단 버튼을 클릭해주세요.
                            </div>
                            <Fade in={showmsg} >
                                <div className="boxConsole" style={{ borderStyle: 'dashed', margin: "10px 15px 10px 15px"}}>
                                    <Box showmsg={showmsg.toString()} className="showmsg" style={{ margin: "10px", color: "grey"}}>
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
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <div id="modal-modal-description" style={{margin: '10px', fontWeight: 'bold'}}>[ 단말에 보낸 메세지 히스토리 확인 ]</div>
                            <div id="modal-modal-description" style={{margin: '7px'}}>
                                원격명령을 보낸 리스트를 확인할 수 있습니다.<p/>
                                확인하고 싶은 날짜를 입력하거나, 명령을 보내고 난 뒤 확인한 Index 번호를 입력하세요.<p />
                                <span style={{color: 'red'}}>날짜의 형식을 꼭 지켜주세요(ex. 2023073113)</span>
                            </div>
                            <Box style={{ margin: "10px 15px 10px 15px" }}>
                                {/*<span style={{ p:"4px"}}>
                                                <b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} />
                                                &nbsp;~&nbsp;
                                                <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} /><p/>
                                            </span>*/}
                                <TextField
                                    id="startDate"
                                    name="startDate"
                                    label="Start Date: (ex.YYYYMMDDHH)"
                                    variant="outlined"
                                    color="error"
                                    helperText="Please enter Submit Start Date"
                                    autoComplete="startDate "  // 이전에 입력한 값 드롭다운 옵션 보여줌
                                    autoFocus
                                    onChange={e => setStartDate(e.target.value)}
                                    value={startDate}
                                    sx={{ paddingRight: '20px'}}
                                />
                                <TextField
                                    id="endDate"
                                    name="endDate"
                                    label="End Date: (ex.YYYYMMDDHH)"
                                    variant="outlined"
                                    color="error"
                                    helperText="Please enter Submit End Date"
                                    autoComplete="endDate "
                                    autoFocus
                                    onChange={e => setEndDate(e.target.value)}
                                    value={endDate}
                                    sx={{ paddingRight: '20px'}}
                                />
                                <TextField
                                    id="submitRowIndex"
                                    name="submitRowIndex"
                                    label="Submit Row Index"
                                    variant="outlined"
                                    color="primary"
                                    helperText="Please enter Submit Row Index"
                                    autoComplete="submitRowIndex"
                                    autoFocus
                                    onChange={e => setSubmitRowIndex(e.target.value)}
                                    value={submitRowIndex}
                                    sx={{ paddingRight: '20px'}}
                                />
                                <Button variant="contained" size="large" color="success" onClick={refreshButton} style={{alignItems : 'center'}} >
                                    <RefreshIcon />
                                </Button>
                                <MaterialReactTable
                                    title="Ping Alert History"
                                    columns={pingColumns}
                                    data={getSendStatus}

                                    defaultColumn={{
                                        size: 100,
                                    }}
                                    renderTopToolbarCustomActions={({ table }) => (
                                        <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
                                            <Button
                                                color="primary"
                                                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                                onClick={()=>handleExportMessage(table)}
                                                startIcon={<FileDownloadIcon />}
                                                variant="contained"
                                                style={{p: '0.5rem', flexWrap: 'wrap'}}
                                            >
                                                Export All Data
                                            </Button>

                                            {/*<span style={{ p:"4px"}}>
                                                            <b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} />
                                                            &nbsp;~&nbsp;
                                                            <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} /><p/>
                                                        </span>*/}
                                        </Box>
                                    )}
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
                                        pagination: { pageIndex: 0, pageSize: 5 },
                                    }}
                                    muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                                    muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <br />
                    <br />
                    <hr />
                    <Grid container spacing={1} >
                        <Grid item xs={12} sm={5}>
                            <div className="buttonGroup">
                                <Button className="pingButton" variant="contained" color="error" endIcon={<SendSharpIcon />} onClick={handleAction} > Ping </Button>
                                <Button className="resetButton" variant="contained" color="inherit" endIcon={<LocationOnIcon />} onClick={handleLocation}> Location </Button>
                                <Button className="resetButton" variant="contained" color="success" endIcon={<RefreshIcon />} onClick={handleReset}> Reset </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <div className="buttons">
                                <Button className="cancelButton" variant="outlined" onClick={handleClose} > Close </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
)
}



export default SendPing;