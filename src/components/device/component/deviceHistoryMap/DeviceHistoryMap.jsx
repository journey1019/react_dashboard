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


const DeviceHistoryMap = (props) => {
    //console.log(props.nmsOneHistory);

    // 데이터를 수집한 날짜(received_date_ 기준으로 All Object Info 나눔
    const [historyTableData, setHistoryTableData] = useState({});

    // 기준점
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
            <Grid className="input" container spacing={0} sx={{height: '95%'}}>

                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        Map
                    </div>
                    <hr/>
                    <div className="device_diagnostic_construct_contained" style={{width: '100%', height: '95%'}}>

                        <MapContainer center={centerPosition} zoom={zoomLevel} scrollWheelZoom={false} style={{height: '100%'}}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <FullscreenControl />
                            <Marker position={[35.3395166666667,129.374566666667]} icon={customIcon}><Popup>위치 1</Popup></Marker>
                            <Marker position={[35.2006666666667,129.261833333333]} icon={customIcon}><Popup>위치 2</Popup></Marker>
                            <Marker position={[35.0858166666667,129.123033333333]} icon={customIcon}><Popup>위치 3</Popup></Marker>
                            <Marker position={[37.1393833333333,127.621716666667]} icon={customIcon}><Popup>위치 3</Popup></Marker>
                            <Marker position={[37.1393833333333,127.621716666667]} icon={customIcon}><Popup>위치 3</Popup></Marker>
                            <Marker position={[37.1393833333333,127.621716666667]} icon={customIcon}><Popup>위치 3</Popup></Marker>
                            <Marker position={[37.1393833333333,127.621716666667]} icon={customIcon}><Popup>위치 3</Popup></Marker>
                        </MapContainer>

                    </div>
                </Box>
            </Grid>
        </>
    )
}

export default DeviceHistoryMap;