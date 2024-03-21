/* React */
import React, { useState, useEffect, useMemo } from "react";

/* Import */
import "./deviceHistory.scss";

/* MUI */
import {Grid, Box, Button, darken} from "@mui/material";
import MaterialReactTable from 'material-react-table';
import {ExportToCsv} from "export-to-csv";
import CircleIcon from "@mui/icons-material/Circle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";


// Device.jsx 에서 받아온 API
//
const DeviceHistory = (props) => {
    //console.log(props.HistorySnapShot)
    //console.log(props.HistorySnapShotVhc)

    const [nmsHistory, setNmsHistory] = useState([]);

    /* Row Selection _ Map && History Chart */
    const [rowSelection, setRowSelection] = useState({});


    useEffect(() => {

        let deviceNmsList = [];

        props.HistorySnapShotVhc.map(function(device){
            //console.log(device);

            /* messageDatas 항목생성 - String(문자열) -> JSON변환 */
            // messageData 항목을 JSON으로 변환하여 messageDatas 항목에 데이터 삽입
            try { // JSON으로 변환할 수 있는 경우
                device.messageDatas = JSON.parse(device.message_data)
                //console.log(device)
            } catch (e) { // 예외가 발생한 경우 _ messageDatas와 같은 형태로 데이터 항목들 생성
                device.messageDatas = {};
                device.messageDatas.Name = "";
                device.messageDatas.Fields = [];
            }
            /* Error 항목 세분화를 위한 구분 */
            // messageData _ Name & Field (SoftwareResetReason)
            if(device.messageDatas.Fields.length != 0) { // Fields 값 있는 단말기(JSON)
                device.messageDatas.Fields.map(function (fieldNameArray) {
                    // SoftwareResetReason 에러 구분
                    if (fieldNameArray.Name === 'softwareResetReason') {
                        device.messageDatas.SoftwareResetReason = fieldNameArray.Value;
                    } else{ // Fields Array 값은 있는데, Name이 softwareResetReason가 없는 단말기
                        device.messageDatas.SoftwareResetReason = 'Field는 있는데 soft없어~';
                    }
                })
            }
            else{ // Fields Array가 빈 값인 경우
                device.messageDatas.SoftwareResetReason = 'Field값 아예 없음 : []';
            }


            /* 장비 상태 기준 & 네트워크 상태 조건 설정 */
            // Running / Caution / Warning / Faulty
            let runningMin = device.maxPeriod;
            let cautionMin = runningMin * 1.5;
            let warningMin = runningMin * 3.0;
            let faultyMin = runningMin * 5.0;
            // parseDiff _ parsingTimegap 기준
            if ((faultyMin > 0 && device.parseDiff > faultyMin) || (device.softwareResetReason == 'Exception') || (device.SIN == '0' && device.MIN == '2')) {
                device["status"] = 'Faulty';
                device["statusDesc"] = 'MaxPeriod * 3.0 초과';
            } else if (warningMin > 0 && device.parseDiff > warningMin) {
                device["status"] = 'Warning';
                device["statusDesc"] = 'MaxPeriod * 1.5 초과 ~ 3.0 이하';
            } else if (cautionMin > 0 && device.parseDiff > cautionMin) {
                device["status"] = 'Caution';
                device["statusDesc"] = 'MaxPeriod * 1.0 초과 ~ 1.5 이하';
            } else {
                device["status"] = 'Running';
                device["statusDesc"] = 'MaxPeriod * 1.0 이하';
            }

            /* 장애 단말기 판별 설정 */
            if (device.status == 'faulty') {
                if (device.softwareResetReason == 'Exception') { //'LuaOTA'or'Exception'
                    device["statusDesc"] += ' / Software_Exception';
                }
                if (device.SIN == '0' && device.MIN == '2') {
                    device["statusDesc"] += ' / Protocol Error' //{SIN:0, MIN:2}
                }
            }

            deviceNmsList.push(device);
        })
        setNmsHistory(deviceNmsList);
    }, [props.HistorySnapShotVhc])

    //console.log(nmsHistory);


    const columns = useMemo(
        () => [
            {
                header: 'Received Date',
                accessorKey: 'received_date',
                enableColumnFilterModes: false,
            },
            {
                header: 'Insert Date',
                accessorKey: 'insert_date',
                enableColumnFilterModes: false,

            },
            {
                header: 'Parse Date',
                accessorKey: 'event_date',
                enableColumnFilterModes: false,
            },
            {
                header: 'Time Gap',
                accessorKey: 'diff',
                size: 100,
            },
            {
                header: 'Parsing Time Gap',
                accessorKey: 'parse_diff',
                size: 100,
            },
            {
                header: 'MaxPeriod',
                accessorKey: 'max_period',
                size: 100,
            },
            {
                header: 'Main Key',
                accessorKey: 'main_key',
                size: 100,
            },
            {
                header: 'Sub Key',
                accessorKey: 'sub_key',
                size: 100,
            },
            {
                header: 'Latitude',
                accessorKey: 'latitude',
                size: 100,
            },
            {
                header: 'Longitude',
                accessorKey: 'longitude',
                size: 100,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                size: 100,
                Cell: ({cell}) => {
                    return (
                        <div className={`cellWithStatus ${cell.getValue(cell)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
                enableColumnFilterModes: false,
            },
            {
                header: 'Status Desc',
                accessorKey: 'statusDesc',
                Cell: ({cell, row}) => {
                    if (row.original.statusDesc.includes('3.0 초과')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "dimgrey"
                        }}><CircleIcon sx={{ color: 'dimgrey'}}/>   {cell.getValue(cell)}</div>;
                    } else if (row.original.statusDesc.includes('1.5 초과')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "Crimson"
                        }}><CircleIcon sx={{ color: 'Crimson'}}/>   {cell.getValue(cell)}</div>;
                    } else if (row.original.statusDesc.includes('1.0 초과')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "Goldenrod"
                        }}><CircleIcon sx={{ color: 'Goldenrod'}}/>   {cell.getValue(cell)}</div>;
                    } else if (row.original.statusDesc.includes('1.0 이하')) {
                        return <div style={{
                            fontWeight: 'bold',
                            color: "Mediumseagreen"
                        }}><CircleIcon sx={{ color: 'Mediumseagreen'}}/>   {cell.getValue(cell)}</div>;
                    } else {
                        return null;
                    }
                },
                enableColumnFilterModes: false,
            },
            {
                header: 'Sat Cnr',
                accessorKey: 'io_json.satCnr',
                size: 100,
            },
            {
                header: 'Battery Status',
                accessorKey: 'io_json.batteryStatus',
                size: 100,
            },
            {
                header: 'SOS',
                accessorKey: 'io_json.sos',
                size: 100,
            },
            {
                header: 'Loading',
                accessorKey: 'io_json.loading',
                size: 100,
            },
            {
                header: 'Geofence',
                accessorKey: 'io_json.geofence',
                size: 100,
            },
            {
                header: 'Box Open',
                accessorKey: 'io_json.boxOpen',
                size: 100,
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'io_json.vehiclePower',
                size: 100,
            },
            {
                header: 'Pump Power',
                accessorKey: 'io_json.pumpPower',
                size: 100,
            },
            {
                header: 'Sat In View',
                accessorKey: 'io_json.satInView',
                size: 100,
            },
            {
                header: 'PowerVoltage',
                accessorKey: 'io_json.powerVoltage',
                size: 100,
            },
            {
                header: 'dIo1',
                accessorKey: 'io_json.dIo1',
                size: 100,
                enableColumnFilterModes: false,
            },
            {
                header: 'dIo2',
                accessorKey: 'io_json.dIo2',
                size: 100,
                enableColumnFilterModes: false,
            },
            {
                header: 'dIo3',
                accessorKey: 'io_json.dIo3',
                size: 100,
                enableColumnFilterModes: false,
            },
            {
                header: 'dIo4',
                accessorKey: 'io_json.dIo4',
                size: 100,
                enableColumnFilterModes: false,
            },
        ]
    )

    /* Export To CSV */
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };
    const csvExporter = new ExportToCsv(csvOptions);
    // Export All Data | Page | Select Row)
    const handleExportData = (table) => {
        csvExporter.generateCsv(nmsHistory.map(function (row) {
            let datas = {};
            table.getAllColumns().map(function (columns) {
                if (columns['id'] != 'mrt-row-select') {
                    if (typeof (row[columns.id]) != "undefined") { // id: 'mrt-row-select' == undefined (checkbox)
                        datas[columns.id] = row[columns.id]; // Table = API
                    } else {
                        datas[columns.id] = '';
                    }
                }
            })
            return datas;
        }));
    }


    /* History -> History Chart */
    useEffect(() => {
        props.NmsOneHistory(nmsHistory);
    }, [nmsHistory])

    //console.log(rowSelection)





    /* nms/History */
    /*useEffect(() => {
        if(typeof(props.nmsHistory.dataList) != 'undefined'){
            // All Data _ nmsHistory
            let deviceNmsList = [];

            props.nmsHistory.dataList.map(function(received){
                console.log(received);

                received["accessId"] = props.nmsHistory.accessId;
                received["deviceId"] = props.nmsHistory.deviceId;
                received["vhcleNm"] = props.nmsHistory.vhcleNm;

                // Object 순회 - ioJson
                if(received.ioJson != null) {
                    for (let key of Object.keys(received.ioJson)) {
                        const value = received.ioJson[key];
                        received[key] = value.toString() || '';
                    }
                } else{
                }
                deviceNmsList.push(received);
            })
            setNmsHistory(deviceNmsList);
        }
        else {
            console.log('nmsHistory Data Null')
        }
    }, [props.nmsHistory])*/


    return(
        <>
            <Grid className="input" container spacing={0}>

                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        History Table
                    </div>
                    <hr/>
                    <div className="device_diagnostic_construct_contained" style={{width: '100%'}}>
                        <MaterialReactTable
                            columns={columns}
                            data={nmsHistory}

                            positionToolbarAlertBanner="top"

                            renderTopToolbarCustomActions={({table, row}) => (
                                <Box
                                    sx={{display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap'}}
                                >
                                    {/* Export to CSV */}
                                    <Button // Export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                        color="primary"
                                        onClick={() => handleExportData(table)}
                                        startIcon={<FileDownloadIcon/>}
                                        variant="contained"
                                        size="small"
                                        style={{p: '0.5rem', flexWrap: 'wrap'}}
                                    >
                                        Export All Data
                                    </Button>
                                </Box>
                            )}



                            // RowId : Date(1.received/2.insert/event(parse)X)
                            getRowId={(row) => (row.received_date)} // Row ID = Received Date

                            enableRowSelection={true} // CheckBox
                            enableMultiRowSelection = {false} // 체크박스 대신 라디오 버트 사용
                            onRowSelectionChange={setRowSelection} // 내부 행 선택 상태를 자신의 상태에 연결
                            state={{rowSelection}}


                            enableColumnResizing // 열 사이즈 설정
                            enableGrouping // 열 그룹
                            enableStickyHeader
                            enableStickyFooter
                            enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                            localization={{ // 현지화(i18n) 언어지원
                                filterCustomFilterFn: 'Custom Filter Fn',
                            }}


                            initialState={{
                                density: 'compact',
                                expanded: true,
                                showColumnFilters: true,
                                exportButton: true, // 행 선택 버튼 _ 액션버튼
                                sorting: [ // 정렬 ['오름차순', '내림차순']
                                    { id: 'received_date', desc: false },
                                ],
                                columnPinning: {right: [ 'status' ]}, // 열 고정
                                columnVisibility: // 열 숨기기
                                    {
                                        insert_date: false,
                                        event_date: false,
                                        latitude: false,
                                        longitude: false,
                                        'io_json.sos': false,
                                        'io_json.boxOpen': false,
                                        'io_json.vehiclePower': false,
                                        'io_json.pumpPower': false,
                                        'io_json.dIo1' : false,
                                        'io_json.dIo2' : false,
                                        'io_json.dIo3' : false,
                                        'io_json.dIo4' : false,
                                    },
                            }}
                            displayColumnDefOptions={{
                                'mrt-row-numbers': {
                                    enableHiding: true,
                                }
                            }}

                            muiToolbarAlertBannerChipProps={{color: 'error'}}
                            // 테이블 테마 _ 줄바꿈
                            muiTablePaperProps={{
                                elevation: 0,
                                sx: {
                                    borderRadius: '0',
                                    border: '1px dashed #e0e0e0',
                                },
                            }}
                            muiTableBodyProps={{
                                sx: (theme) => ({
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: darken(theme.palette.background.default, 0.1),
                                    },
                                }),
                            }}
                        />
                    </div>
                </Box>
            </Grid>
        </>
    )
}

export default DeviceHistory;