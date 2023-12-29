import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import {RiShip2Fill} from "react-icons/ri";
import {BiBarChartAlt} from "react-icons/bi";
import {BiCaretRightCircle} from "react-icons/bi";
import {AiFillAndroid} from "react-icons/ai";
import { GiProcessor } from 'react-icons/gi';
import {TbInfoHexagon} from 'react-icons/tb';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import SatelliteAltRoundedIcon from '@mui/icons-material/SatelliteAltRounded';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <MdIcons.MdDashboard />,
        cName: 'nav-text'
    },
    {
        title: 'Befo NMS',
        path: '/before',
        icon: <BiCaretRightCircle />,
        cName: 'nav-text'
    },
    {
        title: 'AIS',
        path: '/ais',
        icon: <RiShip2Fill />,
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
        title: 'Diagnostic',
        path: '/diagnostic',
        icon: <GiProcessor/>,
        cName: 'nav-text'
    },
    {
        title: 'Example',
        path: '/example',
        icon: <TbInfoHexagon/>,
        cName: 'nav-text'
    },
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    },{
        title: 'Managed',
        path: '/managed',
        icon: <IoIcons.IoMdCog />,
        cName: 'nav-text'
    }
    /*{
        title: 'Users',
        path: '/users',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Table',
        path: '/table',
        icon: <BsIcons.BsTable />,
        cName: 'nav-text'
    },
    {
        title: 'Map',
        path: '/map',
        icon: <BiIcons.BiMap />,
        cName: 'nav-text'
    },
    {
        title: 'Sample',
        path: '/sample',
        icon: <AiFillAndroid />,
        cName: 'nav-text'
    },
    {
        title: 'Reports',
        path: '/reports',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path: '/products',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Messages',
        path: '/messages',
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: 'nav-text'
    },*/
];


/*
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as TbIcons from 'react-icons/tb';
import {BiBarChartAlt} from "react-icons/bi";
import {BiCaretRightCircle} from "react-icons/bi";
import {AiFillAndroid} from "react-icons/ai";


export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'IDP',
        path: '/dashboard',
        icon: <MdIcons.MdDashboard />,
        cName: 'nav-text'
    },
    {
        title: 'GES',
        path: '/before',
        icon: <BiCaretRightCircle />,
        cName: 'nav-text'
    },
    {
        title: 'T-AIS',
        path: '/ais',
        icon: <BiBarChartAlt />,
        cName: 'nav-text'
    },
    {
        title: 'Sat/Net',
        path: '/ais',
        icon: <TbIcons.TbSatellite />,
        cName: 'nav-text',
    },
    /!*{
        title: 'Users',
        path: '/users',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Table',
        path: '/table',
        icon: <BsIcons.BsTable />,
        cName: 'nav-text'
    },
    {
        title: 'Map',
        path: '/map',
        icon: <BiIcons.BiMap />,
        cName: 'nav-text'
    },
    {
        title: 'Sample',
        path: '/sample',
        icon: <AiFillAndroid />,
        cName: 'nav-text'
    },
    {
        title: 'Reports',
        path: '/reports',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path: '/products',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Messages',
        path: '/messages',
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: 'nav-text'
    },*!/
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
];*/
