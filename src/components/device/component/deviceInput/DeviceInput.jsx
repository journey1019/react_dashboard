/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */

/* MUI */
import {ListItemText, ListSubheader, ListItem, List, FormControl, InputLabel, Select, MenuItem, Box, TextField, Button, Grid, Typography} from "@mui/material";


/* Icon */
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

/* Device.jsx 의 자식 컴포넌트 */
const DeviceInput = (props) => {
    console.log(props)
    // Main Table에서 선택한 Row DeviceId
    console.log(props.tableSelectDeviceId)
    // Session에 저장된 nmsCurrent Data (Device.jsx 에게 상속받음)
    console.log(props.sessionNmsCurrent);
    
    /* Input Value */
    // Select에서 선택한 DeviceId
    const [deviceId, setDeviceId] = useState(props.deviceId || props.tableSelectDeviceId || null);
    // 선택한 단말기 이름 출력
    const handleSelectDeviceIdChange = (event) => {
        const deviceId = event.target.value;
        setDeviceId(deviceId);
    }

    const handleSelectClose = () => {
        setDeviceId(null);
    }

    /* 선택한 단말기Id 값을 부모(Device.jsx)에게 전달 */
    // deviceId는 Device.jsx에서 각 Components에게 props로 할당함
    useEffect(()=> {
        props.InputSelectDevice(deviceId);
    }, [deviceId])

    console.log(deviceId)


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
                            onChange={handleSelectDeviceIdChange}
                            value={deviceId || ''}
                        >
                            {props.sessionNmsCurrent.map((item) => (
                                <MenuItem key={item.deviceId} value={item.deviceId} onClick={handleSelectClose}>
                                    {item.deviceId}
                                </MenuItem>
                            ))}
                            {deviceId && (
                                <div>
                                    <h2>Selected Object:</h2>
                                    <p>ID: {deviceId}</p>
                                    <p>Name: {props.sessionNmsCurrent.find((item) => item.deviceId === deviceId)?.vhcleNm}</p>
                                </div>
                            )}
                            {/*{[0, 1, 2, 3, 4].map((sectionId) => (
                                <li key={`section-${sectionId}`}>
                                    <ul>
                                        <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                                        {[0, 1, 2].map((item) => (
                                            <ListItem key={`item-${sectionId}-${item}`}>
                                                <ListItemText primary={`Item ${item}`} />
                                            </ListItem>
                                        ))}
                                    </ul>
                                </li>
                            ))}*/}
                            {/*{options.map((option) => (
                                <MenuItem key={option} value={option} onClick={handleSelectClose}>
                                    {option}
                                </MenuItem>
                            ))}*/}
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