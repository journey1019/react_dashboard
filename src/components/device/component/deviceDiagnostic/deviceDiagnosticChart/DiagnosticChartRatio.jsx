import React, {useState} from "react";
import ReactApexChart from "react-apexcharts";

const DiagnosticChartRatio = (props) => {
    const radialPercent = [props.pwrOnPercent, props.satOnPercent];
    /* 가동률 - Apex Radial Chart */
    const [radialChartState, setRadialChartState] = useState({
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
            position: 'top',
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            }
        },
        labels: ['단말기 가동률', '위성 가동률'],
    });

    return(
        <>
            <ReactApexChart options={radialChartState} series={radialPercent} type="radialBar" />
        </>
    )
}

export default DiagnosticChartRatio;