import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';

const Example = () => {
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

    const data = useMemo(
        //data definitions...
        () => [
            {
                id: 1,
                firstName: 'Hugh',
                lastName: 'Mungus',
                gender: 'Male',
                age: 42,
            },
            {
                id: 2,
                firstName: 'Leroy',
                lastName: 'Jenkins',
                gender: 'Male',
                age: 51,
            },
            {
                id: 3,
                firstName: 'Candice',
                lastName: 'Nutella',
                gender: 'Female',
                age: 27,
            },
            {
                id: 4,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 5,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 6,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 7,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 8,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 9,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 10,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 11,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },{
                id: 12,
                firstName: 'Micah',
                lastName: 'Johnson',
                gender: 'Other',
                age: 32,
            },
        ],
        [],
        //end
    );

    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            initialState={{ showColumnFilters: true }} //show filters by default
            muiTableHeadCellFilterTextFieldProps={{
                sx: { m: '0.5rem 0', width: '100%' },
                variant: 'outlined',
            }}
        />
    );
};

export default Example;
