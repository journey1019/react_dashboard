/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import axios from "axios";

/* ApexChart _ Line Chart */
import ReactApexChart from 'react-apexcharts';

/***
 * @Author : jhlee
 * @date : 2024-02-13
 * @Desc : {
 *  Main 화면에서 볼 수 있는 위성신호레벨 그래프
 *  DiagnosticGraph 에서 가져온 startDate-endDate 범위의 모든 날짜 배열을 활용한
 *  모든 단말기의 일자별 평균 위성신호레벨
 * }
 */

// 모든 단말기의 평균 일테니, 두 개의 그래프가 아닌, 하나의 그래프로 평균 표현될거임
    // 각 단말기 정보를 가져와서, 날짜별 데이터가 있는 단말기만 합쳐, 평균구함
    // 각 날짜 value 가 있는지 체크하고, 해당 데이터를 더해서 평균내서 새로운 배열로
const SatSignalLevel = (props) => {
    console.log(props);

    if(props.dateArray.length > 0){
        const chartData = {
            series: [
                {
                    name: 'device1',
                    data: [31, 40, 28, 51, 42, 109, 100],
                },
                {
                    name: 'device2',
                    data: [11, 32, 45, 32, 34, 52, 41],
                },
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'area',
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                },
                xaxis: {
                    type: 'datetime',
                    categories: props.dateArray,
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm',
                    },
                },
            },
        };

        return (
            <div>
                <div id="chart">
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="area"
                        height={350}
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
    else{
        console.log('DiagnosticGraph 로 받아온 데이터가 없습니다.')
    }

    /*const seriesData = props.satCnrObjects.map(deviceData => ({
        name: deviceData.deviceName,
        data: deviceData.satCnrs,
    }))

    const xaxisCategories = props.satCnrObjects[0]?.eventDates || [];

    const chartData = {
        series: seriesData,
        options: {
            chart: {
                height: 350,
                type: 'area',
            },
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                type: 'datetime',
                categories: xaxisCategories,
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm',
                },
            },
        },
    };*/

    /*const chartData = {
        series: [
            {
                name: 'series1',
                data: [31, 40, 28, 51, 42, 109, 100],
            },
            {
                name: 'series2',
                data: [11, 32, 45, 32, 34, 52, 41],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
            },
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                type: 'datetime',
                categories: [
                    '2018-09-19T00:00:00.000Z',
                    '2018-09-19T01:30:00.000Z',
                    '2018-09-19T02:30:00.000Z',
                    '2018-09-19T03:30:00.000Z',
                    '2018-09-19T04:30:00.000Z',
                    '2018-09-19T05:30:00.000Z',
                    '2018-09-19T06:30:00.000Z',
                ],
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm',
                },
            },
        },
    };*/

    /*return (
        <>
        </>
        /!*<div>
            <div id="chart">
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="area"
                    height={350}
                />
            </div>
            <div id="html-dist"></div>
        </div>*!/
        /!*<div>
            <div id="chart">
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="area"
                    height={350}
                />
            </div>
            <div id="html-dist"></div>
        </div>*!/
    );*/
}

export default SatSignalLevel;