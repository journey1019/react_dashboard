import Chart from "react-apexcharts";
import React from "react";

const DiagnosticChartSatSignal = (props) => {

    //console.log(averageValue);
    // satCnr : 위성신호레벨
    const satCnrOptions = {
        series: [{
            name: "위성신호 레벨",
            data: props.satSignalList,
        }],
        chart: {
            height: 'auto',
            type: 'line',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '위성신호 레벨 (_SatCnr)',
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
        },
        yaxis: [
            {
                title: {
                    text: 'Value',
                },
            },
        ],
        annotations: {
            yaxis: [
                {
                    y: props.averageValue,
                    borderColor: '#FF4560',
                    label: {
                        borderColor: '#FF4560',
                        style: {
                            color: '#fff',
                            background: '#FF4560',
                        },
                        text: 'Average : '+ props.averageValue.toString(), // 평균값 주석에 표시될 텍스트
                    },
                    borderWidth: 3,
                },
            ],
        },
    };

    return(
        <>
            <Chart options={satCnrOptions} series={satCnrOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
        </>
    )
}

export default DiagnosticChartSatSignal;