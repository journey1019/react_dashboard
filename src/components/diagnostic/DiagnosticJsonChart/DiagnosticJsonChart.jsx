import {Line} from "react-chartjs-2";
import React, {useState, useEffect} from "react";
import { Box } from '@mui/material';
import diagnosticJson from "../config/diagnostic.json";


const DiagnosticJsonChart = () => {
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
                text: 'Power On Average',
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
                label: '01680675SKY33EC',
                data: [60, 50, 60, 60, 60, 50, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 59, 60, 60, 60, 60, 60, 60, 60],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
            {
                label: '01680675SKY33ED',
                data: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 59, 60, 60, 60, 60, 60, 60, 60],
                borderColor: 'rgba(0, 0, 0, 1)',
                backgroundColor: 'rgba(120, 120, 120, 1)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
            {
                label: '01680675SKY33EE',
                data: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 59, 60, 60, 60, 60, 60, 60, 60],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
            {
                label: '01680675SKY33EF',
                data: [60, 60, 60, 0, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 59, 60, 60, 60, 60, 60, 0, 60],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
            {
                label: '01680675SKY33EG',
                data: [60, 60, 60, 60, 60, 60, 59, 60, 60, 60, 60, 60, 58, 60, 60, 60, 59, 60, 60, 60, 60, 60, 60, 60],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
            {
                label: '01680675SKY33EH',
                data: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
            {
                label: '01680675SKY33EI',
                data: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                pointStyle: 'circle',
                pointRadius: 3,
                pointHoverRadius: 10,
                borderWidth: 1,
                filer: true,
                hidden: false
            },
        ]
    };




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

export default DiagnosticJsonChart;