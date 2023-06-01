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


import Logo from "../../assets/KO_logo.png";
import Session from 'react-session-api';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


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
        });
    };


    async function signIn() {
        let item = {username, password};
        console.warn(item);

        const urls = "https://iotgwy.commtrace.com/restApi/user/login";
        const params = {userId: username, userPw: password}
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
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                    localStorage.setItem("user-info", JSON.stringify(returnVal));
                    navigate("/login/seLogin")
                    navigator.push("/seLogin")
                    //alert("카카오워크로 전송된 2차 인증")
                    console.log(returnVal);
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
            <div className="logo">
                {/*<img src={Logo} alt="logo" height="70" width="230" />*/}
            </div>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                            name="password"
                            value={password}
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={signIn}
                        >
                            Login
                        </Button>

                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default Login;