import React, {useState, useEffect, useContext, useMemo} from "react";

import Box from "@mui/material/Box";
import History from "../../TableComponents/History/History";
import HistoryChart from "../../TableComponents/History/HistoryChart";


const DetailHistory = () => {

    const [nmsHistory, setNmsHistory] = useState([]);
    function HistoryData(data) {
        setNmsHistory(data)
    }


    return(
        <>
            <div className="deviceInfo">
                <div className="deviceIdText" >
                    <div className="deviceIdTitle">
                        History Table
                    </div><hr/>
                    <Box>
                        <History HistoryData={HistoryData}/>
                    </Box>
                    {/*<Box sx={{width: '90vw', p: 1}}>
                                <History />
                                <Grid item xs={12}>
                                </Grid>
                            </Box>*/}
                </div>
            </div>
            {/*<div className="deviceInfo">
                <div className="deviceIdText" >
                    <div className="deviceIdTitle">
                        History Chart
                    </div><hr/>
                    <Box>
                        <HistoryChart />
                    </Box>
                    <Box sx={{width: '90vw', p: 1}}>
                                <History />
                                <Grid item xs={12}>
                                </Grid>
                            </Box>
                </div>
            </div>*/}
        </>
    )
}


export default DetailHistory;