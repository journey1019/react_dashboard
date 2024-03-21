/* React */
import React, {useState, useEffect, useMemo, useRef} from "react";

/* Import */
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // 현상유지

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";

/* Icon */
import icon from "leaflet/dist/images/marker-icon.png"; // Select Icon
import blueIcon from "./images/marker-icon.png";

/* MUI */
import {Grid, Box, Button, darken} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";


const DeviceHistoryMap = (props) => {
    const { sessionNmsCurrent, deviceInfoData } = props;

    //console.log(deviceInfoData)
    //console.log(deviceInfoData.deviceId)

    const [selectLatitude , setSelectLatitude] = useState('');
    const [selectLongitude, setSelectLongitude] = useState('');

    useEffect(() => {
        setSelectLatitude(deviceInfoData.latitude);
        setSelectLongitude(deviceInfoData.longitude);
    }, [deviceInfoData])


    // Device 의 위도, 경도
    //console.log(selectLatitude)
    //console.log(selectLongitude)

    // 데이터를 수집한 날짜(received_date_ 기준으로 All Object Info 나눔
    const [historyTableData, setHistoryTableData] = useState({});

    // 기준점
    //const centerPosition = [35.824844, 127.674335];
    const centerPosition = [35.824844, 127.674335];
    const zoomLevel = 6; // 클수록 확대, 작을수록 축소

    // Map 테마 변경 (Key)
    const vWorldApiKey = "46C7EBA3-7E0F-3132-860D-3307A83ADB20";


    let markerUrl = blueIcon;
    const markerIcon = L.icon({
        iconUrl: markerUrl,
    })
    //L.marker([50.5, 30.5]).addTo(map);

    //const markerPosition = [35.1217166666667, 129.050883333333];

    const customIcon = new L.icon({
        iconUrl: blueIcon,
        iconSize: [18, 34],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32], // 팝업이 열릴 때의 앵커 지점
    })


    return(
        <>
            {/*<Grid className="input" container spacing={0} sx={{height: '95%'}}>*/}
            <MapContainer center={centerPosition} zoom={zoomLevel} minZoom={2} scrollWheelZoom={false} style={{ maxWidth: '100%', maxHeight:'92%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FullscreenControl />
                {deviceInfoData && selectLatitude != undefined && selectLongitude != undefined ? (
                    <Marker position={[selectLatitude,selectLongitude]} icon={customIcon}>
                        <Popup>
                            {`단말: ${deviceInfoData.deviceId}`}<br/><br/>{`위도: ${selectLatitude}`}<br/>{`경도: ${selectLongitude}`}
                        </Popup>
                    </Marker>
                ) : (
                    <p>현재 위치를 알 수 없습니다.</p>
                )}
            </MapContainer>
        </>
    )
}

export default DeviceHistoryMap;