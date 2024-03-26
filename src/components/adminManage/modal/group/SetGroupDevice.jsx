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
import useDidMountEffect from "../../module/UseDidMountEffect";
import {GroupDeviceListData} from "../../data/group/GroupDeviceListData";
import ManageCheckboxTable from "../../table/ManageCheckboxTable";
import {GroupDeviceSetData} from "../../data/group/GroupDeviceSetData";

/** K.O IoT GWY URL */
import { koIotUrl } from 'config';

const SetGroupDevice =(props) =>{

    const [onclick,setOnclick] = useState(false);
    const [groupId, setGroupId] = useState("");
    const [groupSelect,setGroupSelect] = useState(true);

    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "groupId";
    const pageSize = 5;
    const listSize = 20;
    const buttonName = "DEVICE ADD";
    const sortId = "useYn";
    const [editAbleRole, setEditAbleRole] = useState(false);

    const selectUrls = koIotUrl + "/admin/group/getGroupDeviceAddList";
    const [selectData, setSelectData] = useState([]);
    const [updateGroups,setUpdateGroups] = useState(false);

    useDidMountEffect(()=>{
        if(JSON.parse(sessionStorage.getItem('userInfo')).roleId=="SUPER_ADMIN"){
            if(props.selectId !==null && props.selectId!==""){
                setGroupSelect(false);
                setGroupId(props.selectId);
            }
        }
    },[props.selectId]);

    const manageCrpUrls = koIotUrl + "/admin/module/getManageCrpList";
    const [manageCrpList,setManageCrpList] = useState([]);
    const [manageCrpNmList,setManageCrpNmList] = useState([]);

    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
        setUpdateGroups(false);


        if(JSON.parse(sessionStorage.getItem('userInfo')).roleId=="SUPER_ADMIN"){
            const param = {
                groupId : props.selectId
            }
            returnData(selectUrls,param).then(result=>{if(result!=null){setSelectData(result);}});
            returnData(manageCrpUrls,null).then(result=>{if(result!=null){setManageCrpList(result);}});

        };
    }

    useDidMountEffect(()=>{
        let manageCrpName = [];
        manageCrpList.map(function(result){
            const manage = {};
            manage.text = result.manageCrpNm;
            manage.value = result.manageCrpNm;
            manageCrpName.push(manage)
        })
        setManageCrpNmList(manageCrpName);
    },[manageCrpList]);

    function modalClose(){
        props.refreshTable(updateGroups);
        setOnclick(false);

    }
    /*--------------------------- Font Style -------------------------------*/
    const H2 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '20px',
    }));


    const groupDeviceEditUrls = koIotUrl + "/admin/group/deviceGroupMpEdit";
    function deviceGroupUpdate(param){
        param["groupId"] = props.selectId;
        setUpdateGroups(true);
        postRequest(groupDeviceEditUrls,param,null);
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
                //returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});
                alert("저장되었습니다.")

            }else{
                alert("저장에 실패 했습니다")
            }

            return returnVal;

        } catch {
            return null;
        }

    }


    return (
        <div >
            <React.Fragment>
                <Button
                    className='device_Btn'
                    variant='contained' size='medium'
                    onClick={modalShow}
                    disabled={groupSelect}
                    style={{zIndex: 1, float:"left"}}
                >
                    {buttonName}
                </Button>

                <Dialog
                    fullScreen
                    open={onclick}
                    onClose={modalClose}
                    //TransitionComponent={Transition}
                    sx={{width: "50%", left:"25%",bottom:"2%"}}
                >
                    <AppBar sx={{ position: 'relative', backgroundColor:'#4C4C4C' }}>
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
                        <Box className="table" p={2}>
                            <ManageCheckboxTable title={"Group Device LIST"} rowId={"deviceId"} data={selectData} dataColumn={GroupDeviceSetData} paramOption={deviceGroupUpdate} pageSize={listSize}
                            manageNmList={manageCrpNmList}/>
                        </Box>
                    </Grid>
                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default SetGroupDevice;