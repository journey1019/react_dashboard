import {Line} from "react-chartjs-2";
import React, {useState, useEffect} from "react";
import { Box } from '@mui/material';
import diagnosticJson from "../config/diagnostic.json";


const MultiLine = () => {
    console.log(diagnosticJson);


    const options = {
        responsive: true,
        interactions: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Multi Line Chart',
                font: {
                    size: 15
                }
            },
            tooltip: {
                enable: true,
                mode: 'index',
                position: 'nearest',
                intersect: false,
                usePointStyle: true,
            },
            legend: {
                labels: {
                    usePointStyle : true, // Legend_PointStyle
                }
            }
        },
        scales: {
            y:{
                type: 'linear',
                display: true,
                position: 'left',
                gridLines: {
                    color: 'rgba(166, 201, 226, 1)',
                    lineWidth: 1
                },
                ticks: {
                    stepSize:5,
                }
            },
        },
    };


    const labels = diagnosticJson.map(x => x.startDay);

    const data = {
        labels,
        datasets: [
            {
                label: 'Power On Average',
                data: diagnosticJson.map(x => x.pwrOnAvr),
                borderColor: 'rgb(86,181,159)',
                backgroundColor: 'rgb(58,123,109)',
                filer: true,
                yAxisId: 'y',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
            {
                label: 'Satellite On Average',
                data: diagnosticJson.map(x => x.satOnAvr),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                filer: true,
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
        ]
    }

    // 데이터셋 추가
    /*function addDataSet() {
        const color1 = Math.floor(Math.random() * 256);
        const color2 = Math.floor(Math.random() * 256);
        const color3 = Math.floor(Math.random() * 256);

        console.log(color1 + " " + color2 + " " + color3)
        const newDataset = {
            label: 'new Dataset'+config.data.datasets.length,
            borderColor : 'rgba('+color1+', '+color2+', '+color3+', 1)',
            backgroundColor : 'rgba('+color1+', '+color2+', '+color3+', 1)',
            data: [],
            fill: false
        }
        // newDataset에 데이터 삽입
        for (let i=0; i< config.data.labels.length; i++){
            let num = Math.floor(Math.random() * 50);
            newDataset.data.push(num);
        }

        // chart에 newDataset 푸쉬
        config.data.datasets.push(newDataset);

        myChart.update();	//차트 업데이트
    }*/

    /*useEffect(() => {
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
    }, [diagnosticJson])*/



    /*const data = {
        labels: generateLabels(),
        datasets: [
            {
                label: 'D0',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red),
                hidden: true
            },
            {
                label: 'D1',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.orange,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.orange),
                fill: '-1'
            },
            {
                label: 'D2',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.yellow,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.yellow),
                hidden: true,
                fill: 1
            },
            {
                label: 'D3',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.green,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green),
                fill: '-1'
            },
            {
                label: 'D4',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue),
                fill: '-1'
            },
            {
                label: 'D5',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.grey,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.grey),
                fill: '+2'
            },
            {
                label: 'D6',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.purple,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.purple),
                fill: false
            },
            {
                label: 'D7',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red),
                fill: 8
            },
            {
                label: 'D8',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.orange,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.orange),
                fill: 'end',
                hidden: true
            },
            {
                label: 'D9',
                data: generateData(),
                borderColor: Utils.CHART_COLORS.yellow,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.yellow),
                fill: {above: 'blue', below: 'red', target: {value: 350}}
            }
        ]
    };*/




    return(
        <>
            <div className="Multi-line-chart" style={{ alignItems: 'center', position: 'relation', height: '40vh', width: '40vw'}}>
                <Line options={options} data={data} style={{width: '100%'}}/>
            </div>
            {/*<div className="chart-container" style={{ position: "relative", height: '200px', width: '60vw'}}>
                <canvas id="myChart"></canvas>
            </div>*/}
        </>
    )
}

export default MultiLine;