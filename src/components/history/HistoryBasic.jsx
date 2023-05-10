import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { HistoryData } from "./HistoryData";


const History = () => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                muiTableHeadCellFilterTextFieldProps: { placeholder: 'ID' },
            },
            {
                accessorKey: 'run',
                header: 'RUN',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 'ON', value: 'ON' },
                    { text: 'OFF', value: 'OFF' },
                ],
                filterVariant: 'select',
            },
            {
                accessorKey: 'deviceId',
                header: 'Device ID',
            },
            {
                accessorKey: 'event',
                header: 'Event',
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
                filterVariant: 'range',
            },
        ],
        [],
    );

    return (

        <MaterialReactTable
            columns={columns}
            data={HistoryData.map((data) => data)}
            initialState={{ showColumnFilters: true }} //show filters by default
            muiTableHeadCellFilterTextFieldProps={{
                sx: { m: '0.5rem 0', width: '100%' },
                variant: 'outlined',
            }}
        />

    );
};

export default History;