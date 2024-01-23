/* React */
import React, { useEffect, useState, useRef, useMemo } from "react";

/* MUI */
import { Button } from '@mui/material';

const WhaTab = () => {

    /*const navigateToWhaTab = () => {
        // 와탭으로 이동하는 링크
        window.location.href = 'https://service.whatap.io/account/login';
    };*/
    useEffect(() => {
        // 페이지가 마운트될 때 바로 와탭으로 이동
        window.location.href = "https://service.whatap.io/account/login";
    }, []) // 빈 배열은 마운트 시에만 실행 되도록 함

    return(
        <>
            {/* 버튼을 클릭하면 와탭으로 이동 */}
            {/*<Button onClick={navigateToWhaTab}>와탭으로 이동</Button>*/}
        </>
    )
}

export default WhaTab;