import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material/styles";
import "./DeviceDetailForm.scss"
import {Box, Button, Grid, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import Switch from '@mui/material/Switch';
import useDidMountEffect from "../module/UseDidMountEffect"


const GroupDetailForm_bak= (props) => {

    const H5 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '15px',
    }));
    const [propDataCheck, setPropDataCheck] = useState(false);

    const[groupId, setGroupId] = useState('');
    const[groupNm, setGroupNm] = useState('');
    const[manageCrpId, setManageCrpId] = useState('');
    const[crpId, setCrpId] = useState('');
    const[conn,setConn] = useState('')
    
    const [ynChecked, setYnChecked] = useState(false);
    const [senderName, setSenderName] = useState('');

    const [sendEndPoint, setSendEndPoint] = useState('')
    const [sendSubEndPoint, setSendSubEndPoint] = useState('')
    const [sendDateFormat, setSendDateFormat] = useState('')
    const [sendLocationFormat, setSendLocationFormat] = useState('')

    const [sendDataColumn, setSendDataColumn] = useState('')
    const [sendDataForm, setSendDataForm] = useState('')

    const [sendLastRow, setSendLastRow] = useState('')
    const [sendParsed, setSendParsed] = useState(false);
    const [ynSenderChecked, setYnSenderChecked] = useState(false);

    const [smtpUseChecked, setSmtpUseChecked] = useState(false);
    const [sendSmtpEndPoint, setSendSmtpEndPoint] = useState('')
    const [sendSmtpSubEndPoint, setSendSmtpSubEndPoint] = useState('')
    const [sendSmtpDataColumn, setSendSmtpDataColumn] = useState('')
