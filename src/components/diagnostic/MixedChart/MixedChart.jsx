import React from 'react';
import Chart from 'react-apexcharts';

const MixedChart = (props) => {
    console.log(props.getDiagnostic)

    const options = {
        chart: {
            height: 'auto',
            type: 'line',
        },
        stroke: {
            curve: 'smooth',
        },
        series: [
            {
                name: '단말기전원 작동시간',
                type: 'line',
                data: props.getDiagnostic.map(x=>x.st6100On),
            },
            {
                name: '위성전원 작동시간',
                type: 'line',
                data: props.getDiagnostic.map(x=>x.satOnTime),
            },
            {
                name: '위성 신호레벨',
                type: 'line',
                data: props.getDiagnostic.map(x=>x.satCnr),
            },
            {
                name: '배터리 충전 작동시간',
                type: 'line',
                data: props.getDiagnostic.map(x=>x.batChargeTime),
            },
            // 위성연결이 끊긴 횟수
            {
                name: '위성연결 끊김 횟수',
                type: 'bar',
                data: props.getDiagnostic.map(x=>x.satCutOffCount),
            },
            // 단말기 전원이 켜진 횟수
            {
                name: '단말기전원 작동 횟수',
                type: 'bar',
                data: props.getDiagnostic.map(x=>x.powerOnCount),
            },
            // 메세지를 보낸 횟수
            {
                name: '메세지 수신 횟수',
                type: 'bar',
                data: props.getDiagnostic.map(x=>x.sendDataCount),
            },
        ],
        xaxis: {
            categories: props.getDiagnostic.map(x=>x.eventDate),
        },
    };

    return (
        <div className="mixed-chart" style={{width: '90%', alignItems: 'center', justifyItems: 'center'}}>
            <Chart options={options} series={options.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
        </div>
    );
};

export default MixedChart;
