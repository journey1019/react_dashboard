import {CssBaseline , Grid } from "@material-ui/core"
import React, { useState, useEffect } from 'react'
import Header from "./Components/Header/Header"
import List from "./Components/Lists/Lists"
import Maps from "./Components/Maps/Maps"
import {getPlacesData} from "./apis/api"

function Map() {
    const [places,setplaces]=useState([])
    const [coordinates,setcoordinates] = useState({})
    const [bounds,setbounds] = useState(null)
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
            setcoordinates({lat:latitude,lng:longitude})
        })
    },[])
    useEffect(()=>{
        if(bounds){
            getPlacesData(bounds.sw,bounds.ne)
                .then((data)=>{
                    setplaces(data)
                })
        }
    },[coordinates,bounds])
    console.log(places);
    return (
        <>
            <CssBaseline/>
            <Header/>
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs={12} md={4}>
                    <List places={places}/>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Maps
                        setcoordinates={setcoordinates}
                        setbounds={setbounds}
                        coordinates={coordinates}
                        places={places}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default Map;