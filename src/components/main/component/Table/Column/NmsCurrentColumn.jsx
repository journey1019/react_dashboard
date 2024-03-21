import DeviceDialog from "../../../../table/diag/DeviceDialog";
import React from "react";

/*export const NmsCurrentColumn =  [
    {
        header: 'Manage Crp Nm',
        accessorKey: 'manageCrpNm',
        size: 150,
        filterFn: 'equals',
        filterSelectOptions: manageFilterSet,
        filterVariant: 'select',
        enableColumnFilterModes: false, // filter mode change
    },
    {
        header: 'Crp Nm',
        accessorKey: 'crpNm',
        enableColumnFilterModes: false,
    },
    {
        header: 'Device ID',
        accessorKey: 'deviceId',
        enableGrouping: false, //do not let this column be grouped
        enableColumnFilterModes: false,
        Cell: ({cell}) => {
            return (
                /!*<DiagDevice cell={cell} clickRow={clickRow}/>*!/
                <DeviceDialog cell={cell} clickRow={clickRow} />
            )
        }
    },
    {
        header: 'Vhcle Nm',
        accessorKey: 'vhcleNm',
        size: 100,
        enableColumnFilterModes: false,
    },
    {
        header: 'Time Gap',
        accessorKey: 'diff',
        size: 200,
        //type: 'percent',
        columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
        filterFn: 'betweenInclusive',
        // use betweenInclusive instead of between
        Cell: ({cell, row}) => {
            if (row.original.maxPeriod * 5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 5.0) {
                return <div style={{color: "darkblue", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            } else if (row.original.maxPeriod * 3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 3.0) {
                return <div style={{color: "red", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            } else if (row.original.maxPeriod * 1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 1.5) {
                return <div style={{color: "orange", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            } else {
                return <div style={{color: "green", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            }
        },
    },
    {
        header: 'Parsing Time Gap',
        accessorKey: 'parseDiff',
        size: 200,
        columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
        filterFn: 'betweenInclusive',
        Cell: ({cell, row}) => {
            if (row.original.maxPeriod * 5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 5.0) {
                return <div style={{color: "darkblue", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            } else if (row.original.maxPeriod * 3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 3.0) {
                return <div style={{color: "red", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            } else if (row.original.maxPeriod * 1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 1.5) {
                return <div style={{color: "orange", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            } else {
                return <div style={{color: "green", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
            }
        },
    },
    {
        header: 'Day Count',
        accessorKey: 'dayCount',
        size: 100,
    },
    {
        header: 'Main Key',
        accessorKey: 'mainKey',
        size: 140,
    },
    {
        header: 'Sub Key',
        accessorKey: 'subKey',
        size: 140,
    },
    {
        header: 'Min Period',
        accessorKey: 'minPeriod',
        size: 140,
    },
    {
        header: 'Max Period',
        accessorKey: 'maxPeriod',
        size: 140,
    },
    {
        header: 'Received Date',
        accessorKey: 'receivedDate',
        enableColumnFilterModes: false,
    },
    {
        header: 'Insert Date',
        accessorKey: 'insertDate',
        enableColumnFilterModes: false,

    },
    {
        header: 'Parse Date',
        accessorKey: 'parseDate',
        enableColumnFilterModes: false,
    },
    {
        header: 'Parsing Name',
        accessorKey: 'Name',
        filterFn: 'equals',
        filterSelectOptions: nameFilterSet,
        //filterSelectOptions: resultSet,
        filterVariant: 'select',
        enableColumnFilterModes: false,
        Cell: ({cell, row}) => {
            if (row.original.Name == 'protocolError') {
                return <div style={{
                    backgroundColor: "darkgray",
                    borderRadius: "5px",
                    color: "white"
                }}>{cell.getValue(cell)}</div>;
            }
        },
    },
    {
        header: 'Software Reset Reason',
        accessorKey: 'softwareResetReason',
        /!*filterFn: 'equals',
        filterSelectOptions: softwareFilterSet,
        filterVariant: 'select',*!/
        enableColumnFilterModes: false,
        size: 200,
        Cell: ({cell}) => {
            return (
                <div className={`cellWithSoftware ${cell.getValue(cell)}`}>
                    {cell.getValue(cell)}
                </div>
            );
        },
    },
    {
        header: 'Status',
        accessorKey: 'status',
        size: 100,
        Cell: ({cell}) => {
            return (
                <div className={`cellWithStatus ${cell.getValue(cell)}`}>
                    {cell.getValue(cell)}
                </div>
            );
        },
        enableColumnFilterModes: false,
    },
    {
        header: 'Status Desc',
        accessorKey: 'statusDesc',
        size: 210,
        Cell: ({cell, row}) => {
            if (row.original.statusDesc.includes('3.0 초과')) {
                return <div style={{
                    //backgroundColor: "darkgray",
                    backgroundColor: 'Crimson',
                    borderRadius: "5px",
                    color: "white"
                }}>{cell.getValue(cell)}</div>;
            } else if (row.original.statusDesc.includes('1.5 초과')) {
                return <div style={{
                    backgroundColor: 'Crimson',
                    borderRadius: "5px",
                    color: "white"
                }}>{cell.getValue(cell)}</div>;
            } else if (row.original.statusDesc.includes('1.0 초과')) {
                return <div style={{
                    backgroundColor: 'Goldenrod',
                    borderRadius: "5px",
                    color: "white"
                }}>{cell.getValue(cell)}</div>;
            } else if (row.original.statusDesc.includes('1.0 이하')) {
                return <div style={{
                    backgroundColor: 'Mediumseagreen',
                    borderRadius: "5px",
                    color: "white"
                }}>{cell.getValue(cell)}</div>;
            } else {
                return null;
            }
        },
        enableColumnFilterModes: false,
    },
];*/

