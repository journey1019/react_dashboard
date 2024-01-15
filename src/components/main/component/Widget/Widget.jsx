/* React */
import React, { useState, useEffect, useMemo } from 'react';

/* Import */
import './widget.scss';
import TitleColorReturn from "./style/TitleColorReturn";
import DiffColorReturn from "./style/DiffColorReturn";

/* MUI */
import {Box, Grid, Container, Menu, MenuItem, Button, IconButton, darken, Typography} from "@mui/material";

/* Icon */
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';


const Widget = (props) => {

    // 네트워크 상태 타입 정의
    const type = props.type;
    const statusNmsCurrent = props.statusNmsCurrent;
    let data;

    // 각 상태 타입별 단말기 리스트 지정
    const runningList = statusNmsCurrent.runningList;
    const cautionList = statusNmsCurrent.cautionList;
    const warningList = statusNmsCurrent.warningList;
    const faultyList = statusNmsCurrent.faultyList;

    /* 버튼 클릭 이벤트 */
    // 카운트 버튼 작동 시, ( 클릭값 = 네트워크 타입 ) 색상 변경
    const [clickBackground, setClickBackground] = useState("");
    useEffect(() => {
        if(props.statusClickValue === props.type) {
            setClickBackground("rgba(255, 204, 204, 1)")
        }
        else {
            setClickBackground("rgba(0, 0, 0, 0)")
        }
    }, [props.statusClickValue])

    /* 네트워크 상태 타입 */
    switch (type) {
        case "running":
            data = {
                title: "정상",
                isStatus: "Running",
                description: "최대기간(Max Period) X 1",
                diff: "1.0 이하",
                count: runningList.length,
                icon: (
                    <PlayArrowOutlinedIcon
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
                title: "유의",
                isStatus: "Caution",
                description: "최대기간(Max Period) X 1.5",
                diff: "1.0초과~1.5이하",
                count: cautionList.length,
                icon: (
                    <ErrorOutlineOutlinedIcon
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
                title: "경고",
                isStatus: "Warning",
                description: "최대기간(Max Period) X 3.0",
                diff: "1.5초과~3.0이하",
                count: warningList.length,
                icon: (
                    <WarningOutlinedIcon
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
                title: "위험",
                isStatus: "Faulty",
                description: "최대기간(Max Period) X 5.0",
                diff: "3.0초과",
                count: faultyList.length,
                icon: (
                    <DisabledByDefaultOutlinedIcon
                        className="icon"
                        style={{
                            /*color: "black",
                            backgroundColor: "rgba(150, 150, 150, 1)",*/
                            color: "crimson",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                        }}
                    />
                ),
            };
            break;
        default:
            break;
    }


    return(
        <>
            <Grid className="widget" container spacing={0}>
                <Grid item xs={7} sm={7} className="left">
                    <Typography sx={{ color: TitleColorReturn(type), fontSize: '16px'}}>
                        {data.title}
                    </Typography>
                    <Typography variant="h4" gutterBottom >{data.isStatus}</Typography>
                    <Typography sx={{color: 'gray'}}>
                        {data.description}
                    </Typography>
                </Grid>

                <Grid item xs={5} sm={5} className="right">
                    <Typography className="percentage_positive" sx={{color: DiffColorReturn(type)}}>
                        <KeyboardArrowDownIcon />
                        {data.diff}
                    </Typography>
                    <Button
                        className="count"
                        variant="outlined"
                        color="error"
                        style={{ backgroundColor: clickBackground}}
                        onClick={(e) => {
                            let clkData ="";
                            if(props.statusClickValue !== props.type){ // caution !== running
                                clkData = props.type; // running --> Table
                            }
                            props.StatusClick(clkData); // running
                        }}
                    >
                        {data.count}
                    </Button>
                    {data.icon}
                </Grid>
            </Grid>
        </>
    )
}

export default Widget;