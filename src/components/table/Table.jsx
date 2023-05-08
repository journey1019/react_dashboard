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

    const[nmsCurrent, setNmsCurrent] = useState(null);

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


    useEffect(()=>{
        getData();
    });

    const getData = useCallback(() => {
        setTimeout(() => {
            axios({
                method: "get",
                url: urls,
                headers: headers,
                params: params,
                responseType: "json"
            })
                .then(response => {
                    setStates(response.data.response);
                });
        }, timer);
    });

    function setStates(data){
        console.log(data);
        setNmsCurrent(data);
    }


    useEffect(() => {
        getData();
    }, []);

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
    );
};

export default Table;
