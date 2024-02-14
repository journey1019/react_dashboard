/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import axios from "axios";

/* MUI */
import { Grid } from "@mui/material"

/* ApexChart _ Radial */
import ReactApexChart from 'react-apexcharts';

const OperationRatio = (props) => {
    // 위성 접속률 Chart 상태
    const [satOnPercentChartState, setSatOnPercentChartState] = useState({
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '24px',
                    },
                    value: {
                        fontSize: '20px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return 1;
                        },
                    },
                },
            },
        },
        legend: {
            show: true,
            position: 'top',
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            }
        },
        labels: ['위성 접속률'],
    });

    if(Object.entries(props.resultObject).length > 0) {
        console.log(props.resultObject);




        return(
            <>
                {/*<Grid container spacing={0} sx={{display: 'flex'}}>
                    <Grid item xs={6}>
                        <ReactApexChart
                            options={satOnPercentChartState}
                            series={[100]}
                            type="radialBar"
                            width={'100%'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReactApexChart
                            options={satOnPercentChartState}
                            series={[100]}
                            type="radialBar"
                            width={'100%'}
                        />
                    </Grid>
                </Grid>*/}
            </>
        )
    }
    else {
        console.log('DiagnosticGraph 에서 받아오는 resultObject 가 비었습니다.')
    }
}

export default OperationRatio;