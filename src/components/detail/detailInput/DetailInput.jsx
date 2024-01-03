import React, {useState, useEffect, useContext, useMemo} from "react";
import "./detailInput.scss";

/* MUI*/
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Grid, Button } from "@mui/material";

/* List */
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna',
    'Oberon',
    'Phobos',
    'Pyxis',
    'Sedna',
    'Titania',
    'Triton',
    'Umbriel',
];

const ITEM_HEIGHT = 48;

const DetailInput = (props) => {

    const [date, setDate] = useState([]);

    const now = new Date();

    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    console.log(startDate); // 2023-12-23
    console.log(endDate); // 2024-01-02
    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };



    useEffect(() => {
        props.InputDate(date)
    }, [date]);




    /*const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };*/

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    return(
        <>
            <div className="input">
                <Grid container spacing={0} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Grid item xs={0.5}>
                        <SearchIcon />
                    </Grid>

                    <Grid item xs={4} >
                        <Box sx={{ w: 1}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Device Id ...</InputLabel>
                                <Select
                                    label="deviceId"
                                    MenuProps={{
                                        sx: {
                                            "&& .Mui-selected": {
                                                backgroundColor: "pink"
                                            }
                                        }
                                    }}
                                >
                                    {options.map((option) => (
                                        <MenuItem key={option} value={option} onClick={handleClose}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={1} >
                        <CalendarTodayIcon/>
                    </Grid>

                    <Grid item xs={5} >
                        <Box sx={{ w: 1, display: 'flex'}}>
                            <Grid item sm={5}>
                                <TextField id="outlined-basic" label="Start Date" variant="outlined" sx={{width: 1}}/>
                            </Grid>
                            <Grid item sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{fontSize: '30px'}}>~</span>
                            </Grid>
                            <Grid item sm={5}>
                                <TextField id="outlined-basic" label="End Date" variant="outlined" sx={{width: 1}}/>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={1.5} >
                        <Button variant="contained" color="error" size="large" sx={{ textAlign: 'center', alignItems: 'center'}}>Search</Button>
                    </Grid>
                </Grid>
            </div>

        </>
    )
}

export default DetailInput;