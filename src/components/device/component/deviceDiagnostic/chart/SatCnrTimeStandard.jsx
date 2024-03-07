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

const SatCnrTimeStandard = (props) => {
    //const { completeForCnrMapData, ...otherProps } = props;
    const { cnrMapSatCnr, cnrMapEventDate, ...otherProps } = props;

    // Toggle Function
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };


    const [chartData, setChartData] = useState({
        series: [
            {
                name: '위성신호레벨/잡음비',
                data: cnrMapSatCnr,
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
                categories: cnrMapEventDate,
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
        },
    });

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