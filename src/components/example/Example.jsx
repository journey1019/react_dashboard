import React, {useState, useEffect, useCallback, useMemo} from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";

import MaterialReactTable from 'material-react-table';


function Example() {
    /***
     * 단말 데이터 갱신 확인(Console에서 확인 필요)
     * Array 및 Object의 State 전체의 변경을 UseEffect 에서 확인하는 부분 --> 진행 중
     *
     */

        //Axios 갱신을 위한 계수기 state
    const[number,setNumber] = useState(0);
    //API로 들어온 데이터(NmsCurrent) state
    const[nmsHistory,setNmsHistory] = useState([]);
    //갱신 확인을 위한 단말 1개의 데이터
    const[nmsDevice,setNmsDevice] = useState({
        /*crpCount:0,
        crpDeviceCount:0,
        crpId:'',
        crpNm:'',
        deviceId:'',
        diff:0,
        insertDate:'',
        mainKey:'',
        manageCrpId:'',
        manageCrpNm:'',
        receivedDate:'',
        subKey:'',
        vhcleNm:''*/
    });

    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{
        //주기 설정
        setTimeout(()=>{
            //주기별로 계수기를 실행시켜 useEffect 변경을 발생시킴
            setNumber(number+1)
            //async, await에서 받아온 데이터
            // function returnData() 호출하여 parsing
            const data = returnData().then(
                result=>{
                    if(result!=null){

                        let deviceNmsList = [];
                        //result 배열 풀기
                        result.map(function (device){

                            //manageCrp 배열 내의 crp 풀기
                            device['dataList'].map(function (received){
                                received["deviceId"] = device.deviceId;
                                received["receivedDate"] = received.receivedDate;


                                deviceNmsList.push(received);

                                //device 1개에서 변경되는 것을 확인하기 위해 생성
                                if(device.deviceId == "01802737SKYBBF2"){
                                    setNmsDevice(device);
                                }
                            });
                        });
                        //parsing 된 전체 device 정보 갱신
                        setNmsHistory(deviceNmsList);
                    }else{

                    }

                });


            //2초에 1번
        },2000);

        //계수기 변경 때마다 동작하게 설정
    },[number]);

    //전체 데이터 변경 확인
    //현재 nmsHistory 값은 배열 --> useState에서 데이터 수신 시 마다 갱신을 확인하여
    //변경으로 간주됨
    useEffect(()=>{


        //console.log(nmsHistory)


        //Array
    },[nmsHistory]);


    //device 1개에 대한 변경 확인
    useEffect(()=>{


        console.log(nmsDevice)

        //useState 내의 수신시간, 시간 차 마다 갱신되게 설정
    },[nmsDevice.receivedDate,nmsDevice.diff]);


//axios function --> async
    async function returnData(){


        const timer = 1000;
        const token = '2886360e-1945-4f99-a1b0-07992bad8228';
        const urls = "http://testvms.commtrace.com:12041/restApi/nms/historyData?deviceId=01665706SKYAB8f&startDate=2023-05-08&&endDate=2023-05-09";
        //const urls = "http://testvms.commtrace.com:12050/NMS/getCurrentReceived";
        const params = {desc:false};

        const headers = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer "+token,
            // 추가
            //"Access-Control-Allow-Origin": `http://localhost:3000`,
            //'Access-Control-Allow-Credentials':"true",

        };

        let returnVal = null;

        //axis 생성
        try {

            //result에 대한 await 시, result 데이터 확인 못함
            //returnVal을 통해 데이터 가져오기
            let result = await axios({
                method:"get",//통신방식
                url : urls,//URL
                headers : headers,//header
                params:params,
                responseType:"json"
            })
                .then(response =>{
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                })
                .then(err=>{
                    return null;
                });

            //반환
            return returnVal;

        }catch {
            return null;
        }


    }



    return (
        <div>
            <p>{number}</p>
        </div>
    );
}

export default Example;