// running / warning / dangerous / dead
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import {useEffect, useState} from "react";
import Button from '@mui/material/Button';

function Widget (props) {

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        warning:0,
        danger:0,
        dead:0,
    });


    useEffect( () => {

    }, [setDiffStatus]);


    console.log(props.diffStatus.running); // 13
    console.log(diffStatus); //{running: 0, warning: 0, danger: 0, dead: 0}
    const type = props.type;

    console.log(props); //{type: 'offline', diffStatus: {…}}

    console.log(props.info); //undefined
    /*props.diffStatus.map((item, index) =>{

    }, [props.diffStatus]);*/
    /*useEffect(() => {
    }, [props.diffStatus])*/


    /*useEffect(()=>{
        console.log(props.diffStatus);
        setDiffStatus(props.diffStatus);
    },[props.diffStatus])*/

    /*useEffect(()=>{
        console.log(props.diffStatus);
        setDiffStatus(props.diffStatus);
    },[props.diffStatus])*/
    const [clickBackground, setClickBackground] = useState("");

    /*useEffect(() => {
        props.diffStatus.map((type, index)=>{
            if
        })
    })*/


    useEffect(() => {
        if(props.statusClickValue == props.type) {
            setClickBackground("rgba(204, 223, 255, 1)")
        }
        else {
            setClickBackground("rgba(0, 0, 0, 0)")
        }

    }, [props.statusClickValue])


    let data;
    //temporary
    const diff = 20;

    switch (type) {
        case "running":
            data = {
                title: "Normal Operation",
                isState: "Running",
                link: "See All Power On",
                count: (props.diffStatus.running),
                icon: (
                    <PersonOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            color: "green",
                        }}
                    />
                ),
            };
            break;
        case "caution":
            data = {
                title: "Time Gap exceeds normal range",
                isState: "Caution",
                link: "View all On Standby",
                count: (props.diffStatus.warning),
                icon: (
                    <ShoppingCartOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(218, 165, 32, 0.2)",
                            color: "goldenrod",
                        }}
                    />
                ),
            };
            break;
        case "warning":
            data = {
                title: "Time Gap exceeds warning range",
                isState: "Warning",
                link: "View net warning",
                count: (props.diffStatus.danger),
                icon: (
                    <MonetizationOnOutlinedIcon
                        className="icon"
                        style={{
                            color: "crimson",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                        }}
                    />
                ),
            };
            break;
        case "faulty":
            data = {
                title: "Offline or Powered Down",
                isState: "Faulty",
                link: "See details of Offline",
                /*count: (props.diffStatus.dead),*/
                count: 0,
                icon: (
                    <AccountBalanceWalletOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "#a0a0a0",
                            color: "#464646",
                        }}
                    />
                ),
            };
            break;
        default:
            break;
    }


    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.isState}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <KeyboardArrowUpIcon />
                    {diff} %
                </div>
                <Button
                    className="count"
                    variant="outlined"
                    style = {{backgroundColor: clickBackground}}
                    onClick={(e) => {
                        let clkData ="";
                        if(props.statusClickValue!=props.type){
                            clkData = props.type;
                        }
                        props.StatusClick(clkData);
                    }}
                >
                    {data.count}
                </Button>
                {data.icon}
            </div>
        </div>
    );
};

export default Widget;
