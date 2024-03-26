/* React */
import React, { useState, useEffect, useMemo } from "react";


/** K.O IoT GWY URL */
import { koIotUrl } from 'config';


/* Import */
import "./getSendStatus.scss";
import ReturnRequest from "../../../components/modules/ReturnRequest";
import MaterialReactTable from "material-react-table";

import {ExportToCsv} from "export-to-csv";
import dayjs from "dayjs";

/* MUI */
import {Box, Dialog, Tooltip, Button, IconButton, Typography, TextField, darken} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

/* Icon */
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from "@mui/icons-material/FileDownload";


const GetSendStatus = () => {
    const session = JSON.parse(sessionStorage.getItem("userInfo"));
    const [sendMsgOpen, setSendMsgOpen] = useState(false);

    // Dialog 열기 & 닫기 함수
    const openDialog = () => {
        setSendMsgOpen(true);
    };
    const closeDialog = () => {
        setSendMsgOpen(false);
    }
    // 버튼 클릭 시 권한에 따른 동작 함수
    const handleButtonClick = () => {
        if (session.roleId === 'SUPER_ADMIN' || session.roleId === 'ADMIN') {
            openDialog(); // 권한이 있는 경우 Dialog 열기
        } else {
            // 권한이 없는 경우 alert 띄우기
            alert('해당 페이지는 관리자만 접속이 가능합니다.');
        }
    };


    /** Variant */
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'days')); // 어제
    const [endDate, setEndDate] = useState(dayjs()); // 오늘

    const sendStatusUrls = koIotUrl + "/send/getSendStatus";
    const sendStatusParams = {startDate: startDate.format('YYYY-MM-DDTHH'), endDate: endDate.format('YYYY-MM-DDTHH')};
    const [sendStatus, setSendStatus] = useState([]);

    // API 호출 함수
    const refreshSendStatus = () => {
        ReturnRequest(sendStatusUrls, sendStatusParams).then(msg => {
            if (msg != null) {
                msg.dataList.map(function(list){
                    if(list.isEndCheck === true){
                        list.isEndChecks = "true"
                    } else{
                        list.isEndChecks = "false";
                    }
                });
                setSendStatus(msg.dataList);
            }
        });
    };

    // 버튼 클릭 시 이벤트 핸들러
    const handleRefreshClick = () => {
        refreshSendStatus(); // API 호출 함수 실행
    };

    useEffect(() => {
        // 페이지 로드될 때 최초 한 번 API 호출
        refreshSendStatus();
    }, [startDate, endDate]);

    const columns = useMemo(
        () => [
            {
                header: 'API Access ID(SYS)',
                accessorKey: 'apiAccessId',
                enableColumnFilterModes: false,
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableColumnFilterModes: false,
            },
            {
                header: 'MSG 발신 일자',
                accessorKey: 'createDate',
                enableColumnFilterModes: false,
            },
            {
                header: 'MSG 수신 일자',
                accessorKey: 'statusDate',
                enableColumnFilterModes: false,
            },
            {
                header: 'MSG 수신 체크',
                accessorKey: 'isEndChecks',
                enableColumnFilterModes: false,
            },
            {
                header: 'MSG 응답 체크',
                accessorKey: 'sendingCheck',
                enableColumnFilterModes: false,
            },
            {
                header: 'Payload',
                accessorKey: 'payloadName',
                enableColumnFilterModes: false,
            },
            {
                header: 'MSG ID',
                accessorKey: 'messageId',
                enableColumnFilterModes: false,
            },
            {
                header: 'Submit Row Index',
                accessorKey: 'submitRowIndex',
                enableColumnFilterModes: false,
            },
            {
                header: 'User ID',
                accessorKey: 'userId',
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
    const handleExportData = (table) => {
        csvExporter.generateCsv(sendStatus.map(function (row) {
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

    return(
        <>
            <Tooltip title="Send Msg" >
                <IconButton onClick={handleButtonClick}>
                    {/*<FcSmartphoneTablet size="24" />*/}
                    <SendIcon fontSize="large"/>
                </IconButton>
            </Tooltip>

            <Dialog
                open={sendMsgOpen}
                onClose={closeDialog}
                fullScreen
                maxWidth="xl"
                sx={{position: 'absolute', display: 'flex', alignItems : 'center', justifyContent : 'center'}}
            >
                <Box sx={{ width: '100vmax', p: 2, backgroundColor: '#FAFBFC', position: 'relative' }}>
                    <Box className="send_construct">
                        <Box className="send_body">
                            <Box className="send_body_top">
                                <Box className="send_title">
                                    <Typography variant="h5" >Mobile Terminated Messages</Typography>
                                    <Typography variant="subtitle1">[ 원격명령을 보낸 메세지 히스토리 확인 ]</Typography>
                                </Box><br/>
                                <Box className="send_body_input" >
                                    <Box sx={{pr: 3}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%', pr: 2}}>
                                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']} sx={{minWidth: 'min-content'}}>
                                                <DateTimePicker
                                                    label="Start Date"
                                                    value={startDate}
                                                    onChange={(newValue) => setStartDate(newValue)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{pr: 3}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%', pr: 2}}>
                                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']} sx={{minWidth: 'min-content'}}>
                                                <DateTimePicker
                                                    label="End Date"
                                                    value={endDate}
                                                    onChange={(newValue) => setEndDate(newValue)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{ w: 1, display: 'flex', justifyContent: 'flex-end'}}>
                                        <Tooltip title="Refresh">
                                            <Button variant="contained" color="error" size="large" onClick={handleRefreshClick} sx={{ pr: 3}}><RefreshIcon /></Button>
                                        </Tooltip>
                                    </Box>
                                    <Box sx={{ w: 1, display: 'flex', justifyContent: 'flex-end'}}>
                                        <Tooltip title="Close">
                                            <Button onClick={closeDialog} size="large" color="error" variant="outlined"><CloseIcon/></Button>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box><br/>
                            <MaterialReactTable
                                data={sendStatus}
                                columns={columns}

                                positionToolbarAlertBanner="top"

                                renderTopToolbarCustomActions={({table, row}) => (
                                    <Box
                                        sx={{display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap'}}
                                    >
                                        {/* Export to CSV */}
                                        <Button // Export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                            color="error"
                                            onClick={() => handleExportData(table)}
                                            startIcon={<FileDownloadIcon/>}
                                            variant="contained"
                                            size="small"
                                            style={{p: '0.5rem', flexWrap: 'wrap'}}
                                        >
                                            Export All
                                        </Button>
                                    </Box>
                                )}
                                columnResizeMode
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
                                    density: 'comfortable', // 행 간격 ['spacious' / 'comfortable' / 'compact']
                                    expanded: true, // 모든 그룹 확장
                                    showColumnFilters: true, // 각 열 필터 확장
                                    exportButton: true, // 행 선택 버튼 _ 액션버튼
                                    pagination: { pageIndex: 0, pageSize: 10 }, // 페이지
                                    sorting: [ // 정렬 ['오름차순', '내림차순']
                                        { id: 'createDate', desc: true },
                                    ],

                                }}
                                muiToolbarAlertBannerChipProps={{color: 'primary'}}
                                muiTableContainerProps={{sx: {m: '0.5rem 0', maxHeight: 700}}}

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
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export default GetSendStatus;