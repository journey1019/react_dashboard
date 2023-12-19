import {Line} from "react-chartjs-2";
import React, {useState, useEffect} from "react";
import { Box } from '@mui/material';
import diagnosticJson from "../config/diagnostic.json";

const ChartjsLine = (props) => {
    console.log(props)
    console.log(props.diagnostic)
    console.log(props.diagnostic['satCnrAvr'])
    console.log(props.satCnr)

    /*useEffect(() => {
        props.diagnostic.map(function(diag) {
            console.log(diag)
        })
    }, [props.diagnostic])*/


    /*if(Object.keys(timeline.cnrMap).length == 4) {
                console.log('hello 난 4개')
            }
            else if(Object.keys(timeline.cnrMap).length >= 4) {
                console.log('나는 4개 이상~')
            }*/


    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [names, setNames] = useState([]);

    const [satAve, setSatAve] = useState([]);

    console.log(diagnosticJson);
    useEffect(() => {
        diagnosticJson.map(function(result){
            console.log(result);

            if(result.cnrMap != null) {
                for(let key of Object.keys(result.cnrMap)) {
                    const value = result.cnrMap[key];
                    result[key] = value || '';
                }
            }
            else{
            }
            console.log(result)
        })
    }, [diagnosticJson])

    useEffect(() => {
        props.diagnostic.map(function (timeline) {
            console.log(timeline)
            console.log(timeline.cnrMap)

            // cnrMap Object 순회
            if(timeline.cnrMap != null) {
                for(let key of Object.keys(timeline.cnrMap)) {
                    const value = timeline.cnrMap[key];
                    timeline[key] = value || '';
                }
            }else{
            }

            /*timeline.cnrMap.map(function(satCnr){
                setLabels(Object.keys(satCnr))
            })*/


            /*timeline['cnrMap'].map(function(satCnr) {
                console.log(satCnr);
            })*/
            console.log(timeline)
            /*setSatAve(timeline.cnrMap)*/
        })

        /*let newCnrMap = [];
            if(Object.keys(timeline.cnrMap).length == 4) {
                console.log('hello 나는 4개')
                timeline.cnrMap.map((x) => {
                    let y = {};
                    y['15분'] = x['0'];
                    y['30분'] = x['1'];
                    y['45분'] = x['2'];
                    y['00분'] = x['3'];
                    newCnrMap.push(y);
                });
                console.log(timeline)
            }
            else if(Object.keys(timeline.cnrMap).length > 4) {
                console.log('나는 4개 이상~')
            }*/

    }, [props.diagnostic])

    console.log(satAve)

    useEffect(() => {
        console.log(props.satCnr)

        props.satCnr.map(function(timeline){

            console.log(timeline);
            // values -> Naming Change


            console.log(timeline.satCnrAvr);

            setLabels(Object.keys(timeline))
            setValues(Object.values(timeline))
        })
    }, [props.satCnr])



    /*useEffect(() => {
        diagnosticJson.map(function(timeline) {
            console.log(timeline)

            console.log(timeline.cnrMap)
            console.log(timeline.deviceId)
            setNames(timeline.deviceId)
            setLabels(Object.keys(timeline.cnrMap))
            setValues(Object.values(timeline.cnrMap))
        })
    }, [diagnosticJson])*/

    console.log(labels);
    console.log(names);
    console.log(values);

    //const labels = props.diagnostic.map(x => x.deviceId);

    // 날짜 기준이 아니라
    /* Line Chart */
    const dataLine = {
        labels,
        datasets: [
            {
                label: 'CnrMap',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: false,
            },
            /*{
                label: 'Average',
                data: props.diagnostic.map(item => item.satCnrAvr),
                borderColor: 'rgb(255,0,0)',
                backgroundColor: 'rgba(132,0,0,0.2)',
                borderDash: [6, 6],
                borderDashOffset: 0,
                borderWidth: 3,
                hidden: false,
            },*/
            /*{
                label: 'Average',
                data: [43.6],
                borderColor: 'rgb(255,11,50)',
                backgroundColor: 'rgba(197,0,0,0.2)',
            }*/
        ]
    }

    function average(ctx) {
        const values = ctx.chart.data.datasets[0].data;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
    const annotation = {
        type: 'line',
        borderColor: 'black',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            enabled: true,
            content: (ctx) => 'Average: ' + average(ctx).toFixed(2),
            position: 'end'
        },
        scaleID: 'y',
        value: satAve
    };
    /*const annotation = {
        type: 'line',
        borderColor: 'black',
        borderWidth: 3,
        scaleID: 'y',
        value: 50
    };*/
    /*const dataLine = {
        labels,
        datasets: [
            {
                label: names,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgb(105,255,64,1)',
                backgroundColor: 'rgb(105,255,64, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(167,167,167,1)',
                backgroundColor: 'rgba(167,167,167,0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                hidden: false,
            },
            {
                label: names,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: false,
            },
        ]
    };*/

    const optionsLine = {
        responsive: false,
        scales: {
            y: {
                stacked: true,
            }
        },
        plugins: {
            filler: {
                propagate: false
            },
            annotation: {
                annotations: {
                    annotation
                }
            },
            'samples-filler-analyser': {
                target: 'chart-analyser'
            }
        },
        interaction: {
            intersect: false,
        },
    }

    return(
        <>
            {/* 임시 사이즈 지정해놓음 (반응형 추후) */}
            <Line data={dataLine} options={optionsLine} width="500"/>
        </>
    )
}

export default ChartjsLine;