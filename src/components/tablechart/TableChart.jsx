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
                text: 'Chart.js Line Chart - Multi Axis',
            },
            tooltip: {
                enable: true,
                mode: 'index',
                intersect: false,
                usePointStyle: true,
            },
        },
        scales: {
            y:{
                type: 'linear',
                display: true,
                position: 'right',
            },
            y1: {
                type: 'linear',
                display: true,
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
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
                    fill: false
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
                fill: false,
                yAxisID: 'y',
                pointStyle: 'circle',
                pointRadius: 5,
            },
            {
                label: 'Sub Key',
                data: nmsCurrent.map(x => x.subKey),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: false,
                yAxisID: 'y1',
                pointStyle: 'triangle',
                pointRadius: 5,
            },
            {
                label: 'Battery Status',
                data: nmsCurrent.map(x => x.batteryStatus),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: false,
            },
            {
                label: 'SOS',
                data: nmsCurrent.map(x => x.sos),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
            {
                label: 'SatInView',
                data: nmsCurrent.map(x => x.satInView),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Power Voltage',
                data: nmsCurrent.map(x => x.powerVoltage),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: false,
            },
            {
                label: 'Sat Cnr',
                data: nmsCurrent.map(x => x.satCnr),
                borderColor: 'rgba(0, 0, 0, 1)',
                backgroundColor: 'rgba(120, 120, 120, 1)',
                /*pointBorderColor: 'aqua',*/
                fill: false,
                pointStyle: 'star',
                pointRadius: 5,
            },
        ]
    }



    //mainKeysubKeybatteryStatussossatInViewpowerVoltagesatCnr


    return(
        <Container id="chartJSContainer" maxWidth="xl" >
            <Line options={options} data={data} />;
        </Container>
    )
}

export default TableChart;