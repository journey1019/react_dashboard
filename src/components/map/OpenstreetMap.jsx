import './map.scss';

import "leaflet/dist/leaflet.css";
import L from "leaflet"; // 현상유지
import { useEffect, useRef, useState} from 'react';
//import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
//import {func} from "prop-types";
import red_icon from "../map/images/red_icon.png";
import gray_icon from "../map/images/gray_icon.png";
import green_icon from "../map/images/green_icon.png";
import yellow_icon from "../map/images/yellow_icon.png"

import { Button } from '@mui/material';


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

    const[currentTableData, setCurrentTableData] = useState({});
    const[preSelectDevice, setPreSelectDevice] = useState("");

    // Map 테마 변경
    const vWorldApiKey = "C34C4C1E-2EE6-3DB7-B88B-8378955D7DF8";

    // 맵 뿌리기
    const mapRef = useRef(null);

    useEffect(() => {
        mapRef.current = L.map('map', {
            center: centerPosition,
            zoom: zoomLevel,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    id:"defaultLayer",
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });

        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id:"osmLayer",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        const vworldLayer = L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Base/{z}/{y}/{x}.png', {
            id:"vWorldLayer",
            "minZoom": 6,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
        });

        const midnightLayer = L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/midnight/{z}/{y}/{x}.png', {
            id:"midnightLayer",
            "minZoom": 6,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
        });

        const satelliteLayer = L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Satellite/{z}/{y}/{x}.jpeg', {
            id:"satelliteLayer",
            name: "satelliteLayer",
            "minZoom": 6,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
        });

        const whiteLayer = L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/white/{z}/{y}/{x}.png', {
            id:"whiteLayer",
            "minZoom": 6,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
        });

        const hybridLayer = L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Hybrid/{z}/{y}/{x}.png', {
            id:"hybridLayer",
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
        });

        let hybrid = L.tileLayer.wms('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Hybrid/{z}/{y}/{x}.png', {
        });

        const baseMaps = {
            "OSM" : osmLayer,
            "vWorld": vworldLayer,
            "white": whiteLayer,
            "midnight":midnightLayer,
            "satellite":satelliteLayer,


        };
        const overlayMaps = {
            "지적도": cadastral,
            "Info": hybrid
        };

        osmLayer.addTo(mapRef.current);
        L.control.layers(baseMaps, overlayMaps).addTo(mapRef.current);
    }, []);


    const markerRef = useRef(null);
    //const markecautionrRef = useRef(null);
    //const markecautionrRef = useRef(null);
    //const markecautionrRef = useRef(null);

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

            currentTableData[item.deviceId] = item;

            const markerIcon = returnMarkerIcon(item.status);


            if(markerRef.current[item.deviceId]==null){
                const marker = L.marker([item.latitude,item.longitude],{
                    title:(item.crpNm + "\n" + "(" + item.vhcleNm + ")"),
                    icon : markerIcon}).addTo(mapRef.current);

                //marker.bindPopup(item.deviceId).openPopup();
                markerRef.current[item.deviceId] = marker;

                /*if(item.status === 'Caution'){
                    markerRef.current[item.deviceId] = marker;
                }*/

            }else{   // 또 다른 마커 정보
                markerRef.current[item.deviceId].setLatLng([item.latitude,item.longitude]);

                if(props.selectDevice != item.deviceId) {
                    // 기존 셀렉된 디바이스와 새로 셀렉한 디바이스 id가 다를 경우, 마커변경
                    markerRef.current[item.deviceId].setIcon(markerIcon);
                }
            }
            const deviceInfo = {};
            MapCurrentData[item.deviceId] = item;
        });

        setDeviceInfo(MapCurrentData);

    },[props.nmsCurrent]);

    //
    async function  reverseGeocoding(latitude,longitude){

        let returnVal = null;
        try {
            await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+latitude+'&lon='+longitude, { method : "GET" })      //메소드 방식 지정
                .then(res => res.json())              //json으로 받을 것을 명시
                .then(res => {                        //실제 데이터를 상태변수에 업데이트

                    if(res.error==null){
                        returnVal = res.display_name;
                    }

                });
            return returnVal;

        }catch {
            return null;
        }

    }


    function returnMarkerIcon(status) {
        let markerUrl = "";

        switch (status){
            case "running":
                markerUrl = green_icon;
                break;
            case "caution":
                markerUrl = yellow_icon;
                break;
            case "warning":
                markerUrl = red_icon;
                break;
            case "faulty":
                markerUrl = gray_icon;
                break;
            default:
                break;
        }

        const markerIcon = L.icon({
            iconUrl: markerUrl,
            shadowUrl: iconShadow,
        });
        return markerIcon;
    }


    useEffect(()=>{
        if(props.selectDevice!=null && props.selectDevice!=""){
            // {01174921SKY35EA: NewClass, 01382820SKYFE71: NewClass, 01382818SKYF667: NewClass, 01377867S}
            //console.log(markerRef.current);

            let bindStr = ( deviceInfo[props.selectDevice].crpNm + "(" + deviceInfo[props.selectDevice].vhcleNm + ")");

            const addr = reverseGeocoding(markerRef.current[props.selectDevice].getLatLng().lat,markerRef.current[props.selectDevice].getLatLng().lng).then(
                result=>{
                    if(result!=null){
                        bindStr = ( deviceInfo[props.selectDevice].crpNm + "(" + deviceInfo[props.selectDevice].vhcleNm + ")\n" + result);
                    }

                    markerRef.current[props.selectDevice].bindPopup(bindStr).openPopup();
                    markerRef.current[props.selectDevice].setIcon(DefaultIcon);
                    //markerRef.current[props.selectDevice]._updateZIndex(10000);
                    setView(markerRef.current[props.selectDevice].getLatLng(),15);

                    if(preSelectDevice!="" && props.selectDevice!=preSelectDevice){
                        const markerIcon = returnMarkerIcon(currentTableData[preSelectDevice]["status"]);
                        markerRef.current[preSelectDevice].setIcon(markerIcon);

                    }
                    setPreSelectDevice(props.selectDevice);
                }
            );
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
            {<Button id="refreshButton" size="small" onClick={refreshButton}>Refresh</Button>}
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