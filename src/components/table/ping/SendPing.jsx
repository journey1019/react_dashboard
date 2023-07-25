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



const SendPing = ({clickRow}) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    /*function sendClick(row) {
        setOpen(true);
    }*/

    const [msgConsole, setMsgConsole] = useState([]);
    const [msgStatus, setMsgStatus] = useState([]);
    const [statusCode, setStatusCode] = useState([]);
    const [sendSuccess, setSendSuccess] = useState([]);

    const [showMsg, setShowMsg] = useState(false);

    const actionToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    const actionURLS = "https://iotgwy.commtrace.com/restApi/send/sendMessage";
    const actionHEADERS = {
        "Content-Type": `application/json;charset=UTF-8`,
        "Accept": "application/json",
        "Authorization": "Bearer "+ actionToken,
    }

    /* ------------------------------ Ping 명령 ------------------------------*/
    const handleAction = async ({clickRow}) => {
        setShowMsg(false);
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

    /* ------------------------------ Reset 명령 ------------------------------*/

    const handleReset = async () => {
        setShowMsg(false)
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

    /* ------------------------------ Message History Get 명령 ------------------------------*/

    const [getSendStatus, setGetSendStatus] = useState([]);

    const [submitRowIndex, setSubmitRowIndex] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    /*const [startDate, setStartDate] = useState(new Date("2023-07-20").toISOString());
    const[endDate, setEndDate] = useState(new Date().toISOString());*/

    /*const[startDate, setStartDate] = useState(new Date("2023-07-01").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);*/

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };


    useEffect(() => {
        const data = returnGetSendStatus().then(
            result => {
                console.log(result);
                if(result != null) {
                    let getDetailList = [];
                    getDetailList.push(result);
                    setGetSendStatus(getDetailList);

                    console.log(result);

                    result['dataList'].map(function (api){

                        api["dataCount"] = result.dataCount;

                        console.log(api)
                    })


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
    }, [getSendStatus, clickRow])

    async function returnGetSendStatus() {
        if((startDate == null || startDate == "")) {
            return null
        }
        else{

            const getURL = 'https://iotgwy.commtrace.com/restApi/send/getSendStatus';
            // 있어도, 없어도 되도록 해야함
            const getBody = { startDate: '20230701', endDate: '20230724'}

            let returnVal = null;

            const alrToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const actionHEADERS = {
                "Content-Type": `application/json;charset=UTF-8`,
                "Accept": "application/json",
                "Authorization": "Bearer " + alrToken,
            };

            try{
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
            catch{
                return null;
            }
        }
    }

    const pingColumns = useMemo(
        () => [
            {
                header: 'Submit Row Index',
                accessorKey: 'submitRowIndex',
                editable: true
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
                accessorKey: 'deviceId ',
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
                accessorKey: 'creactDate',
                editable: true
            },
        ]
    )

    return(
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
                width: 1500,
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
                    <Grid item xs={12} sm={5}>
                        <div id="modal-modal-description" style={{margin: '10px', fontWeight: 'bold'}}>[ 해당 단말에 보낸 메세지 확인 ]</div>
                        <Fade in={showMsg}>
                            <div className="boxConsole" style={{ borderStyle: 'dashed', margin: "10px 15px 10px 15px"}}>
                                <Box showMsg={showMsg} key={showMsg.statusCode} className="showMsg" style={{ margin: "10px", color: "grey"}}>
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

                    <Grid item xs={12} sm={7}>
                        <div id="modal-modal-description" style={{margin: '10px', fontWeight: 'bold'}}>[ 단말에 보낸 메세지 히스토리 확인 ]</div>
                        <Box style={{ margin: "10px 15px 10px 15px" }}>
                            {/*<b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} />
                                            &nbsp;~&nbsp;
                                            <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} /><p/>*/}
                            <TextField
                                id="startDate"
                                name="startDate"
                                label="Start Date "
                                variant="outlined"
                                color="error"
                                helperText="Please enter Submit Start Date"
                                autoComplete="startDate "
                                autoFocus
                                onChange={e => setStartDate(e.target.value)}
                                value={startDate}
                                sx={{ paddingRight: '20px'}}
                            />
                            <TextField
                                id="endDate"
                                name="endDate"
                                label="End Date"
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
                            <MaterialReactTable
                                title="Ping Alert History"
                                columns={pingColumns}
                                data={getSendStatus}
                                defaultColumn={{
                                    size: 100,
                                }}
                                /*renderTopToolbarCustomActions={({ table }) => (
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
                                    </Box>
                                )}*/
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
                            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker label="Basic date picker" defaultValue={dayjs('2023-07-15')}/>
                                                    <DatePicker
                                                        label="Controlled picker"
                                                        value={endDate}
                                                        onChange={(newValue) => setEndDate(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>*/}
                        </Box>
                    </Grid>
                </Grid>

                <br />
                <br />
                <hr />
                <div className="buttonGroup">
                    <Button className="pingButton" variant="contained" color="error" endIcon={<SendSharpIcon />} onClick={handleAction} > Ping </Button>
                    <Button className="resetButton" variant="contained" color="success" endIcon={<RefreshIcon />} onClick={handleReset}> Reset </Button>
                    <Button className="cancelButton" variant="outlined" onClick={handleClose} > Close </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default SendPing;