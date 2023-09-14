import Navbar from "../../components/navbar/Navbar";
import './diagnostic.scss';
import Category from "../../components/diagnostic/category/Category";

import * as React from 'react';
import { useMemo } from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Input } from '@mui/material';
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField';
import { Box, Stack } from '@mui/material';
import MaterialReactTable from 'material-react-table';

import { data } from "./config/makeData";



const Diagnostic = () => {



    /*--------------------------------------------------------*/



    return (
        <div className="diagnostic">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="contain">
                <div className="categories">
                    <Category type="running" />
                </div>
            </div>
        </div>
    )
}

export default Diagnostic;