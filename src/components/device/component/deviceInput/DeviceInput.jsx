/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */

/* MUI */
import {FormControl, InputLabel, Select, MenuItem, Box, TextField, Button, Grid, Typography} from "@mui/material";

/* Icon */
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


const options = [
    'Device 1',
    'Device 2',
    'Device 3',
    'Device 4',
    'Device 5',
    'Device 6',
    'Device 7',
    'Device 8',
    'Device 9',
    'Device 10',
    'Device 11',
];


const DeviceInput = () => {

    // Option Select
    const [selectOption, setSelectOption] = useState(null);
    const handleSelectClick = (event) => {
        setSelectOption(event.currentTarget);
    }
    const handleSelectClose = () => {
        setSelectOption(null);
    }


    return(
        <>
            {/* Input */}
            {/* Search  */}
            <Grid className="input" container spacing={0}>
                <Grid item xs={5} sm={5} sx={{display: 'flex', alignItems: 'center'}}>
                    <SearchIcon style={{ width: '4em'}}/>
                    <FormControl color="error" fullWidth>
                        <InputLabel id="demo-simple-select-label">Select Device Id</InputLabel>
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
                                <MenuItem key={option} value={option} onClick={handleSelectClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Date */}
                <Grid item xs={5.5} sm={5.5} sx={{display: 'flex', alignItems: 'center', w: 1}}>
                    <CalendarTodayIcon style={{ width: '4em'}}/>
                    <Box sx={{ display: 'flex', width: '-webkit-fill-available' }}>
                        <Grid item sm={12} sx={{w: 1}}>
                            <TextField id="outlined-basic" label="Start Date" variant="outlined" sx={{width: 1}} fullWidth color="error"/>
                        </Grid>
                        <Grid item sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{fontSize: '30px'}}>~</span>
                        </Grid>
                        <Grid item sm={12} sx={{w: 1}}>
                            <TextField id="outlined-basic" label="End Date" variant="outlined" sx={{width: 1}} fullWidth color="error"/>
                        </Grid>
                    </Box>
                </Grid>

                {/* Button */}
                <Grid item xs={1.5} sm={1.5} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Button variant="contained" color="error" size="large" sx={{ textAlign: 'center', alignItems: 'center'}}>Search</Button>
                </Grid>

            </Grid>
        </>
    )
}

export default DeviceInput;