import React, { useState, useEffect, useMemo } from 'react';
import Detail from "../../../detail/Detail";
import { Link } from "react-router-dom";

/* MUI */
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ArrowCircleRightTwoToneIcon from "@mui/icons-material/ArrowCircleRightTwoTone";
import {IconButton} from "@mui/material";
import Container from '@mui/material/Container';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

    /* Full Screen IconButton Click, DetailDevice로 이동 */
    function MoveDetailDevice() {
        return(
            <>
                <Button href="/device" variant="outlined" size="large" color="primary" sx={{ float: 'right', borderRadius: '20px' }} endIcon={<ArrowForwardIcon />}>
                    전체 화면으로 이동
                </Button>
                <br/><br/>
            </>
        )
    }

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
                    {/*<Container >
                        <Detail deviceId={deviceId}/>
                        <Button onClick={toggleDrawer(false)} size="large" variant="outlined" sx={{ float: 'right', mb: 2 }}>Close Drawer</Button>
                    </Container>*/}
                    <Box sx={{width: '50vw', p: 5, pt: 10}}>
                        <MoveDetailDevice />
                        <br/>
                        <Detail deviceId={deviceId}/>
                        <Button onClick={toggleDrawer(false)} size="large" variant="outlined" sx={{ float: 'right', mb: 2 }}>Close Drawer</Button>
                    </Box>
                </div>
            </Drawer>
        </div>
    );

}

export default DetailDeviceDrawer;