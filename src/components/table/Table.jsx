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
import { darken } from '@mui/material';
import TableRow from "@material-ui/core/TableRow";
/*import MaterialReactTable, {
    type MRT_ColumnDef,
    type MRT_RowSelectionState,
} from 'material-react-table';*/
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

    const [manageFilterSet, setManageFilterSet] = useState([]);

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
                    let caution = 0;
                    let dead = 0;

                    let dangerObj = {};

                    let diffObj = {};

                    setManageFilterSet([]);

                    //result 배열 풀기
                    result.map(function (manageCrp){

                        const manage = {};


                        manage.text = manageCrp.manageCrpNm;
                        manage.value = manageCrp.manageCrpNm;

                        manageFilterSet.push(manage);

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
                                if(device.dangerMin > 0 && device.diff>device.dangerMin){
                                    device["status"] = 'warning';
                                    warning = warning+1;
                                }else if(device.warningMin > 0 && device.diff>device.warningMin){
                                    device["status"] = 'caution';
                                    caution = caution+1;
                                }else{
                                    device["status"] = 'running';
                                    running = running+1;
                                }

                                //device의 정보를 생성한 배열에 push
                                deviceNmsList.push(device);
                                locationList.push(location);
                                //console.log(device);
                            });
                        });

                    });

                    //console.log(deviceNmsList);
                    //parsing 된 전체 device 정보 갱신
                    setNmsCurrent(deviceNmsList);

                    //console.log(locationList);

                    setFeed(locationList);


                    diffObj.caution = caution;
                    diffObj.warning = warning;
                    diffObj.running = running;

                    //console.log(diffObj);

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

    // Refresh
    setTimeout(() => {
        setNumber(number + 1);
        if(number > 100){
            setNumber(0);
        }
        // 1분 Timeout
    }, 60000)
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
        //console.log(nmsCurrent)
        props.MapChange(nmsCurrent)
    }, [nmsCurrent]);

    useEffect(() => {
        props.WidgetCount(diffStatus)
    }, [diffStatus])
    //console.log(diffStatus);

    // Status Button Click, type 값 출력
    useEffect(() => {
        //console.log(props.statusClick);
    },[props.statusClick]);


    useEffect(() => {
        const setStatusData = [
            {id : 'status', value : props.statusClickValue}
        ];
        //console.log(setStatusData);
        setColumnFilters(setStatusData);
    },[props.statusClickValue]);


    //console.log(nmsCurrent);

    //console.log(feed);

    // {danger:29, warning: 2, running: 254} _ Object
    //console.log(diffStatus);
    //console.log(diffStatus.warning);


    //axios function --> async
    async function returnData(){
        const timer = 1000;
        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
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
                    //console.log(response);
                    //console.log(returnVal);
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

    // Table Columns Defined
    const columns = useMemo(
        () => [
            {
                header: 'Manage Crp Nm',
                accessorKey: 'manageCrpNm',
                filterFn: 'equals',
                filterSelectOptions: manageFilterSet,
                filterVariant: 'select',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Crp Nm',
                accessorKey: 'crpNm',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableGrouping: false, //do not let this column be grouped
                /*Cell: ({row}) =>(<button onClick={() => handleRowClick(row)}>View Details</button>)*/
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Vhcle Number',
                accessorKey: 'vhcleNm',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Time Gap',
                accessorKey: 'diff',
                size: 230,
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan'], //only allow these filter modes
                filterFn: 'between',
                // use betweenInclusive instead of between
                Cell: ({ cell, row }) => {
                    //console.log(row.original);
                    if(row.original.dangerMin > 0 && cell.getValue(cell) >= row.original.dangerMin) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(row.original.warningMin > 0 && cell.getValue(cell) >= row.original.warningMin) {
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
                size: 230,
                filterFn: 'between',
                Cell: ({ cell, row }) => {
                    //console.log(row.original);
                    if(row.original.dangerMin > 0 && cell.getValue(cell) >= row.original.dangerMin) {
                        return <div style={{backgroundColor : "red", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                    else if(row.original.warningMin > 0 && cell.getValue(cell) >= row.original.warningMin) {
                        return <div style={{backgroundColor : "yellow", borderRadius:"5px", color: "black" }}>{cell.getValue(cell)}</div>;
                    }
                    else {
                        return <div style={{backgroundColor : "green", borderRadius:"5px", color: "white" }}>{cell.getValue(cell)}</div>;
                    }
                },
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
            },
            {
                header: 'Day Count',
                accessorKey: 'dayCount',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Warning Min',
                accessorKey: 'warningMin',
                size: 230,
                filterFn: 'between',
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
            },
            {
                header: 'Danger Min',
                accessorKey: 'dangerMin',
                size: 230,
                filterFn: 'between',
                columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
            },
            {
                header: 'Insert Date',
                accessorKey: 'insertDate',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
                enableColumnFilterModes: false, //disable changing filter mode for this column
                //render:(data)=> <div style={{background:data.subKey<=2?"Green":"red"}}>{data.subKey}</div>,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                Cell: ({ cell }) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
                enableColumnFilterModes: false, //disable changing filter mode for this column
            },
        ],
        [],
    );

    const [columnFilters, setColumnFilters] = useState([]);

    const [clickRow, setClickRow] = useState("");

    const [rowSelection, setRowSelection] = useState({});
    //const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    useEffect(() => {
        //do something when the row selection changes...
        //console.info( clickRow );
        //console.log(clickRow);
        props.MapClick( clickRow );
        /*props.WidgetClick( clickRow );*/
    }, [clickRow]);

    // row click, background color 변경
    const [clickRowBackground, setClickRowBackground] = useState("");

    useEffect(() => {
        if(clickRow != "" && clickRow == setClickRow) {
            setClickRowBackground("rgba(204, 223, 255, 1)")
        }
        else{
            setClickRowBackground("rgba(0,0,0,0)")
        }
    }, [clickRowBackground])


    const [selectedRows, setSelectedRows] = useState([]);
    const handleRowClick = (row) => {
        if(clickRow.includes(row)) {
            setClickRow(clickRow.filter((clickRow) => clickRow != row));
        } else{
            setClickRow([...clickRow, row]);
        }
    }

    return (
        <>
            <MaterialReactTable
                title="NMS Current Table"
                columns={columns}
                data={nmsCurrent}

                /*options={{
                    rowStyle: rowData => {
                        let selected =
                            setClickRow &&
                            clickRow === rowData.id;
                        return {
                            backgroundColor: selected ? "#7f18ab" : "#FFF",
                            color: selected ? "#e0dd1f !important" : "#000"
                        };
                    }
                }}*/
                /*options={{
                    rowStyle: rowData => {
                        const selected =
                            this.state.selectedRow &&
                            this.state.selectedRow.tableData.id === rowData.tableData.id;
                        return {
                            backgroundColor: selected ? "#7f18ab" : "#FFF",
                            color: selected ? "#e0dd1f !important" : "#000"
                        };
                    }
                }}
                onRowClick={(evt, setClickRow) => this.setState({ selectedRow })}*/

                getRowId={(row) => row.deviceId} // row select
                onRowSelectionChange = {handleRowClick} //connect internal row selection state to your own
                onColumnFiltersChange={setColumnFilters}
                state={{ rowSelection, columnFilters }} //pass our managed row selection state to the table to use
                //state={{ rowSelection }} //pass our managed row selection state to the table to use
                /*options ={{
                    row.id => {
                        backgroundColor: (rowSelection === row.id) ? '#27bab4' : '#FFF'
                    }
                }
                }*/
                muiSelectProps={{ backgroundColor: clickRowBackground }}

                muiTableBodyRowProps={({ row }) => ({
                    //implement row selection click events manually
                    onClick: (event) =>{
                        /*setRowSelection((prev) => ({
                            ...prev,
                            [row.id] : !prev[row.id],
                        }))*/
                        //row.getToggleSelectedHandler();
                        setClickRow(row.id);
                        //setRowSelection(row.id);/handleRowClick(row.id);
                    },
                    // Click row 시 background 변경
                    //style : {backgroundColor : clickRowBackground},
                    //selected: clickRow[row.id],
                    selected: rowSelection[row.id], // select result
                    //options : { color: 'black' },
                    sx: {
                        cursor: 'pointer',
                        /*"& .MuiTableRow-root" : {
                            backgroundColor: clickRowBackground,
                        },*/
                        backgroundColor: handleRowClick === row.id ? 'yellow' : 'white',
                    },

                })}

                /*onRowClick={(evt, selectedRow) =>
                    setSelectedRow(selectedRow.tableData.id)
                }*/
                /*options={{
                    rowStyle: (row) => ({
                        backgroundColor:
                            clickRow === row.id ? "#6ABAC9" : "#000",
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

                enableMultiRowSelection={false} // radio buttons instead of checkboxes
                // Table selec column 추가
                //enableRowSelection // 라디오버튼 _ 다중클릭(?)
                //enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                enableColumnResizing
                /*enableFullScreenToggle={({"&.muiButtonBase-root"}) => ({
                    onClick : (event) => {

                    }
                }}*/
                enableGrouping // Column Grouping
                enableStickyHeader
                enableStickyFooter
                enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                localization={{
                    filterCustomFilterFn: 'Custom Filter Fn',
                }}
                filterFns={{
                    customFilterFn: (cell, filterValue) => {
                        return cell.getValue(cell) === filterValue;
                    },
                }}

                initialState={{
                    exportButton: true,
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
                // 줄바꿈 Theme
                muiTablePaperProps = {{
                    elevation: 0,
                    sx: {
                        borderRadius: '0',
                        border: '1px dashed #e0e0e0',
                    },
                }}
                // Table Theme
                muiTableBodyProps={{
                    sx: (theme) => ({
                        '& tr:nth-of-type(odd)': {
                            backgroundColor: darken(theme.palette.background.default, 0.1),
                        },
                        /*rowStyle: (row) => ({
                            backgroundColor: clickRow === setClickRow ? "#6ABAC9" : "#000",
                                //clickRowBackground,
                            //clickRow === setClickRow ? "#6ABAC9" : "#000",
                        }),*/
                        /*row.id => {
                            backgroundColor: (rowSelection === row.id) ? '#27bab4' : '#FFF'
                        }*/
                    }),

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