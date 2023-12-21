import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material/styles";
import "./DeviceDetailForm.scss"
import {Box, Button, Grid, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import dayjs from 'dayjs';
import Switch from '@mui/material/Switch';
import useDidMountEffect from "../module/UseDidMountEffect"
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';


const UserDetailForm = (props) => {

    const H5 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '15px',
    }));

    const password_reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const email_reg = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/

    function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${month}-${date}-${year}`;
    }




    const[userId, setUserId] = useState("");
    const[userNm, setUserNm] = useState("");
    const[manageCrpId, setManageCrpId] = useState('');
    const[crpId, setCrpId] = useState('');

    const[userPw,setUserPw] = useState('');
    const[userPwRe,setUserPwRe] = useState('');
    const[groupId, setGroupId] = useState('');
    const[roleId, setRoleId] = useState('');

    const[email,setEmail] = useState("");
    const[phone,setPhone] = useState("");
    const[address,setAddress] = useState("");
    const[expireDate,setExpireDate] = useState(dayjs(getDate()));

    const[userCertMethod, setUserCertMethod] = useState('');


    const[department,setDepartment] = useState('');
    const[depPosition,setDepPosition] = useState('');
    const[locateDisable,setLocateDisable] = useState(false);
    const[adminChecker,setAdminChecker] = useState(true)







    useDidMountEffect(()=>{props.changeMangeCrpId(manageCrpId)},[manageCrpId]);

    const [ynChecked, setYnChecked] = useState(true);
    const handleYnCheck = (event) => {
        setYnChecked(event.target.checked);
    };

    useDidMountEffect(()=>{
        if(roleId ==="SUPER_ADMIN" || roleId ==="ADMIN"){
            setAdminChecker(false)
        }else{
            setAdminChecker(true)
        }
    },[roleId]);

    const[groups,setGroups] = useState([]);


    //setDeviceId(props.deviceId)
    useDidMountEffect(()=>{
        //console.log(props.data)
        setUserId(props.data.userId)
        setUserNm(props.data.userNm)
        setEmail(props.data.userEmail)
        setPhone(props.data.userTel===null?"":props.data.userTel)
        setAddress(props.data.userAddress===null?"":props.data.userAddress)
        setLocateDisable(true)
        setManageCrpId(props.data.manageCrpId)
        setCrpId(props.data.crpId)
        setUserPw(props.data.userPw)
        setGroupId(props.data.groupId)
        setUserCertMethod(props.data.userCertMethod)
        setRoleId(props.data.rolesRoleId)
        setExpireDate(dayjs(props.data.userExpiredDate.substring(0,10)))
        setDepartment(props.data.department)
        setDepPosition(props.data.depPosition)

        if(props.data.rolesRoleId==="SUPER_ADMIN" || props.data.rolesRoleId==="ADMIN"){
            setAdminChecker(false)
        }

        if(props.data.useYn==="Y"){
            setYnChecked(true)
        }else{
            setYnChecked(false)
        }


    },[props.data]);


    function saveBtnClicked(){

        let updateChk = true;
        let errorChk = false;

        if(typeof props.data.userId ==="undefined"){
            updateChk = false;
        }

        const saveValue = {
            "userId": userId,
            "manageCrpId": manageCrpId,
            "crpId": crpId,
            "userNm": userNm,
            "useYn": ynChecked === true?"Y":"N",
            "groupId": groupId,
            "rolesRoleId":roleId,
            "userEmail": email,
            "userCertMethod": userCertMethod,
            "authId": email,
            "userTel": phone,
            "userExpiredDate":expireDate.format("YYYY-MM-DDT23:59:59")

        }

        if(roleId==="SUPER_ADMIN"||roleId==="ADMIN"){
            saveValue.department = department;
            saveValue.depPosition = depPosition;
            saveValue.authType = "SE_AUTH";
        }

        if(updateChk===false){
            if(userPw===null || userPw===""){
                alert("PASSWORD를 입력해주세요.")
                errorChk = true;
            }else if(userPwRe===null || userPwRe===""){
                alert("PASSWORD RE를 입력해주세요")
               errorChk = true;
            }else if(userPw!==userPwRe){
                alert("PASSWORD 가 다릅니다.")
                errorChk = true;
            }else if(!password_reg.test(userPw)){
                alert("하나 이상의 문자, 숫자, 특수문자로 구성되는 8자이상의 PASSWORD를 입력해주세요.")
                errorChk = true;
            }else{
                saveValue.userPw = userPw;
            }
        }

        if(!email_reg.test(email)){
            alert("EMAIL 입력이 잘못되었습니다.")
        }

        if(errorChk===false){
            const saveInfo = {
                "updateChk":updateChk,
                "saveValue":saveValue
            }

            props.updateAndSave(saveInfo);
        }

    }


    return(
        <div style={{marginLeft:"10px", paddingLeft:"5px"}}>
            <form id="deviceSetForm">
                <Grid container spacing={1} style={{width:"100%"}}>

                    <Grid container>
                        <Grid item xs={3} sm={3} ><H5>User ID</H5><TextField id="userId" name="userId" value={userId} onChange={(event)=>{ setUserId(event.target.value)}} disabled={locateDisable}  style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>User Name</H5><TextField id="userNm" name="userNm" value={userNm} onChange={(event)=>{ setUserNm(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} >
                            <H5>Manage Crp</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manageCrpId"
                                name="manageCrpId"
                                value={manageCrpId}
                                label="manageCrpNm"
                                onChange={(event) => {
                                    setManageCrpId(event.target.value);
                                }}
                                sx={{width:"90%"}}
                            >
                                {
                                    props.manageCrpList.map((data)=>{
                                        return(<MenuItem key={data.manageCrpId} value={data.manageCrpId}>{data.crpNm}</MenuItem>)
                                    })
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={3} sm={3} >
                            <H5>Crp</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="crpId"
                                name="crpId"
                                value={crpId}
                                label="crpNm"
                                onChange={(event) => {
                                    setCrpId(event.target.value);
                                }}
                                sx={{width:"90%"}}
                            >
                                {
                                    props.crpList.map((data)=>{
                                        return(<MenuItem key={data.crpId} value={data.crpId}>{data.crpNm}</MenuItem>)
                                    })
                                }
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} sm={3}><H5>PASSWORD</H5><TextField id="userPw" name="userPw" type="password" disabled={locateDisable} value={userPw} onChange={(event)=>{ setUserPw(event.target.value)}} disabled={locateDisable}  style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3}><H5>PASSWORD RE</H5><TextField id="userPwRe" name="userPwRe"  type="password"  disabled={locateDisable} value={userPwRe} onChange={(event)=>{ setUserPwRe(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3}>
                            <H5>GROUP</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="groupId"
                                name="groupId"
                                value={groupId}
                                onChange={(event) => {
                                    setGroupId(event.target.value);
                                }}
                                sx={{width:"90%"}}
                            >
                                {props.groupList.map((groupInfo) => (

                                    <MenuItem
                                        key={groupInfo.groupId}
                                        value={groupInfo.groupId}
                                    >
                                        {groupInfo.groupId}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={3} sm={3}><H5>User Role</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="roleId"
                                name="roleId"
                                value={roleId}
                                onChange={(event) => {
                                    setRoleId(event.target.value);
                                }}
                                sx={{width:"90%"}}
                            >
                                {props.roleList.map((roleInfo) => (

                                    <MenuItem
                                        key={roleInfo.roleId}
                                        value={roleInfo.roleId}
                                    >
                                        {roleInfo.roleId}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={3} sm={3} ><H5>EMAIL</H5><TextField id="email" name="email" value={email} onChange={(event)=>{ setEmail(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>PHONE</H5><TextField id="phone" name="phone" value={phone} onChange={(event)=>{ setPhone(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>ADDRESS</H5><TextField id="address" name="address" value={address} onChange={(event)=>{ setAddress(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3}><H5>EXPIRED DATE</H5><DatePicker format="YYYY-MM-DD" value={expireDate} onChange={(newValue) => setExpireDate(newValue)} /></Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={3} sm={3} >
                            <H5>CERTIFICATION TYPE</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="userCertMethod"
                                value={userCertMethod}
                                label="userCertMethod"
                                onChange={(event) => {
                                    setUserCertMethod(event.target.value);
                                }}
                                disabled={adminChecker}
                                sx={{width:"90%"}}

                            >

                                <MenuItem key="KAKAOWORK" value="KAKAOWORK">KAKAOWORK</MenuItem>
                                <MenuItem key="EMAIL" value="EMAIL">EMAIL</MenuItem>

                            </Select>
                        </Grid>
                        <Grid item xs={3} sm={3} ><H5>DEPARTMENT</H5><TextField id="department" name="department" disabled={adminChecker} value={department} onChange={(event)=>{ setDepartment(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>POSITION</H5><TextField id="depPosition" name="depPosition" disabled={adminChecker} value={depPosition} onChange={(event)=>{ setDepPosition(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6}>
                                <H5>USE</H5>
                                <Switch
                                    checked={ynChecked}
                                    onChange={handleYnCheck}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    size="large"
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <H5><br/></H5>
                                <Button
                                    className='device_Btn'
                                    variant='contained' size='medium'
                                    onClick={saveBtnClicked}
                                    disabled={!props.editAble}
                                    style={{zIndex: 1}}
                                >
                                    SAVE
                                </Button>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>

            </form>
        </div>
    )
}

export default UserDetailForm;