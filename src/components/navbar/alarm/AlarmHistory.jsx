import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import AlarmIcon from "@mui/icons-material/Alarm";

const AlarmHistory = (props) => {

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };
    const handleFullClose = () => {
        setFullOpen(false);
    };

    // Open Full - Screen Dialog
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    /* ------------------------------------------------------------------ */

    async function returnHistory() {
        const alrToken = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const alrDetUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
        const alrDetParams = {startDate: "2023-07-01", endDate: "2023-07-10"}

        const alrDetHeaders = {
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Authorization": "Bearer " + alrToken,
        };

        let returnVal = null;

        try{
            let result = await axios({
                method: "get",
                url: alrDetUrl,
                headers: alrDetHeaders,
                params: alrDetParams,
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


    return(
        <>
            <IconButton color="success" aria-label="add an alarm" className='item' onClick={handleFullOpen}>
                <AlarmIcon className="icon" size="large" />
            </IconButton>

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
            </Dialog>
        </>
    )
}
export default AlarmHistory;