import React, { useState, useEffect, useMemo } from 'react';

import MaterialReactTable from "material-react-table";
import {darken} from "@mui/material";

const DeviceNmsHistory = (props) => {
    const { nmsHistory, ...otherProps } = props;
    console.log(nmsHistory);

    // All Nms History Data
    const nmsHistoryTableData = nmsHistory.dataList;

    // Table Columns
    const columns = useMemo(
        () => [
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            },
            {
                header: 'Message Date',
                accessorKey: 'messageDate',
            },
            {
                header: 'Message Data',
                accessorKey: 'messageData',
            },
            {
                header: 'Main Key',
                accessorKey: 'mainKey',
            },
            {
                header: 'Sub Key',
                accessorKey: 'subKey',
            },


            /* Diag*/
            /*{
                header: 'Sub Key',
                accessorKey: 'subKey',
            },
            {
                header: 'Sat Cnr',
                accessorKey: 'ioJson.satCnr',
            },
            {
                header: 'SatCutOffCount',
                accessorKey: 'ioJson.satCutOffCount',
            },
            {
                header: 'SatOnTime',
                accessorKey: 'ioJson.satOnTime',
            },
            {
                header: 'St6100On',
                accessorKey: 'ioJson.st600On',
            },*/
            /* IoJson*/
            /*{
                header: 'Battery Status',
                accessorKey: 'ioJson.batteryStatus',
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'ioJson.vehiclePower',
            },
            {
                header: 'Geofence',
                accessorKey: 'ioJson.Geofence',
            },
            {
                header: 'PumpPower',
                accessorKey: 'ioJson.PumpPower',
            },*/
        ]
    );


    return(
        <>
            {nmsHistory && Object.keys(nmsHistory).length > 0 ? (
                // nmsHistory가 존재하고 길이가 0보다 큰 경우
                // 여기에 해당하는 코드 작성
                <>
                    <MaterialReactTable
                        columns={columns}
                        data={nmsHistoryTableData}
                        style={{ overflowX: 'auto'}}

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
                                { id: 'parseDiff', desc: true },
                            ],
                            columnPinning: {left: [ 'mrt-row-actions' ], right: [ 'status' ]}, // 열 고정
                            columnVisibility: // 열 숨기기
                                {
                                    mainKey: false,
                                    subKey: false,
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
                </>
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
