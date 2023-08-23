import Navbar from "../../components/navbar/Navbar";
import './diagnostic.scss';

import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Input } from '@mui/material';
import TextField from '@mui/material/TextField';







const Diagnostic = () => {


    return (
        <div className="diagnostic">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="contain">
                <div className="inquiry">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Basic date picker" />
                        </DemoContainer>
                    </LocalizationProvider>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </div>
                <div className="statusInfo">
                    hi
                </div>
            </div>
        </div>
    )
}

export default Diagnostic;