import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import './ioParam.scss';

const IoParam = (props) => {

    console.log(props.ioParam);

    if(props.ioParam != '') {
        return(
            <>
                <div className="IoParam">
                    IoParam
                </div>
            </>
        )
    }
    else{
        return null;
    }
}

export default IoParam;