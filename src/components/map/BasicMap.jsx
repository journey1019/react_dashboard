import './map.scss'
import {useCallback, useEffect, useRef, useState} from 'react';
import locationData from "../../config/Result_13.json";
import { MarkerWithLabel } from '@googlemaps/markerwithlabel';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'



function BasicMap(props) {


    /** Map feed props **/
    const [feedData, setFeedData] = useState([]);

    useEffect(()=>{
        console.log(props.feed);
        setFeedData(props.feed);
    },[props.feed])

    /*if(props.feed != null || props.feed.length != 0){
        setFeedData(props.feed);
    }*/

    const mapElement = useRef(null);

    const mapObject = {};

    // 컴포넌트가 마운트될 때, 수동으로 스크립트를 넣어줍니다.
    // 이는 script가 실행되기 이전에 window.initMap이 먼저 선언되어야 하기 때문입니다.
    const loadScript = useCallback((url: string) => {
        const firstScript = window.document.getElementsByTagName('script')[0];
        const newScript = window.document.createElement('script');
        newScript.src = url;
        newScript.async = true;
        newScript.defer = true;
        firstScript?.parentNode?.insertBefore(newScript, firstScript);
    }, []);


    // script에서 google map api를 가져온 후에 실행될 callback 함수
    const initMap = useCallback(() => {
        const { google } = window;
        if (!mapElement.current || !google) return;


        const location = { lat: 35.824844, lng: 127.674335 };
        const map = new google.maps.Map(mapElement.current, {
            zoom: 7,
            center: location,
        });


        /*const newLocationArrayData = locationData.map((item,index)=>{

            const marker = new MarkerWithLabel({
                position: new google.maps.LatLng(item.latitude, item.longitude),
                clickable: true,
                draggable: true,
                map: map,
                labelContent: item.device, // can also be HTMLElement
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels", // the CSS class for the label
                labelStyle: { opacity: 1.0 },
            })
        });*/
        const newLocationArrayData = feedData.map((item,index)=>{
            console.log(item);

            const marker = new MarkerWithLabel({
                position: new google.maps.LatLng(item.latitude, item.longitude),
                clickable: true,
                draggable: true,
                map: map,
                labelContent: item.deviceId, // can also be HTMLElement
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels", // the CSS class for the label
                labelStyle: { opacity: 1.0 },
            })
        });
    }, [feedData]);


    useEffect(() => {

    },[feedData])


    useEffect(() => {
        const script = window.document.getElementsByTagName('script')[0];
        const includeCheck = script.src.startsWith(
            'https://maps.googleapis.com/maps/api'
        );

        // script 중복 호출 방지
        if (includeCheck) return initMap();

        window.initMap = initMap;
        loadScript(
            'https://maps.google.com/maps/api/js?client=gme-seavantage&region=KR&amp;language=ko&libraries=drawing,places,visualization,geometry&callback=initMap'
        );
    }, [initMap, loadScript]);


    return(
        <>
            <div className="map" ref={mapElement} style={{ width: '2800px', height: '500px' }} />
        </>
    );
}

export default BasicMap;