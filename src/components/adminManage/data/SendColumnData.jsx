import {useMemo} from "react";

export const SendColumnData =  [
        {
            header: 'Device Id',
            accessorKey: 'deviceId',
        },
        {
            header: 'Group Id',
            accessorKey: 'groupId',
            size: 150,
        },
        {
            header: 'Send Date',
            accessorKey: 'sendDate',
        },
        {
            header: 'Message Date',
            accessorKey: 'messageDate',
        },
        {
            header: 'Send Address',
            accessorKey: 'pushAddress',
            size: 130,
        },
        {
            header: 'Send Protocol',
            accessorKey: 'pushType',
            size: 130,
        },
        {
            header: 'Success',
            accessorKey: 'pushSuccess',
        },
        {
            header: 'Index',
            accessorKey: 'pushIndex',
        }
    ];
