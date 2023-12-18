import React, {useState, useEffect} from "react";
import Chart from "react-apexcharts";

const RadialBar = (props) => {
    console.log(props.percentage)


    //const [labels, setLabels] = useState([]);
    //const [series, setSeries] = useState([]);

    useEffect(() => {
        props.percentage.map(function(percent){
            //delete Object.assign(percent, {배터리충전가동률: percent.batChargePercent})['batChargePercent'];
            console.log(percent);
            console.log(Object.keys(percent))
            console.log(Object.values(percent))

            //setLabels(Object.keys(percent));
            //setSeries(Object.values(percent));
        })
    }, [props.percentage])
    //console.log(labels)
    //console.log(series)


    const [options, setOptions] = useState({
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
                inverseOrder: false, // 역순
                startAngle: 0,  // 시작각
                endAngle: 360,  // 끄탁
                offsetX: 0,     // 범례 컨테이너의 왼쪽 오프셋 설정
                offsetY: 0,     // 범례 오른쪽 오프셋 설저
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
                            console.log(w);
                            return (
                                w.globals.seriesTotals.reduce((a, b) => { // reduce : 함수 배열 순회하며 callback 함수 실행 값 누적
                                    console.log(a);
                                    console.log(b);
                                    return a + b;
                                }, 0) / // 0 초지값
                                w.globals.series.length + // 개수
                                "%"
                            );
                        }
                    }
                }
            }
        }
    });

    const [series, setSeries] = useState([100, 255, 41, 17, 15]);

    return (
        <div className="donut">
            {/* Assuming Chart is a component that receives options, series, type, and width as props */}
            <Chart options={options} series={series} type="radialBar" width="380" />
        </div>
    );
};

export default RadialBar;
