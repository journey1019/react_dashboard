import React, { useEffect, useState, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import {Grid, Box} from "@mui/material";
import OneDeviceMonthData from "./missingLineData.json";

import UseDidMountEffect from "../../../modules/UseDidMountEffect";

const DeviceMissingLine = () => {
    const chartRef = useRef(null);

    console.log(OneDeviceMonthData);

    const [receivedDateList, setReceivedDateList] = useState([]);

    /*useEffect(() => {
        OneDeviceMonthData.map(function(date){
            console.log(date.receivedDate);

            setReceivedDateList(date.receivedDate);
        })
        console.log(receivedDateList)

    }, [OneDeviceMonthData])*/



    const chartData = {
        series: OneDeviceMonthData,
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false,
                },
                animations: {
                    enabled: false,
                },
            },
            stroke: {
                width: [5, 5, 4],
                curve: 'straight',
            },
            labels: ['2023-12-01', '2023-12-02', '2023-12-02', '2023-12-03', '2023-12-04', '2023-12-05', '2023-12-06', '2023-12-07', '2023-12-08', '2023-12-09', '2023-12-10', '2023-12-11', '2023-12-12', '2023-12-13', '2023-12-14', '2023-12-15'],
            title: {
                text: 'Missing data (null values)',
            },
            xaxis: {},
        },
    };

    UseDidMountEffect(() => {
        if (chartRef.current) {
            // Update chart data
            chartRef.current.updateOptions(chartData.options);
            chartRef.current.updateSeries(chartData.series);
        } else {
            // Initialize chart
            chartRef.current = new ApexCharts(document.getElementById('chart-container'), chartData);
            chartRef.current.render();
        }

        return () => {
            // Cleanup
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [chartData]);


    return (
        <div>
            <Grid className="input" container spacing={0} >

                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        <div id="chart-container">

                        </div>
                    </div>
                    <hr/>
                </Box>
            </Grid>
        </div>
    );
};

export default DeviceMissingLine;