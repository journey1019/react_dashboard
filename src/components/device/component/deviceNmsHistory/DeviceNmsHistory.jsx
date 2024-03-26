import React, { useState, useEffect, useMemo } from 'react';

import MaterialReactTable from "material-react-table";
import {Box, Button, darken} from "@mui/material";
import {ExportToCsv} from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const DeviceNmsHistory = (props) => {
    const { nmsHistory, ...otherProps } = props;
    console.log(nmsHistory);

    // Session 에서 가져옴
    const userInfo = sessionStorage.getItem('userInfo');
    const sessionUserInfo = JSON.parse(userInfo);



    // All Nms History Data
    /*const nmsHistoryTableData = nmsHistory.dataList;

    // messageData -> messageDatas(string->Json)
    if(typeof(nmsHistory.dataList) != "undefined") {
        nmsHistoryTableData.map(function(data) {
            data.messageDatas = data.messageData;
            if(data.mainKey=='0' || data.mainKey=='16') {
                data.messageDatas = JSON.parse(data.messageDatas);
                // SoftwareResetReason
                if(data.messageDatas.Fields.length > 0) {
                    data.messageDatas.Name = data.messageDatas.Name;
                    const softwareResetReasonObj = data.messageDatas.Fields.find(obj=>obj.Name === 'softwareResetReason');
                    if(softwareResetReasonObj) {
                        data.messageDatas.SoftwareResetReason = softwareResetReasonObj.Value;
                    }
                    else{
                        data.messageDatas.SoftwareResetReason = '';
                    }
                }
                else{
                    data.messageDatas.Name = data.messageDatas.Name;
                    data.messageDatas.SoftwareResetReason = '';
                }

            }
            else {
                data.messageDatas = {};
                data.messageDatas.Name = "";
                data.messageDatas.Fields = [];
                data.messageDatas.SoftwareResetReason = "";
            }
        })
    }*/
    //console.log(nmsHistoryTableData)

    const nmsHistoryTableData = nmsHistory.dataList || [];
    const { deviceId, vhcleNm } = nmsHistory;
    const dataListWithDeviceIdAndVhcleNm = nmsHistoryTableData.map(item => ({
        ...item,
        deviceId: deviceId,
        vhcleNm: vhcleNm
    }))
    console.log(dataListWithDeviceIdAndVhcleNm)

    dataListWithDeviceIdAndVhcleNm.forEach(data => {
        data.messageDatas = data.messageData;
        if(data.mainKey=='0' || data.mainKey=='16') {
            data.messageDatas = JSON.parse(data.messageDatas);
            // SoftwareResetReason
            if(data.messageDatas.Fields.length > 0) {
                data.messageDatas.Name = data.messageDatas.Name;
                const softwareResetReasonObj = data.messageDatas.Fields.find(obj => obj.Name === 'softwareResetReason');
                data.messageDatas.SoftwareResetReason = softwareResetReasonObj ? softwareResetReasonObj.Value : '';
            } else {
                data.messageDatas.Name = data.messageDatas.Name;
                data.messageDatas.SoftwareResetReason = '';
            }
        } else {
            data.messageDatas = {};
            data.messageDatas.Name = "";
            data.messageDatas.Fields = [];
            data.messageDatas.SoftwareResetReason = "";
        }
    });

    console.log(dataListWithDeviceIdAndVhcleNm)

    let columns = useMemo(() => {
        if(sessionUserInfo && (sessionUserInfo.roleId === 'SUPER_ADMIN' || sessionUserInfo.roleId === 'ADMIN')) {
            return[
                {
                    header: 'Device ID',
                    accessorKey: 'deviceId',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Device Alias',
                    accessorKey: 'vhcleNm',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Rcvd Date',
                    accessorKey: 'receivedDate',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'MSG ID',
                    accessorKey: 'messageId',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Main Key',
                    accessorKey: 'mainKey',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Sub Key',
                    accessorKey: 'subKey',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Event',
                    accessorKey: 'messageDatas.Name',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'SW Reset Reason',
                    accessorKey: 'messageDatas.SoftwareResetReason',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Payload',
                    accessorKey: 'messageData',
                    enableColumnFilterModes: false,
                },
                {
                    header: '수집주기(분)',
                    accessorKey: 'ioJson.period',
                    size: 100,
                    enableColumnFilterModes: false,
                },
                {
                    header: '위성연결시간',
                    accessorKey: 'ioJson.satOnTime',
                    enableColumnFilterModes: false,
                },
                {
                    header: '신호/잡음(dB)',
                    accessorKey: 'ioJson.satCnr',
                    enableColumnFilterModes: false,
                },
                {
                    header: '위성끊김횟수',
                    accessorKey: 'ioJson.satCutOffCount',
                    enableColumnFilterModes: false,
                },
                {
                    header: '단말가동시간',
                    accessorKey: 'ioJson.st6100On',
                    enableColumnFilterModes: false,
                },
                {
                    header: '리셋횟수',
                    accessorKey: 'ioJson.powerOnCount',
                    enableColumnFilterModes: false,
                },
                {
                    header: '0분',
                    accessorKey: 'ioJson.cnrMap.0',
                    size: 100,
                    enableColumnFilterModes: false,
                },
                {
                    header: '15분',
                    accessorKey: 'ioJson.cnrMap.1',
                    size: 100,
                    enableColumnFilterModes: false,
                },
                {
                    header: '30분',
                    accessorKey: 'ioJson.cnrMap.2',
                    size: 100,
                    enableColumnFilterModes: false,
                },
                {
                    header: '45분',
                    accessorKey: 'ioJson.cnrMap.3',
                    size: 100,
                    enableColumnFilterModes: false,
                },
            ]
        }
        else if(sessionUserInfo && sessionUserInfo.roleId === 'NMS_USER') {
            return[
                {
                    header: 'Device ID',
                    accessorKey: 'deviceId',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Device Alias',
                    accessorKey: 'vhcleNm',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Rcvd Date',
                    accessorKey: 'receivedDate',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Main Key',
                    accessorKey: 'mainKey',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Sub Key',
                    accessorKey: 'subKey',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Event',
                    accessorKey: 'messageDatas.Name',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Payload',
                    accessorKey: 'messageData',
                    enableColumnFilterModes: false,
                },
            ]
        }
        else {
            return []; // 기본적으로 빈 배열을 반환하거나 다른 기본값을 반환할 수 있음
        }
    }, [sessionUserInfo])


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

    // Function (Export All Data | Page | Select Row)
    const handleExportData = (table) => {
        csvExporter.generateCsv(dataListWithDeviceIdAndVhcleNm.map(function (row) {
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
    const handleExportRows = (table) => {    // Select Data
        const rows = table.getRowModel().rows;
        csvExporter.generateCsv(rows.map((row) => {
            let datas = {};
            table.getAllColumns().map(function (columns) { // columns == Table_id 값
                if (columns['id'] != 'mrt-row-select') {
                    if (typeof (row.getValue(columns.id)) != "undefined") { // id: 'mrt-row-select' == undefined (checkbox)
                        datas[columns.id] = row.getValue(columns.id); // Table = API
                    } else {
                        datas[columns.id] = '';
                    }
                }
            });
            return datas;
        }));
    };
    const handleExportSelected = (table) => {
        const selected = table.getSelectedRowModel().rows;
        csvExporter.generateCsv(selected.map((row) => {
            let datas = {};
            table.getAllColumns().map(function (columns) {
                if (columns['id'] != 'mrt-row-select') {
                    if (typeof (row.getValue(columns.id)) != "undefined") {
                        datas[columns.id] = row.getValue(columns.id);
                    } else {
                        datas[columns.id] = '';
                    }
                }
            })
            return datas;
        }))
    }
    console.log(nmsHistoryTableData)


    return(
        <>
            {nmsHistory && Object.keys(nmsHistory).length > 0 ? (
                // nmsHistory가 존재하고 길이가 0보다 큰 경우
                // 여기에 해당하는 코드 작성
                <div style={{maxWidth: 'calc(100vmax - 50px)'}}>
                    <MaterialReactTable
                        columns={columns}
                        data={dataListWithDeviceIdAndVhcleNm}
                        style={{ overflowX: 'auto'}}

                        posisionToolbarAlertBanner="top"

                        renderTopToolbarCustomActions={({table, row}) => (
                            <Box
                                sx={{display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap'}}
                            >
                                {/* Export to CSV */}
                                <Button // Export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                    /*color="primary"*/
                                    color="error"
                                    onClick={() => handleExportData(table)}
                                    startIcon={<FileDownloadIcon/>}
                                    variant="contained"
                                    size="small"
                                    style={{p: '0.5rem', flexWrap: 'wrap'}}
                                >
                                    Export All Data
                                </Button>
                                <Button //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                                    disabled={table.getRowModel().rows.length === 0}
                                    onClick={() => handleExportRows(table)}
                                    //onClick={() => handleExportRows(table.getRowModel().rows)}
                                    startIcon={<FileDownloadIcon/>}
                                    variant="contained"
                                    size="small"
                                    color="error"
                                >
                                    Export Page Rows
                                </Button>
                                {/*<Button
                                    color="error"
                                    disabled={
                                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    //only export selected rows
                                    onClick={() => handleExportSelected(table)}
                                    //onClick={() => handleExportSelected(table.getSelectedRowModel().rows)}
                                    startIcon={<FileDownloadIcon/>}
                                    variant="contained"
                                    size="small"
                                >
                                    Export Selected Rows
                                </Button>*/}

                            </Box>
                        )}


                        enableColumnResizing // 열 사이즈 설정
                        enableGrouping // 열 그룹
                        enableStickyHeader
                        enableStickyFooter
                        enableColumnFilterModes //enable changing filter mode for all columns unless explicitly disabled in a column def
                        localization={{ // 현지화(i18n) 언어지원
                            filterCustomFilterFn: 'Custom Filter Fn',
                        }}
                        filterFns={{
                            customFilterFn: (cell, filterValue) => {
                                return cell.getValue(cell) === filterValue;
                            },
                            "* .MuiInputBase-fullWidth": {
                                minWidth: '50px',
                            },
                        }}

                        initialState={{
                            density: 'compact', // 행 간격 ['spacious' / 'comfortable' / 'compact']
                            expanded: true, // 모든 그룹 확장
                            showColumnFilters: true, // 각 열 필터 확장
                            exportButton: true, // 행 선택 버튼 _ 액션버튼
                            pagination: { pageIndex: 0, pageSize: 20 }, // 페이지
                            sorting: [ // 정렬 ['오름차순', '내림차순']
                                { id: 'receivedDate', desc: false },
                            ],
                            columnPinning: {left: [ 'mrt-row-actions' ], right: [ 'status' ]}, // 열 고정
                            columnVisibility: // 열 숨기기
                                {
                                    mainKey: true,
                                    subKey: true,
                                    receivedDate: true,
                                },
                        }}

                        muiToolbarAlertBannerChipProps={{color: 'primary'}}
                        muiTableContainerProps={{sx: {m: '0.5rem 0', maxHeight: 700, width: '100%'}}}

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
            ) : (
                // nmsHistory가 존재하지 않거나 길이가 0인 경우
                // 여기에 해당하는 코드 작성
                <>
                    조회된 데이터가 없습니다
                </>
            )}
        </>
    )
}


export default DeviceNmsHistory;
