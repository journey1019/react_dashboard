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
import {RequestColumnData} from "../data/RequestColumnData";
import {DeviceRequestData} from "../data/device/DeviceRequestData"
import {DeviceSendData} from "../data/device/DeviceSendData"
import DeviceDetailForm from "../form/DeviceDetailForm";

const SetDevice =() =>{

    const [onclick,setOnclick] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "deviceId";
    const listSize = 20;
    const buttonName = "단말 관리"
    const [editAbleRole, setEditAbleRole] = useState(false);

    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
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


    const selectUrls = "https://iotgwy.commtrace.com/restApi/admin/device/info";
    const [selectData, setSelectData] = useState([]);

    const manageCrpUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getManageCrpList";
    const crpUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getCrpList";
    const groupsUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getGroupUse";
    const defaultUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getDefaultLocation";
    const apiAccessIdUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getApiAccessId";

    const [manageCrpList,setManageCrpList] = useState([]);
    const [crpList,setCrpList] = useState([]);
    const [groupsList,setGroupsList] = useState([]);
    const [defaultLocationList,setDefaultLocationList] = useState([]);
    const [apiAccessIdList,setApiAccessIdList] = useState([]);
    const [managecrpId,setManagecrpId] = useState([]);
    const [apiAccessList,setApiAccessList] = useState([]);


    useDidMountEffect(()=>{
        returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});
        returnData(manageCrpUrls,null).then(result=>{if(result!=null){setManageCrpList(result);}});
        returnData(groupsUrls,null).then(result=>{if(result!=null){setGroupsList(result);}});
        returnData(defaultUrls,null).then(result=>{if(result!=null){setDefaultLocationList(result);}});
        returnData(apiAccessIdUrls,null).then(result=>{if(result!=null){setApiAccessList(result);}});

    },[deviceBtnChk]);

    function changeMangeCrpId(updateManageCrpId){
        setManagecrpId(updateManageCrpId)
    }

    useDidMountEffect(()=>{
        const param = {"manageCrpId":managecrpId};
        returnData(crpUrls,param).then(result=>{if(result!=null){setCrpList(result);}});
    },[managecrpId]);


    const deviceIdChkUrls = "https://iotgwy.commtrace.com/restApi/admin/module/getDeviceIdCheck";
    const [deviceIdChk,setDeviceIdChk] = useState({});
    function deviceIdCheck(deviceId){
        const deviceChkParam = {"deviceId" : deviceId}
        console.log(deviceChkParam)
        returnData(deviceIdChkUrls,deviceChkParam).then(result=>{if(result!=null){setDeviceIdChk(result);}});
    }

    const detailUrls = "https://iotgwy.commtrace.com/restApi/admin/device/deviceDetail";
    const [detailData, setDetailData] = useState([]);

    useDidMountEffect(()=>{

        if(deviceId!=null && deviceId!=""){
            const detailParam = {"deviceId":deviceId};
            detailGetData(detailParam);
        }

    },[deviceId]);


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




    const editUrls = "https://iotgwy.commtrace.com/restApi/admin/device/deviceEdit";
    const saveUrls = "https://iotgwy.commtrace.com/restApi/admin/device/deviceAdd";

    function updateSave(saveInfo){

        //console.log(saveInfo)
        const saveData = saveInfo.saveValue;
        if(saveData.deviceId==null || saveData.deviceId==""){
            alert("Device ID를 입력하세요.")
        }else if(saveData.vhcleNm==null || saveData.vhcleNm==""){
            alert("Device Name를 입력하세요.")
        }else if(saveData.manageCrpId==null || saveData.manageCrpId==""){
            alert("Manage CRP를 입력하세요.")
        }else if(saveData.manageCrpId==null || saveData.manageCrpId==""){
            alert("CRP를 입력하세요.")
        }else if(saveData.apiAccessId==null || saveData.apiAccessId==""){
            alert("Api Access를 입력하세요.")
        }else if(saveInfo.updateChk ===false && typeof saveData.latitude ==="undefined"){
            alert("Default Location을 입력하세요.")
        }else{

            if(saveInfo.updateChk===false){
                postRequest(saveUrls,null,saveData)
            }else{
                postRequest(editUrls,null,saveData)
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

    async function postRequest(urls,params,bodyData) {

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
                params:params
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
                        <Grid item xs={7} sm={7} >
                            <Box className="table" p={2}>
                                <ManageSelectTable title={"단말 LIST"} rowId={rowId} data={selectData} dataColumn={DeviceListData} paramOption={selectDeviceOption} pageSize={listSize} />
                            </Box>
                        </Grid>
                        <Grid item xs={5} sm={5} >
                            <Box className="table" p={1} style={{marginTop:"16px",marginLeft:"0px",padding:"16px",border: "1px dashed #EAEAEA"}}>
                                <DeviceDetailForm deviceId={deviceId} data={detailData} manageCrpList={manageCrpList} crpList={crpList}
                                                  changeMangeCrpId={changeMangeCrpId} groupList={groupsList} defaultLocation={defaultLocationList}
                                                  apiAccessList={apiAccessList} editAble={editAbleRole} updateAndSave={updateSave} deviceIdCheck={deviceIdCheck} deviceCheckVal={deviceIdChk}/>
                            </Box>
                        </Grid>

                    </Grid>

                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default SetDevice;