export const NmsCurrentColumn =  [
    {
        header: 'Manage Crp Nm',
        accessorKey: 'manageCrpNm',
        size: 150,
    },
    {
        header: 'Crp Nm',
        accessorKey: 'crpNm',
        enableColumnFilterModes: false,size: 100,
    },
    {
        header: 'Device ID',
        accessorKey: 'deviceId',
        enableGrouping: false, //do not let this column be grouped
        enableColumnFilterModes: false,size: 100,
    },
    {
        header: 'Vhcle Nm',
        accessorKey: 'vhcleNm',
        size: 100,
        enableColumnFilterModes: false,
    },{
        header: 'Time Gap',
        accessorKey: 'diff',
        size: 100,
        //type: 'percent',
        columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
        filterFn: 'betweenInclusive',
        // use betweenInclusive instead of between
    },
    {
        header: 'Parsing Time Gap',
        accessorKey: 'parseDiff',
        size: 100,
        columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
        filterFn: 'betweenInclusive',
    },
    {
        header: 'Day Count',
        accessorKey: 'dayCount',
        size: 100,
    },
    {
        header: 'Main Key',
        accessorKey: 'mainKey',
        size: 140,
    },
    {
        header: 'Sub Key',
        accessorKey: 'subKey',
        size: 140,
    },
    {
        header: 'Min Period',
        accessorKey: 'minPeriod',
        size: 140,
    },
    {
        header: 'Max Period',
        accessorKey: 'maxPeriod',
        size: 140,
    },
    {
        header: 'Received Date',
        accessorKey: 'receivedDate',
        enableColumnFilterModes: false,size: 100,
    },
    {
        header: 'Insert Date',
        accessorKey: 'insertDate',
        enableColumnFilterModes: false,size: 100,

    },
    {
        header: 'Parse Date',
        accessorKey: 'parseDate',
        enableColumnFilterModes: false,size: 100,
    },
    {
        header: 'Parsing Name',
        accessorKey: 'Name',
        filterFn: 'equals',
        //filterSelectOptions: resultSet,
        filterVariant: 'select',
        enableColumnFilterModes: false,size: 100,
    },
    {
        header: 'Software Reset Reason',
        accessorKey: 'softwareResetReason',
        /*filterFn: 'equals',
        filterSelectOptions: softwareFilterSet,
        filterVariant: 'select',*/
        enableColumnFilterModes: false,
        size: 200,
    },
    {
        header: 'Status',
        accessorKey: 'status',
        size: 100,
        enableColumnFilterModes: false,
    },
    {
        header: 'Status Desc',
        accessorKey: 'statusDesc',
        size: 210,
        enableColumnFilterModes: false,
    },

];



