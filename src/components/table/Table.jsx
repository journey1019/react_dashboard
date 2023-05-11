import React, {useState, useEffect, useMemo, useCallback} from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Stack } from '@mui/material';
//import { format } from "date-fns";
// Table Refresh Button
//import RefreshIcon from '@mui/icons-material/Refresh';

// API
import axios from 'axios';



const Table = () => {

    /** API **/
        // Axios 갱신을 위한 계수기 state
    const[number, setNumber] = useState(0);
    // API로 들어온 데이터(NmsCurrent) state
    const[nmsCurrent, setNmsCurrent] = useState([]);

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

    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{

        // First table setting // 코드수정필요(임시)
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


            //10분에 1번
        },100000);
        return () => {
            clearTimeout(nmsCurrent);
        }

        //계수기 변경 때마다 동작하게 설정
    },[number]);

    // 전체 데이터 변경 확인
    // 현재 nmsCurrent 값은 배열 --> useState에서 데이터 수신 시 마다 갱신을 확인하여
    // 변경으로 간주됨
    useEffect( () => {

        //console.log(nmsCurrent)

        // Array
    }, [nmsCurrent]);

    // device 1개에 대한 변경 확인
    useEffect(() => {
        console.log(nmsDevice)

        //useState 내의 수신시간, 시간 차 마다 갱신되게 설정
    }, [nmsDevice.receivedData, nmsDevice.diff]);


    //axios function --> async
    async function returnData(){
        const timer = 1000;
        const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
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

    /*// Status Row Count
    const countNumber = useMemo(
        () => nmsCurrent.reduce((acc, curr) => rowCount(acc, curr.diff), 0), [],
    );*/

    // Optionally
    const [rowSelection, setRowSelection] = useState({});

    const handleRowClick = (row) => {
        console.log("Row Data:", row.original);
    };

    /*
    // Count Row
    const count = () => {
        nmsCurrent.filter(element => (nmsCurrent>10000) === element).length;
    }

    const countNm = useMemo(

        () => nmsCurrent.reduce((acc, curr) => count.number(acc, curr.diff), 0),
        [],
    );*/



    // Table Columns Defined
    const columns = useMemo(
        () => [
            /*{
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
            },*/
            {
                header: 'Manage Crp Nm',
                accessorKey: 'manageCrpNm',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: '어선안전법VMS', value: '어선안전법VMS' },
                    { text: '화진T&I', value: '화진T&I' },
                    { text: '형망협회', value: '형망협회' },
                    { text: '제아정보통신', value: '제아정보통신' },
                    { text: '대형기선저인망수협', value: '대형기선저인망수협' },
                    { text: '코리아오브컴', value: '코리아오브컴' },
                    { text: '골재채취운반선', value: '골재채취운반선' },
                    { text: '서해안근해안강망연협회', value: '서해안근해안강망연협회' },
                ],
                filterVariant: 'select',
            },
            /*{
                header: 'Crp Id',
                accessorKey: 'crpId'
            },*/
            {
                header: 'Crp Nm',
                accessorKey: 'crpNm',
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableGrouping: false, //do not let this column be grouped
                /*Cell: ({row}) =>(<button onClick={() => handleRowClick(row)}>View Details</button>)*/
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
                //render:(data)=> <div style={{background:data.subKey<=2?"Green":"red"}}>{data.subKey}</div>,
            },
            {
                header: 'Warning Min',
                accessorKey: 'warningMin',
            },
            {
                header: 'Danger Min',
                accessorKey: 'dangerMin',
            },
            {
                header: 'Time Gap',
                accessorKey: 'diff',
                filterVariant: 'range',
                aggregationFn: 'number',
                /*AggregatedCell: ({ cell, table }) => (
                    <>
                        Number by {' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header} : {' '}
                        <Box
                            sx={{ color: 'info.main', display: 'inline', fontWeight: 'bold' }}
                        >
                            {cell.getValue()}
                        </Box>
                    </>
                ),
                Footer: () => (
                    <Stack>
                        All Count:
                        <Box color="Warning.main">{count.round(countNm)}</Box>
                    </Stack>
                )*/
                /*
                // row data count
                aggregationFn: 'number', // 불완전한 Network 장비 개수
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Oldest by {' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box sx = {{ color: 'info.main', display: 'inline', fontWeight: 'bold'}}>
                            {cell.getValue()}
                        </Box>
                    </>
                ),
                Footer: () => (
                    <Stack>
                        Number:
                        <Box color="warning.main">{Math.round(number)}</Box>
                    </Stack>
                ),*/
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
        //[maxTimeGap],
        [],
    );

/*

    const [clickedEvent, setClickedEvent] = useState('');

    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
*/



    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={nmsCurrent}

                getRowId={(row) => row.deviceId} // row select
                muiTableBodyRowProps={({ row }) => ({
                    //implement row selection click events manually
                    onClick: () =>
                        setRowSelection((prev) => ({
                            ...prev,
                            [row.id]: !prev[row.id],
                        })),
                    selected: rowSelection[row.id],
                    sx: {
                        cursor: 'pointer',
                    },
                })}
                state={{ rowSelection }}

                enableMultiRowSelection={false} // radio buttons instead of checkboxes
                enableColumnResizing
                enableGrouping // Column Grouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    exportButton: true,
                    showColumnFilters: true,
                    density: 'compact', // interval
                    expanded: true, //expand all groups by default
                    /*grouping: ['manageCrpNm', 'crpNm'], //an array of columns to group by by default (can be multiple)*/
                    pagination: { pageIndex: 0, pageSize: 100 },
                    sorting: [{ id: 'manageCrpNm', desc: false }], //sort by state by default
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
            />
        </>
    );
};

export default Table;