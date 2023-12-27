import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material/styles";
import "./DeviceDetailForm.scss"
import {Box, Button, Grid, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import Switch from '@mui/material/Switch';
import useDidMountEffect from "../module/UseDidMountEffect"


const GroupDetailForm = (props) => {

    const H2 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '1.1em',
    }));
    const H5 = styled('h5')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '15pt',
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
        <div style={{marginLeft:"10px"}}>
            <form id="deviceSetForm">
                <Grid container spacing={1} style={{width:"100%"}}>
                    <Grid container spacing={1} sx={{height:"62px", paddingTop:"12px"}}>
                        <H5>계정 정보</H5>
                    </Grid>
                    <Grid container spacing={1} className="deviceEditForm" sx={{padding:"0px 10px 0px 0px"}}>
                        <Grid container spacing={1} sx={{marginTop:"1px"}}>
                            <Grid item xs={0.7} sm={0.7} sx={{ textAlign:"center"}}><H2>Group<br/>ID</H2></Grid>
                            <Grid item xs={1.7} sm={1.7} sx={{margin:"3px 0px 0px 1px"}}><TextField id="groupId" name="groupId" size="small" value={groupId} onChange={(event)=>{ setGroupId(event.target.value)}} disabled={propDataCheck} style={{width:"95%"}}/></Grid>
                            <Grid item xs={0.7} sm={0.7} sx={{ textAlign:"center"}}><H2>Group<br/>NAME</H2></Grid>
                            <Grid item xs={1.7} sm={1.7} sx={{margin:"3px 0px 0px 1px"}}><TextField id="groupNm" name="groupNm" size="small" value={groupNm} onChange={(event)=>{ setGroupNm(event.target.value)}} style={{width:"95%"}}/></Grid>
                            <Grid item xs={0.7} sm={0.7} sx={{ textAlign:"center"}}><H2>Manage<br/>Crp</H2></Grid>
                            <Grid item xs={1.7} sm={1.7} sx={{margin:"3px 0px 0px 1px"}}>
                                <Select
                                    id="manageCrpId"
                                    name="manageCrpId"
                                    value={manageCrpId}
                                    size="small"
                                    onChange={(event) => {
                                        setManageCrpId(event.target.value);
                                    }}
                                    sx={{width:"95%"}}
                                >
                                    {
                                        props.manageCrpList.map((data)=>{
                                            return(<MenuItem key={data.manageCrpId} value={data.manageCrpId}>{data.crpNm}</MenuItem>)
                                        })
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={0.5} sm={0.5} sx={{marginTop:"3px"}}><H2>Crp</H2></Grid>
                            <Grid item xs={1.7} sm={1.7} sx={{margin:"3px 0px 0px 1px"}}>
                                <Select
                                    id="crpId"
                                    name="crpId"
                                    value={crpId}
                                    size="small"
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
                            <Grid item xs={0.8} sm={0.8} sx={{marginTop:"3px"}}><H2>Connect</H2></Grid>
                            <Grid item xs={1.5} sm={1.5} sx={{margin:"3px 0px 0px 1px"}}><TextField id="conn" name="conn" size="small" value={conn} onChange={(event)=>{ setConn(event.target.value)}} style={{width:"95%"}}/></Grid>
                        </Grid>
                        <Grid item xs={6} sm={6} style={{border:"1px dashed #EAEAEA"}}>
                            <Grid container spacing={1} sx={{marginTop:"1px", borderBottom:"1px dashed #EAEAEA"}}>
                                <Grid item xs={1} sm={1}><Switch checked={ynSenderChecked} onChange={(event) => {setYnSenderChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                <Grid item xs={10} sm={10} sx={{margin:"7px 0px 0px 5px"}}><H2>Sender{senderName}</H2></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>END POINT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="sendEndPoint" name="sendEndPoint" size="small" value={sendEndPoint} disabled={!ynSenderChecked} onChange={(event)=>{ setSendEndPoint(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>SUB END POINT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="sendSubEndPoint" name="sendSubEndPoint" size="small" value={sendSubEndPoint} disabled={!ynSenderChecked} onChange={(event)=>{ setSendSubEndPoint(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>DATE FORMAT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="sendDateFormat" name="sendDateFormat" size="small" value={sendDateFormat} disabled={!ynSenderChecked} onChange={(event)=>{ setSendDateFormat(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>LOCATION FORMAT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="sendLocationFormat" name="sendLocationFormat" size="small" value={sendLocationFormat} disabled={!ynSenderChecked} onChange={(event)=>{ setSendLocationFormat(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>DATA COLUMN</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="sendDataColumn" name="sendDataColumn" size="small" multiline minRows={2} maxRows={2}  value={sendDataColumn} disabled={!ynSenderChecked} onChange={(event)=>{ setSendDataColumn(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>SEND FORM</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="sendDataForm" name="sendDataForm" size="small" multiline minRows={2} maxRows={2}  value={sendDataForm} disabled={!ynSenderChecked} onChange={(event)=>{ setSendDataForm(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>LAST ROW INDEX</H2></Grid>
                                <Grid item xs={5} sm={5} sx={{marginLeft:"1px"}}><TextField id="sendLastRow" name="sendLastRow" size="small" value={sendLastRow} disabled={!ynSenderChecked} disabled={propDataCheck} onChange={(event)=>{ setSendLastRow(event.target.value)}} style={{width:"80%"}}/></Grid>
                                <Grid item xs={1.1} sm={1.1} sx={{marginTop:"8px",marginLeft:"5px"}}><H2>Parsed</H2></Grid>
                                <Grid item xs={1} sm={1} sx={{marginLeft:"1px"}}><Switch checked={sendParsed} disabled={!ynSenderChecked} onChange={(event) => {setSendParsed(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                            </Grid>
                            <Grid container sx={{margin:"5px 10px 10px 0px",padding:"5px",border:"1px solid #EAEAEA",width:"95%"}}>
                                <Grid container sx={{marginTop:"0px", borderBottom:"1px dashed #EAEAEA"}}>
                                    <Grid item xs={2} sm={2} style={{marginTop:"10px"}}><H2>SMTP INFO</H2></Grid>
                                    <Grid item xs={9} sm={9}><Switch checked={smtpUseChecked}  disabled={!ynSenderChecked}  onChange={(event) => {setSmtpUseChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                </Grid>
                                <Grid container sx={{marginTop:"10px"}}>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>END POINT</H2></Grid>
                                    <Grid item xs={3} sm={3} sx={{paddingLeft:"5px"}}><TextField id="sendSmtpEndPoint" name="sendSmtpEndPoint" size="small" value={sendSmtpEndPoint} disabled={!smtpUseChecked} onChange={(event)=>{ setSendSmtpEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>SUB END POINT</H2></Grid>
                                    <Grid item xs={3} sm={3} sx={{paddingLeft:"5px"}}><TextField id="sendSmtpSubEndPoint" name="sendSmtpSubEndPoint" size="small" value={sendSmtpSubEndPoint} disabled={!smtpUseChecked} onChange={(event)=>{ setSendSmtpSubEndPoint(event.target.value)}} style={{width:"90%"}}/></Grid>
                                </Grid>
                                <Grid container sx={{marginTop:"10px"}}>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>DATA COLUMN</H2></Grid>
                                    <Grid item xs={9} sm={9} sx={{paddingLeft:"5px"}}><TextField id="sendSmtpDataColumn" name="sendSmtpDataColumn" value={sendSmtpDataColumn} size="small" multiline minRows={2} maxRows={2}  disabled={!smtpUseChecked} onChange={(event)=>{ setSendSmtpDataColumn(event.target.value)}} style={{width:"97%"}}/></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} sm={6} style={{border:"1px dashed #EAEAEA"}}>
                            <Grid container spacing={1} sx={{marginTop:"1px", borderBottom:"1px dashed #EAEAEA"}}>
                                <Grid item xs={1} sm={1}><Switch checked={ynReceivederChecked} onChange={(event) => {setYnReceivederChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                                <Grid item xs={10} sm={10} sx={{margin:"7px 0px 0px 5px"}}><H2>RECEIVER{receiverName}</H2></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>END POINT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="receivedEndPoint" name="receivedEndPoint" size="small" value={receivedEndPoint} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedEndPoint(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>SUB END POINT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="receivedSubEndPoint" name="receivedSubEndPoint" size="small" value={receivedSubEndPoint} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedSubEndPoint(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>DATE FORMAT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="receivedDateFormat" name="receivedDateFormat" size="small" value={receivedDateFormat} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDateFormat(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>LOCATION FORMAT</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="receivedLocationFormat" name="receivedLocationFormat" size="small" value={receivedLocationFormat} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedLocationFormat(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>DATA COLUMN</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="receivedDataColumn" name="receivedDataColumn" size="small" multiline minRows={2} maxRows={2}  value={receivedDataColumn} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDataColumn(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>SEND FORM</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><TextField id="receivedDataForm" name="receivedDataForm" size="small" multiline minRows={2} maxRows={2}  value={receivedDataForm} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDataForm(event.target.value)}} style={{width:"100%"}}/></Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{marginTop:"1px"}}>
                                <Grid item xs={3} sm={3} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>Parsed</H2></Grid>
                                <Grid item xs={8} sm={8} sx={{marginLeft:"1px"}}><Switch checked={receivedParsed} disabled={!ynReceivederChecked}  onChange={(event) => {setReceivedParsed(event.target.checked);}}  inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                            </Grid>
                            <Grid container sx={{margin:"5px 10px 10px 0px",padding:"5px",border:"1px solid #EAEAEA",width:"95%"}}>
                                <Grid container sx={{marginTop:"10px"}}>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>MAIN KEY</H2></Grid>
                                    <Grid item xs={3} sm={3} sx={{paddingLeft:"5px"}}><TextField id="receivedMainKey" name="receivedMainKey" size="small" value={receivedMainKey} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedMainKey(event.target.value)}} style={{width:"90%"}}/></Grid>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>SUB KEY</H2></Grid>
                                    <Grid item xs={3} sm={3} sx={{paddingLeft:"5px"}}><TextField id="receivedSubKey" name="receivedSubKey" size="small" value={receivedSubKey} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedSubKey(event.target.value)}} style={{width:"90%"}}/></Grid>
                                </Grid>
                                <Grid container sx={{marginTop:"10px"}}>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>SEPARATOR</H2></Grid>
                                    <Grid item xs={9} sm={9} sx={{paddingLeft:"5px"}}><TextField id="receivedSeparator" name="receivedSeparator" size="small" value={receivedSeparator} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedSeparator(event.target.value)}} style={{width:"97%"}}/></Grid>
                                </Grid>
                                <Grid container sx={{marginTop:"10px"}}>
                                    <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>DESC</H2></Grid>
                                    <Grid item xs={9} sm={9} sx={{paddingLeft:"5px"}}><TextField id="receivedDesc" name="receivedDesc" size="small" multiline minRows={2} maxRows={2}  value={receivedDesc} disabled={!ynReceivederChecked} onChange={(event)=>{ setReceivedDesc(event.target.value)}} style={{width:"97%"}}/></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{marginBottom:"5%",paddingLeft:"5px"}}>
                            <Grid item xs={1} sm={1} sx={{margin:"2% 0px 0px 10px"}}><H2>GROUP USE</H2></Grid>
                            <Grid item xs={9} sm={9} sx={{marginTop:"1.3%"}}><Switch checked={ynChecked}  onChange={(event) => {setYnChecked(event.target.checked);}} inputProps={{ 'aria-label': 'controlled' }} size="large"/></Grid>
                            <Grid item xs={1} sm={1} sx={{marginTop:"1.3%"}}>
                                <Button
                                    className='group_Btn'
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

export default GroupDetailForm;