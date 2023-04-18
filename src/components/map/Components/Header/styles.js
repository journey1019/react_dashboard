import React from 'react';
import {alpha,makeStyles} from "@material-ui/core/styles"
export default makeStyles((theme)=>({
    title:{
        display: 'none',
        [theme.breakpoints.up('sm')]:{// width greater than breakpoint
            display: 'block',
        }
    },
    search:{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white,0.15),// Here alpha is used for opacity
        '&:hover':{backgroundColor:alpha(theme.palette.common.white,0.45)},// hover property
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width:"100%",
        [theme.breakpoints.up('sm')]:{
            marginLeft:theme.spacing(3),width:"auto"
        }

    },
    toolbar:{
        display:"flex",
        justifyContent:"space-between",
    },
    searchicon:{
        padding:theme.spacing(0,2),
        height:"100%",
        position:"absolute",
        pointerEvents:"none",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput:{
        padding: theme.spacing(2, 2, 2,0), paddingLeft: `calc(1em + ${theme.spacing(2)}px)`, transition: theme.transitions.create('width'), width: '100%', [theme.breakpoints.up('md')]: { width: '20ch' },
    },



}));