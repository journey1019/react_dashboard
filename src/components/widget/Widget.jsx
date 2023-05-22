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



    useEffect(() =>{

    }, [setDiffStatus])

    console.log(props.diffStatus.running); // 13
    console.log(diffStatus); //{running: 0, warning: 0, danger: 0, dead: 0}
    const type = props.type;

    console.log(props); //{type: 'offline', diffStatus: {…}}

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

    let data;

      //temporary
    const diff = 20;

    switch (type) {
        case "run":
            data = {
            title: "Normal Operation",
            isState: "Running",
            link: "See All Power On",
                count: (props.diffStatus.running),
            icon: (
                <PersonOutlinedIcon
                    className="icon"
                    style={{
                        color: "crimson",
                        backgroundColor: "rgba(255, 0, 0, 0.2)",
                    }}
                />
            ),
            };
            break;
        case "standby":
            data = {
            title: "Time Gap exceeds normal range",
            isState: "Warning",
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
        case "shutdown":
            data = {
            title: "Time Gap exceeds warning range",
            isState: "Danger",
            link: "View net danger",
                count: (props.diffStatus.danger),
            icon: (
                <MonetizationOnOutlinedIcon
                    className="icon"
                    style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
                />
            ),
            };
            break;
        case "offline":
            data = {
            title: "Offline or Powered Down",
            isState: "Dead",
            link: "See details of Offline",
                /*count: (props.diffStatus.dead),*/
                count: 0,
            icon: (
                <AccountBalanceWalletOutlinedIcon
                    className="icon"
                    style={{
                        backgroundColor: "rgba(128, 0, 128, 0.2)",
                        color: "purple",
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
                    classNamt="count"
                    variant="outlined"
                    onClick={(e) => {
                        alert("hello")
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
