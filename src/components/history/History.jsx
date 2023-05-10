import React, {useState, useEffect, useMemo, useCallback} from 'react';
import MaterialReactTable from 'material-react-table';

// API
import axios from 'axios';

const History = () => {
    /** API **/
        // Axios 갱신을 위한 계수기 state
    const[number, setNumber] = useState(0);
    // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[nmsDevice, setNmsDevice] = useState({
        /*statusCode:'',
        status:'',
        error:'',
        errorMessage:'',
        deviceId:'',
        vhcleNm: '',
        accessId:'',
        dataCount:'',*/
        receivedDate:'',
        messageDate:'',
        mainKey:'',
        subKey:'',
        messageData:'',
        messageId:'',
        ioJson:'',
    })

    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{

        // 주기 설정
        setTimeout( () => {
            setNumber(number + 1)

            const data = returnData().then(
                result=>{
                    if(result!=null){

                        let deviceNmsList = [];
                        //result 배열 풀기
                        result.map(function (info) {
                            info['dataList'].map(function (device){
                                device["deviceId"] = device.deviceId;
                                device["receivedDate"] = device.receivedDate;

                                deviceNmsList.push(device);

                                if(device.deviceId=="01802737SKYBBF2"){
                                    setNmsDevice(device)
                                }
                            });
                        });
                        /*result.map(function (status){

                            status['dataList'].map(function (data) {

                                data["statusCode"] = status.statusCdoe;
                                data["status"] = status.status;

                                deviceNmsList.push(data);
                            });
                        });*/
                        setNmsCurrent(deviceNmsList);
                    }else{

                    }
                }
            );
        }, 10000);
    }, [number]);

    useEffect(() => {

    }, [nmsCurrent]);

    useEffect(() => {
        console.log(nmsDevice)
    },[nmsDevice.receivedData]);

    async function returnData() {
        const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
        const urls = "http://testvms.commtrace.com:12041/restApi/nms/historyData";
        const params = {detailMessage:false};

        const headers = {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept":"application/json",
            "Authorization": "Bearer"+token,
        };
        let returnVal = null;

        try {
            let result = await axios({
                method:"get",
                url:urls,
                headers:headers,
                params:params,
                responseType:"json"
            })
                .then(response => {
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

    const columns = useMemo(
        () => [
            /*{
                header: 'Status Code',
                accessorKey: 'statusCode',
            },
            {
                header: 'status',
                accessorKey: 'status',
            },
            {
                header: 'error',
                accessorKey: 'error',
            },
            {
                header: 'Error Message',
                accessorKey: 'errorMessage',
            },*/
            {
                header: 'Device Id',
                accessorKey: 'deviceId',
            },
            {
                header: 'Vehicle Number',
                accessorKey: 'vhcleNm',
            },
            {
                header: 'Data Count',
                accessorKey: 'dataCount',
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            },
            {
                header: 'Message Date',
                accessorKey: 'messageDate',
            },
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
            },
            {
                header: 'Message Data',
                accessorKey: 'messageData',
            },
            {
                header: 'Message Id',
                accessorKey: 'messageId',
            },
            {
                header: 'Battery Status',
                accessorKey: 'batteryStatus',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: '0', value: '0' },
                    { text: '1', value: '1' },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'vehiclePower',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: '0', value: '0' },
                    { text: '1', value: '1' },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Geofence',
                accessorKey: 'geofence',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: '0', value: '0' },
                    { text: '1', value: '1' },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Pump Power',
                accessorKey: 'pumpPower',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: '0', value: '0' },
                    { text: '1', value: '1' },
                    { text: 'null', value: '' },
                ],
                filterVariant: 'select',
            },
        ],
        [],
    );

    return (
        <MaterialReactTable
            columns={columns}
            data={nmsCurrent}
            enableMultiRowSelection={false}
            enableColumnResizing
            enableGrouping
            enableStickyHeader
            enableStickyFooter
            initialState={{
                exportButton: true,
                showColumnFilters: true,
                density: 'compact',
                expanded: true,
                pagination: { pageIndex: 0, pageSize: 100 },
                sorting: [{ id: 'manageCrpNm', desc: false }],
            }}
            muiToolbarAlertBannerChipProps={{ color: 'primary' }}
            muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
            muiTableHeadCellFilterTextFieldProps={{
                sx: { m: '0.5rem 0', width: '100%' },
                variant: 'outlined',
            }}
        />
    );
};

export default History;