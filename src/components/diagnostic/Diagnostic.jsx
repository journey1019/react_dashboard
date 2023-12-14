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
        setSelectTime(event.target.value);
    };

    const [startDate, setStartDate] = useState(new Date());
    const [value, setValue] = useState(dayjs('2022-04-17'));
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
                    console.log(result);

                    let percentList = [];

                    result.map(function(response) {
                        console.log(response);

                        const percent = {};
                        percent.batChargePercent = response.batChargePercent;
                        percent.pwrOnPercent = response.pwrOnPercent;
                        percent.satOnPercent = response.satOnPercent;


                        //percentList.push(percent);
                        percentList.push(response.batChargePercent);
                        percentList.push(response.pwrOnPercent);
                        percentList.push(response.satOnPercent);
                    })

                    /*console.log(result.batChargePercent);
                    console.log(result.pwrOnPercent);
                    console.log(result.satOnPercent);*/

                    setDiagnostic(result);
                    setPercentage(percentList);
                } else{
                    console.log('값이 없음')
                }
            }
        )
    }, []);

    useEffect(() => {

    }, [diagnostic])
    console.log(diagnostic);
    console.log(percentage);

    async function getDiagnosticAverage() {
        const token = JSON.parse(sessionStorage.getItem("userInfo")).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticAverage";
        const params = {avrType: 'HOUR', keyType: 1, timeIdenty: '2023-11-12 00'};
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









    return(
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Time Standard</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectTime}
                    label="selectTime"
                    onChange={handleChangeTime}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>HOUR</MenuItem>
                    <MenuItem value={20}>DAY</MenuItem>
                    <MenuItem value={30}>WEEK</MenuItem>
                    <MenuItem value={40}>MONTH></MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Key Type</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectKeyType}
                    label="selectKeyType"
                    onChange={handleChangeType}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>1</MenuItem>
                    <MenuItem value={20}>2</MenuItem>
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

            <FormControl sx={{ ml: 1, pr: 10}}>
                <RadialBar />
            </FormControl>

        </>
    )
}

export default Diagnostic;
