import "./tablechart.scss"
import React, { useEffect, useState } from 'react';


//import {AreaChart, Area, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import faker from 'faker';

import Container from '@mui/material/Container';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TableChart = ({nmsCurrent}) => {

    useEffect(() => {
    }, [nmsCurrent]);
    console.log(nmsCurrent); // [{}. {}, {}, ...]


    //console.log(nmsCurrent);

    /*const [nmsCurrent, setNmsCurrent] = useState({
        labels: nmsCurrent.map((data) => data.)
    })*/

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
                text: 'Line Chart based on History Data',
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
            /*y1: {
                type: 'linear',
                display: false,
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },*/
        },
    };
    /*options: {
        animation: false,
            legend: {
            display: true,
                position: "top"
        },
        elements: {
            point: {
                pointStyle: 'circle',
                    radius: 0
            },
            line: {
                tension: 0,
                    filler: false
            }
        },
        plugins: {
            tooltip: {
                mode: 'index',
                    intersect: false
            }
        },
        scales: {
            yAxes: [
                {
                    gridLines :{display:false},
                    id: 'left-y-axis',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        fontColor: linecolors[0],
                        callback: function(value, index, ticks) {
                            return new Intl.NumberFormat('de-DE').format(value);
                        }
                    }
                },
                {
                    gridLines :{zeroLineColor:gridcolor,color:gridcolor,lineWidth:1},
                    id: 'right-y-axis',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        fontColor:linecolors[2],
                        callback: function(value, index, ticks) {
                            return new Intl.NumberFormat('de-DE').format(value);
                        }
                    }
                }
            ],
                xAxes: [
                {
                    ticks: {
                        autoSkip: true,
                        autoSkipPadding: 10,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            ]
        }
    }*/

    const labels = nmsCurrent.map(x => x.messageDate);

    const data = {
        labels,
        datasets: [
            {
                label: 'Main Key',
                data: nmsCurrent.map(x => x.mainKey),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                filler: true,
                yAxisID: 'y',
                pointStyle: 'circle',
                pointRadius: 1, // 기본 Point 반지름
                pointHoverRadius: 10, // Point 선택 시 반지금
                borderWidth: 1, // 기본 선 두께
            },
            {
                label: 'Sub Key',
                data: nmsCurrent.map(x => x.subKey),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                filler: true,
                yAxisID: 'y',
                pointStyle: 'triangle',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
            {
                label: 'Battery Status',
                data: nmsCurrent.map(x => x.batteryStatus),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                filler: false,
                pointStyle: 'rectRounded',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
            {
                label: 'SOS',
                data: nmsCurrent.map(x => x.sos),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                filler: false,
                pointStyle: 'rectRot',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
            {
                label: 'SatInView',
                data: nmsCurrent.map(x => x.satInView),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                filler: false,
                pointStyle: 'rectRot',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
            {
                label: 'Power Voltage',
                data: nmsCurrent.map(x => x.powerVoltage),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                filler: false,
                pointStyle: 'rectRounded',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
            {
                label: 'Sat Cnr',
                data: nmsCurrent.map(x => x.satCnr),
                borderColor: 'rgba(0, 0, 0, 1)',
                backgroundColor: 'rgba(120, 120, 120, 1)',
                /*pointBorderColor: 'aqua',*/
                filler: false,
                pointStyle: 'star',
                pointRadius: 1,
                pointHoverRadius: 10,
                borderWidth: 1,
            },
        ]
    }



    //mainKeysubKeybatteryStatussossatInViewpowerVoltagesatCnr


    return(
        <div className="chart-container" style={{ textAlign:'center', alignItems:'center', position: 'relative', height: '80vh', width: '90vw'}}>
            <Line options={options} data={data} />
        </div>
        //<Line sx={{width: '1000px', height:'500px'}} options={options} data={data} />
        /*<div className="chart-wrap">
    <Line options={options} data={data} />
</div>*/
        /*<Container id="chartJSContainer" maxWidth="xl" >
        </Container>*/
    )
}

export default TableChart;
