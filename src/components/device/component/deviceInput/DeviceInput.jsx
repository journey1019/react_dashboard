/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */

/* MUI */
import {ListItemText, ListSubheader, ListItem, List, FormControl, InputLabel, Select, MenuItem, Box, TextField, Button, Grid, Typography} from "@mui/material";

/* Icon */
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


// Device.jsx 의 자식 컴포넌트
// DeviceInput.jsx -> Device.jsx -> All Device components 에게 전달
/**
 * @author : jhlee
 * @date : 2024-02-28
 * @file : 단말 세부 데이터 Input Value 입력 (deviceId & startDate & endDate)
 * @property: {
 *     tableSelectDeviceId: deviceId
 *         -> Table->Device 로 받아온 Table 에서 선택한 Row 의 deviceId
 * }
 * @desc : {
 *   useState({}) const[deviceId, setDeviceId] : 단말ID
 *   -> deviceId : deviceId_DeviceInput.jsx || tableSelectDeviceId_Table.jsx
 *   useState({}) const[startDate, setStartDate] : 시작 날짜
 *   -> startDate : Today - 10 (setting)
 *   useState({}) const[endDate, setEndDate] : 끝 날짜
 *   -> endDate : Today (setting)
 *
 * }
 * */
const DeviceInput = (props) => {
    const { tableSelectDeviceId, sessionNmsCurrent, ...otherProps } = props;
    console.log(props)

    // Table 에서 Action(Row)를 클린했을 때 DeviceId
    console.log(props.tableSelectDeviceId)
    // Session에 저장된 nmsCurrent Obj Data (Device.jsx 에게 상속받음)
    console.log(props.sessionNmsCurrent);
    
    /* Input Value */
    // DeviceInput _ Option 에서 선택한 DeviceId
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

    // DeviceInput _ Calender 에서 선택한 Date (startDate, endDate)
    const now = new Date();
    // 2024-01-21T06:18:45 (Today - 10)
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -30)).toISOString().slice(0, -5)); // 10일 전
    // 2024-01-31T06:18:45 (Today)
    const[endDate, setEndDate] = useState(new Date().toISOString().slice(0, -5));



    /* 선택한 단말기Id 값을 부모(Device.jsx)에게 전달 */
    // deviceId는 Device.jsx에서 각 Components에게 props로 할당함
    /**
     * @trigger deviceId, startDate, endDate : Input Values
     * @desc
     * 해당 페이지 모든 데이터가 Input Values 에 맞춰 조회되고, 해당 값들은 Device All Components 에게 전달됨
     * @export
     * locationInfos({})
     * deviceInfo({})
     * selectStatus([])
     */
    useEffect(()=> {
        props.InputSelectDevice(deviceId, startDate, endDate);
    }, [deviceId, startDate, endDate])

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
                            <TextField id="outlined-basic" label="Start Date" value={startDate} variant="outlined" sx={{width: 1}} fullWidth color="error"/>
                        </Grid>
                        <Grid item sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{fontSize: '30px'}}>~</span>
                        </Grid>
                        <Grid item sm={12} sx={{w: 1}}>
                            <TextField id="outlined-basic" label="End Date" value={endDate} variant="outlined" sx={{width: 1}} fullWidth color="error"/>
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