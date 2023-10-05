import './defaultParam.scss';
import * as React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import {useEffect, useState, useMemo} from "react";

import {Box, Stack, Button, Input} from "@mui/material";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);



const DefaultParam = (props) => {
    console.log(props.defaultParam);

    const [dailyData, setDailyData] = useState(0);

    const [satCount, setSatCount] = useState([]);
    const [satTime, setSatTime] = useState([]);


    const [keyCount, setKeyCount] = useState([]);

    const [resetReasonName, setResetReasonName] = useState([]);
    const [resetReasonNameKey, setResetReasonNameKey] = useState([]);
    const [resetReasonNameValue, setResetReasonNameValue] = useState([]);

    const [resetReason, setResetReason] = useState([]);

    useEffect(() => {
        props.defaultParam.map(function (data) {

            console.log(data)

            console.log(data.resetReason);
            setResetReason(data.resetReason);


            /*data.resetReason['hardwareResetReason'] = data.resetReason['hardwareResetReason'].map(row => row.key)
            console.log(data.resetReason);*/
            /*if(data.resetReason['hardwareResetReason'] != ''){
                data.resetReason['hardwareResetReason'] = data.resetReason['hardwareResetReason'].reduce(
                    (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
            }
            else return null;*/


            /*data.resetReason['hardwareResetReason'].map(function(hardwareObj){
                console.log(hardwareObj);
                hardwareObj["hardwareResetReason"] = data.resetReason['hardwareResetReason']
            })
            console.log(data.resetReason);*/


            /* ---------- */
            // hardwareResetReason
            /*const hardwareObj = data.resetReason['hardwareResetReason'].reduce(
                (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
            console.log(hardwareObj)

            /!*data.resetReason['hardwareResetReason'] = data.resetReason['hardwareResetReason'].reduce(
                (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});*!/
            // softwareResetReason
            const softwareObj = data.resetReason['softwareResetReason'].reduce(
                (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
            console.log(softwareObj)
            /!*data.resetReason['softwareResetReason'] = data.resetReason['softwareResetReason'].reduce(
                (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});*!/
            // lastResetReason
            const lastObj = data.resetReason['lastResetReason'].reduce(
                (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
            console.log(lastObj)
            /!*data.resetReason['lastResetReason'] = data.resetReason['lastResetReason'].reduce(
                (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});*!/

            console.log(data.resetReason);

            let resetArrays = [];

            resetArrays.push(hardwareObj, softwareObj, lastObj);
            console.log(resetArrays)*/







            console.log(Object.keys(data.resetReason)) // ['hardwareResetReason', 'softwareResetReason', 'lastResetReason']
            setResetReasonName(Object.keys(data.resetReason));

            let resetReasonArray = [];

            console.log(data.resetReason['hardwareResetReason']);
            resetReasonArray.push(data.resetReason.hardwareResetReason, data.resetReason.softwareResetReason, data.resetReason.lastResetReason);
            console.log(resetReasonArray);

            let kata =[];
            /*data.resetReason['hardwareResetReason'].map(function(errorArray){
                console.log(errorArray);
                let a = {key: 'soft', value: 4}
                kata.push(errorArray, a);
                console.log(kata)
            })*/






            /*for(let key in data.resetReason){
                let messageName = data.resetReason[key][0];
                let nameArray = [];
                let keyArray = [];
                let valueArray = [];

                nameArray.push(key);
                keyArray.push(messageName.key);
                valueArray.push(messageName.value);


                console.log(key + ", " + messageName.key + ", " + messageName.value);

                setResetReasonName(nameArray);
                setResetReasonNameKey(keyArray);
                setResetReasonNameValue(valueArray);
            }*/


            /*console.log(resetReasonName)
            console.log(resetReasonNameKey)
            console.log(resetReasonNameValue)*/

            /*data.resetReason['messageArray'] = [data.resetReason.hardwareResetReason, data.resetReason.softwareResetReason, data.resetReason.lastResetReason];
            console.log(data.resetReason);*/


            /*data.resetReason['hardwareResetReason'].map(function(messageArray){
                data.resetReason['messageArray'] = data.resetReason.hardwareResetReason;
                console.log(data.resetReason);
            })
            data.resetReason['softwareResetReason'].map(function(messageArray){
                data.resetReason['messageArray'] = data.resetReason.hardwareResetReason;
                console.log(data.resetReason);
            })*/



            /*if(data.resetReason != ''){
                if(data.resetReason['hardwareResetReason'].map(function(messageArray){

                }))
            }*/



            let keyList = [];

            console.log(Object.values(data))

            /* Key Count (Int)*/
            console.log(data.keyCount)
            setKeyCount(data.keyCount);



            console.log(data.dailyData)
            console.log(data.sat)
            console.log(data.sat.satCount)
            console.log(data.sat.satTime)


            data['keyCount'].map(function(keyArray) {
                console.log(keyArray)
                keyList.push(keyArray);
            })

            console.log(keyList);
            /*data.map(function(satObj) {
                console.log(satObj)
            })*/

            // defaultParam _ dailyData(Count)
            setDailyData(data.dailyData);



            // defaultParam _ satCount
            setSatCount(data.sat.satCount);
            setSatTime(data.sat.satTime);
        })
    }, [props.defaultParam])

    console.log(satCount);
    console.log(satTime);
    console.log(dailyData);

    console.log(resetReason);
    console.log(resetReason.hardwareResetReason);

    /*console.log(resetReason.hardwareResetReason.map(row=>row.key))*/





    /* -------------- DefaultParam_keyCount Array -- */
    function KeyCount({keyCountList}) {
        return (
            <div className="keyCount">
                <div className="keyCount_Key">
                    {keyCountList.key}
                </div>
                <hr/>
                <span className="keyCount_Value">
                    {keyCountList.value}
                </span>
            </div>
        )
    }

    /* -------------- DefaultParam_satTime Array -- */
    /*function TimeLineList({TimeLineList}) {
        return(
            <Timeline>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{TimeLineList.key}</TimelineContent>
                    <TimelineContent>{TimelineList.value}</TimelineContent>
                </TimelineItem>

            </Timeline>
        )
    }*/

    /* -------------- DefaultParam_satTime PieChart Option -- */
    const pieOptions = {
        responsive: true,
        plugin: {
            legend: {
                display: true,
                position: "right",
            },
            title: {
                display: true,
                test: 'Satellite type according to time'
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            }
        }
    };
    const label = satCount.map(row=>row.key);
    const dataCount = satCount.map(counting=>counting.value);

    const data = {
        maintainAspectRatio: false,
        responsive: false,
        labels: label,
        datasets: [
            {
                data: dataCount,
                backgroundColor: ['#ad302c', '#F2E8C6', '#E25E3E', '#7A9D54', '#4F709C'],//라벨별 컬러설
                hoverBackgroundColor: ['#77211e', '#DAD4B5', '#C63D2F', '#557A46', '#2B2A4C'],
            }
        ]
    };

    /* -------------- DefaultParam _ Return -- */
    return(
        <>
            <div className="defaultParam">
                <div className="dailyData">
                    <span className="arrayTitle">Daily Data</span>
                    <span className="dailyDataCount">{dailyData}</span>
                </div>
                <hr />
                <div className="keyCountArray">
                    {keyCount.map((keyCountList) => (
                        <KeyCount keyCountList={keyCountList} key={keyCountList.key} sx={{display: 'flex', borderStyleBorder: 'solid', borderWidth: '3px', borderColor: 'black'}}/>
                    ))}
                </div>
            </div><br/>


            <div className="defaultParam">
                <div className="resetReason">
                    <span className="arrayTitle">Reset Reason</span>
                    <hr />

                    <div className="resetReasonArray">

                        <div className="resetReasonList">
                            <div className="resetReasonName">
                                {/*{resetReasonName}*/}
                                hardwareResetReason
                            </div>
                            <div className="resetReasonName_List">
                                <div className="resetReasonList_Key">
                                    {/*{resetReasonNameKey}*/}
                                    LowPower
                                </div>
                                <div className="resetReasonList_Value">
                                    {/*{resetReasonNameValue}*/}
                                    3
                                </div>
                            </div>
                        </div>
                        <div className="resetReasonList">
                            <div className="resetReasonName">
                                {/*{resetReasonName}*/}
                                softwareResetReason
                            </div>
                            <div className="resetReasonName_List">
                                <div className="resetReasonList_Key">
                                    {/*{resetReasonNameKey}*/}
                                    None
                                </div>
                                <div className="resetReasonList_Value">
                                    {/*{resetReasonNameValue}*/}
                                    3
                                </div>
                            </div>
                        </div>
                        <div className="resetReasonList">
                            <div className="resetReasonName">
                                {/*{resetReasonName}*/}
                                lastResetReason
                            </div>
                            <div className="resetReasonName_List">
                                <div className="resetReasonList_Key">
                                    {/*{resetReasonNameKey}*/}
                                    LowVoltage
                                </div>
                                <div className="resetReasonList_Value">
                                    {/*{resetReasonNameValue}*/}
                                    4
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><br/>


            <div className="defaultParam">
                <span className="arrayTitle">Satellite</span>
                <hr/>
                <div className="pieChart-container" style={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                }}>
                    <Pie
                        data={data}
                        options={pieOptions}
                    />

                    <Box sx={{ width: '100%', p: 3, border: '1px dashed grey'}} >
                        <Timeline>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Eat</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Code</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />
                                </TimelineSeparator>
                                <TimelineContent>Sleep</TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </Box>
                </div>
            </div><br/>
        </>
    )
}

export default DefaultParam;