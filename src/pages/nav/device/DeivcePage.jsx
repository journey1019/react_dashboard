/* React */
import React, { useState, useEffect} from "react";

/* Import */
import Navbar from "../Navbar";
import Device from "../../../components/device/Device";

/* MUI */
import CssBaseline from "@mui/material/CssBaseline";
import {Tooltip, Box, IconButton, Dialog, AppBar, Toolbar, Typography, Grid, Button, TextField} from "@mui/material";

/* Icon */
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from '@mui/x-data-grid';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {Link} from "react-router-dom";
import {FcSmartphoneTablet} from "react-icons/fc";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Drawer from "@mui/material/Drawer";
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';

/*const DevicePage = () => {
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

    // Drawer Box width 설정
    const initialWidth = '100vw'; // 초기 width 값 : 70vw
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
                <FcSmartphoneTablet size="24" onClick={()=> console.log('devicePage btn Click')}/>
            </IconButton>

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <div
                    role="tab"
                    /!*onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}*!/

                >
                    {/!*<Container >
                        <Detail deviceId={deviceId}/>
                        <Button onClick={toggleDrawer(false)} size="large" variant="outlined" sx={{ float: 'right', mb: 2 }}>Close Drawer</Button>
                    </Container>*!/}
                    <Box width={boxWidth} sx={{ p: 2, pt: 10, backgroundColor: '#FAFBFC'}}>
                        <Box sx={{ w: 1, m: 2,  display: 'flex', float: 'right'}}>
                            <Button onClick={toggleDrawer(false)} size="large" color="error" variant="outlined" >Close Drawer</Button>
                        </Box>
                        {/!*<Box sx={{ w: 1, m: 2,  display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Button onClick={handleDrawerButtonClick} variant={buttonVariant} size="large" color="error" >{buttonText}</Button>
                            <Button onClick={toggleDrawer(false)} size="large" color="error" variant="outlined" >Close Drawer</Button>
                        </Box>*!/}
                        <br/>
                        <Device />
                    </Box>
                </div>
            </Drawer>

        </div>
    )
}*/

const DevicePage = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    // Drawer Button Text 설정
    const buttonText = isDrawerOpen ? <ArrowForwardIcon /> : '전체화면으로 보기';

    // Button 클릭 시 Drawer 열림/닫힘 상태를 토글하는 함수
    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };
    /*const [isDialogOpen, setDialogOpen] = useState(false);

    // Dialog Button Text 설정
    const buttonText = isDialogOpen ? <ArrowForwardIcon /> : '전체화면으로 보기';

    // Button 클릭 시 Dialog 열림/닫힘 상태를 토글하는 함수
    const toggleDialog = () => {
        setDialogOpen(!isDialogOpen);
    };*/

    return (
        <div>
            <Tooltip title="Device Page" >
                <IconButton onClick={toggleDrawer}>
                        <AddToHomeScreenIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <div role="tab">
                    <Box sx={{ p: 2, pt: 10, backgroundColor: '#FAFBFC' }}>
                        <Box sx={{ w: 1, m: 2, display: 'flex', float: 'right' }}>
                            <Button onClick={() => setDrawerOpen(false)} size="large" color="error" variant="outlined">Close Drawer</Button>
                        </Box>
                        <br />
                        <Device />
                    </Box>
                </div>
            </Drawer>
        </div>
        /*<div>
            <Tooltip title="Device Page" >
                <IconButton onClick={toggleDialog}>
                    {/!*<FcSmartphoneTablet size="24" />*!/}
                    <AddToHomeScreenIcon fontSize="large" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                fullScreen
                maxWidth="xl"
                sx={{position: 'absolute', display: 'flex'}}
            >
                <Box sx={{ width: '100%', p: 2, backgroundColor: '#FAFBFC', position: 'relative' }}>
                    <Box sx={{ w: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setDialogOpen(false)} size="large" color="error" variant="outlined">Close Dialog</Button>
                    </Box>
                    <br />
                    <Device />
                </Box>
            </Dialog>
        </div>*/
    );
}
export default DevicePage;