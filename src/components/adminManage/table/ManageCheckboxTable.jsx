import MaterialReactTable from "material-react-table";
import React, {useMemo,useState,useEffect} from "react";
import "./ManageTable.scss"
import {Box, Button, darken} from "@mui/material";
import useDidMountEffect from "../module/UseDidMountEffect";
import {GroupDeviceSetData} from "../data/group/GroupDeviceSetData";

const ManageCheckboxTable = (props) => {


    /** API _ API로 들어온 데이터(NmsCurrent) state **/
    const[propsData, setPropsData] = useState([]);
    //const[nmsDevice] = useState([]);
    const titles = props.title;
    const [rowSelection,setRowSelection] = useState({});
    const [clickRowId, setClickRowId] = useState("");

    function bodyRowClick(selectId){

        if(typeof(rowSelection[selectId]) ==="undefined"){
            rowSelection[selectId] = true;
        }else{
            if(rowSelection[selectId]){
                rowSelection[selectId] = false;
            }else{
                rowSelection[selectId] = true;
            }
        }
        setClickRowId(selectId)
    }


    useDidMountEffect(() => {

        //console.log("test1")
        let checkBoxYn = "Y";

        if(typeof(rowSelection[clickRowId]) ==="undefined"){
            checkBoxYn = "N"
        }else{
            if(rowSelection[clickRowId]===false){
                checkBoxYn = "N"
            }
        }

        const param = {
            deviceId:clickRowId,
            useYn:checkBoxYn
        }
        if(clickRowId!==null && clickRowId!==""){
            props.paramOption(param);
            setClickRowId("")
        }

    }, [clickRowId,rowSelection]); // deviceId



    useDidMountEffect(()=>{
        ////console.log(props.data);
        setPropsData(props.data);

        let deviceGroupMap = {};
        props.data.map(function(deviceData){
            if(deviceData["useYn"]==="Y"){
                deviceGroupMap[deviceData[props.rowId]] = true
            }
        })
        setRowSelection(deviceGroupMap)

    },[props.data]);

    const columns = useMemo(
        () => props.dataColumn,
        [],
    );




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
                                props.pageSize * (props.pageSize>=20?31.5:33)
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
                        bodyRowClick(row.getValue(props.rowId)); // History 연결
                    },
                    sx: {
                        cursor: 'pointer',
                        /*"& .MuiTableRow-root" : {
                            backgroundColor: clickRowBackground,
                        },*/
                    },

                })}
                muiSelectCheckboxProps={({row})=>({
                    onClick:()=>{
                        setClickRowId(row.getValue(props.rowId))
                    }
                })}
                getRowId={(row) => row[props.rowId]} // row select
                onRowSelectionChange={setRowSelection}
                state={{rowSelection}}
                positionToolbarAlertBanner={"none"}
                enableSelectAll={false}
                enableRowSelection
                enableMultiRowSelection={true}
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    //exportButton: true,
                    showColumnFilters: true,
                    density: 'compact',
                    expanded: true,
                    pagination: { pageIndex: 0, pageSize: props.pageSize },
                }}
            />
        </>
    );
}

export default ManageCheckboxTable;