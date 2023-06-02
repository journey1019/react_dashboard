import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

import SeLogin from "../seLogin/SeLogin";

import Logo from "../../assets/KO_logo.png";
import Session from 'react-session-api';
import axios from 'axios';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // access token
    const [authKey, setAuthKey] = useState('');
    
    /* SeLogin Modal */
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    



    /*// toast Library
    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in';
        if(username === null || username) {
            isproceed = false;
            errormessage += 'Username';
        }

        if(!isproceed){
            toast.warning(errormessage)
        }else{
            //email 규칙
            //if(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)){
            if(/^[A-z][A-z0-9-_]{3,23}$/.test(username)){

            }else{
                isproceed = false;
                toast.warning('Please enter the valid email')
            }
        }
        return isproceed;
    }*/


    useEffect(() => {
        localStorage.clear();
    },[]);


    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate("/")
        }
    }, [])

    // Error Message
    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (event) => {
        event.preventDefault();
        let item = {username, password};
        console.warn(item);
        const urls = "https://iotgwy.commtrace.com/restApi/user/login";
        const params = {userId: username, userPw: password}
        const headers = {
            "Accept": "application/json",
        }
        let returnVal = null;

        let result = await axios({
            method : "POST",
            url: urls,
            header: headers,
            params: params,
            responseType: "json"
        })
            .then(response => {
                //성공 시, returnVal로 데이터 input
                returnVal = response.data.response; //{authType: 'KAKAOWORK', authKey: 'jhlee@orbcomm.co.kr'}
                console.log(returnVal);
                console.log(response);
                sessionStorage.setItem('username', username);
                //localStorage.setItem("user-info", JSON.stringify(returnVal));
                navigate("/login/seLogin")
                alert("카카오워크로 전송된 2차 인증");
                return <SeLogin />
            })
            .then(err => {
                if (!err?.response){
                    setErrMsg('No Server Response');
                }
                else if (err.response?.status === 400) {
                    setErrMsg('Missing Username or Password');
                }
                else if (err.response?.status === 401) {
                    setErrMsg('Unauthorized');
                }
                else {
                    setErrMsg('Login Failed');
                }
            });
        return returnVal;
    };

    const accessToken = () => {
        const tokenURL = "https://iotgwy.commtrace.com/restApi/user/getToken";
        const tokenParams = {userId: username, userPw: password}
        const header = {
            "Accept": "application/json",
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
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{borderRadius: "10px", paddingTop: "10px"}}>{errMsg}</p>
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
                            onClick={handleOpen}
                        >
                            Login
                        </Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box className="modal-box" sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                pt: 2,
                                px: 4,
                                pb: 3,
                            }}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    2차 인증 코드
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    카카오워크 또는 메일로 전송받은 2차 인증번호를 확인하고, 입력하세요.
                                </Typography>
                                <br />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="Authentication"
                                    label="Authentication"
                                    //value={authentication}
                                    type="authentication"
                                    id="authentication"
                                    autoComplete="authentication"
                                    //onChange={e => setAuthentication(e.target.value)}
                                />
                                <br />
                                <Button  variant="outlined" onClick={handleClose}>Cancel</Button>
                            </Box>
                        </Modal>

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