import React from 'react'
import GoogleMapReact from 'google-map-react'
import {useMediaQuery} from '@material-ui/core'
import useStyles from "./styles.js"
const Maps = ({setbounds,setcoordinates,coordinates,places}) => {
    const classes = useStyles()
    const isMobile = useMediaQuery('(min-width:600px)')

    console.log(coordinates);
    return (
        <div className={classes.mapcontainer}>
            <GoogleMapReact
                bootstrapURLKeys={{key: 'AIzaSyB0K0MN98zcl8vf_Y2bfm7543idSmYeZpc'}}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50,50,50,50]}
                options={''}
                onChange={(e)=>{console.log(e)
                    setcoordinates({lat:e.center.lat,lng:e.center.lng})
                    setbounds({ne:e.marginBounds.ne,sw:e.marginBounds.sw})
                }}
                onChildClick={''}
            >
                {places?.map((place,i)=>(
                    <div
                        className={classes.markcontainer}
                    >

                    </div>
                ))}
            </GoogleMapReact>
        </div>
    )
}

export default Maps