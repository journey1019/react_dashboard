/* React */
import React, { useEffect } from "react";

/* Chart */
import ApexChartPie from "../../../../modules/chart/ApexChartPie";


/* MUI*/
import {Grid, Box, LinearProgress, Stack} from "@mui/material";
import ReactApexChart from 'react-apexcharts';
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

    // 처음 렌더링 시 updatedStatusHistory 가 빈 문자열이 아닐 때
    if(updatedStatusHistory && updatedStatusHistory.length > 0) {

        // {Running: n, Caution: n, Warning: n, Faulty: n}
        let countMap = {};

        updatedStatusHistory.forEach(item => {
            const { status } = item;
            countMap[status] = (countMap[status] || 0) + 1;
        });
        console.log(countMap)

        // [{status: 'Running', count: n}, ..]
        const statusCounts = Object.keys(countMap).map(status => ({
            status,
            count: countMap[status],
        }));
        console.log(statusCounts)


        const chartSeriesArray = statusCounts.map(item => item.count);
        const chartLabelsArray = ['Running', 'Caution', 'Warning', 'Faulty'];
        const chartColorArray = ['rgba(0, 128, 0, 0.6)', 'rgba(218, 165, 32, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(150, 150, 150, 1)'];



        const colorMap = {
            Running: 'rgba(0, 128, 0, 0.6)',
            Caution: 'rgba(218, 165, 32, 0.6)',
            Warning: 'rgba(255, 0, 0, 0.6)',
            Faulty: 'rgba(150, 150, 150, 1)',
        };

        // ApexCharts 데이터 형식으로 변환
        const chartData = statusCounts.map(({ status, count }) => ({
            x: status,
            y: count,
            color: colorMap[status],
        }));
        console.log(chartData)

        // ApexCharts 옵션 설정
        const chartOptions = {
            labels: statusCounts.map(({ status }) => status),
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true, // 레전드 보이게 설정
            },
        };

        console.log(chartOptions)
        console.log([{data:chartData}])


        // 각 status의 개수 계산
        const statusCounts1 = updatedStatusHistory.reduce((counts, entry) => {
            counts[entry.status] = (counts[entry.status] || 0) + 1;
            return counts;
        }, {});
        // 각 status에 해당하는 색상 할당
        const statusColors1 = {
            Running: 'rgba(0, 128, 0, 0.6)',
            Caution: 'rgba(218, 165, 32, 0.6)',
            Warning: 'rgba(255, 0, 0, 0.6)',
            Faulty: 'rgba(150, 150, 150, 1)',
        };
        // ApexCharts에 전달할 데이터 형식으로 변환
        const chartData1 = Object.entries(statusCounts1).map(([status, count]) => ({
            x: status,
            y: count,
            fill: statusColors1[status],
        }));

        // ApexCharts의 options 설정
        const chartOptions1 = {
            labels: Object.keys(statusCounts1),
        };


        return(
            <ReactApexChart
                options={chartOptions1}
                series={chartData1}
                type="donut"
                height={300}
            />
            /*<Box sx={{display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                <ApexChartPie series={chartSeriesArray} labelsArray={chartLabelsArray} colorArray={chartColorArray}/>
            </Box>*/
            /*<Box sx={{display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                <ReactApexChart
                    key={JSON.stringify(statusCounts)} // 의존성 추가
                    options={chartOptions}
                    series={[{ data: chartData }]}
                    type="donut"
                />
            </Box>*/
        )
    }
    // 처음 렌더링 시 updatedStatusHistory 가 빈 문자열([]) 또는 'null' 일 경우
    else {
        return(
            <Box sx={{ width: 1 }}>
                <p>조회한 데이터가 없습니다.</p>
            </Box>
        )
    }
    /*return(
        <>
            {/!*{statusCounts.length > 0 ? (
            <Pie data={chartData} options={options} />
        ) : (
            <p>{!updatedStatusHistory ? 'No data available for chart.' : 'Empty data.'}</p>
        )}*!/}
            {/!*{statusCounts.length > 0 ? (
            <ReactApexChart options={apexOptions} series={options.series} type="pie" height={350} />
        ) : (
            <p>{!updatedStatusHistory ? 'No data available for chart.' : 'Empty data.'}</p>
        )}*!/}
        </>
    )*/
}
export default StatusHistoryPie;