/* React */
import React, {useState, useEffect} from "react";

/* Import */
import "./deviceInput.scss";
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

/* MUI */
import {FormControl, InputLabel, Select, MenuItem, Button, Grid} from "@mui/material";

/* Icon */
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


/**
 * @date: 2024-03-11
 * @file: {
 *     Device Input Value 입력
 *     Device.jsx 모든 컴포넌트에게 전달 및 적용
 * }
 * @property: {
 *     tableSelectDeviceId : Table.jsx 에서 선택한 Row 의 deviceId
 *     -> deviceId = Main.jsx -> Table.jsx -> DrawerDevice.jsx -> Device.jsx
 *     sessionNmsCurrent : Main 에서 세션에 저장한 nmsCurrent
 *     -> sessionNmsCurrent = Main.jsx -> (Session) -> Device.jsx
 * }
 * @desc: {
 *     useState({}) const[deviceId, setDeviceId] : 단말 Id
 *     -> deviceId = Input Value(deviceId) or Table Select Row(tableSelectDeviceId by Table.jsx)
 *     useState({}) const[startDate, setStartDate] : 시작 날짜
 *     -> startDate : Today - 30 (default)
 *     useState({}) const[endDate, setEndDate] : 종료 날짜
 *     -> endDate : Today (default)
 *
 *     formattedStartDate : Device.jsx 에 전달 및 적용
 *     -> 형식 : YYYY-MM-DDTHH:mm:ss
 *     formattedEndDate : Device.jsx 에 전달 및 적용
 *     -> 형식 : YYYY-MM-DDTHH:mm:ss
 * }
 * @todo: {
 *     1) 각 태그 Width 및 상하 중앙 정렬
 * }
 * */
const DeviceInput = (props) => {
    const { tableSelectDeviceId, sessionNmsCurrent, ...otherProps } = props;


    /** Input Value */
    const [deviceId, setDeviceId] = useState(tableSelectDeviceId || null);

    const [startDate, setStartDate] = useState(dayjs().subtract(30, 'days'));
    const [endDate, setEndDate] = useState(dayjs());

    const handleSelectDeviceIdChange = (event) => {
        const deviceId = event.target.value;
        setDeviceId(deviceId);
    }
    const handleSelectClose = () => {
        setDeviceId(null);
    }


    /**
     * @desc: Input Values 입력 시 모든 컴포넌트에게 전달 및 조회
     * @trigger: deviceId, startDate, endDate : Input Values
     * @path: DeviceInput.jsx -> Device -> All Component
     * */
    useEffect(() => {
        const formattedStartDate = startDate.format('YYYY-MM-DDTHH:mm:ss');
        //console.log('Formatted Start Date:', formattedStartDate);
        const formattedEndDate = endDate.format('YYYY-MM-DDTHH:mm:ss');
        //console.log('Formatted Current Date:', formattedEndDate);

        // 상태 업데이트 후 다른 처리 가능
        // 다른 컴포넌트로 전달할 수 있음 (props, context, 등을 활용)
        props.InputSelectDevice(deviceId, formattedStartDate, formattedEndDate);
    }, [deviceId, startDate, endDate]);



    return(
        <Grid className="deviceInput_construct" container spacing={0}>
            <Grid item xs={4.5} sm={4.5} className="deviceInput_construct_deviceId_input_component">
                <SearchIcon style={{ width: '4em'}}/>
                <FormControl color="error" fullWidth sx={{pt: 1}}>
                    <InputLabel id="demo-simple-select-label">Select Device Id</InputLabel>
                    <Select
                        label="deviceId"
                        MenuProps={{
                            sx: {
                                "&& .Mui-selected": {
                                    backgroundColor: "pink",
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
                        {/*{deviceId && (
                            <div>
                                <h2>Selected Object:</h2>
                                <p>ID: {deviceId}</p>
                                <p>Name: {props.sessionNmsCurrent.find((item) => item.deviceId === deviceId)?.vhcleNm}</p>
                            </div>
                        )}*/}
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
            <Grid item xs={6} sm={6} className="deviceInput_construct_deviceId_input_component">
                <CalendarTodayIcon style={{ width: '4em'}}/>
                {/*<Grid container spacing={0}>
                        <Grid item xs={6} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >
                                    <DateTimePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >
                                    <DateTimePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                    </Grid>*/}
                <Grid container >
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <DateTimePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        style= {{ width: '100%' }}
                                    />
                                </div>
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <DateTimePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                {/*<Box sx={{ display: 'flex', width: '-webkit-fill-available' }}>
                    <Grid item sm={12} sx={{w: 1}} sx={{display: 'flex'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >
                                <DateTimePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                />
                                <DateTimePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                </Box>*/}
            </Grid>

            {/* Button */}
            <Grid item xs={1.5} sm={1.5} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button variant="contained" color="error" size="large" sx={{ textAlign: 'center', alignItems: 'center'}}>Search</Button>
            </Grid>

        </Grid>
    )
}

export default DeviceInput;