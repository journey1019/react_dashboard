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
import {UserListData} from "../data/user/UserListData";
import {UserRequestData} from "../data/user/UserRequestData"
import UserDetailForm from "../form/UserDetailForm";
import {GroupListData} from "../data/group/GroupListData";
import {GroupSendListData} from "../data/group/GroupSendListData";
import {GroupControllListData} from "../data/group/GroupControllListData";
import {GroupDeviceListData} from "../data/group/GroupDeviceListData";
import ManageAddModalTable from "../table/ManageAddModalTable";
import GroupDetailForm from "../form/GroupDetailForm";

/** K.O IoT GWY URL */
import { koIotUrl } from 'config';

const SetGroup_bak =() =>{

    const [onclick,setOnclick] = useState(false);
    const [groupId, setGroupId] = useState("");

    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "groupId";
    const pageSize = 5;
    const buttonName = "전송 그룹 관리"



    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
        setDeviceData([])
        setControlData([]);
        setSendData([]);
        setDetailData({});
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


    const selectUrls = koIotUrl + "/admin/group/info";
    const [selectData, setSelectData] = useState([]);
    const [requestData, setRequestData] = useState([]);

    const manageCrpUrls = koIotUrl + "/admin/module/getManageCrpList";
    const crpUrls = koIotUrl + "/admin/module/getCrpList";
    const groupsUrls = koIotUrl + "/admin/module/getGroupUse";
    const defaultUrls = koIotUrl + "/admin/module/getDefaultLocation";
    const apiAccessIdUrls = koIotUrl + "/admin/module/getApiAccessId";
    const userRoleUrls = koIotUrl + "/admin/module/getUserRole";

    const [manageCrpList,setManageCrpList] = useState([]);
    const [crpList,setCrpList] = useState([]);
    const [groupsList,setGroupsList] = useState([]);
    const [defaultLocationList,setDefaultLocationList] = useState([]);
    const [managecrpId,setManagecrpId] = useState([]);
    const [apiAccessList,setApiAccessList] = useState([]);
    const [roleList,setRoleList] = useState([]);


    useDidMountEffect(()=>{
        returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});
        returnData(manageCrpUrls,null).then(result=>{if(result!=null){setManageCrpList(result);}});
        returnData(groupsUrls,null).then(result=>{if(result!=null){setGroupsList(result);}});
        returnData(defaultUrls,null).then(result=>{if(result!=null){setDefaultLocationList(result);}});
        returnData(apiAccessIdUrls,null).then(result=>{if(result!=null){setApiAccessList(result);}});
        returnData(userRoleUrls,null).then(result=>{if(result!=null){setRoleList(result);}});

    },[deviceBtnChk]);

    function changeMangeCrpId(updateManageCrpId){
        setManagecrpId(updateManageCrpId)
    }

    useDidMountEffect(()=>{
        const param = {"manageCrpId":managecrpId};
        returnData(crpUrls,param).then(result=>{if(result!=null){setCrpList(result);}});
    },[managecrpId]);



    const sendUrls = koIotUrl + "/admin/group/groupSendLog";
    const [sendParam,setSendParam] = new useState({});
    const [sendData, setSendData] = useState([]);
    const controlUrls = koIotUrl + "/admin/group/groupControlLog";
    const [controlParam,setControlParam] = useState({});
    const [controlData, setControlData] = useState([]);
    const deviceUrls = koIotUrl + "/admin/group/getGroupDevice";
    const [deviceParam,setDeviceParam] = useState({});
    const [deviceData, setDeviceData] = useState([]);
    const detailUrls = koIotUrl + "/admin/group/getGroupDetail";
    const [detailData, setDetailData] = useState([]);





    useDidMountEffect(()=>{

        if(groupId!=null && groupId!=""){
            const detailParam = {"groupId":groupId};
            detailGetData(detailParam);
        }
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


    function detailGetData(param){

        returnData(detailUrls,param).then(
            result=>{
                if(result!=null){

                    setDetailData(result);
                }else{
                }
            });

        return () => {
            //clearTimeout(nmsCurrent);
        }

    }

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

    const editUrls = koIotUrl + "/admin/group/groupEdit";
    const saveUrls = koIotUrl + "/admin/group/groupAdd";

    function updateSave(saveInfo){

        //console.log(saveInfo)

        let errorChk = false;
        const saveData =saveInfo.saveValue;
        if(saveData.groupId===''){
            alert("GROUP ID는 필수 입력입니다.")
        }else if(saveData.manageCrpId===''){
            alert("MANAGE CRP를 입력해야 합니다.")
        }else if(saveData.crpId===''){
            alert("CRP를 입력해야 합니다.")
        }else{

            if(saveInfo.updateChk===false){
                postRequest(saveUrls,saveData)
            }else{
                postRequest(editUrls,saveData)
            }
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

    async function postRequest(urls,bodyData) {

        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;

        const headers = {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept":"application/json",
            "Authorization": "Bearer "+token,
        };
        let returnVal = null;

        try {
            returnVal = await axios.post(urls,bodyData,{
                headers:headers,
            });

            if(returnVal.status===201){
                returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});
                alert("저장되었습니다.")

            }else{
                alert("저장에 실패 했습니다")
            }

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
                                    <ManageSelectTable title={"전송 Group LIST"} rowId={rowId} data={selectData} dataColumn={GroupListData} paramOption={selectGroupOption} pageSize={pageSize} />
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                {<Box className="table" p={2}>
                                    <ManageAddModalTable title={"Group Device LIST"} rowId={"deviceId"} data={deviceData} dataColumn={GroupDeviceListData} paramOption={selectDeviceOption} pageSize={pageSize} />
                                </Box>}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} style={{width:"100%"}}>
                            <Box className="table" p={1} style={{marginLeft:"15px",border: "1px solid #EAEAEA"}}>
                                <GroupDetailForm groupId={groupId} data={detailData} manageCrpList={manageCrpList} crpList={crpList}
                                                changeMangeCrpId={changeMangeCrpId} groupList={groupsList} updateAndSave={updateSave}/>
                            </Box>
                        </Grid>
                        <Grid container spacing={1} style={{width:"100%"}}>
                            <Grid item xs={6} sm={6}>
                                <Box className="table" p={2}>
                                    <H2>{}</H2>
                                    <ManageTable data={sendData} title={"전송 LOG"} dataColumn={GroupSendListData} parmaOption={sendDataParamOption} pageSize={pageSize}/>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Box className="table" p={2}>
                                    <H2>{}</H2>
                                    <ManageTable data={controlData} title={"제어 LOG"} dataColumn={GroupControllListData} parmaOption={controlParamOption} pageSize={pageSize}/>
                                </Box>
                            </Grid>
                        </Grid>

                    </Grid>

                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default SetGroup_bak;