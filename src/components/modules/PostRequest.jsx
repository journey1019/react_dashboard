import React, {useEffect, useState} from "react";
import axios from "axios";


// Send Command
async function PostRequest(urls, params) {
    const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    const headers = {
        "Content-Type": 'application/json;charset=UTF-8',
        "Accept":"application/json",
        "Authorization": "Bearer " + token,
    };

    try{
        const response = await axios.post(urls, params, {
            headers: headers,
        })

        // 성공 시, 데이터를 반환
        return response.data.response;
    } catch(error) {
        // 에러 발생 시, 적절한 처리를 수행하거나 null을 반환
        console.log("Error in PostRequest", error);
        return null;
    }
}
export default PostRequest;