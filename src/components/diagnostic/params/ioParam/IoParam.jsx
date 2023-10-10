import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import './ioParam.scss';
import ioParamData from './config/ioParamData.json';

import {Box, Stack, Button, Input, darken} from "@mui/material";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import {useTheme} from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import {Line} from "react-chartjs-2";
import MaterialReactTable from "material-react-table";


const IoParam = (props) => {

    console.log(props.ioParam);
    console.log(ioParamData);

    // ioParam 전체 개수 (하루에 수집한 IoParam Data 개수)
    const ioParamDataCount = Object.keys(ioParamData).length;


    const theme = useTheme();
    const [value, setValue] = useState(0);

    /* -------------- IoParam Tab -- */
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

    /* -------------- IoParam _ Chart Options -- */
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
                position: 'top',
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

    /* -------------- IoParam _ Table Datasets -- */
    const columns = useMemo(
        () => [
            {
                header: 'Time Stamp',
                accessorKey: 'timeStamp',
            },
            {
                header: 'Power Voltage',
                accessorKey: 'powerVoltage',
                size: 100,
            },
            {
                header: 'Sat Cnr',
                accessorKey: 'satCnr',
                size: 100,
            },
            {
                header: 'Sat In View',
                accessorKey: 'satInView',
                size: 100,
            },
            {
                header: 'Vehicle Power',
                accessorKey: 'vehiclePower',
                size: 100,
            }
        ]
    )

    const labels = ioParamData.map(x => x.timeStamp);
    const data = {
        labels,
        datasets: [
            {
                label: 'Power Voltage',
                data: ioParamData.map(x => x.powerVoltage),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                filler: true,
                pointStyle: 'circle',
                pointRadius: 5, // 기본 Point 반지름
                pointHoverRadius: 10, // Point 선택 시 반지금
                borderWidth: 2, // 기본 선 두께
            },
            {
                label: 'Sat Cnr',
                data: ioParamData.map(x => x.satCnr),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                filler: true,
                pointStyle: 'triangle',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: 'satInView',
                data: ioParamData.map(x => x.satInView),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                filler: false,
                pointStyle: 'rectRounded',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: 'vehiclePower',
                data: ioParamData.map(x => x.vehiclePower),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                filler: false,
                pointStyle: 'rectRot',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
        ]
    }



    if(ioParamData != '') {
        return (
            <>
                <div className="ioParam">
                    <Grid container spacing={1}>
                        <Grid item xs={7.5}>
                            <div className="ioParamData">
                                <div className="ioParamAllCount">
                                    <span className="arrayTitle">IoParam Data</span>
                                    <span className="ioParamDataCount">{ioParamDataCount}</span>
                                </div><hr/>

                                <div className="ioParam_Tabs_Charts">
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
                                            <TabPanel value={value} index={0} dir={theme.direction}>
                                                <MaterialReactTable
                                                    title="IoParam Table"
                                                    columns={columns}
                                                    data={ioParamData}

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
                        </Grid>
                        <Grid item xs={4.5}>
                            <div className="ioParamData">
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </>
        )
    }
    else {
        return null;
    }
}

export default IoParam;