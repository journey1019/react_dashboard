import "./diagnostic.scss";
import MixedChart from "./MixedChart/MixedChart";
import ApexLine from "./MixedChart/ApexLine";

import SearchComponent from "../search/SearchComponent";

import Chart from 'react-apexcharts';
import RadialBar from './RadialBar/RadialBar';
import Recharts from './Recharts/Recharts';
import MultiLine from './MultiLine/MultiLine';
import DiagnosticJsonChart from './DiagnosticJsonChart/DiagnosticJsonChart'
import SingleRadial from './SingleRaidal/SingleRadial';
import MultipleRadial from './MultipleRadial/MultipleRadial';
import MultipleLine from './MultipleLine/MultipleLine';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from "axios";

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from "@mui/material/TextField";
import smartvms2date from "./config/smartvms2date.json";
import MixLineBar from "./MixedChart/MixedChart";


/* search */
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const searchData = [
    'React',
    'Material-UI',
    'JavaScript',
    'CSS',
    'HTML',
    'Frontend',
    'Backend',
    'Node.js',
];

const GetDiagnostic = (props) => {

    /* ----- getDiagnosticDate ------ */
    const [getDiagnostic, setGetDiagnostic] = useState([]);

    /* ----- Input ------ */
    const [startDate, setStartDate] = useState('2023120100');
    const [endDate, setEndDate] = useState('2023120500');
    const [keyType, setKeyType] = useState('');
    /*
    const now = new Date();
    //
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
    // Today(Real-Time) -> 20240101
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0].replace(/-/g,''));

    const [keyType, setKeyType] = useState('');

    const to = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
    console.log(to)

    // 오늘로부터 어제 시간-> YYYY-MM-DDTHH:mm:ss.645Z
    const yester = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
    // 오늘로부터 어제 23시 -> YYYYMMDD'23'
    const yesterDay = yester.substring(0, 4) + yester.substring(5, 7) + yester.substring(8,10) + '23';
    console.log(yesterDay);
*/
    /* ------ Select Time ---------*/
    const [timeRange, setTimeRange] = useState('');
    const handleTimeRange = (event) => {
        setTimeRange(event.target.value)
    }

    /* ------ Search Component ------- */
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        // 검색어에 맞는 결과를 찾아 setSearchResults에 설정합니다.
        const results = searchData.filter((item) =>
            item.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    };


    /* ----- getDiagnosticDetailList ------ */
    useEffect(() => {
        const data = getDiagnosticDetailList().then(
            result => {
                if (result != null) {
                    let diagnosticList = [];

                    console.log(result)
                    console.log(result)

                    // 각 Device별 데이터
                    result.map(function(deviceList){
                        console.log(deviceList)

                        deviceList.data.map(function(dataList){
                            console.log(dataList)

                            diagnosticList.push(dataList);
                        })
                    })
                    setGetDiagnostic(diagnosticList);
                }
                else{
                    console.log('detail 값 없음')
                }
            }
        )
    }, [startDate, endDate, keyType])

    useEffect(() => {
        props.RateOfOperation(getDiagnostic)
    }, [getDiagnostic]);
    console.log(getDiagnostic);

    /* ----- async await ------------ */
    async function getDiagnosticDetailList() {
        const token = JSON.parse(sessionStorage.getItem("userInfo")).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
        const params = {startDate: startDate, endDate: endDate, keyType: 2};
        const headers = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        };
        let returnVal = null;

        try {
            let result = await axios({
                method: "get",//통신방식
                url: urls,//URL
                headers: headers,//header
                params: params,
                responseType: "json"
            })
                .then(response => {
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                })
                .then(err => {
                    return null;
                });
            return returnVal; //반환
        } catch {
            return null;
        }
    }

    // satCutOffCount : 위성연결이 끊긴 횟수
    // powerOnCount : 단말기 전원이 켜진 횟수(?)
    // sendDataCount : 메세지를 보내내 횟수

    const timeRangeOptions = [
        {
            value: '1 Days',
            text: '1 Days',
        },
        {
            value: '3 Days',
            text: '3 Days',
        },
        {
            value: '7 Days',
            text: '7 Days',
        },
        {
            value: '30 Days',
            text: '30 Days',
        }
    ]


    return(
        <>
            <div className="getDiag">
                <div className="getDiagText">
                    <span className="getDiagTitle">Visualization by time</span>
                    <span className="getDiagContext">
                        <TextField
                            variant="standard"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/*<List>
                            {searchResults.map((result, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={result} />
                                </ListItem>
                            ))}
                        </List>*/}
                    </span>
                    <span className="getDiagContext">
                        <FormControl sx={{ pr: 1, minWidth: 100}}>
                            <TextField
                                id="diagnosticDate"
                                name="diagnosticDate"
                                variant="outlined"
                                autoComplete="alarmLogIndex"
                                autoFocus
                                onChange={e => setStartDate(e.target.value)}
                                value={startDate}
                                label="Start Date"
                                size="small"
                                sx={{ width: 100}}
                            />
                        </FormControl>
                        <span className="subText" style={{fontSize: '20px', paddingRight: '10px'}}>~</span>
                        <FormControl sx={{ pr: 3, minWidth: 100}}>
                            <TextField
                                id="diagnosticDate"
                                name="diagnosticDate"
                                variant="outlined"
                                autoComplete="alarmLogIndex"
                                autoFocus
                                onChange={e => setEndDate(e.target.value)}
                                value={endDate}
                                label="End Date"
                                size="small"
                                sx={{ width: 100}}
                            />
                        </FormControl>
                        <FormControl sx={{ pr: 1, minWidth: 130 }} size="small">
                            <InputLabel id="demo-select-small-label">Time Range</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={timeRange}
                                label="selectTime"
                                option={timeRangeOptions}
                                optionsTemplate={
                                (option) => (
                                    <MenuItem>
                                        {option.text}
                                    </MenuItem>
                                )
                            }
                                color="warning"
                                onChange={handleTimeRange}
                            >
                                <MenuItem value='1 Days'>1 Days</MenuItem>
                                <MenuItem value='3 Days'>3 Days</MenuItem>
                                <MenuItem value='7 Days'>7 Days</MenuItem>
                                <MenuItem value='30 Days'>30 Days</MenuItem>
                            </Select>
                        </FormControl>
                    </span>
                </div>
                <hr/>
                <div className="getDiagContain">
                    <ApexLine getDiagnostic={getDiagnostic}/>
                </div>
                <hr/>
                {/*<div className="getDiagContain">
                    <MixedChart getDiagnostic={getDiagnostic}/>
                </div>*/}
            </div>
        </>
    )
}


export default GetDiagnostic;