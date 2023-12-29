import React, { useState, useEffect, useMemo } from 'react';
import Detail from "../../../detail/Detail";

/* MUI */
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ArrowCircleRightTwoToneIcon from "@mui/icons-material/ArrowCircleRightTwoTone";
import {IconButton} from "@mui/material";

const DetailDeviceDrawer = (props) => {
    console.log(props)
    console.log(props.clickRow)
    const deviceId = props.clickRow;
    console.log(deviceId)
    /*const [deviceId, setDeviceId] = useState('');
    setDeviceId(props.clickRow)
    console.log(deviceId)*/
    

    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)}>
                <ArrowCircleRightTwoToneIcon size="large" sx={{color: '#424242'}}/>
            </IconButton>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <div
                    role="tab"
                    /*onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}*/

                >
                    <Box sx={{width: '50vw', p: 5, pt: 10}}>
                        <Detail deviceId={deviceId}/>
                        <Button onClick={toggleDrawer(false)} size="large" variant="outlined" sx={{ float: 'right', mb: 2 }}>Close Drawer</Button>
                    </Box>
                </div>
            </Drawer>
        </div>
    );

}

export default DetailDeviceDrawer;