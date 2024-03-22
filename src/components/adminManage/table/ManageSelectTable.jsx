import MaterialReactTable from "material-react-table";
import React, {useMemo,useState,useEffect} from "react";
import "./ManageTable.scss"
import {Box, Button, darken} from "@mui/material";

const ManageSelectTable = (props) => {


    /** API _ API로 들어온 데이터(NmsCurrent) state **/
    const[propsData, setPropsData] = useState([]);
    //const[nmsDevice] = useState([]);
    const titles = props.title;
    const [rowSelection,setRowSelection] = useState({});
    const [clickRowId, setClickRowId] = useState("");


    useEffect(() => {
        props.paramOption(clickRowId);

    }, [clickRowId]); // deviceId





    useEffect(()=>{
        ////console.log(props.data);
        setPropsData(props.data);
    },[props.data]);

    const columns = useMemo(
        () => props.dataColumn,
        [],
    );

    useEffect(()=>{
        ////console.log(rowSelection);
    },[rowSelection]);


    return (
        <>
            <MaterialReactTable
                //title="NMS Manage Table"
                columns={columns}
                data={propsData}
                muiTableContainerProps={({row})=>({

                    sx: {
                        height:  `${
                            
                                //Default mrt row height estimates. Adjust as needed.
                                props.pageSize * (props.pageSize>=20?33:35)
                            }px`,
                    }

                })}
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
                        <span className="tableLogHeaderText">{titles}</span>
                    </Box>
                )}

                // Change History Table Theme
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
                muiTableBodyRowProps={({row}) => ({
                    //implement row selection click events manually
                    onClick: (event) => {

                        setClickRowId(row.getValue(props.rowId)); // History 연결
                    },
                    sx: {
                        cursor: 'pointer',
                        /*"& .MuiTableRow-root" : {
                            backgroundColor: clickRowBackground,
                        },*/
                    },

                })}
                //getRowId={(row) => row.deviceId} // row select
                //onRowSelectionChange={setRowSelection}
                enableMultiRowSelection={false}
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    exportButton: true,
                    showColumnFilters: true,
                    density: 'compact',
                    expanded: true,
                    pagination: { pageIndex: 0, pageSize: props.pageSize },
                }}

            />



        </>
    );
}

export default ManageSelectTable;