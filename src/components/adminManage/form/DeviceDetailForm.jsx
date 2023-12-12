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

    const H5 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '15px',
    }));

    const [age, setAge] = useState('');
    const[manageCrpId, setManageCrpId] = useState('');
    const[crpId, setCrpId] = useState('');
    const[groupId, setGroupId] = useState('');
    const[defaultLocation, setDefaultLocation] = useState('');
    const[groupList,setGroupList] = useState([]);
    const[locateDisable,setLocateDisable] = useState(false);

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleGroup = (event) => {
        setGroupId(event.target.value);
    };

/*    useDidMountEffect(()=>{
        props.groupList.map((data)=>{
            //console.log(data)
        });
    },[props.groupList])*/



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

    const [checked, setChecked] = useState(true);
    const handleChange1 = (event) => {
        setChecked(event.target.checked);
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
        setGroups([])

        if(props.data.groupList!=null && props.data.groupList.length!==0){

            props.data.groupList.map((groupId)=>{
                if(groupId!=null){
                    groups.push(groupId)
                }

            })

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
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();

    const handleChange2 = (event) => {
        const {
            target: { value },
        } = event;
        console.log(groups)
        console.log(value)

        setGroups(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };





    return(
        <div style={{marginLeft:"10px", paddingLeft:"5px"}}>
            <form id="deviceSetForm">
                <Grid container spacing={1} style={{width:"100%"}}>

                    <Grid container>
                        <Grid item xs={3} sm={3} ><H5>Device ID</H5><TextField id="deviceId" name="deviceId" value={deviceId} onChange={(event)=>{ setDeviceId(event.target.value)}} disabled={locateDisable}  style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>Device Nm</H5><TextField id="vhcleNm" name="vhcleNm" value={vhcleNm} onChange={(event)=>{ setVhcleNm(event.target.value)}} style={{width:"90%"}}/></Grid>
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
                        <Grid item xs={3} sm={3}><H5>Api Access</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manage_crp_select"
                                name="apiAccessId"
                                value={age}
                                label="apiAccessId"
                                onChange={handleChange}
                                sx={{width:"90%"}}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select></Grid>
                        <Grid item xs={3} sm={3}>
                            <H5>GROUP</H5>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="groups"
                                multiple
                                value={groups}
                                onChange={handleChange2}
                                input={<OutlinedInput label="Name" />}
                                MenuProps={MenuProps}
                                sx={{width:"90%"}}
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
                        <Grid item xs={6} sm={6}><H5>IN GROUP</H5><TextField id="groups" name="groups" value={groups} style={{width:"95%"}}/></Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={3} sm={3} ><H5>WARNING MIN</H5><TextField id="warningMin" name="warningMin" value={warningMin} onChange={(event)=>{ setWarningMin(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>DANGER MIN</H5><TextField id="dangerMin" name="dangerMin" value={dangerMin} onChange={(event)=>{ setDangerMin(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>MIN PERIOD</H5><TextField id="minPeriod" name="minPeriod" value={minPeriod} onChange={(event)=>{ setMinPeriod(event.target.value)}} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>MAX PERIOD</H5><TextField id="maxPeriod" name="maxPeriod" value={maxPeriod} onChange={(event)=>{ setMaxPeriod(event.target.value)}} style={{width:"90%"}}/></Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={3} sm={3} >
                            <H5>Default Location</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="defaultLocation"
                                value={defaultLocation}
                                label="defaultLocation"
                                onChange={(event) => {
                                    setDefaultLocation(event.target.value);
                                }}
                                sx={{width:"90%"}}
                                disabled={locateDisable}

                            >
                                {
                                    props.defaultLocation.map((data)=>{
                                        return(<MenuItem key={data.locationId} value={data.locationId}>{data.locationNm}</MenuItem>)
                                    })
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={3} sm={3} ><H5>LATITUDE</H5><TextField id="latitude" name="latitude" value={latitude} disabled={locateDisable} style={{width:"90%"}}/></Grid>
                        <Grid item xs={3} sm={3} ><H5>LONGITUDE</H5><TextField id="longitude" name="longitude" value={longitude} disabled={locateDisable} style={{width:"90%"}}/></Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6}>
                                <H5>USE</H5>
                                <Switch
                                    checked={checked}
                                    onChange={handleChange1}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    size="large"
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <H5><br/></H5>
                                <Button
                                    className='device_Btn'
                                    variant='contained' size='medium'
                                    //onClick={modalShow}
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

export default DeviceDetailForm;