// 기존 NmsCurrent Table Columns
// Table Columns Defined
/*const columns = useMemo(
    () => [
        {
            header: 'Manage Crp Nm',
            accessorKey: 'manageCrpNm',
            size: 150,
            filterFn: 'equals',
            filterSelectOptions: manageFilterSet,
            filterVariant: 'select',
            enableColumnFilterModes: false, // filter mode change
        },
        {
            header: 'Crp Nm',
            accessorKey: 'crpNm',
            enableColumnFilterModes: false,
        },
        {
            header: 'Device ID',
            accessorKey: 'deviceId',
            enableGrouping: false, //do not let this column be grouped
            enableColumnFilterModes: false,
            /!*Cell: ({cell}) => {
                return (
                    <DiagDevice cell={cell} clickRow={clickRow}/>

                )
            }*!/
        },
        {
            header: 'Vhcle Nm',
            accessorKey: 'vhcleNm',
            size: 100,
            enableColumnFilterModes: false,
        },
        {
            header: 'Time Gap',
            accessorKey: 'diff',
            size: 200,
            //type: 'percent',
            columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
            filterFn: 'betweenInclusive',
            // use betweenInclusive instead of between
            Cell: ({cell, row}) => {
                if (row.original.maxPeriod * 5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 5.0) {
                    return <div style={{color: "darkblue", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                } else if (row.original.maxPeriod * 3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 3.0) {
                    return <div style={{color: "red", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                } else if (row.original.maxPeriod * 1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 1.5) {
                    return <div style={{color: "orange", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                } else {
                    return <div style={{color: "green", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                }
            },
        },
        {
            header: 'Parsing Time Gap',
            accessorKey: 'parseDiff',
            size: 200,
            columnFilterModeOptions: ['betweenInclusive', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'], //only allow these filter modes
            filterFn: 'betweenInclusive',
            Cell: ({cell, row}) => {
                if (row.original.maxPeriod * 5.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 5.0) {
                    return <div style={{color: "darkblue", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                } else if (row.original.maxPeriod * 3.0 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 3.0) {
                    return <div style={{color: "red", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                } else if (row.original.maxPeriod * 1.5 > 0 && cell.getValue(cell) >= row.original.maxPeriod * 1.5) {
                    return <div style={{color: "orange", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                } else {
                    return <div style={{color: "green", fontWeight: "bold"}}>{cell.getValue(cell)}</div>;
                }
            },
        },
        {
            header: 'Day Count',
            accessorKey: 'dayCount',
            size: 100,
        },
        {
            header: 'Main Key',
            accessorKey: 'mainKey',
            size: 140,
        },
        {
            header: 'Sub Key',
            accessorKey: 'subKey',
            size: 140,
        },
        {
            header: 'Min Period',
            accessorKey: 'minPeriod',
            size: 140,
        },
        {
            header: 'Max Period',
            accessorKey: 'maxPeriod',
            size: 140,
        },
        {
            header: 'Received Date',
            accessorKey: 'receivedDate',
            enableColumnFilterModes: false,
        },
        {
            header: 'Insert Date',
            accessorKey: 'insertDate',
            enableColumnFilterModes: false,

        },
        {
            header: 'Parse Date',
            accessorKey: 'parseDate',
            enableColumnFilterModes: false,
        },
        {
            header: 'Parsing Name',
            accessorKey: 'messageDatas.Name',
            filterFn: 'equals',
            filterSelectOptions: nameFilterSet,
            filterVariant: 'select',
            enableColumnFilterModes: false,
            size: 100,
            /!*Cell: ({cell, row}) => {
                if (row.original.Name == 'protocolError') {
                    return <div style={{
                        backgroundColor: "darkgray",
                        borderRadius: "5px",
                        color: "white"
                    }}>{cell.getValue(cell)}</div>;
                }
            },*!/
            /!*Cell: ({cell, row}) => {
                if(row.original.messageDatas.Name === 'protocolError') {
                    return <div style={{
                        backgroundColor: "darkgray",
                        borderRadius: "5px",
                        color: "white"}}
                    >
                        {cell.row.original.messageDatas.Name}
                    </div>
                }
            }*!/
        },
        {
            header: 'SoftwareResetReason',
            accessorKey: 'messageDatas.SoftwareResetReason',
            filterFn: 'equals',
            filterSelectOptions: softwareFilterSet,
            filterVariant: 'select',
            enableColumnFilterModes: false,
            size: 200,
            Cell: ({cell}) => {
                return (
                    <div className={`cellWithSoftware ${cell.getValue(cell)}`}>
                        {cell.getValue(cell)}
                    </div>
                );},
        },
        {
            header: 'Status',
            accessorKey: 'status',
            size: 100,
            Cell: ({cell}) => {
                return (
                    <div className={`cellWithStatusColor ${cell.getValue(cell)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {cell.getValue(cell)}
                    </div>
                );
            },
            enableColumnFilterModes: false,
            filterComponent: (props) => <TextField {...props} label="Filter" />
        },
        {
            header: 'Status Desc',
            accessorKey: 'statusDesc',
            size: 210,
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
    ],
    [],
);*/
