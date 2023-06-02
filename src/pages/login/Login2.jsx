// Login Error
/* mui */
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from 'react-router-dom'

import React, { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";

import axios from './api/axios';



const Login = () => {
    const { setAuth } = useContext(AuthContext);

    // user, error DOM
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(()=>{
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        /*console.log({
            user: data.get("user"),
            pwd: data.get("pwd"),
            }
        )*/
        const LOGIN_URL = 'https://iotgwy.commtrace.com/restApi/user/login';
        const PARAMS = {userId: user, userPw: pwd}

        let result = await axios({
            method:"POST",//통신방식
            url : LOGIN_URL,//URL
            //headers : headers,//header
            params:PARAMS,
            responseType:"json"
        })
            .then(response =>{
                //성공 시, returnVal로 데이터 input
                //returnVal = response.data.response;
                console.log(response.data.response);
            })
            .then(err=>{
                if (!err?.response) {
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
                errRef.current.focus();
            });


        // 비동기가 있는 가중치 알림으로 api dir 내부에 있는 axios file에 정의한
        // 기본 URL에 추가된 로그인 URL을 전달하고
        // axios의 두 번째 매개변수는 json.stringify가 될 것임
        /*try {
            const response = await axios.post(LOGIN_URL,
                //JSON.stringify({PARAMS}),
                {
                    params : {PARAMS}
                },
                {
                    headers: {
                        //"Content-Type": `application/json;charset=UTF-8`,
                        //'Accept': 'application/json' ,
                        //'Access-Control-Allow-Origin' : '*',
                        //'Access-Control-Allow-Origin' : 'https://iotgwy.commtrace.com',
                    },
                    //withCredentials: true
                },
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            /!*const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;*!/
            // 기록 + 덧붙이기
            setAuth({ user, pwd });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) { // 오류수신
            if (!err?.response) {
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
            errRef.current.focus();
        }*/
    }

    return(
        <div className="body">
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="/dashboard">Go to Home</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                                {/*put router link here*/}
                            <a href="/register">Sign Up</a>
                            </span>
                    </p>
                </section>
            )}
        </div>
    )
}

export default Login