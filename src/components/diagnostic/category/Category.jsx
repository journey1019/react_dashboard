import "./category.scss";
import {useMemo} from "react";
import {Box, Stack} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Input } from '@mui/material';
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField';
import MaterialReactTable from 'material-react-table';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

const Category = ({type}) => {


    /*const averageSalary = useMemo(
        () => data.reduce((acc, curr) => acc + curr.salary, 0) / data.length,
        [],
    );

    const maxAge = useMemo(
        () => data.reduce((acc, curr) => Math.max(acc, curr.age), 0),
        [],
    );

    const columns = useMemo(
        () => [
            {
                header: 'First Name',
                accessorKey: 'firstName',
                enableGrouping: false, //do not let this column be grouped
            },
            {
                header: 'Last Name',
                accessorKey: 'lastName',
            },
            {
                header: 'Age',
                accessorKey: 'age',
                aggregationFn: 'max', //show the max age in the group (lots of pre-built aggregationFns to choose from)
                //required to render an aggregated cell
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Oldest by{' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box
                            sx={{ color: 'info.main', display: 'inline', fontWeight: 'bold' }}
                        >
                            {cell.getValue()}
                        </Box>
                    </>
                ),
                Footer: () => (
                    <Stack>
                        Max Age:
                        <Box color="warning.main">{Math.round(maxAge)}</Box>
                    </Stack>
                ),
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
                //optionally, customize the cell render when this column is grouped. Make the text blue and pluralize the word
                GroupedCell: ({ cell, row }) => (
                    <Box sx={{ color: 'primary.main' }}>
                        <strong>{cell.getValue()}s </strong> ({row.subRows?.length})
                    </Box>
                ),
            },
            {
                header: 'State',
                accessorKey: 'state',
            },
            {
                header: 'Salary',
                accessorKey: 'salary',
                aggregationFn: 'mean',
                //required to render an aggregated cell, show the average salary in the group
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Average by{' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            {cell.getValue()?.toLocaleString?.('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </Box>
                    </>
                ),
                //customize normal cell render on normal non-aggregated rows
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue()?.toLocaleString?.('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </>
                ),
                Footer: () => (
                    <Stack>
                        Average Salary:
                        <Box color="warning.main">
                            {averageSalary?.toLocaleString?.('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </Box>
                    </Stack>
                ),
            },
        ],
        [averageSalary, maxAge],
    );*/
    /*let data;
    switch (type) { // props.type
        case "running":
            data = {
                title: 'Power Voltage',
                isState: "Running",
                link: "See All Power On",
                diff: "100% 이하",
                count: 3,
                icon: (
                    <PlayArrowOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            color: "green",
                        }}
                    />
                ),
            };
            break;
        case "caution":
            data = {
                title: 'Power Voltage',
                isState: "Running",
                link: "See All Power On",
                diff: "100% 이하",
                count: 3,
                icon: (
                    <PlayArrowOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            color: "green",
                        }}
                    />
                ),
            };
            break;
        case "warning":
            data = {
                title: 'Power Voltage',
                isState: "Running",
                link: "See All Power On",
                diff: "100% 이하",
                count: 3,
                icon: (
                    <PlayArrowOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            color: "green",
                        }}
                    />
                ),
            };
            break;
        case "faulty":
            data = {
                title: 'Power Voltage',
                isState: "Running",
                link: "See All Power On",
                diff: "100% 이하",
                count: 3,
                icon: (
                    <PlayArrowOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            color: "green",
                        }}
                    />
                ),
            };
            break;
        default:
            break;
    }*/
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
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



    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    return(
        <>
            <div className="category">
                <Box sx={{ width: '500px', boxShadow: 3 }}>
                    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', width: '100%'}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="secondary" //inherit
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                </Box>
                <Box sx={{ backgroundColor: 'background.paper', width: '80%', boxShadow: 3 }}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            Item One
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            Item Two
                        </TabPanel>
                        <TabPanel value={value} index={2} dir={theme.direction}>
                            Item Three
                        </TabPanel>
                    </SwipeableViews>
                </Box>
            {/*<div className="widget" style={{backgroundColor: 'white'}}>
                <div className="left">
                    <span className="title">{data.title}</span>
                    <span className="counter">
                        3
                    </span>
                    <span className="link">{data.link}</span>
                </div>
                <div className="right">
                    <div className="percentage positive">
                        100%
                    </div>
                    {data.icon}
                </div>
            </div><br/>*/}
                {/*<div className="inquiry">
                    <div className="inquiry date">
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{padding: '0px'}}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className="inquiry input">
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                    </div>
                    <div className="inquiry btn">
                        <Button variant="contained" size="small">Search</Button>
                    </div>
                </div>
                <div className="statusInfo">
                    <div className="table">
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableColumnResizing
                            enableGrouping
                            enableStickyHeader
                            enableStickyFooter
                            initialState={{
                                density: 'compact',
                                expanded: true, //expand all groups by default
                                grouping: ['state'], //an array of columns to group by by default (can be multiple)
                                pagination: { pageIndex: 0, pageSize: 20 },
                                sorting: [{ id: 'state', desc: false }], //sort by state by default
                            }}
                            muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                            muiTableContainerProps={{ sx: { maxHeight: 700 } }}
                        />
                    </div>
                </div>*/}
            </div>
        </>
    )
}

export default Category;