import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { Box, Stack } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import { data } from "./config/makeData";
//import { format } from "date-fns";
import axios from 'axios';


const Table = () => {
    /*
    const averageSalary = useMemo(
        () => data.reduce((acc, curr) => acc + curr.salary, 0) / data.length,
        [],
    );
     */
    //const ServerURL = 'http://testvms.commtrace.com:12041/restApi/nms/currentData'
    //const ServerURL = 'https://jsonplaceholder.typicode.com/users'

    /** API **/
    // Axios 갱신을 위한 계수기 state
    const[number, setNumber] = useState(0);
    // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);
    // Shell Search
    const[search, setSearch] = useState("")
    // 갱신 확인을 위한 단말 1개의 데이터
    const[nmsDevice, setNmsDevice] = useState({
        manageCrpId:'',
        manageCrpNm:'',
        crpNm:'',
        crpId:'',
        deviceId:'',
        vhcleNm:'',
        receivedData:'',
        insertData:'',
        mainKey:'',
        subKey:'',
        diff:'',
    });

    const timer = 1000;
    const token = '2886360e-1945-4f99-a1b0-07992bad8228';
    const urls = "http://testvms.commtrace.com:12041/restApi/nms/currentData";
    //const urls = "http://testvms.commtrace.com:12050/NMS/getCurrentReceived";
    const params = {detailMessage:false};

    const headers = {
        "Content-Type": `application/json;charset=UTF-8`,
        "Accept": "application/json",
        "Authorization": "Bearer "+ token,
        // 추가
        //"Access-Control-Allow-Origin": `http://localhost:3000`,
        //'Access-Control-Allow-Credentials':"true",
    };

    useEffect(() => {
        getData();
    }, []);


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
                        result.map(function (manageCrp){

                            //manageCrp 배열 내의 crp 풀기
                            manageCrp['nmsInfoList'].map(function (crp){

                                //Crp 배열 내의 Device 풀기
                                crp["nmsDeviceList"].map(function (device){


                                    //manageCrp,crp 정보 입력
                                    device["crpId"] = crp.crpId;
                                    device["crpNm"] = crp.crpNm;
                                    device["manageCrpId"] = manageCrp.manageCrpId;
                                    device["manageCrpNm"] = manageCrp.manageCrpNm;
                                    device["crpCount"] = manageCrp.crpCount;
                                    device["crpDeviceCount"] = crp.deviceCount;


                                    //device의 정보를 생성한 배열에 push
                                    deviceNmsList.push(device);

                                    //device 1개에서 변경되는 것을 확인하기 위해 생성
                                    if(device.deviceId == "01802737SKYBBF2"){
                                        setNmsDevice(device);
                                    }
                                });

                            });
                        });
                        //parsing 된 전체 device 정보 갱신
                        setNmsCurrent(deviceNmsList);
                    }else{

                    }

                });


            //2초에 1번
        },2000);

        //계수기 변경 때마다 동작하게 설정
    },[number]);


    useEffect( () => {

    }, [nmsCurrent]);

    useEffect(() => {
        console.log(nmsDevice)
    }, [nmsDevice.receivedData, nmsDevice.diff]);



    async function returnData(){


        const timer = 1000;
        const token = '2886360e-1945-4f99-a1b0-07992bad8228';
        const urls = "http://testvms.commtrace.com:12041/restApi/nms/currentData";
        //const urls = "http://testvms.commtrace.com:12050/NMS/getCurrentReceived";
        const params = {detailMessage:false};

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

    /*const getData = async () => {
        try{
            const data = await axios.get(urls);
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

     */

    const getData = useCallback(() => {
        setTimeout(() => {
            axios({
                method: "get",
                url: urls,
                headers: headers,
                params: params,
                responseType: "json"
            })
                .then((response) => response.data.response)
                .then((data => setNmsCurrent(data)))
                .then((response) => console.log(response));
        }, timer);
    });

    const maxTimeGap = useMemo(
        () => data.reduce((acc, curr) => Math.max(acc, curr.age), 0),
        [],
    );

    /*const warning = useMemo(

    )

     */

    const columns = useMemo(
        () => [
            {
                header: 'Manage Crp Id',
                accessorKey: 'manageCrpId',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 'FISHING_LIMIT', value: 'FISHING_LIMIT' },
                    { text: 'HWAJIN_TNI', value: 'HWAJIN_TNI' },
                    { text: 'HYUNGMANG_ASSOSIATION', value: 'HYUNGMANG_ASSOSIATION' },
                    { text: 'JEA_INFOCOM', value: 'JEA_INFOCOM' },
                    { text: 'LARGE_TRAWLER', value: 'LARGE_TRAWLER' },
                    { text: 'ORBCOMM', value: 'ORBCOMM' },
                    { text: 'SAND_PIT', value: 'SAND_PIT' },
                    { text: 'TAC_MANAGE_CRP', value: 'TAC_MANAGE_CRP' },
                ],
                filterVariant: 'select',
            },
            {
                header: 'Manage Crp Nm',
                accessorKey: 'manageCrpNm'
            },
            {
                header: 'Crp Id',
                accessorKey: 'crpId'
            },
            {
                header: 'Crp Nm',
                accessorKey: 'crpNm',
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableGrouping: false, //do not let this column be grouped
            },
            {
                header: 'Vhcle Number',
                accessorKey: 'vhcleNm',
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            },
            {
                header: 'Insert Date',
                accessorKey: 'insertDate',
            },
            /*
            {
                header: 'Age',
                accessorKey: 'age',
                aggregationFn: 'max', //show the max age in the group (lots of pre-built aggregationFns to choose from)
                //required to render an aggregated cell
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Oldest by{' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box
                            sx={{ color: 'info.main', display: 'inline', fontWeight: 'bold' }}
                        >
                            {cell.getValue()}
                        </Box>
                    </>
                ),
                Footer: () => (
                    <Stack>
                        Max Age:
                        <Box color="warning.main">{Math.round(maxAge)}</Box>
                    </Stack>
                ),
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 'Female', value: 'Female' },
                    { text: 'Male', value: 'Male' },
                ],
                filterVariant: 'select',
                //optionally, customize the cell render when this column is grouped. Make the text blue and pluralize the word
                GroupedCell: ({ cell, row }) => (
                    <Box sx={{ color: 'primary.main' }}>
                        <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
                    </Box>
                ),
            },
             */
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
                render:(data)=> <div style={{background:data.subKey<=2?"Green":"red"}}>{data.subKey}</div>,
            },
            {
                header: 'TimeGap',
                accessorKey: 'timeGap',
                filterVariant: 'range',
            },
            /*
            {
                header: 'Salary',
                accessorKey: 'salary',
                aggregationFn: 'mean', //show the max age in the group (lots of pre-built aggregationFns to choose from)
                //required to render an aggregated cell, show the average salary in the group
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Average by{' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            {cell.getValue()?.toLocaleString?.('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </Box>
                    </>
                ),
                //customize normal cell render on normal non-aggregated rows
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue()?.toLocaleString?.('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </>
                ),
                Footer: () => (
                    <Stack>
                        Average Salary:
                        <Box color="warning.main">
                            {averageSalary?.toLocaleString?.('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </Box>
                    </Stack>
                ),
            },
            */
        ],
        //[averageSalary, maxAge],
        [maxTimeGap],
    );


    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    exportButton: true,
                    showColumnFilters: true,
                    density: 'compact',
                    expanded: true, //expand all groups by default
                    grouping: ['manageCrpId', 'crpNm'], //an array of columns to group by by default (can be multiple)
                    pagination: { pageIndex: 0, pageSize: 100 },
                    sorting: [{ id: 'manageCrpId', desc: false }], //sort by state by default
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
            />


            <div className="data">
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={e => {
                    setSearch(e.target.value)}
                    }
                />
                {nmsCurrent
                    .filter(data =>{
                    if (search == "") {
                        return data
                    } else if (data.manageCrpId.toLowercase().includes(search.toLowerCase())){
                        return data
                    }
                }).
                map((data) => {
                return (
                    <p>
                        {data.manageCrpId} - {data.manageCrpNm} - {data.crpNm} - {data.crpId} - {data.deviceId} - {data.vhcleNm} - {data.receivedData} - {data.insertData} - {data.mainKey} - {data.subKey} - {data.diff}
                    </p>
                );
                })}
            </div>

            <div className="data1">
                {number}
            </div>
        </>
    );
};

export default Table;
