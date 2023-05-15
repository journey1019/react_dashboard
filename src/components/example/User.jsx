import React, {useState, useMemo, useEffect, useCallback} from 'react';
import axios from 'axios';

const User = () => {

    const[nmsCurrent, setNmsCurrent] = useState([]);
    const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
    const url = "http://testvms.commtrace.com:12041/restApi/nms/historyData?deviceId=01665706SKYAB8f&startDate=2023-05-08&&endDate=2023-05-09";
    const params = {desc:false};
    const headers = {
        "Content-Type": 'application/json;charset=UTF-8',
        "Accept":"application/json",
        "Authorization": "Bearer"+token,
    };

    useEffect(() => {
        getData();
    });

    useEffect(() => {
    }, [nmsCurrent]);

    const getData = useCallback(() => {
        setTimeout(() => {
            axios({
                method:"get",
                url: url,
                headers: headers,
                params: params,
                responseType: "json"
            })
                .then(response => {
                    setStates(response.data.response);
                });
        }, 2000);
    });


    function setStates(data){
        console.log(data);
        setNmsCurrent(data);
    }


    return(
        <h1>Users</h1>
    )
}

export default User;