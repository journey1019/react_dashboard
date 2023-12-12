import "./statusPercent.scss";

import React from "react";
//import { PieChart, Pie, Tooltip } from "recharts";



import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPercent = (props) => {
    console.log(props)
    console.log(props.deviceStatus)
    const countRunning = props.deviceStatus.preRunningDv.length;
    const countCaution = props.deviceStatus.preCautionDv.length;
    const countWarning = props.deviceStatus.preWarningDv.length;
    const countFaulty = props.deviceStatus.preFaultyDv.length;

    const data = {
        labels: ['Running', 'Caution', 'Warning', 'Faulty'],
        datasets: [
            {
                label: '# of Votes',
                data: [countRunning, countCaution, countWarning, countFaulty],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(167,167,167,0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(167,167,167,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                titleFont: {
                    size: 12,
                },
                bodyFont: {
                    size: 12,
                },
                footerFont: {
                    // size: 10, // there is no footer by default
                },
                callbacks: {
                    label: (item) => {
                        console.log(item);
                        const count = item.dataset.data[item.dataIndex];
                        const label = item.label;
                        const info = ` ${label} : ${count}`;
                        return console.log(item);
                    },
                    title: () => {
                        return "title이랑 label 위치 변경!";
                    },
                },
            },
        },
    };


    /*const data = [
        { name: "Geeksforgeeks", students: 400 },
        { name: "Technical scripter", students: 700 },
        { name: "Geek-i-knack", students: 200 },
        { name: "Geek-o-mania", students: 1000 },
    ];*/

    return(
        <>
            <Doughnut data={data} options={options} />
        </>
    )
}

export default StatusPercent;