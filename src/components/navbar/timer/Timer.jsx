import {useEffect,useState} from "react";
import axios from "axios";
import "./Timer.scss"


/***
 * @Author : jmpark
 * @date : 2023-06-09
 * @Desc : {
 *  nav bar 상단 만료 시간 Timer 표현 component
 *  만료 시간 Over : window.location.reload() --> 새로고침하여 로그인 창
 *  만료 시간 10 분전 : Token Refresh 활성화(파란색으로 표현, 클릭 시 SessionStorage userInfo 갱신
 * }
 * @returns {JSX.Element}
 * @constructor
 */
function Timer(){
    //초당 1회씩 check하는 계수기
    const [count, setCount] = useState(0)
    //화면에 표현하기위한 String useState
    const [timeString, setTimeString] = useState("");
    //만료시간 계산 및 갱신 임박 타이머(분)
    const [comMinute,setComMinute]  = useState();
    //알람을 사용하기 위한 알람 표시 boolean Type State
    const [expiredAlarm,setExpiredAlarm] = useState(false);
    //만료 시간 알림 시간(분)
    const alarmTime = 10;


    //초마다 동작하는 effect
    useEffect(() => {

        //저장된 Session 불러오기
        const sessionInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        //현재시간
        const currentDate = Date.now();
        //만료시간 --> 만료시간은 UTC 이므로 현재시간(Localdate)와 차이가 있음 --> Sync를 위해 +00:00으로 UTC Time으로 인식하게함.
        const expireDate = new Date(sessionInfo.authExpired+"+00:00");
        //만료시간 - 현재시간 = Second
        const totSecond = parseInt((expireDate - currentDate)/1000,10);
        //totSecond로 계산한 Minute
        const  minute = parseInt(totSecond/60,10);
        //totalSecond에서 분을 제외한 현재 초
        const second = totSecond - (minute*60);

        //State에 현재 잔여 분 표시
        setComMinute(minute);

        //00:00로 표시하기 위한 분, 초 변환
        let stringMin = String(minute);
        let stringSec = String(second);

        //분이 한자리(ex: 5 )일 때, 05로 표시
        if(stringMin.length===1){
            stringMin = "0"+stringMin;
        }

        //초가 한자리(ex: 5 )일 때, 05로 표시
        if(stringSec.length===1){
            stringSec = "0"+stringSec;
        }

        //00:00 형태로 화면 표시를 위한 state입력
        setTimeString(stringMin+":"+stringSec);
    }, [count]);


    //계수기를 위한 Timer
    setTimeout(() => {
        setCount(count + 1);
        //초가 지나치게 커지는 것 방지
        if(count > 100){
            setCount(0);
        }
        // 1초
    }, 1000);


    /***
     * 토큰 갱신을 위한 function
     * 구동 : 상단 Timer가 만료 알림시간(alarmTime)보다 작으면 clickable되며 Session을 갱신할 API 호출
     * @returns {Promise<void>}
     */
    async function refreshSend(){
        //알람 시간보다 작을 때 클릭할 수 있음.
        if(comMinute < alarmTime){
            //url
            const reLoginURLS = "https://iotgwy.commtrace.com/restApi/user/refreshToken";
            //session에서 token을 가져옴
            const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
            //Header
            const reHEADERS = {
                "Content-Type": `application/json;charset=UTF-8`,
                "Accept": "application/json",
                "Authorization": "Bearer "+token,
            }
            let returnVal = null;


            try {
                //post send 시, header가 첨부가 안되 error가 발생하여 전송방식 변경
                returnVal = await axios.post(reLoginURLS,null,{
                    headers:reHEADERS,
                });
                //수신한 데이터
                const returnData = returnVal.data.response;

                //정상수신시
                if(returnVal.data.status === "OK"){
                    //연장된 정보 Session 저장
                    sessionStorage.setItem('userInfo', JSON.stringify(returnData));
                    alert("연장되었습니다.");
                    //알람 표시 변경(UI)
                    setExpiredAlarm(false);
                }else{
                    alert("연장에 실패하였습니다");
                }
            } catch (err) {
            }
        }
    }

    //알람 및 만료시간 체크
    useEffect(()=>{
        //시간 만료(갱신 없이)
        if(comMinute<0){
            //세션 삭제 및 화면 새로고침(login)화면 이동
            sessionStorage.clear();
            window.location.replace("/")
        }
        //알람이 발생하지 않았으며 현재시간이 알람 시간보다 작을 때
        else if(comMinute < alarmTime && expiredAlarm === false){
            //색상변경(UI)
            setExpiredAlarm(true);
        }
    },[comMinute]);
    return (
        <div className={`alarmCheck ${expiredAlarm ? '' : 'default'}`} onClick={refreshSend} >
            {timeString}
        </div>
    );
}


export default Timer;