/* React */
import React from "react";

/* Icon */
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import DirectionsBoatFilledRoundedIcon from "@mui/icons-material/DirectionsBoatFilledRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import SatelliteAltRoundedIcon from "@mui/icons-material/SatelliteAltRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import DashboardIcon from '@mui/icons-material/Dashboard';
import BorderClearIcon from '@mui/icons-material/BorderClear';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';

export const SidebarData = [
    {
        title: 'Dashboard - ver0.8',
        path: '/dashboard',
        icon: <DashboardIcon />,
        cName: 'nav-text'
    },
    {
        title: 'Main1 - ver1.5',
        path: '/main',
        icon: <BorderClearIcon />,
        cName: 'nav-text'
    },
    {
        title: 'Main - ver2.0',
        path: '/mainPage',
        icon: <SpaceDashboardRoundedIcon />,
        cName: 'nav-text'
    },
    {
        title: 'Home',
        path: '/',
        icon: <HomeOutlinedIcon sx={{color: '#CC0000'}}/>,
        cName: 'nav-text'
    },
    {
        title: 'WhaTab',
        path: '/whaTab',
        icon: <ConnectedTvIcon sx={{color: '#46c2e9'}}/>,
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
        title: 'Manage',
        path: '/managed',
        icon: <TokenRoundedIcon/>,
        cName: 'nav-text'
    },
];
