import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import DirectionsBoatFilledRoundedIcon from "@mui/icons-material/DirectionsBoatFilledRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import SatelliteAltRoundedIcon from "@mui/icons-material/SatelliteAltRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import React from "react";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <HomeRoundedIcon />,
        cName: 'nav-text'
    },
    {
        title: '(Main) - 수정중',
        path: '/main',
        icon: <SpaceDashboardRoundedIcon />,
        cName: 'nav-text'
    },
    {
        title: 'Befo NMS',
        path: '/before',
        icon: <PlayCircleRoundedIcon />,
        cName: 'nav-text'
    },
    {
        title: 'AIS',
        path: '/ais',
        icon: <DirectionsBoatFilledRoundedIcon />,
        cName: 'nav-text'
    },
    {
        title: 'Diagnostic',
        path: '/diagnostic',
        icon: <AccountTreeRoundedIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'GES',
        path: '/ges',
        icon: <DnsRoundedIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Satellite',
        path: '/satellite',
        icon: <SatelliteAltRoundedIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Support',
        path: '/support',
        icon: <InfoRoundedIcon />,
        cName: 'nav-text'
    },
    {
        title: '(Manage) - 수정중',
        path: '/example',
        icon: <TokenRoundedIcon/>,
        cName: 'nav-text'
    },
];
