import Chart from "react-apexcharts";
import React from "react";

const DiagnosticChartSatTime = (props) => {

    // satOnTime : 위성전원이 켜진채 작동하는 시간
    const satOnTimeOptions = {
        series: [{
            name: "위성연결 작동시간",
            data: props.satOnTimeList,
        }],
        chart: {
            height: 'auto',
            type: 'line',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: '위성연결 작동시간 (_SatOnTime)',
            align: 'left',
            style: {
                fontSize: '20px', // Set the desired font size here
            },
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: props.eventDateList,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        }
    };

    return(
        <>
            <Chart options={satOnTimeOptions} series={satOnTimeOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
        </>
    )
}

export default DiagnosticChartSatTime;