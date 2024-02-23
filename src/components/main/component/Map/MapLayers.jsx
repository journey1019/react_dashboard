import L from "leaflet";

/**
 *
 * @type {string}
 * vWorld API Key
 */
export const vWorldApiKey = "46C7EBA3-7E0F-3132-860D-3307A83ADB20";
/**
 * Map Layer 정의
 * @type {{hybridLayer, hybrid, osmLayer, vworldLayer, cadastral, defaultLayer, satelliteLayer, midnightLayer, whiteLayer}}
 */
export const MapLayers = {
// Map 테마 변경 (Key)
    /**
     * 기본 레이어 타일 생성
     * 하단 vWorld 레이어는 별도로 추가(tile 레이어 변환을 위해)
     */
    defaultLayer : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        id:"defaultLayer",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    /**
     * openStreet 레이어
     */
    osmLayer : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        id:"osmLayer",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),

    /**
     * vWorld Default 레이어
     */
    vworldLayer : L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Base/{z}/{y}/{x}.png', {
        id:"vWorldLayer",
        "minZoom": 6,
        "maxZoom": 22,
        "maxNativeZoom": 19,
        "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
    }),

    /**
     * vWorld midnight 레이어
     */
    midnightLayer : L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/midnight/{z}/{y}/{x}.png', {
        id:"midnightLayer",
        "minZoom": 6,
        "maxZoom": 22,
        "maxNativeZoom": 19,
        "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
    }),

    /**
     * vWorld 위성 지도 레이어
     */
    satelliteLayer : L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Satellite/{z}/{y}/{x}.jpeg', {
        id:"satelliteLayer",
        name: "satelliteLayer",
        "minZoom": 6,
        "maxZoom": 22,
        "maxNativeZoom": 19,
        "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
    }),

    /**
     * vWorld 백지도 레이어
     */
    whiteLayer : L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/white/{z}/{y}/{x}.png', {
        id:"whiteLayer",
        "minZoom": 6,
        "maxZoom": 22,
        "maxNativeZoom": 19,
        "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
    }),

    /**
     * vWorld 혼합 지도 레이어
     */
    hybridLayer : L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Hybrid/{z}/{y}/{x}.png', {
        id:"hybridLayer",
        "minZoom": 6,
        "maxZoom": 22,
        "maxNativeZoom": 19,
        "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
    }),

    /**
     * vWorld 지적도
     */
    cadastral : L.tileLayer.wms("http://api.vworld.kr/req/wms", {
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
    }),

    /**
     * 지도 상 지역 정보 표시
     */
    hybrid: L.tileLayer.wms('http://api.vworld.kr/req/wmts/1.0.0/'+vWorldApiKey+'/Hybrid/{z}/{y}/{x}.png', {
    })
}