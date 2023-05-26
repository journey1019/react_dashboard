import './map.scss';

import "leaflet/dist/leaflet.css";
import L from "leaflet"; // 현상유지
import {useCallback, useEffect, useRef, useState} from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {func} from "prop-types";
import red_icon from "../map/images/red_icon.png";
import gray_icon from "../map/images/gray_icon.png";
import blue_icon from "../map/images/blue_icon.png";
import yellow_icon from "../map/images/yellow_icon.png"


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



        /*const vworldLayer = L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
            id:"vWorldLayer",
            "minZoom": 6,
            "maxZoom": 22,
            "maxNativeZoom": 19,
            "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
        });*/

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

    function returnMarkerIcon(status) {
        let markerUrl = "";

        switch (status){
            case "running":
                markerUrl = blue_icon;
                break;
            case "warning":
                markerUrl = yellow_icon;
                break;
            case "danger":
                markerUrl = red_icon;
                break;
            case "dead":
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

            console.log(props.nmsCurrent[props.selectDevice]);


            //console.log(markerRef.current[props.selectDevice].getLatLng());
            markerRef.current[props.selectDevice].bindPopup(( deviceInfo[props.selectDevice].crpNm + "\n" + "(" + deviceInfo[props.selectDevice].vhcleNm + ")")).openPopup();
            //선택된 디바이스 마커 바꾸기
            markerRef.current[props.selectDevice].setIcon(DefaultIcon);
            setView(markerRef.current[props.selectDevice].getLatLng(),15);

            // 처음 셀렉할 땐 빈 값
            // 기존 선택한 디바이스와 새로 선택한 디바이스가 다를 때 markerIcon 변경(status 값에 따라)
            if(preSelectDevice != "" && props.selectDevice != preSelectDevice){
                const markerIcon = returnMarkerIcon(currentTableData[preSelectDevice]["status"]);
                markerRef.current[preSelectDevice].setIcon(markerIcon);
            }
            setPreSelectDevice(props.selectDevice);
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