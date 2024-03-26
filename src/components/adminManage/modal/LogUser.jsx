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
import {UserUpdateData} from "../data/user/UserUpdateData";

/** K.O IoT GWY URL */
import { koIotUrl} from 'config';

const LogUser =() =>{

    const [onclick,setOnclick] = useState(false);
    const [userId, setUserId] = useState("");
    const [deviceBtnChk,setDeviceBtnChk] = useState(true);
    const rowId = "userId";
    const pageSize = 5;
    const listSize = 20;
    const buttonName = "사용자 LOG"



    function modalShow(){
        setOnclick(true);
        setDeviceBtnChk(!deviceBtnChk);
        setUpdateData([]);
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


    const selectUrls = koIotUrl + "/admin/user/info";
    const [selectData, setSelectData] = useState([]);
    const [requestData, setRequestData] = useState([]);






    useDidMountEffect(()=>{
        returnData(selectUrls,null).then(result=>{if(result!=null){setSelectData(result);}});

    },[deviceBtnChk]);



    const requestUrls = koIotUrl + "/admin/user/userRequestHistory";
    const [requestParam,setRequestParam] = new useState({});
    const updateUrls = koIotUrl + "/admin/user/userUpdateHistory";
    const [updateParam,setUpdateParam] = useState({});
    const [updateData, setUpdateData] = useState([]);





    useDidMountEffect(()=>{

                requestParam[rowId] = userId;
        updateParam[rowId] = userId;

        if(requestParam[rowId]!=null && requestParam[rowId] != ""){
            requestGetData();
        }
        if(updateParam[rowId]!=null && updateParam[rowId] != ""){
            updateGetData();
        }



    },[userId]);

    useDidMountEffect(()=>{
        if(requestParam[rowId]!=null && requestParam[rowId] != ""){
            requestGetData();
        }
    },[requestParam]);
    useDidMountEffect(()=>{
        if(updateParam[rowId]!=null && updateParam[rowId] != ""){
            updateGetData();
        }
    },[updateParam]);




    function requestDataParamOption(info){
        info["userId"] = userId;
        setRequestParam(info);
    }

    function requestGetData(){
        returnData(requestUrls,requestParam).then(
            result=>{
                if(result!=null && result.at(0)!=null){
                    setRequestData(result);
                }else{
                    setRequestData([]);
                }
            });

        return () => {
            //clearTimeout(nmsCurrent);
        }
    }

    function updateUserParamOption(info){
        info["userId"] = userId;
        setUpdateParam(info);
    }

    function updateGetData(){

        returnData(updateUrls,updateParam).then(
            result=>{

                if(result!=null && result.at(0)!=null){

                    setUpdateData(result);
                }else{
                    setUpdateData([]);
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

    function selectUserOption(selectUser){
        setUserId(selectUser);
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
                                <ManageSelectTable title={"사용자 LIST"} rowId={rowId} data={selectData} dataColumn={UserListData} paramOption={selectUserOption} pageSize={listSize} />
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={6} >
                                <Box className="table" p={2}>
                                    <ManageTable data={requestData} title={"요청 LOG"} dataColumn={UserRequestData} parmaOption={requestDataParamOption} pageSize={pageSize}/>
                                    <ManageTable data={updateData} title={"수정 LOG"} dataColumn={UserUpdateData} parmaOption={updateUserParamOption} pageSize={pageSize}/>
                                </Box>
                        </Grid>

                    </Grid>

                </Dialog>

            </React.Fragment>
        </div>

    )
}

export default LogUser;