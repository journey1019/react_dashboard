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
    const [authentication, setAuthentication] = useState('');

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
    
    
    useEffect(() => {
        let username = sessionStorage.getItem('username');
        if(username === '' || username === null) {
            navigate('/home');
        }
    }, []);
    
    
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
        const item = {username, password, authentication};
        console.warn(item);
        const seLoginURLS = "https://iotgwy.commtrace.com/restApi/user/login";
        const sePARAMS = {userId: username, userPw: password}
        const seHEADERS = {
            "Accept": "application/json",
        }
        let returnVal = null;

        let result = await axios({
            method : "POST",
            url: seLoginURLS,
            header: seHEADERS,
            params: sePARAMS,
            responseType: "json"
        })
            .then(response => {
                //성공 시, returnVal로 데이터 input
                returnVal = response.data.response; //{authType: 'KAKAOWORK', authKey: 'jhlee@orbcomm.co.kr'}
                console.log(returnVal);
                console.log(response);
                sessionStorage.setItem('username', username);
                //localStorage.setItem("user-info", JSON.stringify(returnVal));
                //navigate("/login/seLogin")
                //alert("카카오워크로 전송된 2차 인증");
                //return <SeLogin />
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
    
    
    async function access() {
        const item = {username, password, authentication};
        console.warn(item);
        console.log(item);


        
        const accessURLS = "https://iotgwy.commtrace.com/restApi/user/seAuth";
        const accessPARAMS = {userId: username, userPw: password, authKey: authentication}
        const accessHEADERS = {
            "Accept": "application/json",
        }

        let returnVal2 = null;

        try {
            let result2 = await axios({
                method : "POST",
                url: accessURLS,
                header: accessHEADERS,
                params: accessPARAMS,
                responseType: "json"
            })
                .then(response2 => {
                    // 성공 시, returnVal로 데이터 input
                    returnVal2 = response2.data.response;
                    //setAccessToken = response.data.response.authKey;
                    //console.log(setAccessToken);
                    //{authType: 'TOKEN', authKey: '33612236-12d8-4763-b76b-8e98b1b90bd9', authExpired: '2023-06-02T05:26:30'}
                    console.log(returnVal2);
                    console.log(response2);
                    localStorage.setItem("user-info", JSON.stringify(returnVal2));
                    navigate("/home")
                })
                .then(err => {
                    return null;
                });
            return returnVal2;
        }
        catch{
            return null;
        }
    }
    

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
                                <div style={{justifyContent: "space-between"}}>
                                    <Button  variant="outlined" onClick={handleClose}>Cancel</Button>
                                    <Button  variant="contained" onClick={handleClose}>Access</Button>
                                </div>
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