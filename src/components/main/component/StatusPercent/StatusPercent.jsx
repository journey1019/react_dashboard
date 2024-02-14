/* React */
import React from "react";

/* Import */
import "./statusPercent.scss";

/* Apex Chart */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
//import { PieChart, Pie, Tooltip } from "recharts";
import Chart from "react-apexcharts";

ChartJS.register(ArcElement, Tooltip, Legend);


/***
 * @Author : jhlee
 * @date : 2024-02-06
 * @Desc : {
 *  Widget(Network Status) 상태 비율을 도넛 시각화로 표현한 컴포넌트
 *  React Apex Chart 라이브러리 활용
 *  - 해상도에 맞춰 자동 활성화 됨
 *  - Chart 가운데 총 장비 개수 확인 가능
 *  - 각 항목 hover 시, 해당 개수 가운데 표현
 *  - 자동으로 차지하는 비율 링에 표시
 * }
 */
const StatusPercent = (props) => {
    const statusNmsCurrent = props.statusNmsCurrent;

    // 각 상태 타입별 단말기 리스트 개수 지정
    const runningCount = statusNmsCurrent.runningList.length;
    const cautionCount = statusNmsCurrent.cautionList.length;
    const warningCount = statusNmsCurrent.warningList.length;
    const faultyCount = statusNmsCurrent.faultyList.length;



    const chartOptions = {
        labels: ['Running', 'Caution', 'Warning', 'Faulty'],
        colors: ['rgba(0, 128, 0, 0.6)', 'rgba(218, 165, 32, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(150, 150, 150, 1)'],
        legend: {
            show: true,
            position: 'right',
        },
        dataLabels:{ // 원형/도넛 차트의 데이터 레이블은 조각에 표시되는 백분율 값
            enabled: true,
        },
        plotOptions: {
            pie: {
                //expandOnClick: false, // 파이/도넛 조각을 클릭하면 크기가 늘어남
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '24px',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            offsetY: 16,
                            formatter: function (val) {
                                return val
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#ae0315',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                }
            }
        }
    };

    const chartSeries = [runningCount, cautionCount, warningCount, faultyCount];


    return(
        <>
            <div style={{ width: '100%'}}>
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    width={'100%'}
                />
            </div>
        </>
    )
}

export default StatusPercent;