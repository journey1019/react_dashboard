/* React */
import React, { useState } from 'react';

/* MUI */
import { Box, Typography, Popover, Select, MenuItem, Button } from '@mui/material';

/* Icon */
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


const NumberSelector = ({ initialSelectedValue = 40, onSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedValue, setSelectedValue] = useState(initialSelectedValue);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        const newValue = parseFloat(event.target.value.toFixed(2));
        setSelectedValue(newValue);
        onSelect(newValue);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Box sx={{ display: 'flex', alignItem: 'center', textAlign: 'center'}}>
                <div className="select_number" style={{display: 'flex', alignItems: 'center', justifyContent:'center', textAlign: 'center', color:'#B0B7C3', fontSize: '15px'}}>
                    Standard Number:
                </div>
                <Button size="medium" sx={{ color: '#CC0000', fontSize: 'small' }} onClick={handleClick} startIcon={<KeyboardArrowDownIcon />}>
                    {selectedValue.toFixed(2)}
                </Button>
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Select
                    label="Select Number"
                    value={selectedValue}
                    onChange={handleChange}
                >
                    {[...Array(101).keys()].map((number) => (
                        <MenuItem key={number} value={parseFloat(number.toFixed(2))}>
                            {number.toFixed(2)}
                        </MenuItem>
                    ))}
                </Select>
            </Popover>
        </div>
    );
};

export default NumberSelector;