/* React */
import React from "react";

/* Chart */
import ApexChartPie from "../../../../modules/chart/ApexChartPie";


/* MUI*/
import {Grid, Box, LinearProgress, Stack} from "@mui/material";

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

        return(
            <Box sx={{display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
                <ApexChartPie series={chartSeriesArray} labelsArray={chartLabelsArray} colorArray={chartColorArray}/>
            </Box>
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