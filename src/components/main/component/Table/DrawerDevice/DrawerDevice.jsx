import React, { useState, useEffect, useMemo } from 'react';
import Device from "../../../../device/Device"
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

const DrawerDevice = (props) => {
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
    /*function MoveDetailDevice() {
        return(
            <>
                {/!*<Button href="/devicePage" variant="outlined" size="large" color="primary" sx={{ float: 'right', borderRadius: '20px' }} endIcon={<ArrowForwardIcon />}>
                    전체 화면으로 이동
                </Button>*!/}
                <Button href="/devicePage" variant="outlined" size="large" color="primary" sx={{ float: 'right', borderRadius: '20px' }} endIcon={<ArrowForwardIcon />}>
                    전체 화면으로 이동
                </Button>
                <br/><br/>
            </>
        )
    }*/
    // Drawer Box width 설정
    const initialWidth = '70vw'; // 초기 width 값 : 70vw
    const [boxWidth, setBoxWidth] = useState(initialWidth);

    // Drawer Button Text 설정
    const initialText = '전체화면으로 보기'; // 초기 text : 전체 화면보기
    const [buttonText, setButtonText] = useState(initialText);
    // Drawer Button Variant 설정
    const initialVariant = 'outlined'; // 초기 variant : outlined
    const [buttonVariant, setButtonVariant] = useState(initialVariant);

    // Button 클릭 시 width & text 를 변경하는 함수
    const handleDrawerButtonClick = () => {
        setBoxWidth((prevWidth) => (prevWidth === initialWidth ? '100vw' : initialWidth));
        setButtonText((prevText) => (prevText === initialText ? <ArrowForwardIcon/> : initialText));
        setButtonVariant((prevVariant) => (prevVariant === initialVariant ? 'contained' : initialVariant));
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
                    <Box width={boxWidth} sx={{ p: 5, pt: 10 }}>
                        <Box sx={{ w: 1, m:2,  display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Button onClick={handleDrawerButtonClick} variant={buttonVariant} size="large" color="secondary" >{buttonText}</Button>
                            <Button onClick={toggleDrawer(false)} size="large" color="secondary" variant="outlined" >Close Drawer</Button>
                        </Box>
                        <br/>
                        <Device deviceId={deviceId} />
                    </Box>
                </div>
            </Drawer>
        </div>
    );

}

export default DrawerDevice;