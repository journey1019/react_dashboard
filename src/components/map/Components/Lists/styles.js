import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
export default makeStyles((theme)=>({
    container:{
        padding:"25px"
    },
    formControl:{
        margin:theme.spacing(1),
        minWidth:120,
        marginBottom:"30px",
    },
    list: {
        height: '75vh', overflow: 'auto',
    },

}))