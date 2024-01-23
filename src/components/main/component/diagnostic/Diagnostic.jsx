/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import DiagnosticPeriod2 from "../api/DiagnosticPeriod2.json";

/* Chart */
import Chart from 'react-apexcharts';


const Diagnostic = () => {
    console.log(DiagnosticPeriod2)

    /*// Scatter Chart에 필요한 데이터 생성 (여기서는 더미 데이터 사용)
    const generateData = () => {
        const series = [
            { name: 'Series 1', data: [] },
        ];
        const startDate = new Date('2022-01-01T00:00:00Z').getTime();

        for (let i = 0; i < 20; i++) {
            const randomDate = new Date(startDate + Math.random() * (365 * 24 * 60 * 60 * 1000));
            series[0].data.push({
                x: randomDate,
                y: Math.floor(Math.random() * 100),
            });
        }

        return series;
    };

    // Scatter Chart의 옵션 설정
    const options = {
        chart: {
            id: 'scatter-chart',
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            min: 0,
            max: 2000,
        },
    };*/
    const options = {
        colors: ["#49C0F2", "#28C76F"],
        chart: {
            type: 'scatter',
            height: 350,
            zoom: {
                enabled: false,
                type: "xy"
            },
            toolbar: {
                show: false
            }
        },
        series: [
            { name: 'Estimate', data: [10, 15, 4, 12, 17] },
            { name: 'Actual', data: [12, 10, 12, 5, 12] }
        ],
        xaxis: {
            type: "category",
            categories: ["Q1", "Q2", "Q3", "Q4", "Q5"],
            labels: {
                formatter: function (value, timestamp, index) {
                    return ["Q1 2019", "beat 10%"];
                },
                style: {
                    fontSize: "10px"
                }
            },
            tickAmount: 5,
            tickPlacement: 'between'
        },
        yaxis: {
            tickAmount: 7
        },
        markers: {
            strokeWidth: 0,
        },
        legend: {
            height: 30,
        }
    };
    


    return(
        <>
            전체 위성 데이터 차트
            <Chart options={options} series={options.series} type="scatter" height={350} />
        </>
    )
}

export default Diagnostic;