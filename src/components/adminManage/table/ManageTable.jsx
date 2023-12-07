import MaterialReactTable from "material-react-table";
import React, {useMemo,useState,useEffect} from "react";
import axios from "axios";
import "./ManageTable.scss"
import {Box, Button, darken} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const ManageTable = (props) => {

    /*const columns = useMemo(
        () => props.selectDataColumn,
        [],
    );*/
    const hourMil = 60*60*1000;
    const now = new Date();
    const titles = props.title;
    const[startDate, setStartDate] = useState(new Date(now.getTime()).toISOString().split('T')[0]); // 10일 전
    const[startDateHour, setStartDateHour] = useState(Number(new Date(now.getTime()-(1*hourMil)).toISOString().split('T')[1].substring(0,2))); // 10일 전

    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const[endDateHour, setEndDateHour] = useState(Number(new Date().toISOString().split('T')[1].substring(0,2))); // 10일 전

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleStartHourChange = (e) => {
        setStartDateHour(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };
    const handleEndHourChange = (e) => {
        setEndDateHour(e.target.value);
    };




    function selectData(){
        let chnStartDate = startDate.replaceAll("-","");
        let chnStartDateHour = String(startDateHour);
        let chnEndDate = endDate.replaceAll("-","");
        let chnEndDateHour = String(endDateHour);

        if(chnStartDateHour.length==1){
            chnStartDateHour = '0'+chnStartDateHour;
        }

        if(chnEndDateHour.length==1){
            chnEndDateHour = '0'+chnEndDateHour;
        }

        props.parmaOption({ startDate:((chnStartDate+chnStartDateHour)), endDate:((chnEndDate+chnEndDateHour))});

    }

    function returnDefaultDateSet(){
        const hourMil = 60*60*1000;
        const now = new Date();

        const defStartDate = new Date(now.getTime()).toISOString().split('T')[0]; // 10일 전
        const defStartDateHour = new Date(now.getTime()-(1*hourMil)).toISOString().split('T')[1].substring(0,2);

        const defEndDate = new Date().toISOString().split('T')[0];
        const defEndDateHour = new Date().toISOString().split('T')[1].substring(0,2);

        return { startDate:((defStartDate+defStartDateHour).replaceAll("-","")), endDate:((defEndDate+defEndDateHour).replaceAll("-",""))}

    }


    /** API _ API로 들어온 데이터(NmsCurrent) state **/
    const[propsData, setPropsData] = useState([]);
    const[nmsDevice] = useState([]);

    useEffect(() => {
        props.parmaOption(returnDefaultDateSet());
    }, [1]);

    useEffect(()=>{
        console.log(props.data);
        setPropsData(props.data);
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

                // Date Search
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
                        <span className="tableLogHeaderText">{titles}</span>
                        <span className="tableLogHeader" style={{ p:"4px"}}>
                            <b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange}/>
                            &nbsp;:&nbsp;
                            <input type="number" id="startDateHour" style={{textAlign:"center"}}  value={startDateHour} min="0" max="23" onChange={handleStartHourChange}/>
                            &nbsp;~&nbsp;
                            <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange}/>
                            &nbsp;:&nbsp;
                            <input type="number" id="endDateHour"  style={{textAlign:"center"}} value={endDateHour} min="0" max="23" onChange={handleEndHourChange}/>
                        </span>
                        <Button
                            color="primary"
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={()=>selectData()}
                            startIcon={<SearchIcon />}
                            variant="contained"
                            style={{p: '0.5rem', flexWrap: 'wrap'}}

                        >
                            조회
                        </Button>
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
                    pagination: { pageIndex: 0, pageSize: 10 },
                }}

            />



        </>
    );
}

export default ManageTable;