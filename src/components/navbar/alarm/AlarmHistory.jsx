import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {Button, darken} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import AlarmIcon from "@mui/icons-material/Alarm";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { Box, MenuItem } from '@mui/material';
import Modal from "@mui/material/Modal";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MaterialReactTable from "material-react-table";
import {ExportToCsv} from "export-to-csv";


const AlarmHistory = () => {

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };
    const handleFullClose = () => {
        setFullOpen(false);
    };

    const [alarmHistory, setAlarmHistory] = useState([]);
    const [hisNum, setHisNum] = useState(0);
    const [alarmCount, setAlarmCount] = useState(0);

    /*const[startDate, setStartDate] = useState(new Date("2023-07-01").toISOString().split('T')[0]);*/
    const[startDate, setStartDate] = useState(new Date("2023-07-10").toISOString().split('T')[0]);
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        const data = returnHistory().then(
            result => {
                if(result != null) {
                    let dataList = [];

                    setAlarmCount(result["alarmCount"])

                    //console.log(result);


                    result["alarmList"].map(function(detail) {
                        //console.log(detail);

                        // occurCheck
                        /*if(typeof(Object.values(detail)) == "boolean") {
                            return "true";
                        }else{
                            return "false";
                        }*/

                        dataList.push(detail);
                    })
                    setAlarmHistory(dataList);
                } else{
                }
            });
        return () => {
            clearTimeout(alarmHistory);
        }
    }, [hisNum, alarmHistory, startDate, endDate])

    setTimeout(() => {
        setHisNum(hisNum+1);
        if(hisNum>100){
            setHisNum(0);
        }
    }, 100000)

    async function returnHistory() {
        const alrToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const alrHisUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
        const alrHisParams = {startDate: (startDate + "T00:00:00"), endDate: (endDate + "T23:59:59"), desc: true};

        const alrHisHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try{
            let result = await axios({
                method: "get",
                url: alrHisUrl,
                headers: alrHisHeaders,
                params: alrHisParams,
                responseType: "json",
            })
                .then(response => {
                    returnVal = response.data.response;
                    //console.log(response.data.response); // = result
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        }
        catch{
            return null;
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Alarm Log Index',
                accessorKey: 'alarmLogIndex'
            },
            {
                header: 'Device Id',
                accessorKey: 'deviceId'
            },
            {
                header: 'Alarm Name',
                accessorKey: 'alarmName'
            },
            {
                header: 'Alarm Type',
                accessorKey: 'alarmType'
            },
            {
                header: 'Noti Type',
                accessorKey: 'notiType'
            },
            {
                header: 'Occur Date',
                accessorKey: 'occurDate'
            },
        ]
    )

    // Export To CSV
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };
    const handleExportData = (table) => {
        //console.log(table.getAllColumns())
        csvExporter.generateCsv(alarmHistory.map(function(row){
            let datas = {};
            table.getAllColumns().map(function(columns) {
                if(typeof (row[columns.id])!="undefined"){
                    datas[columns.id] = row[columns.id];
                }

            });
            //console.log(row);
            //console.log(datas)
            return datas;
        }));
    }

    return(
        <>
            <IconButton color="success" aria-label="add an alarm" className='item' onClick={handleFullOpen}>
                <AlarmIcon className="icon" size="large" />
            </IconButton>

            {/*<Dialog open={fullOpen} fullScreen>
                <DialogTitle>Alarm History</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        variant="standard"
                    >

                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFullClose}>Cancel</Button>
                    <Button onClick={handleFullClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>*/}

            <Dialog fullScreen open={fullOpen} sx={{position: 'absolute', display: 'flex', maxWidth: 'lg', alignItems: 'center', paddingLeft: '400px'}}>

                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleFullClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Alarm History
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleFullClose}>
                            Close
                        </Button>
                    </Toolbar>
                </AppBar>

                {/*<div className="dialogContain">
                    <div className="dialogContent">
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </div>
                    <div className="date">
                        <b>Start Date : </b> <input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} /><p />
                        <b>End Date : </b> <p />
                    </div>
                    <div className="date">
                        <b>End Date : </b> <input type="date" id="startDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} /><p />
                        <b>End Date : </b> <p />
                    </div>
                    
                </div>*/}

                <MaterialReactTable
                    title="NMS History Table"
                    columns={columns}
                    data={alarmHistory}

                    // Date Search
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box sx={{display:'flex', gap:'1rem', p: '4px'}}>
                            <Button
                                color="primary"
                                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                onClick={()=>handleExportData(table)}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                style={{p: '0.5rem', flexWrap: 'wrap'}}
                            >
                                Export All Data
                            </Button>

                            <span style={{ p:"4px"}}>
                            <b>Start Date : </b><input type="date" id="startDate" value={startDate} max="2070-12-31" min="1990-01-01" onChange={handleStartChange} />
                                &nbsp;~&nbsp;
                                <b>End Date : </b><input type="date" id="endDate" value={endDate} max="2070-12-31" min="1990-01-01" onChange={handleEndChange} />
                        </span>
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
                        pagination: { pageIndex: 0, pageSize: 100 },
                    }}
                    muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                    muiTableContainerProps={{ sx: { m: '0.5rem 0', maxHeight: 700, width: '100%' }}}
                />
            </Dialog>


            {/*{fullOpen ? (
                <Dialog open={fullOpen} sx={{ width: 'xl' }}>
                    <DialogTitle>Alarm History</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            variant="standard"
                        >

                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFullClose}>Cancel</Button>
                        <Button onClick={handleFullClose}>Subscribe</Button>
                    </DialogActions>
                </Dialog>
            ) : null}

            <Dialog
                fullScreen
                open={fullOpen}
                onClose={handleFullClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleFullClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Alarm History Search
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleFullClose}>
                            Close
                        </Button>
                    </Toolbar>
                </AppBar>


                <List>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText
                            primary="Default notification ringtone"
                            secondary="Tethys"
                        />
                    </ListItem>
                </List>
            </Dialog>*/}
        </>
    )
}
export default AlarmHistory;