import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import './diagnosticParam.scss';

import Grid from "@mui/material/Grid";
import {Box, Button, darken} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import {Line} from "react-chartjs-2";
import MaterialReactTable from "material-react-table";

import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import {useTheme} from "@mui/material/styles";
import {withStyles} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";


const DiagnosticParam = (props) => {

    useEffect(() => {
    }, [props.diagnosticParam])

    const [diagDailyObj, setDiagDailyObj] = useState([]);
    const [diagHourArr, setDiagHourArr] = useState([]);

    const theme = useTheme();
    const [value, setValue] = useState(0);

    /* -------------- Diagnostic_Hour Table Columns -- */
    const columns = useMemo(
        () => [
            {
                header: 'Event Date',
                accessorKey: 'eventDate',
            },
            {
                header: 'ST6100 가동 후 경과시간',
                accessorKey: 'st6100On',
            },
            {
                header: '위성 연결시간',
                accessorKey: 'satOnTime',
            },
            {
                header: '위성 신호레벨',
                accessorKey: 'satCnr',
            },
            {
                header: '위성 끊김 횟수',
                accessorKey: 'satCutOffCount',
            },
            {
                header: '전원 ON 횟수',
                accessorKey: 'powerOnCount',
            },
        ]
    )


    if(props.diagnosticParam != '') {

        console.log(props.diagnosticParam);


        props.diagnosticParam.map(function (date) {
            let dailyArrayList = [];

            console.log(date);

            /* Daily Object */
            console.log(date.daily);
            dailyArrayList.push(date.daily);

            /* Hour Array */
            console.log(date.hour);

            setDiagDailyObj(dailyArrayList);
            console.log(dailyArrayList);

            setDiagHourArr(date.hour);
        });


        console.log(diagDailyObj);
        console.log(diagHourArr); // Hour Array Data


        /* ------------------- Diagnostic_Daily -------------------------------*/

        /*for(const key of Object.keys({diagDailyObj})) {
            console.log(key);
        }*/

        /*useEffect(() => {
            console.log(Object.entries(diagDailyObj(0)))
        }, [diagDailyObj])*/

        /*const eventDateArr = [];
        for ( const event of diagDailyObj){
            eventDateArr.push(event.eventDate)
        }
        console.log(eventDateArr);*/


        function DiagDailyObj({dailyObjList}) {
            /*for(let key of Object.keys(dailyObjList)) {
                console.log(key);
            }
            for(let value of Object.values(dailyObjList)) {
                console.log(value);
            }*/
            return (
                <div className="point">
                    <div className="dailyParamValue">
                    <span className="topKey">
                        Event Date
                    </span>
                        <hr/>
                        <span className="bottomValue" style={{fontSize: '12px'}}>
                        {dailyObjList.eventDate}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        ST6100 경과시간
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.st6100On}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        위성연결시간
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.satOnTime}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        위성신호레벨
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.satCnr}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        위성 끊김
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.satCutOffCount}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        데이터 전송
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.sendDataCount}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        배터리 충전
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.batChargeTime}
                    </span>
                    </div>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        전원 On
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {dailyObjList.powerOnCount}
                    </span>
                    </div>
                </div>
            )
        }

        /* ------------------- Diagnostic_Hour -------------------------------*/

        /* -------------- Diagnostic_Hour Tab -- */
        function TabPanel(props) {
            const {children, value, index, ...other} = props;

            return (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`full-width-tabpanel-${index}`}
                    aria-labelledby={`full-width-tab-${index}`}
                    {...other}
                >
                    {value === index && (
                        <Box sx={{p: 3}}>
                            <Typography>{children}</Typography>
                        </Box>
                    )}
                </div>
            );
        }

        TabPanel.propTypes = {
            children: PropTypes.node,
            index: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired,
        };

        function a11yProps(index) {
            return {
                id: `full-width-tab-${index}`,
                'aria-controls': `full-width-tabpanel-${index}`,
            };
        }


        const handleChange = (event, newValue) => { //Tabs
            setValue(newValue);
        };

        const handleChangeIndex = (index) => { //Tabs Items
            setValue(index);
        };

        /* -------------- Diagnostic_Hour Chart Option -- */
        const options = {
            responsive: true,
            interactions: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                tooltip: {
                    enable: true,
                    mode: 'index',
                    position: 'nearest',
                    intersect: false,
                    usePointStyle: true,
                },
                legend: {
                    position: 'left',
                    labels: {
                        usePointStyle: true, // Legend_PointStyle
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    gridLines: {
                        color: 'rgba(166, 201, 226, 1)',
                        lineWidth: 1
                    }
                },
            },
        };

        /* -------------- Diagnostic_Hour Table Datasets -- */
        const labels = diagHourArr.map(x => x.eventDate);
        const data = {
            labels,
            datasets: [
                {
                    label: 'ST6100 경과시간',
                    data: diagHourArr.map(x => x.st6100On),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    filler: true,
                    pointStyle: 'circle',
                    pointRadius: 5, // 기본 Point 반지름
                    pointHoverRadius: 10, // Point 선택 시 반지금
                    borderWidth: 2, // 기본 선 두께
                },
                {
                    label: '위성 연결시간',
                    data: diagHourArr.map(x => x.satOnTime),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    filler: true,
                    pointStyle: 'triangle',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    borderWidth: 2,
                },
                {
                    label: '위성 신호레벨',
                    data: diagHourArr.map(x => x.satCnr),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    filler: false,
                    pointStyle: 'rectRounded',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    borderWidth: 2,
                },
                {
                    label: '위성 끊김 횟수',
                    data: diagHourArr.map(x => x.satCutOffCount),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    filler: false,
                    pointStyle: 'rectRot',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    borderWidth: 2,
                },
                {
                    label: '전원 ON 횟수',
                    data: diagHourArr.map(x => x.powerOnCount),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    filler: false,
                    pointStyle: 'star',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    borderWidth: 2,
                },
            ]
        }

        /* -------------- Diagnostic_Hour Table Theme -- */
        const BorderLinearProgress = withStyles((theme) => ({
            root: {
                height: 30,
                borderRadius: 0
            },
            colorPrimary: {
                backgroundColor:
                    theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
            },
            bar: {
                borderRadius: 0,
                // how  to change color according to value???
                backgroundColor: `${props.colorPrimary} !important`
            }
        }))(LinearProgress);


        return (
            <>
                <div className="diagnosticParam">
                    {/*<Item>Data</Item>*/}
                    {/*--------------- Diagnostic ---------------*/}
                    {/* Daily Part */}
                    <div className="diagnosticParams">
                        <span className="arrayTitle">Daily</span>
                        {diagDailyObj.map((dailyObjList) => (
                            <DiagDailyObj dailyObjList={dailyObjList} key={dailyObjList.eventDate}/>
                        ))}

                        {/*{diagnosticParam()}*/}
                    </div>
                    <br/><br/>

                    {/* Hour Tab Part */}
                    <div className="diagnosticParams">
                        <span className="arrayTitle">Hour</span>
                        <br/>
                        <Box sx={{width: '500px', boxShadow: 3, marginTop: '5px'}}>
                            <AppBar position="static"
                                    sx={{backgroundColor: 'white', color: 'black', width: '100%'}}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="secondary"
                                    textColor="secondary" //inherit
                                    variant="fullWidth"
                                    aria-label="full width tabs example"
                                >
                                    <Tab label="Chart" {...a11yProps(0)} />
                                    <Tab label="Table" {...a11yProps(1)} />

                                </Tabs>
                            </AppBar>
                        </Box>

                        <Box sx={{backgroundColor: 'background.paper', width: '100%', boxShadow: 3}}>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={value}
                                onChangeIndex={handleChangeIndex}
                            >
                                {/* Chart */}
                                <TabPanel value={value} index={0} dir={theme.direction}>
                                    <div className="chart-container" style={{
                                        justifyContent: 'space-between',
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        width: '1000px',
                                        height: '500px'
                                    }}>
                                        <Line options={options} data={data}/>
                                    </div>
                                </TabPanel>

                                {/* Table */}
                                <TabPanel value={value} index={1} dir={theme.direction}>
                                    <MaterialReactTable
                                        title="NMS Current Table"
                                        columns={columns}
                                        data={diagHourArr}

                                        // 줄바꿈 Theme
                                        muiTablePaperProps={{
                                            elevation: 0,
                                            sx: {
                                                borderRadius: '0',
                                                border: '1px dashed #e0e0e0',
                                            },
                                        }}
                                        // Table Theme
                                        muiTableBodyProps={{
                                            sx: (theme) => ({
                                                '& tr:nth-of-type(odd)': {
                                                    backgroundColor: darken(theme.palette.background.default, 0.1),
                                                },
                                            }),
                                        }}
                                    />
                                </TabPanel>
                            </SwipeableViews>
                        </Box>
                    </div>
                </div>
            </>
        )
    }
    else {
        return null;
    }
};

export default DiagnosticParam;