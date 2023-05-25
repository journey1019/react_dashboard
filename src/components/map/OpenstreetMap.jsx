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

    const[deviceInfo,setDeviceInfo] = useState({});

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
                /*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }),*/
            ]
        });

        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id:"osmLayer",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });



        const vworldLayer = L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
            id:"vWorldLayer",
            "minZoom": 6,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
        });



        let cadastral = L.tileLayer.wms("http://api.vworld.kr/req/wms", {
            "version": "1.3.0",
            "layers": "lp_pa_cbnd_bonbun,lp_pa_cbnd_bubun",
            "styles": "lp_pa_cbnd_bonbun,lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun_line,lp_pa_cbnd_bubun_line",
            "format": "image/png",
            "transparent": true,
            "opacity": 1.0,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "key": "C34C4C1E-2EE6-3DB7-B88B-8378955D7DF8",
            "domain": "https://iogwy.commtrace.com"
        }).addTo(mapRef.current);

        const baseMaps = {
            "OSM" : osmLayer,
            "vWorld": vworldLayer
        };
        const overlayMaps = {
            "지적도": cadastral
        };


        osmLayer.addTo(mapRef.current);
        L.control.layers(baseMaps, overlayMaps).addTo(mapRef.current);
    }, []);


    // add marker
    const markerRef = useRef(null);

    useEffect(() => {
        if(markerRef.current==null){
            markerRef.current= {};
        }
        // Object {000: ~}, {001: ~}, ...
        //console.log(markerRef.current);

        let MapCurrentData = {};

        // Marker - DeviceId
        props.nmsCurrent.map((item,index)=>{
            //console.log(item); //{deviceId: '', latitude: 35, longitude: 125}
            if(markerRef.current[item.deviceId]==null){
                const marker = L.marker([item.latitude,item.longitude],{title:(item.crpNm + '\n' + "(" + item.vhcleNm + ")")}).addTo(mapRef.current);
                //marker.bindPopup(item.deviceId).openPopup();
                markerRef.current[item.deviceId] = marker;
            }else{   // 또 다른 마커 정보
                markerRef.current[item.deviceId].setLatLng([item.latitude,item.longitude]);
            }
            const deviceInfo = {};
            MapCurrentData[item.deviceId] = item;
        });

        setDeviceInfo(MapCurrentData);

    },[props.nmsCurrent]);


    useEffect(()=>{
        if(props.selectDevice!=null && props.selectDevice!=""){
            // {01174921SKY35EA: NewClass, 01382820SKYFE71: NewClass, 01382818SKYF667: NewClass, 01377867S}
            //console.log(markerRef.current);

            console.log(props.nmsCurrent[props.selectDevice]);


            //console.log(markerRef.current[props.selectDevice].getLatLng());
            markerRef.current[props.selectDevice].bindPopup(( deviceInfo[props.selectDevice].crpNm + "(" + deviceInfo[props.selectDevice].vhcleNm + ")")).openPopup();

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