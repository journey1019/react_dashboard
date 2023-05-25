import React, {useState, useEffect, useMemo, useCallback} from 'react';
import MaterialReactTable from 'material-react-table';
import { MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/material';
import { Toolbar } from '@mui/material';
//import { format } from "date-fns";
// Table Refresh Button
//import RefreshIcon from '@mui/icons-material/Refresh';

import History from "../../components/history/History";
import Widget from "../widget/Widget";
import BasicMap from "../../components/map/BasicMap";
import Button from '@mui/material';
// API
import axios from 'axios';
import "./table.scss";

const Table = (props) => {
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

    const[feed, setFeed] = useState([]);

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        warning:0,
        danger:0,
        dead:0,
    });

    const [manageFilter, setManageFilter] = useState([]);



    //계수기를 통한 useEffect 주기별 동작 확인
    useEffect(()=>{
        // First table setting // 코드수정필요(임시)
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let deviceNmsList = [];
                    let locationList = [];
                    let running = 0;
                    let warning = 0;
                    let danger = 0;
                    let dead = 0;

                    let dangerObj = {};

                    let diffObj = {};

                    let manageList = [];

                    //result 배열 풀기
                    result.map(function (manageCrp){

                        const manage = {};

                        manage.text = manageCrp.manageCrpNm;
                        manage.value = manageCrp.manageCrpNm;

                        //manageCrp 배열 내의 crp 풀기
                        manageCrp['nmsInfoList'].map(function (crp){

                            //Crp 배열 내의 Device 풀기
                            crp["nmsDeviceList"].map(function (device){

                                const location = {};

                                //manageCrp,crp 정보 입력
                                device["crpId"] = crp.crpId;
                                device["crpNm"] = crp.crpNm;
                                device["manageCrpId"] = manageCrp.manageCrpId;
                                device["manageCrpNm"] = manageCrp.manageCrpNm;

                                // DeviceId, Location{latitude, longitude}
                                location.deviceId = device.deviceId;
                                location.latitude = device.latitude;
                                location.longitude = device.longitude;


                                // Widgets {running, warning, danger}
                                if(device.diff>device.dangerMin){
                                    device["status"] = 'danger';
                                    danger = danger+1;
                                }else if(device.diff>device.warningMin){
                                    device["status"] = 'warning';
                                    warning = warning+1;
                                }else{
                                    device["status"] = 'running';
                                    running = running+1;
                                }

                                //device의 정보를 생성한 배열에 push
                                deviceNmsList.push(device);
                                locationList.push(location);
                                console.log(device);
                            });
                        });
                        manageList.push(manage);
                    });
                    console.log(deviceNmsList);
                    //parsing 된 전체 device 정보 갱신
                    setNmsCurrent(deviceNmsList);

                    console.log(locationList);

                    setFeed(locationList);

                    setManageFilter(manageList);
                    console.log(manageList);

                    diffObj.danger = danger;
                    diffObj.warning = warning;
                    diffObj.running = running;

                    console.log(diffObj);
                    console.log(diffObj.info);

                    setDiffStatus(diffObj);
                }else{
                }
            });
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

    // Dashboard MapChage Props
    /*useEffect( () => {
        console.log(nmsCurrent)
        props.MapChange(feed)
        // Array
    }, [feed]);*/

    useEffect(() => {
        console.log(nmsCurrent)
        props.MapChange(nmsCurrent)
    }, [nmsCurrent]);

    useEffect(() => {
        props.WidgetCount(diffStatus)
    }, [diffStatus])

    // Status Button Click, type 값 출력
    useEffect(() => {
        console.log(props.statusClick);
    },[props.statusClick]);


    useEffect(() => {

        const setStatusData = [
            {id : 'status', value : props.statusClickValue}
        ];
        console.log(setStatusData);
        setColumnFilters(setStatusData);
    },[props.statusClickValue]);


    console.log(nmsCurrent);

    console.log(feed);

    // {danger:29, warning: 2, running: 254} _ Object
    console.log(diffStatus);
    console.log(diffStatus.warning);

    //axios function --> async
    async function returnData(){
        const timer = 1000;
        const token = 'b6bbe594-81d3-4327-90b7-b6c43627f85b';
        const urls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
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
                    console.log(returnVal);
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

    /*const handleRowClick = (row) => {
        console.log("Row Data:", row.original);
    };*/

    /*
    // Count Row
    const count = () => {
        nmsCurrent.filter(element => (nmsCurrent>10000) === element).length;
    }

    const countNm = useMemo(

        () => nmsCurrent.reduce((acc, curr) => count.number(acc, curr.diff), 0),
        [],
    );*/
    /** Table Status Color  _ Modify**/
    /*function colors(nmsDevice) {
        let options = {
            filtering: false,
            sorting: true,
            rowStyle: {
                backgroundColor: ""
            }
        }
        if(nmsDevice.diff < nmsDevice.warningMin) {
            options.rowStyle.backgroundColor="green";
        }
        else if (nmsDevice.diff < nmsDevice.dangerMin) {
            options.rowStyle.backgroundColor = "yellow";
        }
        else {
            options.rowStyle.backgroundColor = "red";
        }
    }*/
    
    /*function statusColor(nmsDevice) {
        let options = {
            filtering: false,
            sorting: true,
            rowStyle: {
                backgroundColor: ""
            }
        }
        switch(nmsDevice.diff) {
            case
        }
    }*/

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
                filterSelectOptions: manageFilter,
                    /*[
                    /!*!//{ text: '어선안전법VMS', value: '어선안전법VMS' },
                    { text: '화진T&I', value: '화진T&I' },
                    { text: '형망협회', value: '형망협회' },
                    { text: '제아정보통신', value: '제아정보통신' },
                    //{ text: '대형기선저인망수협', value: '대형기선저인망수협' },
                    { text: '코리아오브컴', value: '코리아오브컴' },
                    { text: '골재채취운반선', value: '골재채취운반선' },
                    { text: '서해안근해안강망연합회', value: '서해안근해안강망연합회' },*!/
                ],*/
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
                header: 'Time Gap',
                accessorKey: 'diff',
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
                filterFn: 'between',
                 // use betweenInclusive instead of between
                Cell: ({ cell, row }) => {
                    const red = row.original.dangerMin > 0 && cell.getValue(cell) > row.original.dangerMin;
                    const yellow = row.original.warningMin > 0 && cell.getValue(cell) > row.original.warningMin;
                    const green = row.original;
                    //console.log(row.original);
                    if(red) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(yellow) {
                        return <div style={{backgroundColor : "yellow", borderRadius:"5px", color: "black" }}>{cell.getValue(cell)}</div>;
                    }
                    else {
                        return <div style={{backgroundColor : "green", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                },
                /*filterSelectOptions: [
                    { text: 'Danger', value:({cell}) =>('red') },
                    { text: 'Warning', value:({cell}) =>('yellow') },
                    { text: 'Running', value:({cell}) =>('green') },
                ],*/
                //filterVariant: 'select',

                //columnFilterModeOptions: ['running', 'warning', 'danger', 'dead'],

                /*renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode }) => [
                    <MenuItem key="running" onClick={() => onSelectFilterMode('running')}>
                        <div>Running</div>
                    </MenuItem>,
                    <MenuItem
                        key="warning" onClick={() => onSelectFilterMode('warning')}>
                        <div>Warning</div>
                    </MenuItem>,
                    <MenuItem key="danger" onClick={() => onSelectFilterMode('danger')}>
                        <div>Danger</div>
                    </MenuItem>,
                ],*/
            },
            /*options={{
                    rowStyle: rowData => ({
                        backgroundColor:
                            this.state.selected &&
                            rowData.tableData.id === this.state.selectedRowId
                                ? this.state.c
                                : "#fff"
                    })
                }}*/
            {
                header: 'Parsing Time Gap',
                accessorKey: 'parseDiff',
                Cell: ({ cell, row }) => {
                    const red = row.original.dangerMin > 0 && cell.getValue(cell) > row.original.dangerMin;
                    const yellow = row.original.warningMin > 0 && cell.getValue(cell) > row.original.warningMin;
                    const green = row.original;
                    //console.log(row.original);
                    if(red) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(yellow) {
                        return <div style={{backgroundColor : "yellow", borderRadius:"5px", color: "black" }}>{cell.getValue(cell)}</div>;
                    }
                    else {
                        return <div style={{backgroundColor : "green", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                },
            },
            {
                header: 'Day Count',
                accessorKey: 'dayCount',
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
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
                header: 'Status',
                accessorKey: 'status',
                /*filterFn: 'equals',
                filterSelectOptions: [
                    { text: 'Running', value: 'running' },
                    { text: 'Warning', value: 'warning' },
                    { text: 'Danger', value: 'danger' },
                ],
                filterVariant: 'select',*/
                Cell: ({ cell }) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },

                /*Cell: ({ cell, row }) => {
                    const red = row.original.dangerMin > 0 && cell.getValue(cell) > row.original.dangerMin;
                    const yellow = row.original.warningMin > 0 && cell.getValue(cell) > row.original.warningMin;
                    const green = row.original;
                    //console.log(row.original);
                    if(red) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(yellow) {
                        return <div style={{backgroundColor : "yellow", borderRadius:"5px", color: "black" }}>{cell.getValue(cell)}</div>;
                    }
                    else {
                        return <div style={{backgroundColor : "green", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                },*/
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


    const [columnFilters, setColumnFilters] = useState([]);
    const[clickRow, setClickRow] = useState("");
    //const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        //do something when the row selection changes...
        console.info( clickRow );
        props.MapClick( clickRow );
        /*props.WidgetClick( clickRow );*/
    }, [clickRow]);

    const[isShow, setIsShow] = useState(false);

    /** Map Feed Data **/

    console.log(nmsCurrent);
    console.log(nmsDevice);

    // change Select Row, change background color
    const[selectedRow, setSelectedRow] = React.useState(null);
    const state = {
        columns: columns,
        data: [],
        tableRef: React.createRef(),
        selected: false,
        selectedRowId: null,
        c: "blue",
        currentRow: {}
    };

    return (
        <>
            <MaterialReactTable
                title="NMS Current Table"
                columns={columns}
                data={nmsCurrent}

                getRowId={(row) => row.deviceId} // row select
                onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
                onColumnFiltersChange={setColumnFilters}
                state={{ rowSelection,columnFilters}} //pass our managed row selection state to the table to use
                //state={{ rowSelection }} //pass our managed row selection state to the table to use
                /*options ={{
                    row => {
                        backgroundColor: (rowSelection === row.id) ? '#27bab4' : '#FFF'
                    }
                }
                }*/
                muiSelectProps={{ color: 'black' }}

                muiTableBodyRowProps={({ row }) => ({
                    //implement row selection click events manually
                    onClick: (event) =>{
                        setClickRow(row.id);
                    },
                    //style : {color : 'black'},
                    selected: rowSelection[row.id], // select result
                    //options : { color: 'black' },
                    sx: {
                        cursor: 'pointer',
                        /*"& .MuiTableRow-root" : {
                            backgroundColor: 'gray',
                        },*/
                    },
                })}
                /*onRowClick = {(row) =>{
                    check(row)
                }
                }*/

                /*onRowClick={(evt, selectedRow) =>
                    setSelectedRow(selectedRow.tableData.id)
                }
                options={{
                    rowStyle: (rowData) => ({
                        backgroundColor:
                            selectedRow === rowData.tableData.id ? "#6ABAC9" : "#000",
                    }),
                }}*/
                /*options={{
                    rowStyle: rowData => ({
                        backgroundColor:
                            this.state.selected &&
                            rowData.tableData.id === this.state.selectedRowId
                                ? this.state.c
                                : "#fff"
                    })
                }}
                onRowClick={(event, rowData) => {
                    // if the rowData.tableDate.id could be used on condidtional render
                    console.log(rowData);
                    this.setState({ currentRow: rowData });
                    console.log(this.state.tableRef);
                    if (rowData.tableData.id === this.state.selectedRowId) {
                        this.setState({ selected: false });
                        this.setState({ selectedRowId: null });
                    } else {
                        this.setState({ selected: true });
                        this.setState({ selectedRowId: rowData.tableData.id });
                    }
                }}*/
                /*actions={[
                    rowData => {
                        return hoveringOver !== "" && rowData.tableData.id === hoveringOver
                            ? { icon: DeleteIcon, hidden: false, onClick: handleEditClick }
                            : { hidden: true };
                    }
                ]}*/

                //enableRowSelection
                enableMultiRowSelection={false} // radio buttons instead of checkboxes
                //enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                enableColumnResizing
                /*enableFullScreenToggle={({"&.muiButtonBase-root"}) => ({
                    onClick : (event) => {

                    }
                }}*/
                enableGrouping // Column Grouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    exportButton: true,
                    filters: [
                        {
                            accessorKey: 'status',
                            value: 'danger',
                        },
                    ],
                    showColumnFilters: true,
                    density: 'compact', // interval
                    expanded: true, //expand all groups by default
                    /*grouping: ['manageCrpNm', 'crpNm'], //an array of columns to group by by default (can be multiple)*/
                    pagination: { pageIndex: 0, pageSize: 100 },
                    sorting: [
                        /*{ id: 'manageCrpNm', desc: false },*/
                        { id: 'diff', desc: true },
                    ], //sort by state by default
                    //grouping: ['status'], //an array of columns to group by by default (can be multiple)
                    //grouping: ['status', 'manageCrpNm],
                }}
                /*filterFns={{
                    diff: (cell, type, filterValue) => {
                        if( cell.getValue(type))
                        if(cell.getValue(cell) > row.original.dangerMin) {
                            return <div style={red}>{cell.getValue(cell)}</div>;
                        }
                        else if(cell.getValue(cell) > row.original.warningMin) {
                            return <div style={yellow}>{cell.getValue(cell)}</div>;
                        }
                        else {
                            return <div style={green}>{cell.getValue(cell)}</div>;
                        }
                        return cell.getValue(type) === filterValue;
                    },
                }}*/
                localization={{
                    filterCustomFilterFn: 'Custom Filter Fn',
                }}
                filterFns={{
                    customFilterFn: (cell, filterValue) => {
                        return cell.getValue(cell) === filterValue;
                    },
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                // When full-size, 크기 변경 & onClick 했을 때 event 적용
                muiTableHeadCellProps={{
                    sx: {
                        "& .MuiBox-root": {
                            //paddingTop : '70px',
                        },
                        "& .MuiDialog-container": {
                            paddingTop: '70px',
                        }
                    },
                }}
                /*muiTablePaperProps = {{
                    sx: {paddingTop: '70px'}
                }}*/
                //MuiDialog-paper
                /*muiTablePaperProps={{
                    sx: { paddingTop: '70px' },
                    id: onlyProps
                        ? 'relevant-column-instance-apis-table'
                        : 'column-instance-apis-table',
                }}*/
                /*muiTablePaperProps={{
                    sx: { mb: '1.5rem' },
                    id: onlyProps
                        ? 'relevant-column-instance-apis-table'
                        : 'column-instance-apis-table',
                }}*/
                //history = {this.state.response}
                //renderColumnFilterModeMenuItems
            />
            <hr />
            <History clickRow={clickRow}/>
        </>
    );
};

export default Table;