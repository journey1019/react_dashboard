/* React */
import React, { useState, useEffect } from 'react';

/* MUI */
import { Button, Box } from "@mui/material";

/* Chart */
import ApexCharts from 'react-apexcharts';

/* Icon */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // 확장
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // 축소
import ReactApexChart from "react-apexcharts";
import Chart from 'react-apexcharts';

/**
 * @date: 2024-03-07
 * @file: 위성신호레벨/잡음비 시간별 Line Chart
 * @todo: {
 *     1. 평균값 적용 안됨
 * }
 * */
const SatCnrTimeStandard = (props) => {
    //const { completeForCnrMapData, ...otherProps } = props;
    const { cnrMapSatCnr, cnrMapEventDate, completeForCnrMapData, ...otherProps } = props;

    // Toggle Function
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    // 위성신호 평균 구하기
    const averageSatCnr = (completeForCnrMapData.reduce((sum, item)=> {
        const value = item.satCnr == null ? 0 : item.satCnr;
        return sum + value;
    }, 0) / completeForCnrMapData.length).toFixed(2);
    console.log(averageSatCnr)



    // 처음 렌더링 될때 값이 안들어옴. props 가 바뀔 때마다 적용
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        setChartData({
            series: [
                {
                    name: '위성신호레벨/잡음비',
                    data: completeForCnrMapData.map(cnr => cnr.satCnr),
                    color: '#DC143C',
                },
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    toolbar: {
                        show: true,
                        offsetY: -10,
                        offsetX: -5,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                colors: ['#DC143C'],
                stroke: {
                    width: 2,
                    curve: 'straight',
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
                    categories: completeForCnrMapData.map(date => date.eventDate),
                    title: {
                        text: 'Time(시간)',
                    },
                    stepSize: 1,
                    //tickPlacement: 'between', // 적용안됨
                },
                yaxis:{
                    title: {
                        text: '신호레벨/잡음비(dB)',
                    },
                    //min: 0,   // 범위
                    //max: 100,
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
                        format: 'yyyy/MM/dd HH시',
                    },
                    y:
                        [
                            {
                                title: {
                                    formatter: function (val) {
                                        return val + "(dB)"
                                    }
                                }
                            },
                        ]
                },
                /*annotations: {
                    yaxis: [
                        {
                            y: averageSatCnr,
                            borderColor: '#000000',
                            label: {
                                borderColor: '#000000',
                                style: {
                                    color: '#fff',
                                    background: '#000000',
                                },
                                text: 'SNR Average :'+ averageSatCnr.toString(), // 평균값 주석에 표시될 텍스트
                            },
                            borderWidth: 2,
                        }
                    ],
                }*/
            },
        })
    }, [completeForCnrMapData])


    return (
        <>
            <Box>
                <Button variant="outlined" onClick={toggleExpansion}
                        sx={{
                            m : 1,
                            color: "gray",
                            borderColor: "gray",
                            ":hover": { borderColor: "gray" },
                            display: "flex",
                            justifyContent: "flex-start",
                            width: "100%",
                        }}
                >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </Button>

                {expanded && (
                    <Box sx={{w: 1, pt: 2}} >
                        <ReactApexChart options={chartData.options} series={chartData.series} height={350} />
                    </Box>
                )}
            </Box>
        </>
    );
}

export default SatCnrTimeStandard;