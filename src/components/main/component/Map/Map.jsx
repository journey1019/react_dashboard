/* React */
import React, { useEffect, useRef, useState} from 'react';

/* Import */
import './map.scss';

/* Leaflet */
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // 현상유지

import icon from "leaflet/dist/images/marker-icon.png"; // Select Icon
import iconShadow from "leaflet/dist/images/marker-shadow.png";

/* Icon */
import red_icon from "./images/red_icon.png";
import yellow_icon from "./images/yellow_icon.png";
import gray_icon from "./images/gray_icon.png";
import green_icon from "./images/green_icon.png";
import home from "./images/home.png";

/* MUI */
import useDidMountEffect from "../../../modules/UseDidMountEffect";

/* MapLayer*/
import {MapLayers} from "./MapLayers";

/**
 * @author Jmpark
 * @date 2024.02.20
 * @param props
 * @define
 *  DefaultIcon : marker icon
 *  useState({}) const[deviceInfo,setDeviceInfo] : 단말 정보
 *  centerPosition : 시작 시 지도 중앙
 *  zoomLevel : 시작 시 Zoom level
 *  useState({}) const[preSelectDevice, setPreSelectDevice] :
 *  vWorldApiKey : vWorld API Key
 *  useRef mapRef : 지도 정의
 *  useRef markerRef : 마커 정의
 *  useState({}) const[locationInfos,setLocationInfos] :
 *  useState([]) const[selectStatus,setSelectStatus] :
 * @returns {JSX.Element}
 * @constructor src/component/main/Main.jsx
 *
 * @description
 * 메인 화면 지도 반환
 *  - 호출 위치 : src/component/main/Main.jsx
 *  - 최신 위치 지도 표출(Status 별 색상)
 *  - Status 클릭 시, 해당 위치만 표출
 *  - 단말 선택 시, 해당 위치 이동 및 위,경도에 따른 주소 반환(reverse geocoding)
 *  - 마커 선택 시, 단말 단순 정보 표시.
 */
