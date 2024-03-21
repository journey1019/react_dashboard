/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* IMPORT */
import PostRequest from "../../../../modules/PostRequest";

/* MUI */
import {Button, Grid, Typography, Box, Tooltip, Avatar, Stack, Alert, AlertTitle} from "@mui/material";

const SendMessage = (props) => {
    const { inputDeviceId, ...otherProps } = props;

    const session = JSON.parse(sessionStorage.getItem("userInfo"));
    const sendMessageUrls = "https://iotgwy.commtrace.com/restApi/send/sendMessage";

    const pingSend = {deviceId: inputDeviceId, requestMsg: '0,112,0,0'}
    const resetSend = {deviceId: inputDeviceId, requestMsg: '16,6,0'}
    const locationSend = {deviceId: inputDeviceId, requestMsg: '20,1,0'}

    // 각 버튼 작동
    const handleButtonPing = () => {
        // 버튼을 클릭했을 때만 작동하는 함수
        PostRequest(sendMessageUrls, pingSend).then(response => {
            if (response != null) {
                if (response.sendSuccess === true) {
                    alert('성공적으로 Ping 메세지를 보냈습니다.')
                } else {
                    alert('메세지를 보내는데 실패했습니다.')
                }
            }
        });
    }

    const handleButtonLocation = () => {
        PostRequest(sendMessageUrls, locationSend).then(response => {
            if (response != null) {
                if (response.sendSuccess === true) {
                    alert('성공적으로 Location 메세지를 보냈습니다.')
                } else {
                    alert('메세지를 보내는데 실패했습니다.')
                }
            }
        });
    }

    const handleButtonReset = () => {
        PostRequest(sendMessageUrls, resetSend).then(response => {
            if (response != null) {
                if (response.sendSuccess === true) {
                    alert('성공적으로 Reset 메세지를 보냈습니다.')
                } else {
                    alert('메세지를 보내는데 실패했습니다.')
                }
            }
        });
    }



    useEffect(() => {
        if(inputDeviceId === null && handleButtonPing) {
            PostRequest(sendMessageUrls, pingSend).then(response => {
                if(response!=null) {
                    if(response.sendSuccess === true) {
                        alert('성공적으로 메세지를 보냈습니다.');
                    }
                    else{
                        alert('메세지를 보내는데 실패했습니다.');
                    }
                }
            })
        }
    }, [])


    return(
        <>
            <Box className="sendMessage" sx={{width: '100%', display: 'flex', justifyContent:'left'}}>
                <Button variant="contained" color="error" onClick={handleButtonPing}>PING</Button>
                <Button variant="contained" color="inherit" onClick={handleButtonLocation}>LOCATION</Button>
                <Button variant="contained" color="success" onClick={handleButtonReset}>RESET</Button>
            </Box>
        </>
    )
}
export default SendMessage;