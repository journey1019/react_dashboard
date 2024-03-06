/* React */
import React, { useState, useEffect } from 'react';

/* MUI */
import { Button, Box } from "@mui/material";

/* Chart */
import ApexCharts from 'react-apexcharts';

/* Icon */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // 확장
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // 축소

const SatCnrTimeStandard = (props) => {
    const { againCollectedTimeData, ...otherProps } = props;

    // Toggle Function
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    // Line Chart Options
    const [chartData, setChartData] = useState({
        series: [
            {
                name: '위성신호레벨/잡음비',
                type: 'line',
                data: againCollectedTimeData.map(sat=>sat.satCnr),
            },
        ],
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        title: {
            text: 'Stock Price Movement',
            align: 'left'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0);
                },
            },
            title: {
                text: 'Price'
            },
        },
        xaxis: {
            type: 'datetime',
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0)
                }
            }
        }
    })

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
                    <Box sx={{w: 1}} >
                        {/* 여기에 확장되었을 때 나타날 컨텐츠를 추가하세요 */}
                        <p>SatCnr</p>
                    </Box>
                )}
            </Box>
        </>
    );
}

export default SatCnrTimeStandard;