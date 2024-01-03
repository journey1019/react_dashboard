import {Grid} from "@mui/material";
import React from "react";

const DetailHistoryChart = () => {
    return(
        <div className="deviceInfo">
            <Grid item sm={12}>
                <div className="deviceIdText">
                    <div className="deviceIdTitle">
                        History Chart
                    </div><hr/>
                    <div className="historyChart">
                        {/*<History width={1200}/>*/}
                    </div>
                </div>
            </Grid>
            {/*<History />*/}
        </div>
    )
}

export default DetailHistoryChart;