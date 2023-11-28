import "./Widgets.scss";
import { useState, useEffect } from 'react';

const Widgets = (props) => {
    const [open, setOpen]= useState(false);
    
    const [deviceStatus, setDeviceStatus] = useState({
        preRunning: [],
        preCaution: [],
        preWarning: [],
        preFaulty: [],
    })

    const [befoDeviceStatus, setBefoDeviceStatus] = useState({
        pastRunning: [],
        pastCaution: [],
        pastWarning: [],
        pastFaulty: [],
    })

    useEffect(() => {

    }, [deviceStatus, befoDeviceStatus]);

    const type = props.type;

    switch (type) {
        case "running" :
            /*data = {
                title: (props.deviceStatus.preRunning.length) - (props.befoDeviceStatus.pastRunning.length),
                options: 
            }*/
    }

}