function Map(props){


    /**
     * L.icon --> Leaflet Icon module
     *
     * 기본 단말 아이콘(단말 선택 및 마커 클릭 시 사용)
     * iconUrl : icon file 위치
     * shadowUrl : icon 음영 file 위치
     * iconSize : 아이콘 크기
     * iconAnchor : 아이콘 위치
     * popupAnchor : 팝업 위치
     */
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        //iconShadowAnchor: [9, 45],
        iconSize: [25, 41],
        iconAnchor: [9, 45], //[Left/Right, top/bottom]
        popupAnchor: [3, -46],
    });

    /**
     * 최신 데이터 단말 정보
     * key : deviceId
     * value : props.mapNmsCurrent --> object
     * @desc
     * deviceId, latitude, longitude, status 정보
     *@todo
     * 메모리 사용량 줄이기 위해 저장 시, 필요정보 외 제외.
     */
    const[deviceInfo,setDeviceInfo] = useState({});

    /**
     * Leaflet Default Icon Setting
     */
    L.Marker.prototype.options.icon = DefaultIcon;

    /**
     * @desc
     * 첫 화면 및 화면 초기화 시, 지도 중앙 위,경도
     * @type {number[]}
     */
    const centerPosition = [35.824844, 127.674335];
    /**
     * @desc
     * 첫 화면 및 화면 초기화 시, zoomLevel.
     * @type {number}
     */
    const zoomLevel = 6;

    /**
     * @desc
     * 단말 선택(marker Click 아님) 시, 이전에 선택된 단말 정보
     * @type {useState("")}
     */
    const[preSelectDevice, setPreSelectDevice] = useState("");

    /**
     * @desc
     * 지도 정보 저장 : useRef ==> 렌더링에 필요하지 않은 값을 참조.
     * @type useRef(null)
     */
    const mapRef = useRef(null);

    /**
     * @desc
     * 마커 정보 저장
     * @type useRef(null)
     */
    const markerRef = useRef(null);

    /**
     * @desc
     * Status 별(key) 위치 정보를 [](value)로 저장하는 param
     * @type useState({})
     * @todo
     * 메모리 사용량을 줄이기 위해 useState 대신 const, let을 사용하는 방법도 강구.
     */
    const [locationInfos,setLocationInfos] = useState({});
    //let locationInfos = {};
    /**
     * @desc
     * status 별 선택된 단말 정보 list 저장.
     * @type useState([])
     * @todo
     * status에 따라 선택된 단말 정보를 list형태로 저장.
     */
    const [selectStatus,setSelectStatus] = useState([]);


    /**
     * @name 지도 레이어 생성
     * @typedef useEffect
     * @author jmpark
     * @date 2024.02.20
     * @trigger []
     * @constructor
     * @description
     * main page load 시, 1회 호출
     */
    useEffect(() => {


        if(mapRef.current ==null){
            /**
             * openStreet 기본 맵 생성(<div id="map">)
             */
            mapRef.current = L.map('map', {
                center: centerPosition,
                zoom: zoomLevel,
                layers: [
                    MapLayers.defaultLayer,
                ]
                , minZoom: 2
            });

            /**
             * @desc
             * 우측 상단 지도 Type 선택하게
             * @type {{midnight, white, vWorld, OSM, satellite}}
             */
            const baseMaps = {
                "OSM" : MapLayers.osmLayer,
                "vWorld": MapLayers.vworldLayer,
                "white": MapLayers.whiteLayer,
                "midnight":MapLayers.midnightLayer,
                "satellite":MapLayers.satelliteLayer,
            };
            /**
             * @desc
             * 우측 상단 지도 Info layer
             * @type {{Info, 지적도}}
             */
            const overlayMaps = {
                "지적도": MapLayers.cadastral,
                "Info": MapLayers.hybrid
            };

            //기본 지도 레이어 셋팅
            MapLayers.osmLayer.addTo(mapRef.current);
            //지도 info, 지도 type 추가
            L.control.layers(baseMaps, overlayMaps).addTo(mapRef.current);
        }

    }, []);


    /**
     *@trigger props.mapNmsCurrent([])
     * @desc
     * 주기대로 API에서 수신되는 current 데이터를 status 및 전체별로 분류하고 조회할 수 있도록 분리.
     * @export
     * locationInfos({})
     * deviceInfo({})
     * selectStatus([])
     */
    useEffect(() => {

        if(markerRef.current==null){
            markerRef.current= {};
        }
        /**setDeviceInfo를 위한 {} 생성
         * @desc
         * currentData for --> deviceId(key), deviceInfoForm(value)
         * @type {}
         */
        let MapCurrentData = {};

        /** Status 별 단말 [] 저장
         * @desc
         *  all, running, caution, warning, faulty 별 [] 저장
         * @type {*[]}
         */
        const faultyGroup = [];
        const warningGroup = [];
        const cautionGroup = [];
        const runningGroup = [];
        const allGroup = [];

        /**
         * @desc
         * props.mapNmsCurrent.map --> item
         */
        props.mapNmsCurrent.map((item,index)=>{

            /**
             * deviceInfoForm
             * @desc
             * item으로 저장 할 때 불필요한 데이터가 저장되어 메모리에 적재되는 것을 방지하기 위해 필요값만
             * 만들어 저장
             * @type {{vhcleNm, latitude, crpNm, deviceId, status, longitude}}
             */
            const deviceInfoForm = {
                deviceId : item.deviceId,
                crpNm : item.crpNm,
                vhcleNm : item.vhcleNm,
                status : item.status,
                latitude : item.latitude,
                longitude : item.longitude
            }

            /**
             * status(running, caution, warning, faulty, all) 별 [] 저장
             */
            if(item.status === 'faulty'){
                faultyGroup.push(deviceInfoForm);
            }
            else if(item.status === 'warning') {
                warningGroup.push(deviceInfoForm);
            }
            else if(item.status === 'caution') {
                cautionGroup.push(deviceInfoForm);
            }
            else{
                runningGroup.push(deviceInfoForm);
            }
            allGroup.push(deviceInfoForm);

            /**
             * @desc
             * deviceId(key) , deviceInfoForm(value)
             * @type {{vhcleNm, latitude, crpNm, deviceId, status, longitude}}
             */
            MapCurrentData[item.deviceId] = deviceInfoForm;

        });

        /**
         * locationInfos <- status(key),deviceInfoForm[](value)
         * @type {[]}
         */
        locationInfos["running"] = runningGroup;
        locationInfos["caution"] = cautionGroup;
        locationInfos["warning"] = warningGroup;
        locationInfos["faulty"] = faultyGroup;
        locationInfos["all"] = allGroup;

        /**
         * @param
         * mapCurrentData(deviceId(key),deviceInfoForm(value)
         * @constructor
         * deviceInfo(useState) <- mapCurrentData(deviceId(key),deviceInfoForm(value)
         */
        setDeviceInfo(MapCurrentData);
        /**
         * @param
         * props.statusClickValue : device Status clicked Value(없으면 all로 설정)
         * locationInfos : status 에 대한 deviceInfoForm[]
         * @constructor
         * setSelectStatus(useState) <- locationInfos[props.statusClickValue]([])
         */
        setSelectStatus(locationInfos[props.statusClickValue===""?"all":props.statusClickValue]);


    },[props.mapNmsCurrent]);

    /**
     * @trigger
     * props.statusClickValue : 메인화면 status click param
     * @param
     * props.statusClickValue : device Status clicked Value(해제 시 all로 설정)
     * locationInfos : status 에 대한 deviceInfoForm[]
     * @constructor
     * setSelectStatus(useState) <- locationInfos[props.statusClickValue]([])
     */
    useEffect(() => {
        setSelectStatus(locationInfos[props.statusClickValue===""?"all":props.statusClickValue]);
    }, [props.statusClickValue]);
    //console.log(markerHide); // {id: 'status', value: 'running'}

    /**
     * @trigger
     * selectStatus
     * @param
     * selectStatus : deviceInfoForm[]
     * @constructor
     * markerSet() : 화면 마커 셋팅
     */
    useDidMountEffect(()=>{
        markerSet(selectStatus);
    },[selectStatus]);

    /**
     * @param
     * markers : deviceInfoForm[]
     * @desc
     * 화면 마커 생성(초기화 후 재 생성)
     */
    function markerSet(markers){

        /**
         * marker 초기화(화면 지우기)
         */
        markerReset();

        if(typeof markers!=="undefined"){

            markers.map((item,index)=>{

                /**
                 * status에 따른 마커 정의(색상)
                 * @param
                 * deviceInfoForm.status
                 * @return
                 * L.Icon(leaflet Icon)
                 */
                const markerIcon = returnMarkerIcon(item.status);


                //마커가 없는 경우, 초기화에 따라 선택된 디바이스 제외하고는 생성.
                if(markerRef.current[item.deviceId]==null){

                    /**
                     * @param
                     * deviceInfoForm
                     * @constructor
                     * title : 마커 커서 이동 시, 간단 정보 표시.
                     * icon : 마커 아이콘
                     * .on('click') : 마커 클릭 시
                     * .addTo(mapRef.current) : map에 마커 추가.
                     * .bindPopup : 클릭 시 팝업 내용(L.Popup)
                     */
                    const marker = L.marker([item.latitude,item.longitude],{
                        title:("선사 : " + item.crpNm + "\n선박 : (" + item.vhcleNm + ")\n상태 : " + item.status)
                        , icon : markerIcon})
                        .on('click', onClick)
                        .addTo(mapRef.current).bindPopup(returnPopup(item));
                    // Map _ Marker click, DefaultIcon 변경 & Popup

                    /**
                     * @desc
                     * 마커 클릭 시, 마커 아이콘 변경, 마커 위치 이동.
                     * @param e
                     */
                    function onClick(e) {
                        marker.setIcon(DefaultIcon);
                        setView(marker.getLatLng(),15);
                    }

                    /**
                     * marker popup 닫을 때,
                     * 아이콘 기존 status 변경(마커 클릭 시에)
                     * @desc
                     * setMarkerIcon을 통해 prop.selectDevice와 비교하여 status icon 변경 시,
                     * selectDevice 일 경우, 변경하지 않게 처리하려 했으나
                     * marker를 생성할 시점(prop.selectDevice가 null or "") 값을 갖고 비교하여
                     * 선택된 단말이 무조건 변경되어 하단에서 선택 단말의 popupclose 대해 처리 로직을 바꿔줌.
                     */
                    marker.on('popupclose',function (e){
                        setMarkerIcon(item.deviceId,markerIcon);
                    });

                    /**
                     * marker를 markerRef에 등록.
                     */
                    markerRef.current[item.deviceId] = marker;


                    // device를 선택했을 경우 마커변경(item = not null) / 또 다른 마커정보
                }else{
                    /**
                     * 단말을 선택(selectDevice) 시, 변경처리 확인 필요.
                     */
                    markerRef.current[item.deviceId].setLatLng([item.latitude,item.longitude]);
                    setMarkerIcon(item.deviceId,markerIcon);

                }

            });
        }

    }

    /**
     * @trigger
     * props.selectDevice
     * @param
     * props.selectDevice : Main화면 하단 표에서 선택된 단말
     * @constructor
     * deviceInfo : deviceId(key), deviceInfoFrom(value)
     * bindStr : popup contents
     * const addr : reverseGeocoding returnVal 정의(async,await)
     * reverseGeoncoding(lat,lon) : 해당 위치의 주소 반환 function
     * markerIcon : status 상태가 반영된 MarkerIcon
     * returnMarkerIcon(status) : param(단말 Status) --> return(L.Icon)
     * setView(geoArray[lat,lng], zoomLevel) : geoArray는 마커에서 반환.
     * setMarkerIdon(deviceId, L.Icon) : 해당 단말의 Icon 변경
     * @return
     */
    useEffect(()=>{

        //Main 화면 단말 선택(하단 표) 시,
        if(typeof props.selectDevice !=="undefined" && props.selectDevice!==""){ // deviceId

            /**
             * Marker bind Popup Content Set.
             * @type {string}
             */
            let bindStr = ( deviceInfo[props.selectDevice].crpNm + "<br/>" + "(" + deviceInfo[props.selectDevice].vhcleNm + ")" + "<br/>" + " Status: " + deviceInfo[props.selectDevice].status );

            /**
             * return Address  | reverseGeocoding(latitude, longitude)
             * @type {Promise<null | null | undefined>}
             * @desc
             * reverseGeocoding(lat,lng) : OpenStreetApi를 통해 단말 위치의 주소 반환.
             */
            const addr = reverseGeocoding(markerRef.current[props.selectDevice].getLatLng().lat, markerRef.current[props.selectDevice].getLatLng().lng)
                .then( // 선택한 디바이스의 위도, 경도 값이 있다면,
                    result=>{

                        //console.log(result) // == reverseGeocoding_return returnVal (지번, 우편번호)
                        // 빈 값이 아니라면, popup으로 주소띄우기
                        if(result!=null){ // location(주소값 포함)
                            bindStr = ( deviceInfo[props.selectDevice].crpNm + "<br/>" + "(" + deviceInfo[props.selectDevice].vhcleNm + ")" + "<br/>" + result + "<br/>" + " Status: " + deviceInfo[props.selectDevice].status );
                        }
                        //contents Style 적용.
                        bindStr = "<span style='font-size:10px'>"+bindStr+"</span>";

                        //이전 선택 단말 복원.
                        if(preSelectDevice!=="" && props.selectDevice!==preSelectDevice){
                            /**
                             * @param
                             * useState("") preSelectDevice : 이전 단말 ID
                             * deviceInfo[preSelectDevice] : 이전 선택 단말의 deviceInfoForm
                             * deviceInfo[preSelectDevice]["status"] : 이전 선택 단말의 deviceInfoForm 내 단말 상태 값
                             * @return
                             * L.Icon : Status가 반영된 단말 Icon
                             */
                            const markerIcon = returnMarkerIcon(deviceInfo[preSelectDevice]["status"]);

                            /**
                             * markerRef : leaflet에서 단말 마커에 대해 적용된 useRef().
                             * markerRef.current : 현재 표시되는 모든 마커에 대한 object.(deviceId(key), L.Marker(value))
                             * L.Marker.setIcon(L.Icon) : 단말 Icon Setting.
                             * L.Marker.bindPopup().closePopup() : 해당 마커에 현재 표시되는 bindPopup 닫기.
                             * L.Marker.bindPopup(String) : Popup Contents Setting(단말 선택 시의 popup은 reverseGeocoding)
                             * L.Marker.on('popupclose' : popup이 종료됬을 때의 event Setting.
                             */
                            markerRef.current[preSelectDevice].setIcon(markerIcon);
                            markerRef.current[preSelectDevice].bindPopup().closePopup();
                            markerRef.current[preSelectDevice].bindPopup(returnPopup(deviceInfo[preSelectDevice]));
                            markerRef.current[preSelectDevice].on('popupclose',function (e){
                                /**
                                 * 선택 이전의 status가 적용된 마커로 변경(선택 시 마커 해제)
                                 */
                                setMarkerIcon(preSelectDevice,markerIcon);
                            });
                        }

                        /**
                         * L.Marker.bindPopup(binStr).openPopup() : bindPopup contents Setting 후 팝업 오픈.
                         * setView(latLng,zoomLevel) : 단말 위치로 지도 이동 및 지도 확대
                         * L.Marker.on('popupclose', : popup 종료 시, status에 따른 마커 아이콘 변경 방지.
                         */
                        markerRef.current[props.selectDevice].bindPopup(bindStr).openPopup();
                        markerRef.current[props.selectDevice].setIcon(DefaultIcon);
                        setView(markerRef.current[props.selectDevice].getLatLng(),13);
                        markerRef.current[props.selectDevice].on('popupclose',function (e){
                            /**
                             * 마커 생성 시, popupclose event를 적용했을 때,
                             *  --> 선택된 단말 : 마커 변경 X (defaultIcon)
                             *  --> 선택되지 않은 단말 : 마커 변경 O (markerIcon)
                             *  이어야 함.
                             *  위의 값을 비교하기 위해서는 props.selectDevice와 popup을 종료하는 단말의 ID를 비교해야함.
                             *   --> 마커 생성 시, props.selectDevice의 값을 갖고 비교를 진행(시점)
                             *   --> 주로 마커 생성 시, 값은 null or "" (선택된 단말이 없음)
                             *   --> "" 과 popupclose 되는 단말 ID를 비교하게 되므로 무조건 markerIcon으로 변경 처리됨.
                             *    ==> 이로 인해 단말 선택 시에 해당 이벤트를 변경하는 popupclose를 재정의.
                             */
                            setMarkerIcon(props.selectDevice,DefaultIcon);
                        });

                        //과거 단말 선택에 현재 반영.
                        setPreSelectDevice(props.selectDevice);
                    }
                );
        }
    },[props.selectDevice]);


    /**
     * postion [lat,lng], zoomLevel로 해당 위치로 이동 및 Zoom.
     * @param position
     * @param zoomLevel
     */
    function setView(position,zoomLevel){
        mapRef.current.setView(position,zoomLevel);
    }

    /**
     * 단말이 선택되지 않은 상태의 popup Contents를 포함한 L.popup Return.
     * @param deviceInfo
     * @return L.popup
     */
    function returnPopup(deviceInfo){
        const popup = L.popup({
            closeOnClick: false,
            autoClose: false
        }).setContent("<span style='font-size:10px'>선사 : " + deviceInfo.crpNm + "<br/>선박 : " + deviceInfo.vhcleNm + " <br/>상태  : " + deviceInfo.status + "</span>");

        return popup;
    }

    /**
     * 지도 초기화를 위해 지도 우측의 홈버튼 클릭 시, 지도 위치 및 zoomLevel 초기화
     */
    function homeButton(){
        setView(centerPosition, zoomLevel)
    }

    /**
     * 마커 위치 변경 시, 마커 초기화.
     */
    function markerReset(){

        /**
         * Object.keys() : object key의 list
         * 지도에 표시된 것이 없으면 실행 X;
         */
        if(Object.keys(markerRef.current).length>0){

            /**
             * Object.keys() --> deviceId list
             */
            Object.keys(markerRef.current).forEach(function (key){
                /**
                 * 조건 :
                 * markerRef.current[key]!==null --> 지도에 마커가 있어야
                 * props.selectDevice!==key --> 선택된 단말을 지우지 않아야
                 * L.marker.remove() : 단말 마커 삭제
                 */
                if(markerRef.current[key]!==null && props.selectDevice!==key){
                    //단말 마커 삭제
                    markerRef.current[key].remove();
                    //마커 생성 시, markerRef.current[deviceId]의 null check를 하므로.
                    markerRef.current[key] = null;
                }
            });
        }
    }

    /**
     * markerRef.current[device] 의 마커 아이콘 변경
     * @param deviceId
     * @param icon(L.icon)
     */
    function setMarkerIcon(deviceId, icon){

        markerRef.current[deviceId].setIcon(icon);

    }

    /**
     * Status에 따른 markerIcon Setting.
     * @param status
     * @return L.icon
     */
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

    /**
     * 위치에 따른 주소 반환
     * @param latitude
     * @param longitude
     * @return {Promise<null>}
     */
    async function reverseGeocoding(latitude,longitude){

        let returnVal = null;
        try {
            await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+latitude+'&lon='+longitude, { method : "GET" })      //메소드 방식 지정
                .then(res => res.json())              //json으로 받을 것을 명시
                .then(res => {                        //실제 데이터를 상태변수에 업데이트
                    //console.log(res)
                    if(res.error==null){
                        returnVal = res.display_name;
                    }

                });
            //console.log(returnVal)
            return returnVal; // 지번(?)-우리나라 우편번호(?)

        }catch {
            return null;
        }
    }


    return (
        <>
            <div id="map">
                {
                    <button id="homeButton" color="error" onClick={homeButton}>
                        <img id="home" src={home} alt="home" style={{color: "gray"}} />
                    </button>
                }
            </div>
        </>
    )

}

export default Map;