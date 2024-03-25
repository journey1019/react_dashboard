import React, {useState} from "react";
import ReactApexChart from "react-apexcharts";


/**
 * @date: 2024-03-05
 * @param data1: 위성신호레벨/잡음비
 * @param data2: 위성끊김횟수
 * @param data3: 전원Reset횟수
 * @param data4: 단말개수
 * @param xaxis: 날짜
 * @returns {JSX.Element}
 * @constructor
 * @file: Main 과 Device 의 Diagnostic Line Chart 생성 컴포넌트 - SatCnr & SatCutOffCount & PowerOnCount
 */

const SignLevelSatCutResetChart = ({data1, data2, data3, data4, xaxis}) => {

    const [chartData, setChartData] = useState({
        series: [
            {
                name: '위성신호레벨/잡음비',
                type: 'line',
                data: data1,
                color: '#DC143C',
            },
            {
                name: '위성끊김횟수',
                type: 'column',
                data: data2,
                color: '#E89EFB',
            },
            {
                name: '전원 Reset 횟수',
                type: 'column',
                data: data3,
                color: '#AEA9FF',
            },
            ...(data4 ? [
                {
                    name: '단말 개수',
                    type: 'line',
                    data: data4,
                    yAxis: 2,
                    color: '#ffe4bc',
                }
            ] : []),
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: true,
                    offsetY: -25,
                    offsetX: -5,
                },
            },
            plotOptions: {
                bar: {
                    //horizontal: false,
                    //columnWidth: '90%',
                    //endingShape: 'rounded'
                }
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
            },
            markers: {
                size: 1
            },
            title: {
                text: '',
                align: 'left'
            },
            yaxis: [
                {
                    title: {
                        text: 'cnr(dB)',
                    },
                },
                {
                    show: false,
                    title: {
                        text: 'Cnr(dB)',
                    },
                },
                {
                    show: false,
                    title: {
                        text: 'Cnr(dB)',
                    },
                },
                ...(data4 ? [
                    {
                        opposite: true,
                        title: {
                            text: '단말 개수',
                        },
                        labels: {
                            formatter: function (value) {
                                return value.toFixed(0); // 소수점 이하 자리 없이 정수로 표시
                            },
                        },
                        max: Math.max(...data4) * 2
                    }
                ] : []),
            ],
            xaxis: {
                type: 'datetime',
                categories: xaxis,
                title: {
                    text: 'Daily(일)',
                },
                //tickPlacement: 'on'
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: 0,
                offsetX: 0,
            },
            tooltip: {
                x: {
                    //format: 'dd/MM/yyyy HH:mm',
                    format: 'yyyy/MM/dd HH:mm',
                },
                y:
                    [
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (dB)"
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (번)"
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (번)"
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (개)"
                                }
                            }
                        },
                    ]
            },
        },
    });

    return (
        <>
            <ReactApexChart options={chartData.options} series={chartData.series} height={350} />
        </>
    );
}


export default SignLevelSatCutResetChart;