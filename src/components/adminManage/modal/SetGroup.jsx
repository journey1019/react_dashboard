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
import {GroupListData} from "../data/group/GroupListData";
import {GroupDeviceListData} from "../data/group/GroupDeviceListData";
import ManageAddModalTable from "../table/ManageAddModalTable";
import GroupDetailForm from "../form/GroupDetailForm";
const SetGroup =() =>{

    const [onclick,setOnclick] = useState(false);
    const [groupId, setGroupId] = useState("");

    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "groupId";
    const pageSize = 5;
    const listSize = 10;
    const buttonName = "전송 그룹 관리"
    const [editAbleRole, setEditAbleRole] = useState(false);


    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
        setDeviceData([]);
        setDetailData({});

        if(JSON.parse(sessionStorage.getItem('userInfo')).roleId=="SUPER_ADMIN"){
            setEditAbleRole(true);
        };

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

    const manageCrpUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getManageCrpList";
    const crpUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getCrpList";
    const groupsUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getGroupUse";
    const defaultUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getDefaultLocation";
    const apiAccessIdUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getApiAccessId";
    const userRoleUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getUserRole";

    const [manageCrpList,setManageCrpList] = useState([]);
    const [crpList,setCrpList] = useState([]);
    const [groupsList,setGroupsList] = useState([]);
    const [managecrpId,setManagecrpId] = useState([]);


    useDidMountEffect(()=>{
        returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});
        returnData(manageCrpUrls,null).then(result=>{if(result!=null){setManageCrpList(result);}});
        returnData(groupsUrls,null).then(result=>{if(result!=null){setGroupsList(result);}});

    },[deviceBtnChk]);

    function changeMangeCrpId(updateManageCrpId){
        setManagecrpId(updateManageCrpId)
    }

    useDidMountEffect(()=>{
        const param = {"manageCrpId":managecrpId};
        returnData(crpUrls,param).then(result=>{if(result!=null){setCrpList(result);}});
    },[managecrpId]);




    const deviceUrls = "https://iotgwy.commtrace.com/restApi/admin/group/getGroupDevice";
    const [deviceParam,setDeviceParam] = useState({});
    const [deviceData, setDeviceData] = useState([]);
    const detailUrls = "https://iotgwy.commtrace.com/restApi/admin/group/getGroupDetail";
    const [detailData, setDetailData] = useState([]);





    useDidMountEffect(()=>{

        if(groupId!=null && groupId!=""){
            const detailParam = {"groupId":groupId};
            detailGetData(detailParam);
        }
        deviceParam[rowId] = groupId;

        if(deviceParam[rowId]!=null && deviceParam[rowId] != ""){
            groupDeviceGetData()
        }


    },[groupId]);


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

    const editUrls = "https://iotgwy.commtrace.com/restApi/admin/group/groupEdit";
    const saveUrls = "https://iotgwy.commtrace.com/restApi/admin/group/groupAdd";

    function updateSave(saveInfo){


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
                            <Grid item xs={4} sm={4}>
                                <Box className="table" p={2}>
                                    <ManageSelectTable title={"전송 Group LIST"} rowId={rowId} data={selectData} dataColumn={GroupListData} paramOption={selectGroupOption} pageSize={listSize} />
                                    <ManageAddModalTable title={"Group Device LIST"} rowId={"deviceId"} data={deviceData} dataColumn={GroupDeviceListData} paramOption={selectDeviceOption} pageSize={listSize} />
                                </Box>
                                <Box className="table" p={2}>
                                </Box>
                            </Grid>
                            <Grid item xs={8} sm={8}>

                                <Box className="table" p={1} style={{marginTop:"16px",marginLeft:"0px",padding:"16px",border: "1px dashed #EAEAEA"}}>
                                    <GroupDetailForm groupId={groupId} data={detailData} manageCrpList={manageCrpList} crpList={crpList}
                                                     changeMangeCrpId={changeMangeCrpId} groupList={groupsList} editAble={editAbleRole} updateAndSave={updateSave}/>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default SetGroup;