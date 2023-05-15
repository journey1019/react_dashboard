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
        errorMessage:'',*/
        deviceId:'',
        vhcleNm: '',
        accessId:'',
        dataCount:'',
        receivedDate:'',
        messageDate:'',
        mainKey:'',
        subKey:'',
        messageData:'',
        messageId:'',
        ioJson:'',
    })

    /*const [user, setUser] = useState([])

    useEffect(() => {
        axios.get('http://testvms.commtrace.com:12041/restApi/nms/historyData')
            .then(response => {
                setUsers(response.data);
            });
    }, []);
*/
    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){

                    let deviceNmsList = [];
                    //result 배열 풀기
                    result['dataList'].map(function (received){
                        received["deviceId"] = result.deviceId;
                        received["vhcleNm"] = result.vhcleNm;
                        received["accessId"] = result.accessId;
                        received["dataCount"] = result.dataCount;
                        received["receivedDate"] = result.receivedDate;
                        received["batteryStatus"] = result.batteryStatus;
                        received["ioJson"] = result.ioJson;
                        console.log(received);

                        // device의 정보를 생성한 배열에 push
                        deviceNmsList.push(received);
                    });
                    setNmsCurrent(deviceNmsList);
                }else{
                }
            });

        setTimeout( () => {
            setNumber(number + 1)
            const data = returnData().then(
                result=>{
                    if(result!=null){

                        let deviceNmsList = [];
                        //result 배열 풀기
                        result['dataList'].map(function (received){
                            received["deviceId"] = result.deviceId;
                            received["vhcleNm"] = result.vhcleNm;
                            received["accessId"] = result.accessId;
                            received["receivedDate"] = result.receivedDate;
                            received["batteryStatus"] = result.batteryStatus;
                            received["ioJson"] = result.ioJson;
                            console.log(received);

                            // device의 정보를 생성한 배열에 push
                            deviceNmsList.push(received);
                        });
                        setNmsCurrent(deviceNmsList);
                    }else{
                    }
                });
        },10000);
        return () => {
            clearTimeout(nmsCurrent);
        }
    }, [number]);

    useEffect(() => {

    }, [nmsCurrent]);

    useEffect(() => {
        console.log(nmsDevice)
        console.log(nmsCurrent)
    },[nmsDevice.receivedDate]);

    async function returnData() {
        const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
        const urls = "http://testvms.commtrace.com:12041/restApi/nms/historyData";
        const params = {deviceId:"01671940SKY8D51", startDate:"2023-05-12T00:00:00", endDate:"2023-05-13T00:00:00", desc:false};

        const headers = {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept":"application/json",
            "Authorization": "Bearer "+token,
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
                    // 성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                    console.log(response.data.response);
                    /*this.setState({
                        list:response.response
                    })*/
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
            }}
            muiToolbarAlertBannerChipProps={{ color: 'primary' }}
            muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
            /*muiTableHeadCellFilterTextFieldProps={{
                sx: { m: '0.5rem 0', width: '100%' },
                variant: 'outlined',
            }}*/
        />
    );
};

export default History;