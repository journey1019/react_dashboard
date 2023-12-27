import {Grid} from "@mui/material";
import ApexRadial from "../../diagnostic/MixedChart/ApexRadial";
import GetDiagnostic from "../../diagnostic/GetDiagnostic";
import React, {useState} from "react";


const DetailSatellite = () => {
    const [getDiagnostic, setGetDiagnostic] = useState([]);
    function RateOfOperation(radialData) {
        setGetDiagnostic(radialData);
    }


    return(
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <div className="diagnostic">
                    <div className="diagnosticText">
                        <div className="diagnosticTitle">
                            Network Status Percentage
                        </div>
                    </div>
                    <hr/>
                    <div className="diagnosticContain">
                        <ApexRadial getDiagnostic={getDiagnostic}/>
                    </div>
                </div>
            </Grid>
            <Grid item xs={9}>
                <div className="diagnostic">
                    <GetDiagnostic RateOfOperation={RateOfOperation}/>
                </div>
            </Grid>
        </Grid>
    )
}

export default DetailSatellite;