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
import {Navigate, useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";

import SeLogin from "../seLogin/SeLogin";

import Logo from "../../assets/KO_logo.png";
import Session from 'react-session-api';
import axios from 'axios';
import {object} from "prop-types";



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authentication, setAuthentication] = useState('');

    const userRef = useRef();
    const errRef = useRef();
    // Sign In Button - Error
    const [errMsg, setErrMsg] = useState('');
    // Se-Login Button - Error
    const [errMsg2, setErrMsg2] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // access token
    const [authKey, setAuthKey] = useState('');

    /* SeLogin Modal */
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [seAuthType,setSeAuthType] = useState();

    const [rememberchk,setRememverchk] = useState(true);


    /*useEffect(() => {
        let username = sessionStorage.getItem('username');
        /!*if(username === '' || username === null) {
            navigate('/home');
        }*!/
    }, []);*/


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
        //Login 시작 시, Session 초기화
        sessionStorage.clear();
        //userName, Password 저장 정보 확인
        localSaveCheck();
    },[]);


    /*useEffect(() => {
        const auth = sessionStorage.getItem('user');
        if(auth) {
            navigate("/")
        }
    }, [])*/

    // Error Message
    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    // Error Message2
    useEffect(() => {
        setErrMsg2('');
    }, [authentication])

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        const item = {username, password};
        console.warn(item);
        const seLoginURLS = "https://iotgwy.commtrace.com/restApi/user/login";
        const sePARAMS = {userId: username, userPw: password}
        const seHEADERS = {
            "Accept": "application/json",
        }
        let returnVal = null;

        try {
            let result = await axios({
                method: "POST",
                url: seLoginURLS,
                header: seHEADERS,
                params: sePARAMS,
                responseType: "json"
            })
                .then(response => {
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response; //{authType: 'KAKAOWORK', authKey: 'jhlee@orbcomm.co.kr'}



                    //2차인증 미실시
                    if(returnVal.authType == 'TOKEN'){
                        //login 성공 시
                        loginSuccess(returnVal);
                    }
                    //2차인증
                    else{
                        //2차인증 타입 state 저장
                        setSeAuthType(returnSeType(returnVal.authType));
                        //navigate("/home")
                        //modal open
                        setOpen(true);
                    }

                })
                .then(err => {
                    return null;
                })
            return returnVal;
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    }
    //modal 인증 확인 Type
    function returnSeType(value){
        let type = "";
        switch (value){
            case "KAKAOWORK":
                type = "카카오워크";
                break;
            case "EMAIL":
                type  = "메일";
                break;
            default:
                type="";
                break;
        }
        return type;
    }

    async function access() {
        const item = {username, password, authentication};
        //console.warn(item);
        //console.log(item);

        const accessURLS = "https://iotgwy.commtrace.com/restApi/user/seAuth";
        const accessPARAMS = {userId: username, userPw: password, authKey: authentication}
        const accessHEADERS = {
            "Accept": "application/json",
        }

        let returnVal2 = null;

        try{
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

                    if(returnVal2.authType == 'TOKEN'){
                        setOpen(false);
                        //sessionStorage.setItem('username', username);
                        loginSuccess(returnVal2);
                    }
                })
                .then(err => {
                    return null;
                })
            return returnVal2;
        } catch (err) {
            if (!err?.response2) {
                setErrMsg2('Missing Authentication');
            } else if (err.response2?.status === 400) {
                setErrMsg2('Missing Username or Password');
            } else if (err.response2?.status === 401) {
                setErrMsg2('Unauthorized');
            } else {
                setErrMsg2('Login Failed');
            }
        }
    }

    const accessToken = () => {
        const tokenURL = "https://iotgwy.commtrace.com/restApi/user/getToken";
        const tokenParams = {userId: username, userPw: password}
        const header = {
            "Accept": "application/json",
        }
    }

    function loginSuccess(result){
        //session 저장
        sessionStorage.setItem('userInfo', JSON.stringify(result));

        //username, password 저장 --> localStorage 저장
        localSave();
        //page 변경으로 이동
        window.location.replace("/dashboard");
    }

    function localSave(){
        if(rememberchk){
            const saveUser = {
                userName:username,
                password:password
            }
            localStorage.setItem("saveUser",JSON.stringify(saveUser));
        }else{
            localStorage.clear();
        }
    }

    function localSaveCheck(){

        if(localStorage.getItem("saveUser")!=null){
            const saveUser = JSON.parse(localStorage.getItem("saveUser"));
            console.log(saveUser);
            setRememverchk(true);
            setUsername(saveUser.userName);
            setPassword(saveUser.password);
        }else{
            setRememverchk(false);
        }
    }

    function setcheck(){
        setRememverchk(!rememberchk)
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
                            control={<Checkbox value="remember" checked={rememberchk} onChange={setcheck} color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
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
                                    {seAuthType}로 전송받은 2차 인증번호를 확인하고, 입력하세요.
                                </Typography>
                                <br />
                                <p ref={errRef} className={errMsg2 ? "errmsg" : "offscreen"} aria-live="assertive" style={{borderRadius: "10px", paddingTop: "10px"}}>{errMsg2}</p>
                                <br />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="Authentication"
                                    label="Authentication"
                                    value={authentication}
                                    type="authentication"
                                    id="authentication"
                                    autoComplete="authentication"
                                    onChange={e => setAuthentication(e.target.value)}
                                />
                                <br />
                                <hr />
                                <Button onClick={handleLogin}>2차 인증 재전송</Button>
                                <br />
                                <Button className="cancelButton" variant="outlined" onClick={handleClose} >Cancel</Button>
                                <Button className="accessButton" variant="contained" onClick={access} >Access</Button>
                                {/*<div className = 'login-buttons'>
                                    <Button className="cancelButton" variant="outlined" onClick={handleClose} >Cancel</Button>
                                    <Button className="accessButton" type="submit" variant="contained" onClick={access} >Access</Button>
                                </div>*/}
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