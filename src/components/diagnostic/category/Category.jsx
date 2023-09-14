import "./category.scss";
import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import {Box, Stack, Button, Input} from "@mui/material";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import TextField from '@mui/material/TextField';
import MaterialReactTable from 'material-react-table';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";

// Select Input
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Category = () => {

    const to = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const today = to.replace(/-/g,''); // YYYYMMDD


    const [deviceId, setDeviceId] = useState('01680675SKY33EC');
    const [setDate, setSetDate] = useState(today);
    const [timeZone, setTimeZone] = useState('KST');

    const handleStartChange = (e) => {
        setSetDate(e.target.value);
    };
    const handleCountryChange = (event) => {
        setTimeZone(event.target.value);
    }

    const [getDiagnostic, setGetDiagnostic] = useState([]);



    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let diagnosticList = [];
                    console.log(result);

                    setGetDiagnostic(diagnosticList);
                }else{
                }
            });

        return () => {
            clearTimeout(getDiagnostic);
        }
    }, [deviceId, setSetDate, timeZone]);

    useEffect(() => {
    }, [getDiagnostic]);
    console.log(setDate)

    async function returnData() {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnostic";
        const params = {deviceId:(deviceId), setDate:(setDate), timeZone: (timeZone)};

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
                })
                .then(err=>{
                    return null;
                });
            return returnVal;

        } catch {
            return null;
        }
    }

    


    /*------------------------------------------------------------------*/
    // Grid Item Styling
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    // Time Zone _ Country


    function diagnosticParam() {
        return(
            <div className="dailyParamValue">
                <div className="topKey">
                    Event Date
                </div><hr/>
                <div className="bottomValue">
                    3
                </div>
            </div>
        )
    }

    return(
        <>
            <div className="category">
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        {/*<Item>Data</Item>*/}
                        <div className="diagnosticParams">
                            <span className="arrayTitle">Daily</span>
                            {diagnosticParam()}
                            {diagnosticParam()}
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        {/*<Item>Input</Item>*/}
                        <div className="inputValues">
                            <span>Set Date</span>
                            <LocalizationProvider dateAdapter={AdapterDayjs} style={{padding: '0px'}}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Date" />
                                </DemoContainer>
                            </LocalizationProvider>
                            <br />
                            <span>Device Id</span>
                            <br />
                            <TextField
                                id="outlined-search"
                                label="Device ID"
                                type="search"
                            />
                            <br /><br />
                            <span>Time Zone</span>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-standard"
                                value={timeZone}
                                label="TimeZone"
                                onChange={handleCountryChange}
                            >
                                <MenuItem value={10}>UTC</MenuItem>
                                <MenuItem value={20}>KST</MenuItem>
                            </Select>
                            <br/><br />
                            <Button variant="contained" size="small">Search</Button>
                        </div>
                    </Grid>
                </Grid>
            {/*<div className="widget" style={{backgroundColor: 'white'}}>
                <div className="left">
                    <span className="title">{data.title}</span>
                    <span className="counter">
                        3
                    </span>
                    <span className="link">{data.link}</span>
                </div>
                <div className="right">
                    <div className="percentage positive">
                        100%
                    </div>
                    {data.icon}
                </div>
            </div><br/>*/}
                {/*<div className="inquiry">
                    <div className="inquiry date">
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{padding: '0px'}}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className="inquiry input">
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                    </div>
                    <div className="inquiry btn">
                        <Button variant="contained" size="small">Search</Button>
                    </div>
                </div>
                <div className="statusInfo">
                    <div className="table">
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableColumnResizing
                            enableGrouping
                            enableStickyHeader
                            enableStickyFooter
                            initialState={{
                                density: 'compact',
                                expanded: true, //expand all groups by default
                                grouping: ['state'], //an array of columns to group by by default (can be multiple)
                                pagination: { pageIndex: 0, pageSize: 20 },
                                sorting: [{ id: 'state', desc: false }], //sort by state by default
                            }}
                            muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                            muiTableContainerProps={{ sx: { maxHeight: 700 } }}
                        />
                    </div>
                </div>*/}
            </div>
        </>
    )
}

export default Category;