//---------------------------------------------------------------------

    const [ynReceivederChecked, setYnReceivederChecked] = useState(false);
    const [receiverName, setReceiverName] = useState('');

    const [receivedEndPoint, setReceivedEndPoint] = useState('')
    const [receivedSubEndPoint, setReceivedSubEndPoint] = useState('')
    const [receivedDateFormat, setReceivedDateFormat] = useState('')
    const [receivedLocationFormat, setReceivedLocationFormat] = useState('')

    const [receivedDataColumn, setReceivedDataColumn] = useState('')
    const [receivedDataForm, setReceivedDataForm] = useState('')

    const [receivedLastRow, setReceivedLastRow] = useState('')
    const [receivedParsed, setReceivedParsed] = useState(false);

    const [receivedMainKey, setReceivedMainKey] = useState('')
    const [receivedSubKey, setReceivedSubKey] = useState('')
    const [receivedSeparator, setReceivedSeparator] = useState('')
    const [receivedDesc, setReceivedDesc] = useState('')



    useDidMountEffect(()=>{

        setPropDataCheck(true)
        setGroupId(props.data.groupId)
        setGroupNm(props.data.groupNm)
        setManageCrpId(props.data.manageCrpId)
        setCrpId(props.data.crpId)
        setYnChecked(props.data.groupUseYn==="Y"?true:false)

        if(typeof props.data.sender ==="undefined"){
            setYnSenderChecked(false);
            sendFormReset()
        }else{

            const senderData = props.data.sender;
            setYnSenderChecked(senderData.systemUseYn==="Y"?true:false)

            setSenderName(' ('+senderData.systemId+')')
            setConn(senderData.connectType)
            setSendEndPoint(senderData.endPoint)
            setSendSubEndPoint(typeof senderData.subEndPoint==="undefined"?'':senderData.subEndPoint)
            setSendDateFormat(senderData.dateFormat)
            setSendLocationFormat(senderData.locationFormat)
            setSendDataColumn(typeof senderData.dataColumn==="undefined"?'':JSON.stringify(senderData.dataColumn))
            setSendDataForm(typeof senderData.sendDataFormat==="undefined"?'':JSON.stringify(senderData.sendDataFormat))

            setSendLastRow(senderData.lastRowIndex)
            setSendParsed(senderData.parsed ==="Y"?true:false)

            setSmtpUseChecked(senderData.smtpUseYn ==="Y"?true:false)

            setSendSmtpEndPoint(senderData.smtpAddress)
            setSendSmtpSubEndPoint(senderData.smtpPort)
            setSendSmtpDataColumn(typeof  senderData.smtpSettingVal ==="undefined"?'':JSON.stringify(senderData.smtpSettingVal))

        }

        if(typeof props.data.receiver ==="undefined"){
            setYnReceivederChecked(false)
            receiverReset()
        }else{
            const receiverData = props.data.receiver;

            setReceiverName(' ('+receiverData.systemId+')');
            setYnReceivederChecked(receiverData.systemUseYn==="Y"?true:false)

            setReceivedEndPoint(receiverData.endPoint)
            setReceivedSubEndPoint(receiverData.subEndPoint)
            setReceivedDateFormat(typeof receiverData.dateFormat ==="undefined"?'':receiverData.dateFormat)
            setReceivedLocationFormat(typeof receiverData.locationFormat ==="undefined"?'':receiverData.locationFormat)
            setReceivedDataColumn(typeof receiverData.dataColumn==="undefined"?'':JSON.stringify(receiverData.dataColumn))
            setReceivedDataForm(typeof receiverData.sendDataFormat==="undefined"?'':JSON.stringify(receiverData.sendDataFormat))
            setReceivedLastRow()
            setReceivedParsed(receiverData.parsed==="Y"?true:false);
            if(typeof receiverData.groupKeyInfo !=="undefined"){
                const groupKeyInfo = receiverData.groupKeyInfo;
                setReceivedMainKey(typeof groupKeyInfo.mainKey ==="undefined"?'':groupKeyInfo.mainKey)
                setReceivedSubKey(typeof groupKeyInfo.subKey ==="undefined"?'':groupKeyInfo.subKey)
                setReceivedSeparator(typeof groupKeyInfo.seperator ==="undefined"?'':groupKeyInfo.seperator)
                setReceivedDesc(typeof groupKeyInfo.keyDesc ==="undefined"?'':groupKeyInfo.keyDesc)
            }


        }


    },[props.data]);

    useDidMountEffect(()=>{

    },[ynSenderChecked])
    useDidMountEffect(()=>{},[ynReceivederChecked])


    useDidMountEffect(()=>{props.changeMangeCrpId(manageCrpId)},[manageCrpId]);

    /*useDidMountEffect(()=>{

        if(smtpUseChecked===true){
            alert("CONNECT TYPE이 SMTP로 변경됩니다.")
            setConn("SMTP")
        }else {
            if(typeof props.data.sender !=="undefined" && typeof props.data.sender.connectType !=="undefined"){
                setConn(props.data.sender.connectType)
            }else{
                setConn('')
            }
        }

    },[smtpUseChecked]);*/

    function sendFormReset(){
        setYnSenderChecked(false)

        setConn('')
        setSenderName('')
        setSendEndPoint('')
        setSendSubEndPoint('')
        setSendDateFormat('')
        setSendLocationFormat('')
        setSendDataColumn('')
        setSendDataForm('')

        setSendLastRow('')
        setSendParsed(false)

        setSmtpUseChecked(false)

        setSendSmtpEndPoint('')
        setSendSmtpSubEndPoint('')
        setSendSmtpDataColumn('')

    }

    function receiverReset(){
        setReceiverName('')
        setYnReceivederChecked(false)

        setReceivedEndPoint('')
        setReceivedSubEndPoint('')
        setReceivedDateFormat('')
        setReceivedLocationFormat('')
        setReceivedDataColumn('')
        setReceivedDataForm('')
        setReceivedParsed(false)
        setReceivedMainKey('')
        setReceivedSubKey('')
        setReceivedSeparator('')
        setReceivedDesc('')

    }

    function saveBtnClicked(){

        let updateChk = true;
        let errorChk = false;
        if(typeof props.data.groupId ==="undefined"){
            updateChk = false;
        }

        let senders;

        if(ynSenderChecked){

            if(sendEndPoint===''){
                alert("(SENDER)END POINT를 입력해야 합니다.");
                errorChk = true;
            }if(conn==='TCP' && sendSubEndPoint===''){
                alert("(SENDER)CONNECT가 TCP는 SUB END POINT(port)를 입력해야 합니다.");
                errorChk = true;
            }else if(!IsJsonString(sendDataColumn)){
                alert("(SENDER)DATA COLUMN을 JSON 형태로 입력하여야 합니다.");
                errorChk = true;
            }else if(!IsJsonString(sendDataForm)){
                alert("(SENDER)SEND FORM을 JSON 형태로 입력하여야 합니다.");
                errorChk = true;
            }else{
                senders = {
                    "actType": "SENDER",
                    "connectType": conn,
                    "endPoint": sendEndPoint,
                    "subEndPoint": sendSubEndPoint,
                    "systemUseYn": ynSenderChecked===true?"Y":"N",
                    "dataColumn": JSON.parse(sendDataColumn),
                    "sendDataFormat": JSON.parse(sendDataForm),
                    "parsed": sendParsed===true?"Y":"N",
                    "dateFormat":sendDateFormat,
                    "locationFormat":sendLocationFormat,
                    "systemId":senderName===''?groupId+"_SENDER":senderName
                }

                if(smtpUseChecked){
                    if(!IsJsonString(sendSmtpDataColumn)){
                        alert("SMTP DATA COLUMN을 JSON 형태로 입력하여야 합니다.");
                        errorChk = true;
                    }else{
                        senders.smtpUseYn = senders.smtpUseYn === true?"Y":"N"
                        senders.smtpAddress = sendSmtpEndPoint
                        senders.smtpPort = sendSmtpSubEndPoint
                        senders.smtpSettingVal = JSON.parse(sendSmtpDataColumn)
                    }

                }else{
                    senders.smtpUseYn = "N"
                }
            }


        }
        let receiver;

        if(ynReceivederChecked){

            if(receivedEndPoint===''){
                alert("(RECEIVER)END POINT를 입력해야 합니다.");
                errorChk = true;
            }if(conn==='TCP' && receivedSubEndPoint===''){
                alert("(RECEIVER)CONNECT가 TCP는 SUB END POINT(port)를 입력해야 합니다.");
                errorChk = true;
            }else if(!IsJsonString(receivedDataColumn)){
                alert("(RECEIVER)DATA COLUMN을 JSON 형태로 입력하여야 합니다.");
                errorChk = true;
            }else if(!IsJsonString(receivedDataForm)){
                alert("(RECEIVER)SEND FORM을 JSON 형태로 입력하여야 합니다.");
                errorChk = true;
            }else{
                receiver = {
                    "actType": "RECEIVER",
                    "connectType": conn,
                    "endPoint": receivedEndPoint,
                    "subEndPoint": receivedSubEndPoint,
                    "systemUseYn": ynReceivederChecked===true?"Y":"N",
                    "dataColumn": JSON.parse(receivedDataColumn),
                    "sendDataFormat": JSON.parse(receivedDataForm),
                    "parsed": receivedParsed===true?"Y":"N",
                    "dateFormat":receivedDateFormat,
                    "locationFormat":receivedLocationFormat,
                    "systemId":receiverName===''?groupId+"_RECEIVER":receiverName
                }

                if(receivedMainKey!==''){
                    let groupKeyInfo ={
                        "groupId":groupId,
                        "queryType":"RECEIVER",
                        "mainKey":receivedMainKey,
                        "subKey": receivedSubKey,
                        "seperator": receivedSeparator,
                        "keyDesc": receivedDesc

                    }
                    receiver.groupKeyInfo = groupKeyInfo;
                }


            }


        }

        const saveValue = {
            "groupId": groupId,
            "groupNm": groupNm,
            "groupUseYn": ynChecked===true?"Y":"N",
            "manageCrpId": manageCrpId,
            "crpId": crpId
        }

        if(typeof senders !=="undefined"){
            saveValue.sender = senders
        }
        if(typeof receiver !=="undefined"){
            saveValue.receiver = receiver
        }

        const saveInfo = {
            "updateChk":updateChk,
            "saveValue":saveValue
        }

        if(errorChk===false){
            props.updateAndSave(saveInfo);
        }


    }

    function IsJsonString(str) {
        try {
            var json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }


    return(
        <div style={{marginLeft:"10px", paddingLeft:"5px"}}>
            <form id="deviceSetForm">
                <Grid container spacing={1} style={{width:"100%"}}>
                    <Grid container>
                        <Grid container>
                            <Grid item xs={2} sm={2} ><H5>Group ID</H5><TextField id="groupId" name="groupId" value={groupId} onChange={(event)=>{ setGroupId(event.target.value)}} disabled={propDataCheck} style={{width:"80%"}}/></Grid>
                            <Grid item xs={2} sm={2} ><H5>Group NAME</H5><TextField id="groupNm" name="groupNm" value={groupNm} onChange={(event)=>{ setGroupNm(event.target.value)}} style={{width:"80%"}}/></Grid>
                            <Grid item xs={2} sm={2} >
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
                            <Grid item xs={2} sm={2} >
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
                            <Grid item xs={2} sm={2}><H5>Connect</H5><TextField id="conn" name="conn" value={conn} onChange={(event)=>{ setConn(event.target.value)}} style={{width:"80%"}}/></Grid>
                            <Grid item xs={1} sm={1}><H5>Group Use</H5><Switch checked={ynChecked}  onChange={(event) => {setYnChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                            <Grid item xs={1} sm={1}><H5><br/></H5>
                                <Button
                                    className='group_Btn'
                                    variant='contained' size='medium'
                                    onClick={saveBtnClicked}
                                    style={{zIndex: 1}}
                                >
                                    SAVE
                                </Button></Grid>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <Grid container style={{marginTop:"10px"}}>
                                <Grid item xs={1} sm={1}><Switch checked={ynSenderChecked} onChange={(event) => {setYnSenderChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                <Grid item xs={10} sm={10} style={{marginTop:"5px"}}><H5>Sender{senderName}</H5></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3} sm={3}><H5>END POINT</H5><TextField id="sendEndPoint" name="sendEndPoint" value={sendEndPoint} disabled={!ynSenderChecked} onChange={(event)=>{ setSendEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={3} sm={3}><H5>SUB END POINT</H5><TextField id="sendSubEndPoint" name="sendSubEndPoint" value={sendSubEndPoint} disabled={!ynSenderChecked} onChange={(event)=>{ setSendSubEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={3} sm={3}><H5>DATE FORMAT</H5><TextField id="sendDateFormat" name="sendDateFormat" value={sendDateFormat} disabled={!ynSenderChecked} onChange={(event)=>{ setSendDateFormat(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={3} sm={3}><H5>LOCATION FORMAT</H5><TextField id="sendLocationFormat" name="sendLocationFormat" value={sendLocationFormat} disabled={!ynSenderChecked} onChange={(event)=>{ setSendLocationFormat(event.target.value)}} style={{width:"90%"}}/></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={6} sm={6}><H5>DATA COLUMN</H5><TextField id="sendDataColumn" name="sendDataColumn" value={sendDataColumn} disabled={!ynSenderChecked} onChange={(event)=>{ setSendDataColumn(event.target.value)}} style={{width:"95%"}}/></Grid>
                                <Grid item xs={6} sm={6}><H5>SEND FORM</H5><TextField id="sendDataForm" name="sendDataForm" value={sendDataForm} disabled={!ynSenderChecked} onChange={(event)=>{ setSendDataForm(event.target.value)}} style={{width:"95%"}}/></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3} sm={3}><H5>Last Row Index</H5><TextField id="sendLastRow" name="sendLastRow" value={sendLastRow} disabled={!ynSenderChecked} disabled={propDataCheck} onChange={(event)=>{ setSendLastRow(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2} sm={2}><H5>Parsed</H5><Switch checked={sendParsed} disabled={!ynSenderChecked} onChange={(event) => {setSendParsed(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                <Grid item xs={4} sm={4}></Grid>
                                <Grid item xs={3} sm={3}></Grid>
                            </Grid>
                            <Grid container>
                                <Grid container style={{marginTop:"10px"}}>
                                    <Grid item xs={1.5} sm={1.5} style={{marginTop:"5px"}}><H5>SMTP INFO</H5></Grid>
                                    <Grid item xs={10} sm={10}><Switch checked={smtpUseChecked}  disabled={!ynSenderChecked}  onChange={(event) => {setSmtpUseChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={3} sm={3}><H5>SMTP END POINT</H5><TextField id="sendSmtpEndPoint" name="sendSmtpEndPoint" value={sendSmtpEndPoint} disabled={!smtpUseChecked} onChange={(event)=>{ setSendSmtpEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                    <Grid item xs={3} sm={3}><H5>SMTP SUB END POINT</H5><TextField id="sendSmtpSubEndPoint" name="sendSmtpSubEndPoint" value={sendSmtpSubEndPoint} disabled={!smtpUseChecked} onChange={(event)=>{ setSendSmtpSubEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                    <Grid item xs={6} sm={6}><H5>DATA COLUMN</H5><TextField id="sendSmtpDataColumn" name="sendSmtpDataColumn" value={sendSmtpDataColumn} disabled={!smtpUseChecked} onChange={(event)=>{ setSendSmtpDataColumn(event.target.value)}} style={{width:"90%"}}/></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <Grid container style={{marginTop:"10px"}}>
                                <Grid item xs={1} sm={1}><Switch checked={ynReceivederChecked} onChange={(event) => {setYnReceivederChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                <Grid item xs={10} sm={10} style={{marginTop:"5px"}}><H5>RECEIVER{receiverName}</H5></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3} sm={3}><H5>END POINT</H5><TextField id="receivedEndPoint" name="receivedEndPoint" value={receivedEndPoint} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={3} sm={3}><H5>SUB END POINT</H5><TextField id="receivedSubEndPoint" name="receivedSubEndPoint" value={receivedSubEndPoint} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedSubEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={3} sm={3}><H5>DATE FORMAT</H5><TextField id="receivedDateFormat" name="receivedDateFormat" value={receivedDateFormat} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDateFormat(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={3} sm={3}><H5>LOCATION FORMAT</H5><TextField id="receivedLocationFormat" name="receivedLocationFormat" value={receivedLocationFormat} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedLocationFormat(event.target.value)}} style={{width:"90%"}}/></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={6} sm={6}><H5>DATA COLUMN</H5><TextField id="receivedDataColumn" name="receivedDataColumn" value={receivedDataColumn} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDataColumn(event.target.value)}} style={{width:"95%"}}/></Grid>
                                <Grid item xs={6} sm={6}><H5>SEND FORM</H5><TextField id="receivedDataForm" name="receivedDataForm" value={receivedDataForm} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDataForm(event.target.value)}} style={{width:"95%"}}/></Grid>
                            </Grid>

                            <Grid container>
                                <Grid item xs={2.5} sm={2.5}><H5>MAIN KEY</H5><TextField id="receivedMainKey" name="receivedMainKey" value={receivedMainKey} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedMainKey(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2.5} sm={2.5}><H5>SUB KEY</H5><TextField id="receivedSubKey" name="receivedSubKey" value={receivedSubKey} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedSubKey(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2.5} sm={2.5}><H5>SEPARATOR</H5><TextField id="receivedSeparator" name="receivedSeparator" value={receivedSeparator} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedSeparator(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2.5} sm={2.5}><H5>DESC</H5><TextField id="receivedDesc" name="receivedDesc" value={receivedDesc} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDesc(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2} sm={2}><H5>Parsed</H5><Switch checked={receivedParsed} disabled={!ynReceivederChecked}  onChange={(event) => {setReceivedParsed(event.target.checked);}}  inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>

            </form>
        </div>
    )
}

export default GroupDetailForm_bak;