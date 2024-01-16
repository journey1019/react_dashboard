/* React */
import React, { useState, useEffect } from "react";

/* Import */
import "./deviceDiagnostic.scss";
import ReturnRequest from "../../../modules/ReturnRequest";

/* MUI */
import {Grid, Box} from "@mui/material";
import SatelliteOperationRate from "./diagnostic/satelliteRate/SatelliteOperationRate";
import SatelliteMultiChart from "./diagnostic/satelliteChart/SatelliteMultiChart";

const DeviceDiagnostic = (props) => {

    console.log(props);
    console.log(props.getOneDiagnostic);
    const getOneDiagnostic = props.getOneDiagnostic;


    return(
        <>
            <Grid className="input" container spacing={0}>
                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        Diagnostic
                    </div>
                    <hr/>
                    <div className="device_satellite_construct_contained">
                        <SatelliteOperationRate />

                        <SatelliteMultiChart getOneDiagnostic={getOneDiagnostic}/>
                    </div>
                </Box>
            </Grid>
        </>
    )
}

export default DeviceDiagnostic;