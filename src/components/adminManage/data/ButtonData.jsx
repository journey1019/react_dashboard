import SetDevice from "../modal/SetDevice";
import SetUser from "../modal/SetUser";
import SetGroup from "../modal/SetGroup";
import LogDevice from "../modal/LogDevice";
import LogGroup from "../modal/LogGroup";
import LogUser from "../modal/LogUser";


export const ButtonData = [
    {
      commponent: <SetDevice key="setDevice" />
    },
    {
        commponent: <SetUser key={"setUser"} />
    },
    {
        commponent: <SetGroup key={"setGroup"} />
    },
    {
        commponent: <LogDevice key="logDevice" />
    },
    {
        commponent: <LogUser key={"logUser"} />
    },
    {
        commponent: <LogGroup key={"logGroup"} />
    }
    /*,
    {
        title: '사용자관리',
        className: 'device_Btn',
        variant : 'contained',
        size : 'medium',
        onClick: '',
    },
    {
        title: '그룹관리',
        className: 'device_Btn',
        variant : 'contained',
        size : 'medium',
        onClick: '',
    },
    {
        title: '수집관리',
        className: 'device_Btn',
        variant : 'contained',
        size : 'medium',
        onClick: '',
    },
    {
        title: '알람관리',
        className: 'device_Btn',
        variant : 'contained',
        size : 'medium',
        onClick: '',
    }*/
];