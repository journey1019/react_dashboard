import React from "react";
import {Box, Grid, Typography} from "@mui/material";

const ConditionsToggle = ({title, color, percentage, maxTitle, max, unit, minTitle, min, averageTitle, average}) => {

    return(
        <Grid item xs={12}>
            <Box className="diagnosticWidget_construct_toggle">
                <Box className="diagnosticWidget_construct_top">
                    <Typography className="diagnosticWidget_top_title" variant="h5" >{title}</Typography>
                    <Box className="diagnosticWidget_top_percentage" backgroundColor={color}>{percentage} %</Box>
                    {/*<Box className="deviceWidget_icon" sx={{backgroundColor:'#FF666B'}}> 80 % </Box>*/}
                </Box>
                <Box sx={{paddingLeft : '20px'}}><hr/></Box>
                <Box className="diagnosticWidget_construct_component">
                    <Box sx={{display: 'block', color: '#606060'}}>
                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                            <Typography variant="h8">{maxTitle}</Typography>
                            <Typography variant="h8">{max} {unit}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                            <Typography variant="h8">{minTitle}</Typography>
                            <Typography variant="h8">{min} {unit}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                            <Typography variant="h8">{averageTitle}</Typography>
                            <Typography variant="h8">{average} {unit}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Grid>
    )
}

export default ConditionsToggle;