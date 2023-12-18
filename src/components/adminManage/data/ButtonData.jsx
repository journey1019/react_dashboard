import SetDevice from "../modal/SetDevice"
import SetUser from "../modal/SetUser";
import SetGroup from "../modal/SetGroup";



export const ButtonData = [
    {
      commponent: <SetDevice key="setDevice" />
    },
    {
        commponent: <SetUser key={"setUser"} />
    },
    {
        commponent: <SetGroup key={"setGroup"} />
    }/*,
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