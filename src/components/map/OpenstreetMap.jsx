import './map.scss';

import "leaflet/dist/leaflet.css";
import L from "leaflet"; // 현상유지
import {useCallback, useEffect, useRef, useState} from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {func} from "prop-types";


function OpenSteetMap(props){

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
    });


    L.Marker.prototype.options.icon = DefaultIcon;

    // 기준점
    const centerPosition = [35.824844, 127.674335];
    const zoomLevel = 6;

    const[locationData, setLocationData] = useState([]);


    // 맵 뿌리기
    const mapRef = useRef(null);

    useEffect(() => {
        mapRef.current = L.map('map', {
            center: centerPosition,
            zoom: zoomLevel,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });
    }, []);


    // add marker
    const markerRef = useRef(null);

    useEffect(() => {
        if(markerRef.current==null){
            markerRef.current= {};
        }

        // Marker - DeviceId
        props.feed.map((item,index)=>{
            if(markerRef.current[item.deviceId]==null){
                const marker = L.marker([item.latitude,item.longitude],{title:item.deviceId}).addTo(mapRef.current);
                //marker.bindPopup(item.deviceId).openPopup();
                markerRef.current[item.deviceId] = marker;
            }else{   // 또 다른 마커 정보
                markerRef.current[item.deviceId].setLatLng([item.latitude,item.longitude]);
            }

        })

    },[props.feed]);


    useEffect(()=>{
        if(props.selectDevice!=null && props.selectDevice!=""){
            console.log(markerRef.current);

            //console.log(markerRef.current[props.selectDevice].getLatLng());
            markerRef.current[props.selectDevice].bindPopup(props.selectDevice).openPopup();

            setView(markerRef.current[props.selectDevice].getLatLng(),15);
        }
    },[props.selectDevice]);

    // 마커선택 시 해당 위치, 줌 레벨
    function setView(postion,zoomLevel){
        mapRef.current.setView(postion,zoomLevel);
    }

    // 원상복귀
    function refreshButton(){
        setView(centerPosition, zoomLevel)

    }

    return (
        <div id="map">
            {<button id="refreshButton" onClick={refreshButton}>Refresh</button>}
        </div>

    )




    /*function MyComponent() {
        const map = useMap()
        console.log('map center:', map.getCenter());




        return (
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        )
    }*/


    /*function GetLocData(){

        const map = useMap();

        console.log(locationData);

        return(
            locationData.map((item,index)=>{
                //L.marker([item.latitude, item.longitude]).addTo(map);
                <Marker key={index} position={[item.latitude, item.longitude]}>

                </Marker>
            })

        )
    }*/

    /*useEffect(()=>{

        setLocationData(props.feed);

       //GetLocData();

    },[props.feed]);*/



    /*return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/!*<Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>*!/}
        </MapContainer>
    )*/
    /*return (
        <MapContainer center={[35.824844, 127.674335]} zoom={7}>
            <MyComponent />
            <GetLocData/>
        </MapContainer>
    )*/

}

export default OpenSteetMap;