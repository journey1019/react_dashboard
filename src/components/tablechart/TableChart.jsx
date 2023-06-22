import "./tablechart.scss"
import React, {useState, useEffect, useMemo} from 'react';
import {
    ComposedChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    Area,
    Bar,
    Line,
    LineChart,
    ResponsiveContainer
} from "recharts";
import axios from "axios";



const data = [
    {
        "name": "Page A",
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "Page B",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "Page C",
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": "Page D",
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": "Page E",
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": "Page F",
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": "Page G",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    }
]

const TableChart = ({clickRow}) => {
    const[startDate, setStartDate] = useState(new Date("2023-05-23").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[nmsDevice] = useState([]);

    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let deviceNmsList = [];
                    //result 배열 풀기
                    result['dataList'].map(function (received){
                        received["deviceId"] = result.deviceId;
                        received["vhcleNm"] = result.vhcleNm;

                        // Object 순회 _ ioJson
                        if(received.ioJson != null ) {
                            for (let key of Object.keys(received.ioJson)) {
                                const value = received.ioJson[key]; // Violet과 30이 연속적으로 출력됨
                                received[key] = value.toString() || '';
                            }
                        }else {
                        }
                        // device의 정보를 생성한 배열에 push
                        deviceNmsList.push(received);
                    });
                    setNmsCurrent(deviceNmsList);
                }else{
                }
            });

        return () => {
            clearTimeout(nmsCurrent);
        }
    }, [clickRow]);

    useEffect(() => {
    }, [nmsCurrent]);

    useEffect(() => {
    },[nmsDevice.receivedDate]);

    async function returnData() {
        if ((clickRow == null || clickRow ==  "")) {
            return null
        }
        else{
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            const urls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
            const params = {deviceId:(clickRow), startDate:(startDate+"T00:00:00"), endDate:(endDate+"T23:59:59"), desc:true};

            const headers = {
                "Content-Type": 'application/json;charset=UTF-8',
                "Accept":"application/json",
                "Authorization": "Bearer "+token,
            };

            let returnVal = null;

            try {
                await axios({
                    method:"get",
                    url:urls,
                    headers:headers,
                    params:params,
                    responseType:"json"
                })
                    .then(response => {
                        // 성공 시, returnVal로 데이터 input
                        returnVal = response.data.response;
                    })
                    .then(err=>{
                        return null;
                    });
                return returnVal;

            } catch {
                return null;
            }
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Device Id',
                accessorKey: 'deviceId',
            },
            {
                header: 'Vehicle Number',
                accessorKey: 'vhcleNm',
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            },
        ]

    )



    return(
        <div className = "tableChart">
            <ComposedChart
                width={1400}
                height={550}
                data={nmsCurrent}>

                <XAxis dataKey={columns} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="pv" barSize={30} fill="#413ea0" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            </ComposedChart>
        </div>
    )
}


export default TableChart;