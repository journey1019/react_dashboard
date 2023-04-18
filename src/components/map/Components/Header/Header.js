import React from 'react'
import {AutoComplete} from '@react-google-maps/api'
import {Toolbar,Box,InputBase,Typography} from '@material-ui/core'
import AppBar from "@material-ui/core/AppBar";
import SearchIcon from '@material-ui/icons/Search';
import useStyles from "./styles.js"
const Header = () => {
    const classes=useStyles()
    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant="h4" className={classes.title}>
                    TravelBea
                </Typography>
                <Box display="flex">
                    <Typography variant="h6" className={classes.title}>
                        Explore New Places
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchicon}>
                            <SearchIcon/>
                        </div>
                        <InputBase placeholder="Search..." style={{paddingLeft:"25%"}} className={{root:classes.inputRoot,input:classes.inputInput}}/>
                    </div>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header