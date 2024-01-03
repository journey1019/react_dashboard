import {Grid} from "@mui/material";
import DetailAlarmHistory from "../detailAlarmHistory/DetailAlarmHistory";
import React from "react";

const DetailEventTime = () => {
    return(
        <>
            <div className="deviceInfo">
                <Grid item sm={12}>
                    <div className="deviceIdText">
                        <div className="deviceIdTitle">
                            Event Time Line
                        </div>
                        <div className="deviceIdSubTitle">
                            Event Time Line Contain
                        </div><hr/>
                        <div className="deviceIdSubTitle">
                            <DetailAlarmHistory />
                        </div>
                    </div>
                </Grid>
            </div><br/><br/>
        </>
    )
}
export default DetailEventTime;