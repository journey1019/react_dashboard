/* React */
import React, {useState} from "react";

/* Apex Chart */
import ReactApexChart from "react-apexcharts";

/**
 * @date: 2024-03-05
 * @param data1 : 위성연결시간
 * @param data2 : 단말가동시간
 * @param data3 : 단말개수
 * @param xaxis : 날짜
 * @returns {JSX.Element}
 * @constructor
 * @file: Main 과 Device 의 Diagnostic Line Chart 생성 컴포넌트 - satOnTime & st6100On
 */
const OnTimeLineChart = ({data1, data2, data3,  xaxis}) => {
    /** 위성연결시간 & 단말가동시간 차트 옵션 */
    const [chartData, setChartData] = useState({
        series: [
            {
                name: '위성 연결 시간',
                data: data1,
                yAxis: 0, // '위성 연결 시간'과 같은 y축 사용
            },
            {
                name: '단말 가동 시간',
                data: data2,
                yAxis: 0, // '위성 연결 시간'과 같은 y축 사용
            },
            /*{
                name: '단말 개수',
                data: data3,
                yAxis: 1, // 새로운 y축 사용
            },*/
            ...(data3 ? [
                {
                    name: '단말 개수',
                    data: data3,
                    yAxis: 2,
                }
            ] : []),
        ],
        options: {
            chart: {
                /*events:{
                    click(event, chartContext, config) {
                        console.log(config.config.series[config.seriesIndex])
                        console.log(config.config.series[config.seriesIndex].data[config.dataPointIndex])
                    }
                },*/
                height: 350,
                type: 'line',
                toolbar: {
                    show: true,
                    offsetY: -25,
                    offsetX: -5,
                },
                //type: 'area',
                /*dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },*/
                /*zoom: {
                    enabled: false
                },*/
            },
            dataLabels: {
                enabled: false,
            },
            colors: ['#F4BE00', '#98B7D6', '#ffe4bc'],
            stroke: {
                curve: 'smooth',
                //width: [5, 7, 5], // 선 굵기
                //dashArray: [0, 8, 5], // 0: 직선 n: 실선
            },
            markers: {
                size: 1
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            title: {
                text: '',
                align: 'left'
            },
            xaxis: {
                type: 'datetime',
                categories: xaxis,
                title: {
                    text: 'Daily(일)',
                },
                stepSize: 1,
                min: xaxis[0],
                max: xaxis[30],
                /*labels: {
                    datetimeUTC: true,
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: "MM'월'",
                        day: 'dd'
                    }
                }*/
                //tickPlacement: 'between', // 적용안됨
            },
            yaxis: [
                {
                    title: {
                        text: 'Time(m)',
                    },
                },
                {
                    show: false,
                    title: {
                        text: 'Time(m)',
                    },
                },
                ...(data3 ? [
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
                        max: Math.max(...data3) * 2
                    }
                ] : []),
            ],
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: 0,
                offsetX: 0,
                // legend dynamic changing
                /*tooltipHoverFormatter: function(val, opts) {
                    return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
                }*/
            },
            tooltip: {
                x: {
                    //format: 'dd/MM/yyyy HH:mm',
                    format: 'yyyy-MM-dd',
                },
                y:
                    [
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (분)"
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (분)"
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

    return(
        <ReactApexChart options={chartData.options} series={chartData.series} height={350} />
    )
}

export default OnTimeLineChart;