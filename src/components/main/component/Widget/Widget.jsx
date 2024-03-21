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


/***
 * @Author : jhlee
 * @date : 2024-02-26
 * @file : 단말 별 데이터 수집 시간을 기준으로 네트워크 상태를 세분화
 * @define : {
 * statusNmsCurrent : 네트워크 상태 타입 정의
 * runningList : 정상 단말 리스트
 * cautionList : 유의 단말 리스트
 * warningList : 경고 단말 리스트
 * faultyList : 장애 단말 리스트
 * useState({}) const[clickBackground] : 선택된 타입의 버튼 색상
 * @todo : {
 *    1) Diagnostic Chart & Widget 기능 연계
 * }
 * }
 */
const Widget = (props) => {
    //console.log(props)

    // 네트워크 상태 타입 정의
    const statusNmsCurrent = props.statusNmsCurrent;
    // 각 상태 타입별 단말기 리스트 지정
    const runningList = statusNmsCurrent.runningList;
    const cautionList = statusNmsCurrent.cautionList;
    const warningList = statusNmsCurrent.warningList;
    const faultyList = statusNmsCurrent.faultyList;

    /** Widget 에서 선택한 네트워크 상태 값과  */
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
    /** 데이터 생성 시간을 기준으로 임의로 설정한 단말의 네트워크 상태를 판별
     *  @component
     *  @param {string} type : 네트워크 세분화 종류 type key
     *  @param {string} title : 네트워크 세분화 종류 한글
     *  @param {string} isStatus : 네트워크 세분화 종류 영어
     *  @param {string} description : 네트워크 종류 분류 기준
     *  @param {string} diff : 단말 포함 범휘
     *  @param {int} count : 네트워크에 포함된 단말 개수
     *  @param {string} icon : 네트워크 심볼 아이콘 및 색상
     *  */
    const NetworkBox = ({ type, title, isStatus, description, diff, count, icon }) => (
        <Box className="construct_widget">
            <Box className="box_left">
                <Typography sx={{ color: TitleColorReturn(type), fontSize: '16px'}} gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" gutterBottom >{isStatus}</Typography>
                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>
                    {description}
                </Typography>
            </Box>

            <Box className="box_right">
                <Typography className="widget_percentage_positive" sx={{color: DiffColorReturn(type)}}>
                    {/*<KeyboardArrowDownIcon />*/}
                    {diff}
                </Typography>
                <Button
                    className="widget_count"
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
            </Box>
        </Box>
    )


    return(
        <>
            <Grid container spacing={1} className="network_status">
                <Grid item xs={3}>
                    <NetworkBox type="running"
                                title="정상"
                                isStatus="Running"
                                description="Max Period * 1.0"
                                diff="1.0 이하"
                                count={runningList.length}
                                icon={<PlayArrowOutlinedIcon className="widget_icon" style={{backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green",}}/>}
                    />
                </Grid>
                <Grid item xs={3}>
                    <NetworkBox type="caution"
                                title="경고"
                                isStatus="Caution"
                                description="Max Period * 1.5"
                                diff="1.0 초과 ~ 1.5 이하"
                                count={cautionList.length}
                                icon={<ErrorOutlineOutlinedIcon className="widget_icon" style={{backgroundColor: "rgba(218, 165, 32, 0.2)", color: "goldenrod",}}/>}
                    />
                </Grid>
                <Grid item xs={3}>
                    <NetworkBox type="warning"
                                title="위험"
                                isStatus="Warning"
                                description="Max Period * 3.0"
                                diff="1.5 초과 ~ 3.0 이하"
                                count={warningList.length}
                                icon={<WarningOutlinedIcon className="widget_icon" style={{color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)",}}/>}
                    />
                </Grid>
                <Grid item xs={3}>
                    <NetworkBox type="faulty"
                                title="장애"
                                isStatus="Faulty"
                                description="Max Period * 5.0"
                                diff="3.0 초과"
                                count={faultyList.length}
                        /*color: "black", backgroundColor: "rgba(150, 150, 150, 1)"*/
                        /*color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)"*/
                                icon={<DisabledByDefaultOutlinedIcon className="widget_icon" style={{color: "black", backgroundColor: "rgba(150, 150, 150, 1)"}}/>}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default Widget;