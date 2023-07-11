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

const AlarmHistory = (props) => {

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullClose = () => {
        setFullOpen(false);
    };


    // Open Full - Screen Dialog
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    return(
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
                        open={fullOpen}
                        onClick={handleFullClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Sound
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleFullClose}>
                        save
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
    )
}
export default AlarmHistory;