/* React */
import React from "react";

/* Chart */
import { Pie } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';


/* MUI*/
import {Grid, Box} from "@mui/material";

/**
 * @file: Network Status 가 변화한 이력에 대해서 누적 데이터를 시각화로 보여줌
 * @property: {
 *     updatedStatusHistory : Network Status 변화 이력 데이터
 *     -> statusHistory 를 가공한 새로운 statusHistory Data
 *     -> status 가 변화한 이력이 없을 수도 있기 때문에 삼항연산자로 값이 있는지 조회함
 * }
 * */
const StatusHistoryPie = (props) => {
    const { statusHistory, updatedStatusHistory, ...otherProps } = props;
    console.log(updatedStatusHistory)


    // 처음 렌더링 할때 updatedStatusHistory 가 빈 문자열([]) 또는 'null' 일 경우 고려함
    if (!updatedStatusHistory || updatedStatusHistory.length === 0) {
        return null;
    }

    let countMap = {};

    updatedStatusHistory.forEach(item => {
        const { status } = item;
        countMap[status] = (countMap[status] || 0) + 1;
    });

    const statusCounts = Object.keys(countMap).map(status => ({
        status,
        count: countMap[status],
    }));
    console.log(statusCounts)




    const chartData = {
        labels: ['Running', 'Caution', 'Warning', 'Faulty'],
        datasets: [
            {
                data: statusCounts.map(item => item.count),
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
                hoverBorderColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
    };

    const apexOptions = {
        series: statusCounts.map(item => item.count),
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Running', 'Caution', 'Warning', 'Faulty'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };

    return(
        <>
            {/*{statusCounts.length > 0 ? (
                <Pie data={chartData} options={options} />
            ) : (
                <p>{!updatedStatusHistory ? 'No data available for chart.' : 'Empty data.'}</p>
            )}*/}
            {/*{statusCounts.length > 0 ? (
                <ReactApexChart options={apexOptions} series={options.series} type="pie" height={350} />
            ) : (
                <p>{!updatedStatusHistory ? 'No data available for chart.' : 'Empty data.'}</p>
            )}*/}
            <ReactApexChart options={apexOptions} series={apexOptions.series} type="pie" height={100} />
        </>
    )
}
export default StatusHistoryPie;