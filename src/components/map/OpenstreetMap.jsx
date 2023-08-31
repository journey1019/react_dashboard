import './map.scss';

import "leaflet/dist/leaflet.css";
import L from "leaflet"; // 현상유지
import React, { useEffect, useRef, useState} from 'react';
//import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import icon from "leaflet/dist/images/marker-icon.png"; // Select Icon
import iconShadow from "leaflet/dist/images/marker-shadow.png";
//import {func} from "prop-types";
import red_icon from "../map/images/red_icon.png";
import gray_icon from "../map/images/gray_icon.png";
import green_icon from "../map/images/green_icon.png";
import yellow_icon from "../map/images/yellow_icon.png"
import home from "../map/images/home.png";

import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/*import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';*/

import {
    LayersControl,
    Map,
    TileLayer,
    LayerGroup,
    Marker
} from "react-leaflet";
import Logo from "../../assets/KoreaORBCOMM_logo.png";

function OpenStreetMap(props){

    //console.log(props.statusClickValue) // running, ...(string)


    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        //iconShadowAnchor: [9, 45],
        iconSize: [25, 41],
        iconAnchor: [9, 45], //[Left/Right, top/bottom]
        popupAnchor: [3, -46],
    });

    const[deviceInfo,setDeviceInfo] = useState({});

    L.Marker.prototype.options.icon = DefaultIcon;

    // 기준점
    const centerPosition = [35.824844, 127.674335];
    const zoomLevel = 6;

    // device로 나눈 Object Info
    const[currentTableData, setCurrentTableData] = useState({});

    // 선택 변경된 Device Icon
    const[preSelectDevice, setPreSelectDevice] = useState("");

    // Status click, 항목 전달 (은 이미 statusClickValue로 전달되니까 생성안해도 됨)
    // click 했을 때 항목에 맞는 Marker만 보여줘야 하기 때문에 해당 항목만 조회
    const[statusCategory, setStatusCategory] = useState([]);

    // 1. click, currentTableData에 있는 status와 매칭 시켜서 statusCategory에 삽입
    // 2. click, props.statusClickValue == currentTableData[item.status] {
    //              statusCategory(currentTableData) -> 삽입(대체하는거지)
    //           }


    // Map 테마 변경 (Key)
    const vWorldApiKey = "46C7EBA3-7E0F-3132-860D-3307A83ADB20";

    // 맵 뿌리기
    const mapRef = useRef(null);

    /* -------------------------- Map Theme Layer -------------------------- */
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

        console.log(mapRef);
        console.log(mapRef.current); // location & zoomLevel
    }, []);

    /* ------------------------------------------------------------------------------------------------------------------------------------------------*/

    const markerRef = useRef(null);
    //const markecautionrRef = useRef(null);
    //const markecautionrRef = useRef(null);
    //const markecautionrRef = useRef(null);
    console.log(markerRef);

    /* -------------------------- props nmsCurrent -------------------------- */
    useEffect(() => {
        if(markerRef.current==null){
            markerRef.current= {};
        }
        let MapCurrentData = {};
        console.log(props.nmsCurrent)

        // "Marker" - DeviceId
        props.nmsCurrent.map((item,index)=>{ //item == 모든 단말기 정보 nmsCurrent

            currentTableData[item.deviceId] = item; //device로 object 나눈 nmsCurrent device info
            console.log(currentTableData)

            // 각 Status에 해당하는 iconUrl, shadowUrl
            const markerIcon = returnMarkerIcon(item.status); // status return marker _ (string)
            console.log(item.status)
            console.log(markerIcon)

            console.log(markerRef) // deviceId로 Object 나눈 모든 device
            console.log(mapRef)


            // device를 선택하지 않았을 경우
            if(markerRef.current[item.deviceId]==null){
                const marker = L.marker([item.latitude,item.longitude],{
                    title:("Company : " + item.crpNm + "\n선박명 : (" + item.vhcleNm + ")\nStatus : " + item.status)
                    , icon : markerIcon})
                    .on('click', onClick)
                    .addTo(mapRef.current);
                // Map _ Marker click, DefaultIcon 변경 & Popup
                function onClick(e) {
                    markerRef.current[item.deviceId].bindPopup("<span style='font-size:10px'>Company : " + item.crpNm + "<br/>선박명 : " + item.vhcleNm + " <br/>Status : " + item.status + "</span>").openPopup();
                    markerRef.current[item.deviceId].setIcon(DefaultIcon);
                    setView(markerRef.current[item.deviceId].getLatLng(),15);

                    MapCurrentData[item.deviceId] = item;
                    console.log(MapCurrentData)
                }

                markerRef.current[item.deviceId] = marker;
                console.log(marker);
                console.log(markerRef.current);
            // device를 선택했을 경우 바커변경(item = not null) / 또 다른 마커정보
            }else{
                markerRef.current[item.deviceId].setLatLng([item.latitude,item.longitude]);

                if(props.selectDevice != item.deviceId) {
                    // 기존 셀렉된 디바이스와 새로 셀렉한 디바이스 id가 다를 경우, 마커변경
                    markerRef.current[item.deviceId].setIcon(markerIcon);
                }
            }
            const deviceInfo = {};


            console.log(markerRef.current[item.deviceId.status])

            //if(props.statusClickValue == currentTableData[item.status])
            //show _ 해당 Object 만 출력
            //Marker 찍기
            //else if(props.statusClickValue == 'null' || props.statusClickValue == '')
            //all 출력




            MapCurrentData[item.deviceId] = item;

        });
        setDeviceInfo(MapCurrentData);

    },[props.nmsCurrent, props.statusClickValue]);


    async function reverseGeocoding(latitude,longitude){

        let returnVal = null;
        try {
            await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+latitude+'&lon='+longitude, { method : "GET" })      //메소드 방식 지정
                .then(res => res.json())              //json으로 받을 것을 명시
                .then(res => {                        //실제 데이터를 상태변수에 업데이트
                    console.log(res)
                    if(res.error==null){
                        returnVal = res.display_name;
                    }

                });
            console.log(returnVal)
            return returnVal; // 지번(?)-우리나라 우편번호(?)

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

    //console.log(props.selectDevice) //01680359SKY3DC0
    /* --------------------------- Device Select ----------------------------------------------------------------------------------------------------------*/
    useEffect(()=>{
        // deviceId를 선택했을 때 (
        if(props.selectDevice!=null && props.selectDevice!=""){ // deviceId
            // {01174921SKY35EA: NewClass, 01382820SKYFE71: NewClass, 01382818SKYF667: NewClass, 01377867S}
            //console.log(markerRef.current);

            // deviceInfo = 전체 데이터(nmsCurrent)
            // popup
            let bindStr = ( deviceInfo[props.selectDevice].crpNm + "\n" + "(" + deviceInfo[props.selectDevice].vhcleNm + ")" + "\n" + " Status: " + deviceInfo[props.selectDevice].status );

            // Address  | reverseGeocoding(latitude, longitude)
            const addr = reverseGeocoding(markerRef.current[props.selectDevice].getLatLng().lat, markerRef.current[props.selectDevice].getLatLng().lng)
                .then( // 선택한 디바이스의 위도, 경도 값이 있다면,
                result=>{
                    //console.log(result) // == reverseGeocoding_return returnVal (지번, 우편번호)
                    // 빈 값이 아니라면, popup으로 주소띄우기
                    if(result!=null){ // location(주소값 포함)
                        bindStr = ( deviceInfo[props.selectDevice].crpNm + "\n" + "(" + deviceInfo[props.selectDevice].vhcleNm + ")" + "\n" + result + "\n" + " Status: " + deviceInfo[props.selectDevice].status );
                    }

                    markerRef.current[props.selectDevice].bindPopup(bindStr).openPopup();
                    markerRef.current[props.selectDevice].setIcon(DefaultIcon);
                    //markerRef.current[props.selectDevice]._updateZIndex(10000);
                    setView(markerRef.current[props.selectDevice].getLatLng(),15);

                    /* DeviceId Select -> Another DeviceId === */
                    if(preSelectDevice!="" && props.selectDevice!=preSelectDevice){
                        const markerIcon = returnMarkerIcon(currentTableData[preSelectDevice]["status"]);
                        markerRef.current[preSelectDevice].setIcon(markerIcon);
                        //console.log(markerRef.current);
                        //console.log(markerRef.current[preSelectDevice]);
                    }
                    setPreSelectDevice(props.selectDevice);
                    console.log(props.selectDevice);
                }
            );
        }
    },[props.selectDevice]);

    /* --------------------------- Device Select ---------------f-------------------------------------------------------------------------------------------*/
    useEffect(() => {
        if(props.statusClickValue!=null && props.statusClickValue!="") {
            // if(statusClickValue == markerRef.current[item.status]) {
            //     show()
            // else{ hide() }

        }
    })
    
    

    /* -------------- 마커선택 시 해당 위치, 줌 레벨 -------------- */
    function setView(position,zoomLevel){
        mapRef.current.setView(position,zoomLevel);
    }
    /* --------------------- Home Button ---------------------*/
    function homeButton(){
        setView(centerPosition, zoomLevel)
    }

    /* ------------------------Status Btn Clk event------------------------*/
    const[markerHide, setMarkerHide] = useState([]);

    //console.log(props.statusClickValue)
    
    useEffect(() => {
        const setStatusClk = [{id: 'status', value: props.statusClickValue}];
        setMarkerHide(setStatusClk);

    }, [props.statusClickValue]);
    //console.log(markerHide); // {id: 'status', value: 'running'}

    const addLayers = () => {
        if (mapRef.current) {
            const map = mapRef.current.leafletElement;

        }
    }


    // Status Btn Click --> StatusClick 변화
    /*useEffect(() => {
    }, [props.StatusClick]);


    useEffect(() => {
        const markerHide = [];
    }, props.statusClickValue)*/


    /* --------------------------------------------------------------- */

    return (
        <div id="map">
            {
                <>
                    {/*<Button id="refreshButton" variant="contained" size="small" color="error" onClick={refreshButton}>
                        <RefreshIcon style={{size : "5px", marginRight: "5px"}} />
                        Refresh
                    </Button>*/}
                    <button id="homeButton" color="error" onClick={homeButton}>
                        <img id="home" src={home} alt="home" height={"70"} width={"100"} style={{color: "gray"}} />
                    </button>
                </>
            }
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

export default OpenStreetMap;