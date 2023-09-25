import './defaultParam.scss';
import * as React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import {useEffect, useState, useMemo} from "react";

import {Box, Stack, Button, Input} from "@mui/material";

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


    const [satCount, setSatCount] = useState([]);
    const [satTime, setSatTime] = useState([]);


    useEffect(() => {
        props.defaultParam.map(function (data) {
            console.log(data)
            //console.log(data['dailyCount'])

            let keyList = [];

            console.log(Object.values(data))

            console.log(data.dailyData)
            console.log(data.sat)
            console.log(data.sat.satCount)
            console.log(data.sat.satTime)
            /*console.log(data.sat.satTime.map(function(values){
                console.log(values)
                console.log(values.value);
            }))*/
            /*console.log(Object.values(data.sat.satTime.map(function(values){
                
            })))*/

            data['keyCount'].map(function(keyArray) {
                console.log(keyArray)
                keyList.push(keyArray);
            })

            console.log(keyList);
            /*data.map(function(satObj) {
                console.log(satObj)
            })*/
            setSatCount(data.sat.satCount);
            setSatTime(data.sat.satTime);
        })
    }, [props.defaultParam])

    console.log(props.defaultParam)
    console.log(satCount);
    console.log(satTime);

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
                backgroundColor: ['#a80b28', '#E25E3E', '#F2E8C6', '#7A9D54', '#4F709C'],//라벨별 컬러설
                hoverBackgroundColor: ['#7f2939', '#C63D2F', '#DAD4B5', '#557A46', '#2B2A4C'],
            }
        ]
    };
    /* -------------- DefaultParam _ Return -- */
    return(
        <>
            <div className="defaultParam">
                <span className="arrayTitle">Satellite</span>
                <div className="pieChart-container" style={{
                    width: '200px',
                    height: '200px',
                    display: 'flex',
                }}>
                    <Pie
                        data={data}
                        options={pieOptions}
                    />
                    <Box sx={{p: 3, border: '1px dashed grey'}} >
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
                        {/*<Timeline position="alternate">
                            <TimelineItem>
                                <TimelineOppositeContent color="text.secondary">
                                    09:30 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Eat</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineOppositeContent color="text.secondary">
                                    10:00 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Code</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineOppositeContent color="text.secondary">
                                    12:00 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Sleep</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineOppositeContent color="text.secondary">
                                    9:00 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Repeat</TimelineContent>
                            </TimelineItem>
                        </Timeline>*/}
                        {/*<Timeline position="alternate">
                            <TimelineItem>
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0' }}
                                    align="right"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    9:30 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot>
                                        <FastfoodIcon />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Eat
                                    </Typography>
                                    <Typography>Because you need strength</Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0' }}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    10:00 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot color="primary">
                                        <LaptopMacIcon />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Code
                                    </Typography>
                                    <Typography>Because it&apos;s awesome!</Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot color="primary" variant="outlined">
                                        <HotelIcon />
                                    </TimelineDot>
                                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Sleep
                                    </Typography>
                                    <Typography>Because you need rest</Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                                    <TimelineDot color="secondary">
                                        <RepeatIcon />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Repeat
                                    </Typography>
                                    <Typography>Because this is the life you love!</Typography>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>*/}
                    </Box>
                </div>
            </div>
        </>
    )
}

export default DefaultParam;