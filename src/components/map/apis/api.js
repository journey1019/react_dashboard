import axios from "axios";
const URL="https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary"



export const getPlacesData= async (sw,ne) => {
    try {
        const {data:{data}} = await axios.get(URL,{
            params: {
                bl_latitude: sw.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
                tr_latitude: ne.lat,
            },
            headers: {
                'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
                'x-rapidapi-key': '4a46d777b3msha32aaf661a7de0cp1ce44ejsn3d455ba3caeb'
            }
        })
        return data
    } catch (e) {

        console.log(e);
    }
}