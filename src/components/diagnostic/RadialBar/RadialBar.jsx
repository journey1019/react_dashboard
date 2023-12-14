import React, { Component } from "react";
import Chart from "react-apexcharts";

class RadialBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                labels: ["A", "B", "C", "D", "E"],
                legend: {
                    show: true,
                    onItemClick: {
                        toggleDataSeries: true
                    },
                    onItemHover: {
                        highlightDataSeries: true
                    }
                },
                plotOptions: {
                    radialBar: {
                        size: undefined,
                        inverseOrder: false,
                        startAngle: 0,
                        endAngle: 360, // 각도
                        offsetX: 0,
                        offsetY: 0,
                        hollow: {
                            margin: 5,
                            size: "50%",
                            background: "transparent",
                            image: undefined,
                            imageWidth: 150,
                            imageHeight: 150,
                            imageOffsetX: 0,
                            imageOffsetY: 0,
                            imageClipped: true,
                            position: "front",
                            dropShadow: {
                                enabled: false,
                                top: 0,
                                left: 0,
                                blur: 3,
                                opacity: 0.5
                            }
                        },
                        track: {
                            show: true,
                            startAngle: undefined,
                            endAngle: undefined,
                            background: "#f2f2f2",
                            strokeWidth: "97%",
                            opacity: 1,
                            margin: 5,
                            dropShadow: {
                                enabled: false,
                                top: 0,
                                left: 0,
                                blur: 3,
                                opacity: 0.5
                            }
                        },
                        dataLabels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: "22px",
                                fontFamily: undefined,
                                color: undefined,
                                offsetY: -10
                            },
                            value: {
                                show: true,
                                fontSize: "16px",
                                fontFamily: undefined,
                                color: undefined,
                                offsetY: 16,
                                formatter: function (val) {
                                    return val + "%";
                                }
                            },
                            total: {
                                show: true,
                                label: "Total",
                                color: "#373d3f",
                                formatter: function (w) {
                                    return (
                                        w.globals.seriesTotals.reduce((a, b) => {
                                            return a + b;
                                        }, 0) /
                                        w.globals.series.length +
                                        "%"
                                    );
                                }
                            }
                        }
                    }
                }
            },

            series: [100, 90, 41, 17, 15]
        };
    }

    render() {
        return (
            <div className="donut">
                <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="radialBar"
                    width="380"
                />
            </div>
        );
    }
}

export default RadialBar;
