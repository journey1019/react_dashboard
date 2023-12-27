import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material/styles";
import "./DeviceDetailForm.scss"
import {Box, Button, Grid, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import Switch from '@mui/material/Switch';
import useDidMountEffect from "../module/UseDidMountEffect"
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';


const DeviceDetailForm = (props) => {

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

    const [age, setAge] = useState('');
    const[manageCrpId, setManageCrpId] = useState('');
    const[crpId, setCrpId] = useState('');
    const[groupId, setGroupId] = useState('');
    const[defaultLocation, setDefaultLocation] = useState('');
    const[accessId,setAccessId] = useState('');
    const[groupList,setGroupList] = useState([]);
    const[locateDisable,setLocateDisable] = useState(false);



    useDidMountEffect(()=>{
        let maps = {};
        props.defaultLocation.map((data)=>{

            const locate = {"latitude":data.latitude,"longitude":data.longitude};
            maps[data.locationId] = locate;

        })
        setDefaultLocationMap(maps)
    },[props.defaultLocation]);

    useDidMountEffect(()=>{
        if(defaultLocation!=null&&defaultLocation!=""){
            const locate = defaultLocationMap[defaultLocation];
            setLatitude(locate.latitude)
            setLongitude(locate.longitude)
        }
    },[defaultLocation]);

    useDidMountEffect(()=>{props.changeMangeCrpId(manageCrpId)},[manageCrpId]);

    const [ynChecked, setYnChecked] = useState(true);
    const handleYnCheck = (event) => {
        setYnChecked(event.target.checked);
    };

    const[deviceId, setDeviceId] = useState("");
    const[vhcleNm, setVhcleNm] = useState("");
    const[latitude,setLatitude] = useState(0.0);
    const[longitude,setLongitude] = useState(0.0);
    const[warningMin,setWarningMin] = useState(-1);
    const[dangerMin,setDangerMin] = useState(-1);
    const[minPeriod,setMinPeriod] = useState(-1);
    const[maxPeriod,setMaxPeriod] = useState(-1);
    const[ defaultLocationMap,setDefaultLocationMap] = useState({});
    const[groups,setGroups] = useState([]);


    //setDeviceId(props.deviceId)
    useDidMountEffect(()=>{
        //console.log(props.data)
        setDeviceId(props.data.deviceId)
        setVhcleNm(props.data.vhcleNm)
        setWarningMin(props.data.warningMin)
        setDangerMin(props.data.dangerMin)
        setMinPeriod(props.data.minPeriod)
        setMaxPeriod(props.data.maxPeriod)
        setLocateDisable(true)
        setLatitude(props.data.latitude)
        setLongitude(props.data.longitude)
        setManageCrpId(props.data.manageCrpId)
        setCrpId(props.data.crpId)
        setAccessId(props.data.apiAccessId)
        setGroups(props.data.groupList)

        if(props.data.useYn==="Y"){
            setYnChecked(true)
        }else{
            setYnChecked(false)
        }


    },[props.data]);


    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                (typeof personName ==="undefined"?-1:personName.indexOf(name)) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();

    const groupsChange = (event) => {
        const {
            target: { value },
        } = event;

        setGroups(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    function saveBtnClicked(){

        let updateChk = true;



        if(typeof props.data.deviceId ==="undefined"){
            updateChk = false;
        }

        const saveValue = {
            "deviceId": deviceId,
            "manageCrpId": manageCrpId,
            "crpId": crpId,
            "vhcleNm": vhcleNm,
            "useYn": ynChecked === true?"Y":"N",
            "apiAccessId": accessId,
            "warningMin": warningMin,
            "dangerMin": dangerMin,
            "minPeriod": minPeriod,
            "maxPeriod": maxPeriod
        }

        const groupList = [];
        groups.map((groupId)=>{
            if(groupId!=null){
                groupList.push(groupId)
            }
        });

        if(groupList.length!==0){
            saveValue.groupList = groupList;
        }


        if(defaultLocation!=="" && updateChk===false){
            saveValue.latitude = latitude;
            saveValue.longitude = longitude;
        }

        const saveInfo = {
            "updateChk":updateChk,
            "saveValue":saveValue
        }

        props.updateAndSave(saveInfo);

    }


    return(
        <div style={{marginLeft:"10px"}}>

            <form id="deviceSetForm">
                <Grid container spacing={1} style={{width:"100%"}}>
                    <Grid container spacing={1} sx={{height:"62px", paddingTop:"12px"}}>
                        <H5>단말 정보</H5>
                    </Grid>
                    <Grid container spacing={1} className="deviceEditForm">
                        <Grid container spacing={1}>
                            <Grid item xs={2} sm={2} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>Device ID</H2></Grid>
                            <Grid item xs={7.9} sm={7.9} sx={{marginLeft:"1px"}}><TextField size="small" id="deviceId" required name="deviceId" value={deviceId} onChange={(event)=>{ setDeviceId(event.target.value)}} disabled={locateDisable} sx={{width:"100%"}}/></Grid>
                            <Grid item xs={1} sm={1}>
                                <Button
                                    className='device_Btn'
                                    variant='contained' size='medium'
                                    //onClick={saveBtnClicked}
                                    disabled={locateDisable}
                                    style={{zIndex: 1}}
                                >
                                    CHECK
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{marginTop:"1px"}}>
                            <Grid item xs={2} sm={2} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>Device NAME</H2></Grid>
                            <Grid item xs={9} sm={9} sx={{marginLeft:"1px"}}><TextField size="small" id="vhcleNm" name="vhcleNm" value={vhcleNm} onChange={(event)=>{ setVhcleNm(event.target.value)}} sx={{width:"100%"}}/></Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{marginTop:"1px"}}>
                            <Grid item xs={2} sm={2} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>Manage Crp</H2></Grid>
                            <Grid item xs={9} sm={9} sx={{marginLeft:"1px"}}><Select
                                labelId="demo-simple-select-autowidth-label"
                                size="small"
                                id="manageCrpId"
                                name="manageCrpId"
                                value={manageCrpId}
                                onChange={(event) => {
                                    setManageCrpId(event.target.value);
                                }}
                                sx={{width:"100%"}}
                            >
                                {
                                    props.manageCrpList.map((data)=>{
                                        return(<MenuItem key={data.manageCrpId} value={data.manageCrpId}>{data.crpNm}</MenuItem>)
                                    })
                                }
                            </Select></Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{marginTop:"1px"}}>
                            <Grid item xs={2} sm={2} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>Crp</H2></Grid>
                            <Grid item xs={9} sm={9} sx={{marginLeft:"1px"}}>
                                <Select
                                    id="crpId"
                                    name="crpId"
                                    value={crpId}
                                    size="small"
                                    onChange={(event) => {
                                        setCrpId(event.target.value);
                                    }}
                                    sx={{width:"100%"}}
                                >
                                    {
                                        props.crpList.map((data)=>{
                                            return(<MenuItem key={data.crpId} value={data.crpId}>{data.crpNm}</MenuItem>)
                                        })
                                    }
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{marginTop:"1px"}}>
                            <Grid item xs={2} sm={2} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>Api Access</H2></Grid>
                            <Grid item xs={9} sm={9} sx={{marginLeft:"1px"}}>
                                <Select
                                    id="manage_crp_select"
                                    name="apiAccessId"
                                    size="small"
                                    value={accessId}
                                    onChange={(event) => {
                                        setAccessId(event.target.value);
                                    }}
                                    sx={{width:"100%"}}
                                >
                                    {
                                        props.apiAccessList.map((data)=>{
                                            return(<MenuItem key={data.apiAccessId} value={data.apiAccessId}>{data.apiAccessId}</MenuItem>)
                                        })
                                    }
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{marginTop:"1px"}}>
                            <Grid item xs={2} sm={2} sx={{borderRight:"1px dashed #EAEAEA"}}><H2>GROUP</H2></Grid>
                            <Grid item xs={3} sm={3} sx={{marginLeft:"1px"}}>
                                <Select
                                    id="groups"
                                    size="small"
                                    multiple
                                    value={groups}
                                    onChange={groupsChange}
                                    input={<OutlinedInput label="Name" />}
                                    MenuProps={MenuProps}
                                    sx={{width:"100%"}}
                                >
                                    {props.groupList.map((groupInfo) => (

                                        <MenuItem
                                            key={groupInfo.groupId}
                                            value={groupInfo.groupId}
                                            style={getStyles(groupInfo.groupId, groups, theme)}
                                        >
                                            {groupInfo.groupId}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={6} sm={6} sx={{marginLeft:"1px"}}>
                                <TextField id="groups" name="groups" size="small" value={groups} style={{width:"100%"}}/>
                            </Grid>
                        </Grid>

                        <Grid container sx={{margin:"20px 10px 10px 0px",padding:"10px",border:"1px solid #EAEAEA"}}>
                            <Grid container>
                                <Grid item xs={2} sm={2} sx={{marginTop:"5px"}}><H2>WARNING MIN</H2></Grid>
                                <Grid item xs={4} sm={4} sx={{paddingLeft:"5px"}}><TextField id="warningMin" size="small" name="warningMin" value={warningMin} onChange={(event)=>{ setWarningMin(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2} sm={2} sx={{marginTop:"5px"}}><H2>DANGER MIN</H2></Grid>
                                <Grid item xs={4} sm={4} sx={{paddingLeft:"5px"}}><TextField id="dangerMin" name="dangerMin" size="small" value={dangerMin} onChange={(event)=>{ setDangerMin(event.target.value)}} style={{width:"90%"}}/></Grid>
                            </Grid>
                            <Grid container sx={{marginTop:"5px"}}>
                                <Grid item xs={2} sm={2} sx={{marginTop:"5px"}}><H2>MIN PERIOD</H2></Grid>
                                <Grid item xs={4} sm={4} sx={{paddingLeft:"5px"}}><TextField id="minPeriod" name="minPeriod" size="small" value={minPeriod} onChange={(event)=>{ setMinPeriod(event.target.value)}} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2} sm={2} sx={{marginTop:"5px"}}><H2>MAX PERIOD</H2></Grid>
                                <Grid item xs={4} sm={4} sx={{paddingLeft:"5px"}}><TextField id="maxPeriod" name="maxPeriod" size="small" value={maxPeriod} onChange={(event)=>{ setMaxPeriod(event.target.value)}} style={{width:"90%"}}/></Grid>
                            </Grid>
                        </Grid>
                        <Grid container sx={{margin:"10px 10px 10px 0px",padding:"10px",border:"1px solid #EAEAEA"}}>
                            <Grid container>
                                <Grid item xs={3} sm={3} sx={{marginTop:"5px"}}><H2>Default Location</H2></Grid>
                                <Grid item xs={9} sm={9} >
                                    <Select
                                        id="defaultLocation"
                                        size="small"
                                        value={defaultLocation}
                                        onChange={(event) => {
                                            setDefaultLocation(event.target.value);
                                        }}
                                        sx={{width:"95.5%"}}
                                        disabled={locateDisable}

                                    >
                                        {
                                            props.defaultLocation.map((data)=>{
                                                return(<MenuItem key={data.locationId} value={data.locationId}>{data.locationNm}</MenuItem>)
                                            })
                                        }
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid container sx={{marginTop:"10px"}}>
                                <Grid item xs={2} sm={2} sx={{marginTop:"5px"}}><H2>LATITUDE</H2></Grid>
                                <Grid item xs={4} sm={4} sx={{paddingLeft:"5px"}}><TextField id="latitude" name="latitude" value={latitude} size="small" disabled={locateDisable} style={{width:"90%"}}/></Grid>
                                <Grid item xs={2} sm={2} sx={{marginTop:"5px"}}><H2>LONGITUDE</H2></Grid>
                                <Grid item xs={4} sm={4} sx={{paddingLeft:"5px"}}><TextField id="longitude" name="longitude" value={longitude} size="small" disabled={locateDisable} style={{width:"90%"}}/></Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid container spacing={1} sx={{marginBottom:"5%",paddingLeft:"5px"}}>
                                <Grid item xs={1} sm={1} sx={{marginTop:"5px"}}><H2>USE</H2></Grid>
                                <Grid item xs={9} sm={9} >
                                    <Switch
                                    checked={ynChecked}
                                    onChange={handleYnCheck}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    size="large"
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1} sx={{marginTop:"10%"}}>
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
                </Grid>

            </form>
        </div>
    )
}

export default DeviceDetailForm;