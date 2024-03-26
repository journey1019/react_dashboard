import { useEffect, useRef, useState } from 'react';

import Table from "../main/component/Table/Table";
import Main from "../main/Main";

import ReturnRequest from "../modules/ReturnRequest";

/** K.O IoT GWY URL */
import { koIotUrl } from 'config';

const CurrentData = () => {
    const currentDataUrls = koIotUrl + "/nms/currentData";

    const currentDataParams = {detailMessage: true}

    const [nmsCurrent, setNmsCurrent] = useState([]);

    useEffect(() => {
        ReturnRequest(currentDataUrls, currentDataParams, null).then(result=>{if(result!=null){setNmsCurrent(result)}})
    }, [])

    console.log(nmsCurrent)

    return(
        <>
            <Main nmsCurrent={nmsCurrent} />
            <Table nmsCurrent={nmsCurrent} />
        </>
    )
}

export default CurrentData;