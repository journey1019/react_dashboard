import './AdminManage.scss';
import Navbar from "../../components/navbar/Navbar";
import React, {useEffect, useState} from "react";
import {ButtonData} from "../../components/adminManage/data/ButtonData";
import ManageTable from "../../components/adminManage/table/ManageTable";
import {SelectColumnData} from "../../components/adminManage/data/SelectColumnData";
import {SendColumnData} from "../../components/adminManage/data/SendColumnData";
import {RequestColumnData} from "../../components/adminManage/data/RequestColumnData";
import axios from "axios";

const AdminManage = () => {


    //-- 수집 관리 부분

    const selectTitles = "수집관리";
    const selectUrls = "https://iotgwy.commtrace.com/restApi/admin/collectHistory";
    const [selectParam,setSelectParam] = new useState({});
    const [selectData, setSelectData] = useState([]);
    const pageSize = 10;

    function SelectParamOption(info){
        setSelectParam(info);
    }

    useEffect(() => {
        if(selectParam.startDate!=null){
            returnData(selectUrls,selectParam).then(
                result=>{
                    if(result!=null){
                        setSelectData(result);
                    }else{
                    }
                });

            return () => {
                //clearTimeout(nmsCurrent);
            }
        }

    }, [selectParam]);


    // -- 전송관리 부분
    const sendTitles = "전송관리";
    const sendUrls = "https://iotgwy.commtrace.com/restApi/admin/sendHistory";
    const [sendParam,setSendParam] = new useState({});
    const [sendData, setSendData] = useState([]);

    function SendDataParamOption(info){
        setSendParam(info);
    }

    useEffect(() => {
        if(sendParam.startDate!=null){
            returnData(sendUrls,sendParam).then(
                result=>{
                    if(result!=null){
                        setSendData(result);
                    }else{
                    }
                });

            return () => {
                //clearTimeout(nmsCurrent);
            }
        }

    }, [sendParam]);

    // -- 조회관리 부분
    const requestTitles = "조회관리";
    const requestUrls = "https://iotgwy.commtrace.com/restApi/admin/apiRequestHistory";
    const [requestParam,setRequestParam] = new useState({});
    const [requestData, setRequestData] = useState([]);

    function RequestDataParamOption(info){
        setRequestParam(info);
    }

    useEffect(() => {
        if(requestParam.startDate!=null){
            returnData(requestUrls,requestParam).then(
                result=>{
                    if(result!=null){
                        setRequestData(result);
                    }else{
                    }
                });

            return () => {
                //clearTimeout(nmsCurrent);
            }
        }

    }, [requestParam]);



    async function returnData(urls,params) {

        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;

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
                   // console.log(returnVal)
                })
                .then(err=>{
                    return null;
                });
            return returnVal;

        } catch {
            return null;
        }

    }

    return(
        <div className="managed">
            <div className = "navbar">
                <Navbar />
            </div>

            <div className="contain">
                <div className="buttonTab">

                    {
                        ButtonData.map((item, index) => {
                                return (
                                    item.commponent
                                );
                        })
                    }

                </div>
                <div id="collectLogDiv" className="logDiv">
                    <div>
                        <ManageTable data={selectData} title={selectTitles} dataColumn={SelectColumnData} parmaOption={SelectParamOption} pageSize={pageSize}></ManageTable>
                    </div>
                </div>

                <div id="sendLogDiv" className="logDiv">
                    <div>
                        <ManageTable data={sendData} title={sendTitles} dataColumn={SendColumnData} parmaOption={SendDataParamOption} pageSize={pageSize}></ManageTable>
                    </div>
                </div>
                <div id="requestLogDiv" className="logDiv">
                    <div>
                        <ManageTable data={requestData} title={requestTitles} dataColumn={RequestColumnData} parmaOption={RequestDataParamOption}></ManageTable>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminManage;