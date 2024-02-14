/* React */
import React, { useState } from "react";

/* Import */
import "./statusPercent.scss";

/* Apex Chart */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
//import { Doughnut } from 'react-chartjs-2';
import { RadialChart } from 'react-vis';
import { Pie } from 'react-chartjs-2';
//import { PieChart, Pie, Tooltip } from "recharts";
import Chart from "react-apexcharts";
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ChartDataLabels)
//ChartJS.register(ArcElement, Tooltip, Legend);

/***
 * @Author : jhlee
 * @date : 2024-02-06
 * @Desc : {
 *  Widget(Network Status) 상태 비율을 파이 시각화로 표현한 컴포넌트
 *  React ChartJS 라이브러리 활용
 *  - legend 에서 각 항목 선택 시, 해당 항목 자동 제외해서 보여줌
 *  - 해상도 크기에 맞춰 비활성화 가능
 * }
 */
const StatuePie = (props) => {
    const statusNmsCurrent = props.statusNmsCurrent;

    // 각 상태 타입별 단말기 리스트 개수 지정
    const runningCount = statusNmsCurrent.runningList.length;
    const cautionCount = statusNmsCurrent.cautionList.length;
    const warningCount = statusNmsCurrent.warningList.length;
    const faultyCount = statusNmsCurrent.faultyList.length;

    const data = {
        labels: ['Running', 'Caution', 'Warning', 'Faulty'],
        datasets: [{
            label: '# of Votes',
            data: [runningCount, cautionCount, warningCount, faultyCount],
            borderWidth: 1,
            /*backgroundColor: ['#B2D2A4', '#f2e5c6', '#FFC2C7', '#B8BBC1'],*/
            backgroundColor: ['rgba(0, 128, 0, 0.6)', 'rgba(218, 165, 32, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(150, 150, 150, 1)'],
        }]
    };

    const options = {
        plugins: {
            legend: {
                /*onHover: handleLegendHover,
                onLeave: handleLegendLeave,*/
                position: 'right', // 레전드 위치를 오른쪽으로 지정
                labels: {
                    usePointStyle: true, // 포인트 스타일 사용
                },
                style: {
                    cursor: 'pointer',
                },
            },
            datalabels: {
                anchor: 'center', // 레이블을 항목 끝부분에 표시
                align: 'center', // 레이블을 항목 끝부분에 정렬
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(2) + "%";
                    return percentage;
                },
                display: (context) => context.dataset.data[context.dataIndex] > 10, // 특정 값 이상일 때만 레이블 표시
                color: '#fff',
            },
        },
        maintainAspectRatio: true, // Canvas 크기 유지 비활성화
        responsive: false, // 반응형 활성화
        aspectRatio: 1, // aspectRatio 값 조절 (1은 정사각형)
    }

    /* Bug - 강조안됨 */
    // Append '4d' to the colors (alpha channel), except for the hovered index
    /*function handleLegendHover(event, legendItem, legend) {
        const index = legendItem.index;
        const datasetMeta = legend.chart.getDatasetMeta(0); // Assuming you have only one dataset
        const element = datasetMeta.data[index];

        if (element) {
            element.custom = { ...element.custom, hoverRadius: 10 };
            legend.chart.update();
        }
    }*/

    // Removes the alpha channel from background colors
    /*function handleLegendLeave(event, legendItem, legend) {
        const index = legendItem.index;
        const datasetMeta = legend.chart.getDatasetMeta(0);
        const element = datasetMeta.data[index];

        if (element) {
            element.custom = { ...element.custom, hoverRadius: undefined };
            legend.chart.update();
        }
    }*/

    return(
        <>
            <Pie data={data} options={options} height={'auto'} />
        </>
    )
}

export default StatuePie;