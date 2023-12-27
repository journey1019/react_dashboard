import {Doughnut} from "react-chartjs-2";
import React from "react";


const ChartjsDoughnut = () => {

    /*const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Doughnut Chart'
                }
            }
        },
    };
    const DATA_COUNT = 5;
    const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

    const data = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [
            {
                label: 'Dataset 1',
                data: Utils.numbers(NUMBER_CFG),
                backgroundColor: Object.values(Utils.CHART_COLORS),
            }
        ]
    };*/

    /*const data = {
        labels: ['item1', 'item2', 'item3'],
        datasets: [
            {
                data: [
                    50
                ],
                backgroundColor: [
                    'rgba(255, 159, 64, 1)',
                ],
                label: '배터리 충전 비율 (batChargePercent)'
            },
            {
                data: percentage,
                backgroundColor: [
                    'rgba(153, 102, 255, 1)',
                ],
                label: 'Power On 비율(pwrOnPercent)'
            },
            {
                data: [
                    100
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                label: '위성 On 비율(satOnPercent)'
            }
        ]
    }
    const options = {
        responsive: true,
        legend: {
            display: false,
            /!*position: 'top',*!/
        },
        title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        tooltips: {
            callbacks: {
                label: function(item, data) {
                    console.log(data.labels, item);
                    return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
                }
            }
        }
    }*/


    /*const canvas = document.getElementById("doughnutChartCanvas2");
    const val = 60;
    const data = {
        datasets: [
            {
                data: [val, 100 - val],
                backgroundColor: ["#e15449", "#ffffff00"],
                borderWidth: 0,
                borderRadius: 30,
            },
        ],
    };
    const options = {
        cutout: '78%',
        hover: { mode: null },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
    }
    new Chart(canvas, {
        type: "doughnut",
        data,
        options,
    });
    */
    /*const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [40, 60],      // 섭취량, 총급여량 - 섭취량
                backgroundColor: [
                    '#9DCEFF',
                    '#F2F3F6'
                ],
                borderWidth: 0,
                scaleBeginAtZero: true,
            }
            ]
        },
    });*/

    const data1 = {
        labels: ['배터리 충전 비율'],
        datasets: [
            {
                data: [
                    50, 100-50
                ],
                backgroundColor: [
                    'rgb(255,191,130)',
                    'rgb(202,202,202)',
                ],
                label: '배터리 충전 비율 (batChargePercent)'
            },
        ]
    }
    const data2 = {
        labels: ['Power On 비율'],
        datasets: [
            {
                data: [
                    70, 100-70
                ],
                backgroundColor: [
                    'rgb(189,154,255)',
                    'rgb(202,202,202)',
                ],
                label: 'Power On 비율(pwrOnPercent)'
            },
        ]
    }
    const data3 = {
        labels: ['위성 On 비율'],
        datasets: [
            {
                data: [
                    100, 100-100
                ],
                backgroundColor: [
                    'rgb(115,202,255)',
                    'rgb(202,202,202)',
                ],
                label: '위성 On 비율(satOnPercent)'
            },
        ]
    }
    const options = {
        responsive: true,
        legend: {
            display: false,
            /*position: 'top',*/
        },
        title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        tooltips: {
            callbacks: {
                label: function(item, data) {
                    console.log(data.labels, item);
                    return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
                }
            }
        }
    }


    return(
        <>
            <Doughnut data={data1} options={options} style={{ width: '150px', height: '150px'}}/>
            <Doughnut data={data2} options={options} style={{ width: '150px', height: '150px'}}/>
            <Doughnut data={data3} options={options} style={{ width: '150px', height: '150px'}}/>
        </>
    )
}

export default ChartjsDoughnut;