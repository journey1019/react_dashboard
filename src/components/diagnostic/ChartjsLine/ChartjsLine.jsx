import {Line} from "react-chartjs-2";
import React from "react";


const ChartjsLine = () => {

    /* Line Chart */
    const dataLine = {
        labels: ['item1', 'item1', 'item1' , 'item1' ,'item1', 'item1' ,'item1', 'item1'],
        datasets: [
            {
                label: 'D0',
                data: [45.09, 72.44, 49.36, 76.39, 32.09, 64.75, 76.39, 32.09],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                hidden: true
            },
            {
                label: 'D1',
                data: [72.44, 45.09, 49.36, 72.44, 86.39, 32.09, 72.44, 45.09],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: '-1'
            },
            {
                label: 'D2',
                data: [86.39, 45.09, 49.36, 72.44, 32.09, 64.75, 62.12, 61.64],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                hidden: true,
                fill: 1
            },
            {
                label: 'D3',
                data: [64.75, 86.39, 45.09, 49.36, 32.09, 72.44, 64.32, 52.43],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: '-1'
            },
            {
                label: 'D4',
                data: [83.09, 39.44, 74.36, 72.39, 43.09, 46.75, 43.12, 45.74],
                borderColor: 'rgba(167,167,167,1)',
                backgroundColor: 'rgba(167,167,167,0.2)',
                fill: '-1'
            },
            {
                label: 'D5',
                data: [70.09, 55.44, 61.36, 47.39, 83.09, 75.75, 31.65, 56.21],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: '+2',
            },
            {
                label: 'D6',
                data: [74.36, 83.09, 43.09, 39.44, 46.75, 72.39, 72.23, 51.12],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: false
            },
            {
                label: 'D7',
                data: [47.36, 43.09, 83.09, 39.44, 72.39, 46.75, 73.12, 54.32],
                borderColor: 'rgb(105,255,64,1)',
                backgroundColor: 'rgb(105,255,64, 0.2)',
                fill: 8
            },
        ]
    };

    const optionsLine = {
        scales: {
            y: {
                stacked: true
            }
        },
        plugins: {
            filler: {
                propagate: false
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
            <Line data={dataLine} options={optionsLine} style={{width: '1000px', height: '800px'}}/>
        </>
    )
}

export default ChartjsLine;