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
import ManageTable from "../table/ManageTable";
import {GroupListData} from "../data/group/GroupListData";
import {GroupSendListData} from "../data/group/GroupSendListData";
import {GroupControllListData} from "../data/group/GroupControllListData";
import {GroupDeviceListData} from "../data/group/GroupDeviceListData";
import ManageAddModalTable from "../table/ManageAddModalTable";

const LogGroup =() =>{

    const [onclick,setOnclick] = useState(false);
    const [groupId, setGroupId] = useState("");

    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "groupId";
    const pageSize = 5;
    const listSize = 20;
    const buttonName = "전송 그룹 LOG"



    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
        setDeviceData([])
        setControlData([]);
        setSendData([]);
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


    const selectUrls = "https://iotgwy.commtrace.com/restApi/admin/group/info";
    const [selectData, setSelectData] = useState([]);


    useDidMountEffect(()=>{
        returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});

    },[deviceBtnChk]);




    const sendUrls = "https://iotgwy.commtrace.com/restApi/admin/group/groupSendLog";
    const [sendParam,setSendParam] = new useState({});
    const [sendData, setSendData] = useState([]);
    const controlUrls = "https://iotgwy.commtrace.com/restApi/admin/group/groupControlLog";
    const [controlParam,setControlParam] = useState({});
    const [controlData, setControlData] = useState([]);
    const deviceUrls = "https://iotgwy.commtrace.com/restApi/admin/group/getGroupDevice";
    const [deviceParam,setDeviceParam] = useState({});
    const [deviceData, setDeviceData] = useState([]);




    useDidMountEffect(()=>{


        sendParam[rowId] = groupId;
        controlParam[rowId] = groupId;
        deviceParam[rowId] = groupId;


        if(sendParam[rowId]!=null && sendParam[rowId] != ""){
            sendGetData();
        }
        if(controlParam[rowId]!=null && controlParam[rowId] != ""){
            controlGetData();
        }
        if(deviceParam[rowId]!=null && deviceParam[rowId] != ""){
            groupDeviceGetData()
        }


    },[groupId]);

    useDidMountEffect(()=>{
        if(sendParam[rowId]!=null && sendParam[rowId] != ""){
            sendGetData();
        }
    },[sendParam]);

    useDidMountEffect(()=>{
        if(controlParam[rowId]!=null && controlParam[rowId] != ""){
            controlGetData();
        }
    },[controlParam]);

    useDidMountEffect(()=>{
        if(deviceParam[rowId]!=null && deviceParam[rowId] != ""){
            groupDeviceGetData();
        }
    },[deviceParam]);


    function sendDataParamOption(info){
        info["groupId"] = groupId;
        setSendParam(info);
    }

    function sendGetData(){
        returnData(sendUrls,sendParam).then(

            result=>{
                if(result!=null && result.at(0)!=null){
                    setSendData(result);
                }else{
                    setSendData([]);
                }
            });

        return () => {
            //clearTimeout(nmsCurrent);
        }
    }

    function controlParamOption(info){
        info["groupId"] = groupId;
        setControlParam(info);
    }

    function controlGetData(){

        returnData(controlUrls,controlParam).then(
            result=>{
                if(result!=null && result.at(0)!=null){

                    setControlData(result);
                }else{
                    setControlData([]);
                }
            });
        return () => {
            //clearTimeout(nmsCurrent);
        }
    }


    function groupDeviceGetData(){

        returnData(deviceUrls,deviceParam).then(
            result=>{
                if(result!=null && result.at(0)!=null){

                    setDeviceData(result);
                }else{
                    setDeviceData([]);
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
                     //console.log(returnVal)
                })
                .then(err=>{
                    return null;
                });
            return returnVal;

        } catch {
            return null;
        }

    }

    function selectGroupOption(selectGroup){
        setGroupId(selectGroup);
    }

    const [deviceId, setDeviceId] = useState('')
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
                        <Grid container spacing={1} style={{width:"100%"}}>
                            <Grid item xs={6} sm={6}>
                                <Box className="table" p={2}>
                                    <ManageSelectTable title={"전송 Group LIST"} rowId={rowId} data={selectData} dataColumn={GroupListData} paramOption={selectGroupOption} pageSize={listSize} />
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Grid container spacing={1} style={{width:"100%"}}>
                                    <Box className="table" p={2}>
                                        <ManageSelectTable title={"Group Device LIST"} rowId={"deviceId"} data={deviceData} dataColumn={GroupDeviceListData} paramOption={selectDeviceOption} pageSize={pageSize} />
                                        <ManageTable data={sendData} title={"전송 LOG"} dataColumn={GroupSendListData} parmaOption={sendDataParamOption} pageSize={pageSize}/>
                                        <ManageTable data={controlData} title={"제어 LOG"} dataColumn={GroupControllListData} parmaOption={controlParamOption} pageSize={pageSize}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default LogGroup;