import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import smartvms2Json from "../config/smarvms2.json";

const RadialBar = () => {
    console.log(smartvms2Json);

    const [chartData, setChartData] = useState({
        options: {
            labels: ['RadialBar'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '70%',
                    },
                },
            },
        },
        series: [68],
    });

    return (
        <div className="radialbar">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="radialBar"
                height="380"
            />
        </div>
    );
};

export default RadialBar;

/*class SingleRadial extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {
                labels: ['RadialBar'],
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '70%',
                        }
                    },
                },
            },
            series: [68],
        }
    }

    render() {

        return (
            <div className="radialbar">
                <Chart options={this.state.options} series={this.state.series} type="radialBar" height="380" />
            </div>
        );
    }
}

export default SingleRadial;*/