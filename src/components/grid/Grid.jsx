import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { GridData } from "./GridData";


const Grid = () => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                muiTableHeadCellFilterTextFieldProps: { placeholder: 'ID' },
            },
            {
                accessorKey: 'firstName',
                header: 'First Name',
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
            },
            {
                accessorKey: 'gender',
                header: 'Gender',
                filterFn: 'equals',
                filterSelectOptions: [
                    { text: 'Male', value: 'Male' },
                    { text: 'Female', value: 'Female' },
                    { text: 'Other', value: 'Other' },
                ],
                filterVariant: 'select',
            },
            {
                accessorKey: 'age',
                header: 'Age',
                filterVariant: 'range',
            },
        ],
        [],
    );

    return (
        <MaterialReactTable
            columns={columns}
            data={GridData.map((data) => data)}
            initialState={{ showColumnFilters: true }} //show filters by default
            muiTableHeadCellFilterTextFieldProps={{
                sx: { m: '0.5rem 0', width: '100%' },
                variant: 'outlined',
            }}
        />
    );
};

export default Grid;