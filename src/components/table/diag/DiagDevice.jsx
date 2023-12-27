import './diagDevice.scss';
import React, {useState} from "react";
import Category from '../../diagnostic/params/Category';

import { Box, Button, MenuItem, IconButton } from '@mui/material';
import Modal from "@mui/material/Modal";
import AppBar from "@mui/material/AppBar";
import FitScreenRoundedIcon from '@mui/icons-material/FitScreenRounded';

const DiagDevice = ({cell, row, clickRow}) => {

    const [open, setOpen] = useState(false);
    const handleDiagClose = () => setOpen(false);
    const handleDiagOpen = () => {
        console.log('click');
        setOpen(true);
    }

    
    /* =========== */

    return(
        <>
            <div className="diagDevice">
                <Button
                    className="device_Btn"
                    variant="outlined" size="small" color="warning"
                    onClick={handleDiagOpen}
                    style={{zIndex: 1}}
                >
                    {cell.getValue(cell)}
                </Button>

                <Modal
                    className="device_Modal"
                    open={open}
                    onClose={handleDiagClose}
                    style={{zIndex: 1}}
                >
                    <Box className="modal-box" style={{zIndex: 1}} sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 1300,
                        height: 800,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        pt: 2,
                        px: 4,
                        pb: 3,
                    }}>
                        {/* Header */}
                        <div className="diagnostic_modal_title"
                             style={{justifyContent: 'space-between', alignItems: 'center', display: 'flex'}}
                        >
                            <span className="modal_title" style={{fontSize: 'large'}}>Diagnostic Modal</span>
                            <span className="modal_size">
                                <IconButton aria-label="close" color="inherit">
                                    <FitScreenRoundedIcon className="icon" size="large" style={{fontSize: '20px'}}/>
                                </IconButton>
                            </span>
                        </div>
                        <hr/>
                        <div className="diagnostic_modal_content">
                            <Category/>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    )
}

export default DiagDevice;