import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material/styles";
import "./DeviceDetailForm.scss"
import {Box, Button, Grid, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import Switch from '@mui/material/Switch';


const DeviceDetailForm = (props) => {

    const H5 = styled('h2')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: '15px',
    }));

    const [age, setAge] = useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const [checked, setChecked] = React.useState(true);
    const handleChange1 = (event) => {
        setChecked(event.target.checked);
    };


    return(
        <div style={{marginLeft:"10px", paddingLeft:"5px"}}>
            <form id="deviceSetForm">
                <Grid container spacing={1} style={{width:"100%"}}>

                    <Grid container xs={12} sm={12}>
                        <Grid item xs={3} sm={3} ><H5>Device ID</H5><TextField/></Grid>
                        <Grid item xs={3} sm={3} ><H5>Device Nm</H5><TextField/></Grid>
                        <Grid item xs={3} sm={3} >
                            <H5>Manage Crp</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manage_crp_select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={3} sm={3} >
                            <H5>Crp</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manage_crp_select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container xs={12} sm={12} >
                        <Grid item xs={3} sm={3}><H5>Api Access</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manage_crp_select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select></Grid>
                        <Grid item xs={3} sm={3}>
                            <H5>GROUP</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manage_crp_select"
                                value={age}
                                label="Age"
                                onChange={handleChange}

                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6} sm={6}><H5>IN GROUP</H5><TextField style={{width:"90%"}}/></Grid>
                    </Grid>
                    <Grid container xs={12} sm={12}>
                        <Grid item xs={6} sm={6} ><H5>WARNING</H5></Grid>
                        <Grid item xs={6} sm={6} ><H5>DANGER</H5></Grid>

                    </Grid>
                    <Grid container xs={12} sm={12}>
                        <Grid item xs={3} sm={3} ><H5>MIN</H5><TextField/></Grid>
                        <Grid item xs={3} sm={3} ><H5>MAX</H5><TextField/></Grid>
                        <Grid item xs={3} sm={3} ><H5>MIN</H5><TextField/></Grid>
                        <Grid item xs={3} sm={3} ><H5>MAX</H5><TextField/></Grid>
                    </Grid>

                    <Grid container xs={12} sm={12}>
                        <Grid item xs={3} sm={3} >
                            <H5>Default Location</H5>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="manage_crp_select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={3} sm={3} ><H5>LATITUDE</H5><TextField/></Grid>
                        <Grid item xs={3} sm={3} ><H5>LONGITUDE</H5><TextField/></Grid>
                        <Grid container xs={3} sm={3} >
                            <Grid item xs={6} sm={6}>
                                <H5>USE</H5>
                                <Switch
                                    checked={checked}
                                    onChange={handleChange1}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    size="large"
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <H5><br/></H5>
                                <Button
                                    className='device_Btn'
                                    variant='contained' size='medium'
                                    //onClick={modalShow}
                                    style={{zIndex: 1}}
                                >
                                    SAVE
                                </Button>
                            </Grid>

                        </Grid>
                    </Grid>



                </Grid>
                    {/*<tbody>
                        <tr>
                            <td><H5>Device ID</H5></td>
                            <td><TextField/></td>
                            <td><H5>Device Nm</H5></td>
                            <td><TextField/></td>
                            <td><H5>Manage Crp</H5></td>
                            <td>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </td>
                            <td><H5>Manage Crp</H5></td>
                            <td>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-small"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td><H5>Api Access</H5></td>
                            <td colSpan={2}><TextField/></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>*/}

            </form>
        </div>
    )
}

export default DeviceDetailForm;