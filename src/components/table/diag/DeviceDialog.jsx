// Table _ DiagDevice.jsx (Modal -> Dialog) 바꾸기 전

import './diagDevice.scss';
import React, {useState, useEffect} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FitScreenRoundedIcon from "@mui/icons-material/FitScreenRounded";
import {IconButton} from "@mui/material";
import Category from "../../diagnostic/params/Category";

const DeviceDialog = (props) => {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if(props.cell != null) {
        const deviceId = props.cell.row['id']
        return (
            <>
                <Button variant="outlined"
                        size="small"
                        color="warning"
                        onClick={handleClickOpen}

                >
                    {deviceId}
                </Button>

                <Dialog
                    fullWidth={true}
                    maxWidth={'xl'}
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle sx={{width: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        Diagnostic Device
                        <IconButton aria-label="close" color="inherit">
                            <FitScreenRoundedIcon className="icon" size="large" style={{fontSize: '20px', color: 'darkgray'}}/>
                        </IconButton>
                    </DialogTitle>
                    <hr/>
                    <DialogContent>
                        {/*<DialogContentText>
                        You can see the diagnostic information for each device by entering the input value.
                    </DialogContentText>*/}
                        <Box
                            noValidate
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                m: 'auto',
                                width: 'fit-content',
                            }}
                        >
                            <Category/>
                        </Box>
                    </DialogContent>
                    <hr/>
                    <DialogActions>
                        <Button onClick={handleClose} variant="outlined">Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

export default DeviceDialog;