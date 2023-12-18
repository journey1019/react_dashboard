import "./diagnostic.scss";

import RadialBar from './RadialBar/RadialBar';
import ChartjsDoughnut from './ChartjsDoughnut/ChartjsDoughnut';
import ChartjsLine from './ChartjsLine/ChartjsLine';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from "axios";


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Doughnut} from "react-chartjs-2";
import {Chart} from "chart.js";
import {Line, Pie} from 'react-chartjs-2';

const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

const Diagnostic = () => {

    const [diagnostic, setDiagnostic] = useState([]);

    const [percentage, setPercentage] = useState([]);



    // Input
    const [selectTime, setSelectTime] = useState('');
    const handleChangeTime = (event) => {
        setSelectTime(event.target.value);
    };

    const [selectKeyType, setSelectKeyType] = useState('');
    const handleChangeType = (event) => {
        setSelectKeyType(event.target.value);
    };

    const [startDate, setStartDate] = useState(new Date());
    const [value, setValue] = useState(dayjs('2023-12-12'));
    // ChartjsLine.jsx (SatCnr Line Chart)
    const [satCnr, setSatCnr] = useState([]);
    function dateFormat() {
        let month = startDate.getMonth()+1;
        let day = startDate.getDate ();

        month = month>=10 ? month : '0' + month;
        day = day>=10 ? day : '0' + day;
        console.log(startDate.getFullYear().toString() + month.toString() + day.toString());
        return startDate.getFullYear().toString() + month.toString() + day.toString();
    }


    useEffect(() => {
        const data = getDiagnosticAverage().then(
            result => {
                if (result != null) {
                    let diagList = [];
                    let timelineSatCnr = [];
                    console.log(result);

                    let percentList = [];

                    result.map(function(response) {
                        console.log(response);
                        console.log(response.cnrMap);



                        const percent = {};
                        percent.batChargePercent = response.batChargePercent;
                        percent.pwrOnPercent = response.pwrOnPercent;
                        percent.satOnPercent = response.satOnPercent;


                        percentList.push(percent);

                        if(response.cnrMap !== null) {
                            timelineSatCnr.push(response.cnrMap);
                        }
                        /*percentList.push(response.batChargePercent);
                        percentList.push(response.pwrOnPercent);
                        percentList.push(response.satOnPercent);*/
                    })

                    /*console.log(result.batChargePercent);
                    console.log(result.pwrOnPercent);
                    console.log(result.satOnPercent);*/

                    setDiagnostic(result);
                    setPercentage(percentList);
                    setSatCnr(timelineSatCnr)
                } else{
                    console.log('값이 없음')
                }
            }
        )
    }, [selectTime, selectKeyType, value]);

    useEffect(() => {

    }, [diagnostic, percentage])
    console.log(diagnostic);
    console.log(percentage);

    async function getDiagnosticAverage() {
        const token = JSON.parse(sessionStorage.getItem("userInfo")).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticAverage";
        const params = {avrType: selectTime, keyType: selectKeyType, timeIdenty: '2023-12-12 00'};
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





    //const InputSelectTime = ["HOUR", "DAY", "WEEK", "MONTH"];
    const InputSelectTime = [
        {
            value: 'HOUR',
            text: '시간별',
        },
        {
            value: 'DAY',
            text: '일별',
        },
        {
            value: 'WEEK',
            text: '주간별',
        },
        {
            value: 'MONTH',
            text: '월별',
        }
    ]

    //const inputSelectKeyType = [1, 2];
    const InputSelectKeyType = [
        {
            value: 1,
            text: '시간',
        },
        {
            value: 2,
            text: '일간'
        }
    ]


    const handleChangeInput = (e, type) => {
        const value = e.target.value;
        type === 'time' ? setSelectTime(value) : setSelectKeyType(value) 
    }


    return(
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Time Standard</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectTime}
                    label="selectTime"
                    option={InputSelectTime}
                    optionsTemplate={
                        (option) => (
                            <MenuItem>
                                {option.text}
                            </MenuItem>
                        )
                    }
                    color="warning"
                    onChange={handleChangeTime}
                >
                    {/*{inputSelectTime.map((time, idx) => {
                        return <option key={idx} value={time}>{time}</option>
                    })}*/}
                    <MenuItem value='HOUR'>HOUR</MenuItem>
                    <MenuItem value='DAY'>DAY</MenuItem>
                    <MenuItem value='WEEK'>WEEK</MenuItem>
                    <MenuItem value='MONTH'>MONTH</MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Key Type</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectKeyType}
                    label="selectKeyType"
                    option={InputSelectKeyType}
                    optionsTemplate={
                        (option) => (
                            <MenuItem>
                                {option.text}
                            </MenuItem>
                        )
                    }
                    color="warning"
                    onChange={handleChangeType}
                >
                    <MenuItem value='1'>시간별</MenuItem>
                    <MenuItem value='2'>일간별</MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{ ml: 1}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ monthShort: `M` }}>
                    <DemoContainer components={['DatePicker', 'DatePicker']} >
                        <DatePicker
                            label="Date of inquiry"
                            showDaysOutsideCurrentMonth // 이전&이후 날짜 보여주기 In 달력
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            slotProps={{ textField: {size: 'small'}}}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </FormControl>
            <br/><br/>

            <FormControl sx={{ ml: 1, pr: 1}}>
                <RadialBar percentage={percentage} />
            </FormControl>

            <FormControl sx={{ }}>
                <ChartjsLine diagnostic={diagnostic} satCnr={satCnr}/>
            </FormControl>

        </>
    )
}

export default Diagnostic;
