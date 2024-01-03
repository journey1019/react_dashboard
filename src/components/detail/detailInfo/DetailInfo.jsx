import React, {useState, useEffect, useContext, useMemo} from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import {Grid} from "@mui/material";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const DetailInfo = () => {

    return(
        <>
            <Box className="deviceInfo">
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', padding: '30px 30px 10px 30px', width: 1 }}>
                    <Tooltip title="Account settings" sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Avatar sx={{ width: 100, height: 100, fontSize: '30px', color: '#394251', backgroundColor: '#FAFBFC', fontWeight: 'bold', borderStyle: 'solid', borderColor: '#F3F3F3', borderWidth: '5px'}}>영</Avatar>

                        {/*<Paper sx={{ display: 'flex', justifyItems: 'center', flexWrap: 'wrap', listStyles: 'none', p: 0.5, m: 0 }} component="ul">
                                        {chipData.map((data) => {
                                            let icon;

                                            if (data.label === 'React') {
                                                icon = <TagFacesIcon />;
                                            }

                                            return (
                                                <ListItem key={data.key}>
                                                    <Chip
                                                        icon={icon}
                                                        label={data.label}
                                                        onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </Paper>*/}
                    </Tooltip>
                </Box>

                <Box sx={{display: 'flex', width: 1}}>
                    <div className="deviceIdText">
                        <div className="deviceIdTitle">
                            01680675SKY33EC
                        </div>
                        <div className="deviceIdSubTitle">
                            영산강 홍수통제소 _ 01680675SKY33EC
                        </div>
                    </div>
                </Box>

                <Box sx={{display: 'flex', width: 1}}>
                    <Box className="basicInfo">
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                등록일자(설치일자)
                            </div><hr/>
                            <div className="descriptionContain">
                                YYYY-MM-DDTHH:MM:SS
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                상태
                            </div><hr/>
                            <div className="descriptionContain">
                                Warning
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                위성신호레벨
                            </div><hr/>
                            <div className="descriptionContain">
                                43.6
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                평균신호레벨
                            </div><hr/>
                            <div className="descriptionContain">
                                43.8
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                데이터 수집 주기
                            </div><hr/>
                            <div className="descriptionContain">
                                5분
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                마지막 데이터 수집 시간
                            </div><hr/>
                            <div className="descriptionContain">
                                10분
                            </div>
                        </Box>
                    </Box>
                </Box><br/>

                <Box sx={{display: 'flex', width: 1}}>
                    <Grid item sm={6} sx={{pr: 3}}>
                        <div className="alertInfo">
                            <div className="alertInfoTitle">
                                Alert Table || Alarm 처럼 리스트
                            </div><hr/>
                            <div className="alertInfoContain">
                                Issue Table
                            </div>
                        </div>
                    </Grid >
                    <Grid item sm={6} sx={{pr: 3}}>
                        <div className="alertInfo">
                            <div className="alertInfoTitle">
                                Alarm Navigation
                            </div><hr/>
                            <div className="alertInfoContain">
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="error">
                                        <AlertTitle>Error</AlertTitle>
                                        This is an error alert — <strong>check it out!</strong>
                                    </Alert>
                                    <Alert severity="warning">
                                        <AlertTitle>Warning</AlertTitle>
                                        This is a warning alert — <strong>check it out!</strong>
                                    </Alert>
                                    <Alert severity="info">
                                        <AlertTitle>Info</AlertTitle>
                                        This is an info alert — <strong>check it out!</strong>
                                    </Alert>
                                    <Alert severity="success">
                                        <AlertTitle>Success</AlertTitle>
                                        This is a success alert — <strong>check it out!</strong>
                                    </Alert>
                                </Stack>
                            </div>
                        </div>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default DetailInfo;