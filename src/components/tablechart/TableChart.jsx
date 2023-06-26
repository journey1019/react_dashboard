import "./tablechart.scss"
import React, {useEffect} from 'react';
import {AreaChart, Area, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

const TableChart = ({nmsCurrent}) => {


    useEffect(() => {
    }, [nmsCurrent]);

    console.log(nmsCurrent);

    return(
        <div className = "tableChart">
            {/*<LineChart
                width={1400}
                height={550}
                data={nmsCurrent}>

                <XAxis dataKey="messageDate" interval={0}/>
                <YAxis dataKey="mainKey" />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Bar dataKey="pv" barSize={30} fill="#413ea0" />
                <Line type="monotone" dataKey="receivedDate" stroke="#ff7300" />
                <Line type="monotone" dataKey="messageDate" stroke="#8884d8" activeDot={{ r: 8 }}/>
            </LineChart>*/}
            <AreaChart width={1400} height={550} data={nmsCurrent}>
                {/*<CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="messageDate" interval={0} />
                <YAxis dataKey="mainKey"/>
                <Tooltip />
                <Legend />*/}
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2198F3" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#4BABF4" stopOpacity={0.6}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke='#ccc' />
                <XAxis dataKey="messageDate" dy={10}/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="mainKey" stroke="#8884d8" activeDot={{ r: 10 }}/>
                <Area type="monotone" dataKey="subKey" stroke="#82ca9d" activeDot={{ r: 7 }} />
                {/*<Line type="monotone" dataKey="receivedDate" stroke="#82ca9d" />*/}
            </AreaChart>
        </div>
    )
}


export default TableChart;