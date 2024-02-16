/* Chart */
import Chart from "react-apexcharts";
import React from "react";



const DiagnosticChartDvTime = (props) => {


    /* ----- ApexChart _ (Line: 수치 / Bar : 횟수) ------*/
    // st6100On : 위성에 연결된 단말기가 작동한 시간
    const st6100OnOptions = {
        chart: {
            height: 'auto',
            type: 'line',
        },
        stroke: {
            curve: 'smooth',
        },
        series: [{
            name: '단말기 작동시간',
            type: 'line',
            data: props.st6100OnList,
        }],
        title: {
            text: '단말기 작동시간 (_ST6100On)',
            align: 'left',
            style: {
                fontSize: '25px', // Title의 글자 크기를 변경할 수 있는 부분
            },
        },
        xaxis: {
            categories: props.eventDateList,
        },
    }

    return(
        <>
            <Chart options={st6100OnOptions} series={st6100OnOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
        </>
    )
}

export default DiagnosticChartDvTime;