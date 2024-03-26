import Dialog from "@mui/material/Dialog";
import {Box, Button, Grid, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import axios from "axios";
import useDidMountEffect from "../module/UseDidMountEffect";
import ManageSelectTable from "../table/ManageSelectTable";
import {DeviceListData} from "../data/device/DeviceListData";
import ManageTable from "../table/ManageTable";
import {DeviceRequestData} from "../data/device/DeviceRequestData"
import {DeviceSendData} from "../data/device/DeviceSendData"

/** K.O IoT GWY URL */
import { koIotUrl } from 'config';


const LogDevice =() =>{

    const [onclick,setOnclick] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "deviceId";
    const pageSize = 5;
    const listSize = 20;

    const buttonName = "단말 LOG"

    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
        setRequestData([]);
    }

    function modalClose(){
        setOnclick(false);
    }
    /*--------------------------- Font Style -------------------------------*/
    const H2 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '20px',
    }));


    const selectUrls = koIotUrl + "/admin/device/info";
    const [selectData, setSelectData] = useState([]);
    const [requestData, setRequestData] = useState([]);


    useDidMountEffect(()=>{
        returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});

    },[deviceBtnChk]);


    const requestUrls = koIotUrl + "/admin/device/deviceCollectLog";
    const [requestParam,setRequestParam] = new useState({});
    const sendUrls = koIotUrl + "/admin/device/deviceSendLog";
    const [sendParam,setSendParam] = useState({});
    const [sendData, setSendData] = useState([]);






    useDidMountEffect(()=>{


        requestParam[rowId] = deviceId;
        sendParam[rowId] = deviceId;

        if(requestParam[rowId]!=null && requestParam[rowId] != ""){
            requestGetData();
        }
        if(sendParam[rowId]!=null && sendParam[rowId] != ""){
            sendGetData();
        }



    },[deviceId]);

    useDidMountEffect(()=>{
        if(requestParam[rowId]!=null && requestParam[rowId] != ""){
            requestGetData();
        }
    },[requestParam]);
    useDidMountEffect(()=>{
        if(sendParam[rowId]!=null && sendParam[rowId] != ""){
            sendGetData();
        }
    },[sendParam]);



    function requestDataParamOption(info){
        info["deviceId"] = deviceId;
        setRequestParam(info);
    }

    function requestGetData(){
        returnData(requestUrls,requestParam).then(
            result=>{
                if(result!=null){
                    setRequestData(result);
                }else{

                }
            });

        return () => {
            //clearTimeout(nmsCurrent);
        }
    }

    function sendDataParamOption(info){
        info["deviceId"] = deviceId;
        setSendParam(info);
    }

    function sendGetData(){

        returnData(sendUrls,sendParam).then(
            result=>{
                if(result!=null){
                    setSendData(result);
                }else{
                }
            });

        return () => {
            //clearTimeout(nmsCurrent);
        }

    }


    async function returnData(urls,params) {

        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;

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
                     ////console.log(returnVal)
                })
                .then(err=>{
                    return null;
                });
            return returnVal;

        } catch {
            return null;
        }

    }


    function selectDeviceOption(selectDevice){
        setDeviceId(selectDevice);
    }

    return (
        <div>
            <React.Fragment>
                <Button
                    className='device_Btn'
                    variant='contained' size='medium'
                    onClick={modalShow}
                    style={{zIndex: 1, float:"left"}}
                >
                    {buttonName}
                </Button>

                <Dialog
                    fullScreen
                    open={onclick}
                    onClose={modalClose}
                    //TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={modalClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                {buttonName}
                            </Typography>
                            <Button autoFocus color="inherit" onClick={modalClose}>
                                Close
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={1} style={{width:"100%"}}>
                        <Grid item xs={6} sm={6} >
                            <Box className="table" p={2}>
                                <ManageSelectTable title={"단말 LIST"} rowId={rowId} data={selectData} dataColumn={DeviceListData} paramOption={selectDeviceOption} pageSize={listSize} />
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={6} >
                            <Box className="table" p={2}>
                                <ManageTable data={requestData} title={"수집 LOG"} dataColumn={DeviceRequestData} parmaOption={requestDataParamOption} pageSize={pageSize}/>
                                <ManageTable data={sendData} title={"전송 LOG"} dataColumn={DeviceSendData} parmaOption={sendDataParamOption} pageSize={pageSize}/>
                            </Box>
                        </Grid>

                    </Grid>

                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default LogDevice;