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
            position: 'top',
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
                                console.log(w)
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