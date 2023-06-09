import {React,useState} from 'react';
import {CircularProgress,Grid,Typography,FormControl,InputLabel,MenuItem,Select} from '@material-ui/core'
import useStyles from "./styles.js"
import PlaceDetails from "../PlaceDetails/PlaceDetails"
const List = ({places}) => {
    // Dummy Data

    const classes = useStyles()
    const [type, setType]=useState('restaurants')
    const [rating,setRating] = useState()
    return (
        <div className={classes.container}>
            <Typography variant="h4">Restaurants,Hotels and Attractions Near You</Typography>
            <FormControl className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e)=>setType(e.target.value)}>
                    <MenuItem value="restaurants">Restaurants</MenuItem>
                    <MenuItem value="hotels">Hotels</MenuItem>
                    <MenuItem value="attractions">Attractions</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Ratings</InputLabel>
                <Select value={rating} onChange={(e)=>setRating(e.target.value)}>
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={3}>Above 3.0</MenuItem>
                    <MenuItem value={4}>Above 4.0</MenuItem>
                    <MenuItem value={5}>Above 5.0</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={3} className={classes.list}>
                {
                    places.map((place,i)=>(
                        <Grid item key={i} xs={12}>
                            <PlaceDetails place={place}/>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    )
}

export default List