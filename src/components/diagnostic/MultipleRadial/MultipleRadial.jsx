import ReactApexChart from 'react-apexcharts';
import React, { useEffect, useRef, useState } from 'react';
import exampleJson from "../config/example.json"; // 통계데이터x
import smartvms2date from "../config/smartvms2date.json"; // 01680675SKY33EC에 대해서만

const ApexChart = () => {
    console.log(exampleJson);
    const [detailData, setDetailData] = useState([])



    useEffect(() => {
        exampleJson.map(function (jsonList) {
            let detailList = [];

            console.log(jsonList);
            console.log(jsonList.data)

            jsonList.data.map(function (dataList) {
                console.log(dataList)

                detailList.push(dataList)
                console.log(detailList)
            })
            setDetailData(detailList)
        })
    }, [])

    console.log(detailData)



    /* -------- smartvms2Date ---------- */
    console.log(smartvms2date);

    // Power On 가동률
    const [pwrOnPer, setPwrOnPer] = useState([]);

    useEffect(()=>{
        smartvms2date.map(function(list) {
            let powerPercent = [];

            console.log(list);

            const powerPercentage = {};
            powerPercentage.pwrOnPercent = list.pwrOnPercent;

        })

    }, [smartvms2date])





    const [chartState, setChartState] = useState({
        series: [100, 50, 100],
        options: {
            chart: {
                height: 550,
                type: 'radialBar',
            },
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
                onItemClick: {
                    toggleDataSeries: true
                },
                onItemHover: {
                    highlightDataSeries: true
                }
            },
            labels: ['전원 On 가동률', '배터리 충전률', '위성 On 가동률'],
        },
    });
    return (
        <div>
            <ReactApexChart
                options={chartState.options}
                series={chartState.series}
                type="radialBar"
                width={500}
            />
        </div>
    );
};

export default ApexChart;
