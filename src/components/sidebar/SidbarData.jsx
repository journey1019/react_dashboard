import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';

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
        title: 'Users',
        path: '/users',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Grid',
        path: '/grid',
        icon: <BsIcons.BsTable />,
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
    },
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
];