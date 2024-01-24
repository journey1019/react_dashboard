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

import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import Logo from "../../assets/KO_logo.png";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authentication, setAuthentication] = useState('');

    const errRef = useRef();
    // Sign In Button - Error
    const [errMsg, setErrMsg] = useState('');
    // Se-Login Button - Error
    const [errMsg2, setErrMsg2] = useState('');

    /* SeLogin Modal */
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    // SeLogin Enter
    const handleEnter = (e) => {
        if(e.key === 'Enter') {
            handleAccess();
        }
    }

    /* SeLogin Type */
    const [seAuthType,setSeAuthType] = useState();

    /* Remember Checkbox */
    const [rememberchk,setRememverchk] = useState(true);

    useEffect(() => {
        //Login 시작 시, Session 초기화
        sessionStorage.clear();
        //userName, Password 저장 정보 확인
        localSaveCheck();
    },[]);

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
            await axios({
                method: "POST",
                url: seLoginURLS,
                header: seHEADERS,
                params: sePARAMS,
                responseType: "json"
            })
                .then(response => {
                    //성공 시, returnVal로 데이터 input
                    returnVal = response.data.response; //{authType: 'KAKAOWORK', authKey: 'jhlee@orbcomm.co.kr'}
                    // sessionStroage에 TOKEN 값이 있을 경우 -> Main
                    if(returnVal.authType === 'TOKEN'){
                        //login 성공 시
                        loginSuccess(returnVal);
                    }
                    // sessionStorage에 TOKEN 값 없을 경우 -> 2차 인증 Modal open
                    else{
                        //2차인증 타입 state 저장
                        setSeAuthType(returnSeType(returnVal.authType));
                        // Modal open
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
    // 2차인증 Modal Type 인증 확인
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
    /* ------------------------ Seconde Authentication ---------------------- */
    async function handleAccess(event) {
        const accessURLS = "https://iotgwy.commtrace.com/restApi/user/seAuth";
        const accessPARAMS = {userId: username, userPw: password, authKey: authentication}
        const accessHEADERS = {
            "Accept": "application/json",
        }

        let returnVal2 = null;

        try{
            await axios({
                method : "POST",
                url: accessURLS,
                header: accessHEADERS,
                params: accessPARAMS,
                responseType: "json"
            })
                .then(response2 => {
                    // 성공 시, returnVal로 데이터 input
                    returnVal2 = response2.data.response;
                    //{authType: 'TOKEN', authKey: '33612236-12d8-4763-b76b-8e98b1b90bd9', authExpired: '2023-06-02T05:26:30'}

                    // 2차인증 토큰 발급 시, 로그인
                    if(returnVal2.authType === 'TOKEN'){
                        setOpen(false); // Modal close
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



    function loginSuccess(result){
        /* 만료시간 변경 */
        /*const currentUTC = new Date();
        console.log(currentUTC.toString())
        currentUTC.setSeconds(currentUTC.getSeconds()+10)
        const currentUTCString = currentUTC.toISOString().slice(0, 19);
        result.authExpired = currentUTCString;*/

        //session 저장
        sessionStorage.setItem('userInfo', JSON.stringify(result));
        //username, password 저장 --> localStorage 저장
        localSave();
        //page 변경으로 이동(첫 접속페이지)
        //window.location.replace("/main");
        window.location.replace("/mainPage");
    }

    // remember Button 클릭 시, userName, password 저장
    function localSave(){
        if(rememberchk){
            const saveUser = {  //
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
            //console.log(saveUser);
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
                        fontSize: '14px',
                    }}
                >
                    <img src={Logo} alt="logo" height={"70"} width="230" />
                    <br/><br/>
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
                                    id="authentication"
                                    label="Authentication"
                                    name="Authentication"
                                    value={authentication}
                                    autoComplete="authentication"
                                    type="authentication"
                                    onChange={e => setAuthentication(e.target.value)}
                                    onKeyPress ={handleEnter}
                                />
                                <br />
                                <hr />
                                <Button onClick={handleLogin}>2차 인증 재전송</Button>
                                <br />
                                <Button className="cancelButton" variant="outlined" onClick={handleClose} >Cancel</Button>
                                <Button className="accessButton" variant="contained" onClick={handleAccess} >Access</Button>
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