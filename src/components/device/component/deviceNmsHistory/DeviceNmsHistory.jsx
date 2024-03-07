import React, { useState, useEffect, useMemo } from 'react';

import MaterialReactTable from "material-react-table";

const DeviceNmsHistory = (props) => {
    const { nmsHistory, ...otherProps } = props;
    console.log(nmsHistory);
    console.log(nmsHistory.dataList);

    const nmsHistoryTableData = nmsHistory.dataList;
    const columns = useMemo(
        () => [
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            }
        ]
    )


    return(
        <>
            {nmsHistory && Object.keys(nmsHistory).length > 0 ? (
                // nmsHistory가 존재하고 길이가 0보다 큰 경우
                // 여기에 해당하는 코드 작성
                <>
                    <MaterialReactTable columns={columns} data={nmsHistoryTableData} />
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

/*const DeviceNmsHistory = (props) => {
    const { nmsHistory, ...otherProps } = props;

    const nmsHistoryTableData = nmsHistory.dataList;
    const columns = useMemo(
        () => [
            {
                header: 'Received Date',
                accessorKey: 'receivedDate',
            }
        ]
    )

    return (
        <>
            {nmsHistory?.length > 0 && (
                // nmsHistory가 존재하고 길이가 0보다 큰 경우
                // 여기에 해당하는 코드 작성
                <>
                    <MaterialReactTable columns={columns} data={nmsHistoryTableData} />
                </>
            )}

            {!nmsHistory || nmsHistory.length === 0 && (
                // nmsHistory가 존재하지 않거나 길이가 0인 경우
                // 여기에 해당하는 코드 작성
                <>
                    조회된 데이터가 없습니다.
                </>
            )}
        </>
    );

}*/

/*const DeviceNmsHistory = (props) => {
    const { nmsHistory, ...otherProps } = props;

    // nmsHistory 가 있는 경우
    if(nmsHistory && Object.keys(nmsHistory).length > 0) {

    }
    // nmsHistory 가 없는 경우
    else{

    }

    return(
        <>
        </>
    )
}*/

export default DeviceNmsHistory;
