import { useEffect, useState } from "react";
import axios from "axios";
import "./alarm.scss"

const Alarm = () => {


    async function returnAlarm() {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const summaryUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmSummary";

        const headers = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        };

        try{
            let result = await axios({
                method: "get",
                url: "summaryUrl",
                headers: headers,

            })
        }

    }
}

export default Alarm;