import React, { useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import { data } from "./makeData";


const Grid2 = () => {
    const averageSalary = useMemo(
        () => data.reduce((acc, curr) => acc + curr.salary, 0) / data.length,
        [],
    );

    const maxAge = useMemo(
        () => data.reduce((acc, curr) => Math.max(acc, curr.age), 0),
        [],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableGrouping: false,
            },
            {
                accessorKey: 'run',
                header: 'RUN',
                GroupedCell: ({ cell, row }) => (
                    <Box sx={{ color: 'primary.main' }}>
                        <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
                    </Box>
                ),
            },
            {
                accessorKey: 'deviceId',
                header: 'Device ID',
            },
            {
                accessorKey: 'event',
                header: 'Event',
                GroupedCell: ({ cell, row }) => (
                    <Box sx={{ color: 'primary.main' }}>
                        <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
                    </Box>
                ),
            },
            {
                accessorKey: 'eventTime',
                header: 'Event Time',
            },
            {
                accessorKey: 'city',
                header: 'City',
            },
            {
                accessorKey: 'country',
                header: 'Country',
            },
            {
                accessorKey: 'cellSign',
                header: 'Cell Sign',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 'Good', value: 'Good' },
                    { text: 'Bad', value: 'Bad' },
                ],
                filterVariant: 'select',
                GroupedCell: ({ cell, row }) => (
                    <Box sx={{ color: 'primary.main' }}>
                        <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
                    </Box>
                ),
            },
            {
                accessorKey: 'doorBat',
                header: 'Door Bat',
            },
            {
                accessorKey: 'cellGen',
                header: 'Cell Gen',
            },
            {
                accessorKey: 'geofenceRevision',
                header: 'Geofence Revision',
                aggregationFn: 'max',
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
        ],
        [],
    );


    return (
        <div className="table">
            <h5>NMS Data</h5>
            <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    density: 'compact',
                    expanded: true, //expand all groups by default
                    grouping: ['state'], //an array of columns to group by by default (can be multiple)
                    pagination: { pageIndex: 0, pageSize: 20 },
                    sorting: [{ id: 'state', desc: false }], //sort by state by default
                }}
                muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                muiTableContainerProps={{ sx: { maxHeight: 700 } }}
            />
        </div>
    );
};

export default Grid2;