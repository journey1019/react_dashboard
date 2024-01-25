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
    console.log(props)

    // 네트워크 상태 타입 정의
    const statusNmsCurrent = props.statusNmsCurrent;
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
    const NetworkBox = ({ type, title, isStatus, description, diff, count, icon }) => (
        <Box className="widget" sx={{p:2, m:1 }}>
            <Grid item xs={7} className="left">
                <Typography sx={{ color: TitleColorReturn(type), fontSize: '16px'}}>
                    {title}
                </Typography>
                <Typography variant="h4" gutterBottom >{isStatus}</Typography>
                <Typography variant="h6" sx={{color: 'gray'}}>
                    {description}
                </Typography>
            </Grid>

            <Grid item xs={5} className="right">
                <Typography className="percentage_positive" sx={{color: DiffColorReturn(type)}}>
                    <KeyboardArrowDownIcon />
                    {diff}
                </Typography>
                <Button
                    className="count"
                    variant="outlined"
                    color="error"
                    style={{ backgroundColor: clickBackground, fontSize: "medium" }}
                    onClick={(e) => {
                        let clkData ="";
                        if(props.statusClickValue !== type){ // caution !== running
                            clkData = type; // running --> Table
                        }
                        props.StatusClick(clkData); // running
                    }}
                >
                    {count}
                </Button>
                {icon}
            </Grid>
        </Box>
    )


    return(
        <>
            <Grid container spacing={0} className="network_status">
                <Grid item xs={6}>
                    <NetworkBox type="running"
                                title="정상"
                                isStatus="Running"
                                description="최대기간(Max Period) X 1.0"
                                diff="1.0 이하"
                                count={runningList.length}
                                icon={<PlayArrowOutlinedIcon className="icon" style={{backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green",}}/>}
                    />
                    <NetworkBox type="caution"
                                title="경고"
                                isStatus="Caution"
                                description="최대기간(Max Period) X 1.5"
                                diff="1.0 초과 ~ 1.5 이하"
                                count={cautionList.length}
                                icon={<ErrorOutlineOutlinedIcon className="icon" style={{backgroundColor: "rgba(218, 165, 32, 0.2)", color: "goldenrod",}}/>}
                    />
                </Grid>
                <Grid item xs={6}>
                    <NetworkBox type="warning"
                                title="위험"
                                isStatus="Warning"
                                description="최대기간(Max Period) X 3.0"
                                diff="1.5 초과 ~ 3.0 이하"
                                count={warningList.length}
                                icon={<WarningOutlinedIcon className="icon" style={{color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)",}}/>}
                    />
                    <NetworkBox type="faulty"
                                title="장애"
                                isStatus="Faulty"
                                description="최대기간(Max Period) X 5.0"
                                diff="3.0 초과"
                                count={faultyList.length}
                                /*color: "black", backgroundColor: "rgba(150, 150, 150, 1)",*/
                                icon={<DisabledByDefaultOutlinedIcon className="icon" style={{color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)",}}/>}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default Widget;