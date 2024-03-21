/* React */
import React, { useState, useEffect } from 'react';

/* MUI */
import { Button, Box } from "@mui/material";

/* Chart */
import ApexCharts from 'react-apexcharts';

/* Icon */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // 확장
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // 축소


const SearchByDate = () => {
    //const { completeForCnrMapData, ...otherProps } = props;

    // Toggle Function
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };


    return (
        <>
            <Box>
                <Button variant="outlined" onClick={toggleExpansion}
                        sx={{
                            m : 1,
                            color: "gray",
                            borderColor: "gray",
                            ":hover": { borderColor: "gray" },
                            display: "flex",
                            justifyContent: "flex-start",
                            width: "100%",
                        }}
                >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </Button>

                {expanded && (
                    <Box sx={{w: 1, pt: 2}} >
                        Comming Soon !
                    </Box>
                )}
            </Box>
        </>
    );
}

export default SearchByDate;