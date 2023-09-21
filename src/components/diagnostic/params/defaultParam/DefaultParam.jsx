import './defaultParam.scss';
import * as React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import {useEffect, useState, useMemo} from "react";

import {Box, Stack, Button, Input} from "@mui/material";

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

                }}>
                    <Pie
                        data={data}
                        options={pieOptions}
                    />
                </div>
            </div>
        </>
    )
}

export default DefaultParam;