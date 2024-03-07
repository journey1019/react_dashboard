import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChartPie = ({series, labelsArray, colorArray, }) => {

    const apexOptions = {
        series: series,
        chart: {
            width: '100%',
            //width: 380,
            type: 'pie',
        },
        labels: labelsArray,
        colors: colorArray,
        title: {
            text: 'Status History',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        show: false,

                    },
                },
            },
        ],

        legend : {
            show: false
        },
    };

    return(
        <ReactApexChart options={apexOptions} series={apexOptions.series} type="pie" height={'100%'} />
    )
}

export default ApexChartPie;