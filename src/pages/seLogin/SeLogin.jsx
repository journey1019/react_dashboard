import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

import axios from 'axios';

/** K.O IoT GWY URL */
import {koIotUrl} from 'config';


const SeLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authentication, setAuthentication] = useState('');

    let [accessToken, setAccessToken] = useState('');
    useEffect(() => {

    }, [accessToken])

    const navigate = useNavigate();
    useEffect(() => {
        let username = sessionStorage.getItem('username');
        if(username === '' || username === null) {
            navigate('/dashboard');
        }
    }, []);

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate("/")
        }
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({ // 입력한 데이터 출력
            username: data.get("username"),
            password: data.get("password"),
            authentication: data.get("authentication"),
        });
    };



    async function access() {
        let item = {username, password, authentication};
        console.warn(item);
        console.log(item);

        const urls = koIotUrl + "/user/seAuth";
        const params = {userId: username, userPw: password, authKey: authentication}
        const headers = {
            "Accept": "application/json",
        }

        let returnVal = null;

        try {
            let result = await axios({
                method : "POST",
                url: urls,
                header: headers,
                params: params,
                responseType: "json"
            })
                .then(response => {
                    // 성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                    setAccessToken = response.data.response.authKey;
                    console.log(setAccessToken);
                    //{authType: 'TOKEN', authKey: '33612236-12d8-4763-b76b-8e98b1b90bd9', authExpired: '2023-06-02T05:26:30'}
                    console.log(returnVal);
                    console.log(response);
                    localStorage.setItem("user-info", JSON.stringify(returnVal));
                    navigate("/home")
                    navigator.push("/home")
                })
                .then(err => {
                    return null;
                });
            return returnVal;
        }
        catch {
            return null;
        }
    }

    return(
        <>
            <Container componenet="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        2차 인증 페이지
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            value={username}
                            autoComplete="username"
                            autoFocus
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            value={password}
                            type="password"
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="authentication"
                            value={authentication}
                            label="authentication"
                            type="authentication"
                            id="authentication"
                            autoComplete="authentication"
                            onChange={e => setAuthentication(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={access}
                        >
                            Access
                        </Button>

                        <Button
                            type="submit"
                            variant="outlined"
                            sx={{ mt: 3, mb: 1 }}
                        >
                            2차 인증코드 재전송
                        </Button>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                2차 인증코드 재전송
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default SeLogin



