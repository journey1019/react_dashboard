import ReactApexChart from 'react-apexcharts';
import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";

const ApexChart = (props) => {
    console.log(props)
    console.log(props.getDiagnostic)

    const [diagnosticAvr, setDiagnosticAvr] = useState([]);
    const [percentage, setPercentage] = useState([]);

    const [avrType, setAvrType] = useState('DAY');
    const [keyType, setKeyType] = useState('2')
    const [timeIdenty, setTimeIdenty] = useState('2023-12-01')

    const handleChangeAvrType = (event) => {
        setAvrType(event.target.value)
    }
    const handleChangeKeyType = (event) => {
        setKeyType(event.target.value)
    }

    useEffect(() => {
        const data = getDiagnosticAverage().then(
            result => {
                if (result != null) {
                    let diagList = [];
                    let timelineSatCnr = [];
                    console.log(result);

                    let percentList = [];

                    result.map(function(response) {
                        console.log(response);
                        console.log(response.cnrMap);



                        const percent = {};
                        //percent.batChargePercent = response.batChargePercent;
                        percent.pwrOnPercent = response.pwrOnPercent;
                        percent.satOnPercent = response.satOnPercent;


                        //percentList.push(percent);

                        if(response.cnrMap !== null) {
                            timelineSatCnr.push(response.cnrMap);
                        }
                        //percentList.push(response.batChargePercent); // 홍수통제소 기준 배터리충전률 필요없음
                        percentList.push(response.pwrOnPercent);
                        percentList.push(response.satOnPercent);
                    })

                    /*console.log(result.batChargePercent);
                    console.log(result.pwrOnPercent);
                    console.log(result.satOnPercent);*/

                    setDiagnosticAvr(result);
                    setPercentage(percentList);
                    /*setSatCnr(timelineSatCnr)*/
                } else{
                    console.log('값이 없음')
                }
            }
        )
    }, [avrType, keyType, timeIdenty]);

    //batChargePercent, pwrOnPercent, satOnPercent

    console.log(diagnosticAvr)
    console.log(diagnosticAvr.batChargePercent)
    console.log(percentage) // [100, 100]
    async function getDiagnosticAverage() {
        const token = JSON.parse(sessionStorage.getItem("userInfo")).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticAverage";
        const params = {avrType: avrType, keyType: keyType, timeIdenty: timeIdenty};
        const headers = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        };
        let returnVal = null;

        try {
            let result = await axios({
                method: "get",//통신방식
                url: urls, //URL
                headers: headers, //header
                params: params,
                responseType: "json"
            })
                .then(response => {
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                })
                .then(err => {
                    return null;
                });
            return returnVal; //반환
        } catch {
            return null;
        }
    }


    const [chartState, setChartState] = useState({
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


    return (
        <div style={{width: '100%'}}>
            <ReactApexChart
                options={chartState}
                series={percentage}
                type="radialBar"
                width={'100%'}
            />
        </div>
    );
};

export default ApexChart;
