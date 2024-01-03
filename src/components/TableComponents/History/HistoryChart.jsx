import React, {useState, useEffect, useContext, useMemo} from "react";
import Chart from "react-apexcharts";

const HistoryChart = (props) => {


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
                name: 'Main Key',
                type: 'line',
                data: props.nmsHistory.map(x=>x.mainKey),
            },
            {
                name: 'Sub Key',
                type: 'line',
                data: props.nmsHistory.map(x=>x.subKey),
            },
            {
                name: '위성 신호레벨',
                type: 'line',
                data: props.nmsHistory.map(x=>x.satCnr),
            },
            {
                name: '배터리 충전 시간',
                type: 'line',
                data: props.nmsHistory.map(x=>x.batChargeTime),
            },
            {
                name: '위성 전원 카운트',
                type: 'line',
                data: props.nmsHistory.map(x=>x.satOnTime),
            },
            {
                name: '단말기 전원 카운트',
                type: 'line',
                data: props.nmsHistory.map(x=>x.st6100On),
            },
            {
                name: '수신 메시지 카운트',
                type: 'line',
                data: props.nmsHistory.map(x=>x.sendDataCount),
            },
            {
                name: '위성 끊김 카운트',
                type: 'line',
                data: props.nmsHistory.map(x=>x.satCutOffCount),
            },
            {
                name: '위성 연결 카운트',
                type: 'line',
                data: props.nmsHistory.map(x=>x.powerOnCount),
            },

        ],
        xaxis: {
            categories: props.nmsHistory.map(x=>x.receivedDate),
        },
    };
    return(
        <>
            <div style={{display: 'flex'}}>
                <Chart options={options} series={options.series} type="line" style={{width: '50%', alignItems: 'center', justifyItems: 'center'}} />
                <Chart options={options} series={options.series} type="line" style={{width: '50%', alignItems: 'center', justifyItems: 'center'}} />
            </div>
            <div style={{display: 'flex'}}>
                <Chart options={options} series={options.series} type="line" style={{width: '50%', alignItems: 'center', justifyItems: 'center'}} />
                <Chart options={options} series={options.series} type="line" style={{width: '50%', alignItems: 'center', justifyItems: 'center'}} />
            </div>
        </>
    )
}

export default HistoryChart;