import "./example.scss";
import Navbar from "../../components/navbar/Navbar";
import {
    Circle,
    CircleMarker,
    MapContainer,
    Polygon,
    Polyline,
    Popup,
    Rectangle,
    SVGOverlay,
    TileLayer,
    Marker
} from "react-leaflet";
import React from "react";

import tileLayer from "../util/tileLayer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "react-tabs/style/react-tabs.css";


const Example = () => {

    const center = [51.505, -0.09]

    const polyline = [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.12],
    ]

    const multiPolyline = [
        [
            [51.5, -0.1],
            [51.5, -0.12],
            [51.52, -0.12],
        ],
        [
            [51.5, -0.05],
            [51.5, -0.06],
            [51.52, -0.06],
        ],
    ]

    const polygon = [
        [51.515, -0.09],
        [51.52, -0.1],
        [51.52, -0.12],
    ]

    const multiPolygon = [
        [
            [51.51, -0.12],
            [51.51, -0.13],
            [51.53, -0.13],
        ],
        [
            [51.51, -0.05],
            [51.51, -0.07],
            [51.53, -0.07],
        ],
    ]

    const rectangle = [
        [51.49, -0.08],
        [51.5, -0.06],
    ]

    const bounds = [
        [51.49, -0.08],
        [51.5, -0.06],
    ]

    const fillBlueOptions = { fillColor: 'blue' }
    const blackOptions = { color: 'black' }
    const limeOptions = { color: 'lime' }
    const purpleOptions = { color: 'purple' }
    const redOptions = { color: 'red' }


    const content = [
        {
            title: "Sukiennice",
            image:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/A-10_Sukiennice_w_Krakowie_Krak%C3%B3w%2C_Rynek_G%C5%82%C3%B3wny_MM.jpg/1920px-A-10_Sukiennice_w_Krakowie_Krak%C3%B3w%2C_Rynek_G%C5%82%C3%B3wny_MM.jpg",
            style: { width: "100%" },
            figcaption: "Source: wikipedia.org",
            text: "Kraków,[a] also written in English as Krakow and traditionally known as Cracow, is the second-largest and one of the oldest cities in Poland. Situated on the Vistula River in Lesser Poland Voivodeship...",
            link: "https://en.wikipedia.org/wiki/Krak%C3%B3w",
        },
        {
            title: "Town Hall Tower",
            image:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Krak%C3%B3w_-_Town_Hall_Tower_01a.jpg/315px-Krak%C3%B3w_-_Town_Hall_Tower_01a.jpg",
            style: { display: "flex", height: "202px", width: "auto", margin: "auto" },
            figcaption: "Source: wikipedia.org",
            text: "Town Hall Tower in Kraków, Poland (Polish: Wieża ratuszowa w Krakowie) is one of the main focal points of the Main Market Square in the Old Town district of Kraków. The Tower is the only...",
            link: "https://en.wikipedia.org/wiki/Town_Hall_Tower,_Krak%C3%B3w",
        },
    ];
    

    return(
        <div className="example">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="contain">
                <div>
                    {/*<MapContainer center={center} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Circle center={center} pathOptions={fillBlueOptions} radius={200} />
                        <CircleMarker center={[51.51, -0.12]} pathOptions={redOptions} radius={20}>
                            <Popup>Popup in CircleMarker</Popup>
                        </CircleMarker>
                        <Polyline pathOptions={limeOptions} positions={polyline} />
                        <Polyline pathOptions={limeOptions} positions={multiPolyline} />
                        <Polygon pathOptions={purpleOptions} positions={polygon} />
                        <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
                        <Rectangle bounds={rectangle} pathOptions={blackOptions} />

                        <SVGOverlay attributes={{ stroke: 'red' }} bounds={bounds}>
                            <rect x="0" y="0" width="100%" height="100%" fill="blue" />
                            <circle r="5" cx="10" cy="10" fill="red" />
                            <text x="50%" y="50%" stroke="white">
                                text
                            </text>
                        </SVGOverlay>
                    </MapContainer>*/}
                    <MapContainer center={center} zoom={18} scrollWheelZoom={false}>
                        <TileLayer {...tileLayer} />

                        <Marker position={center}>
                            <Popup maxWidth={320}>
                                <Tabs>
                                    <TabList>
                                        <Tab>Sukiennice</Tab>
                                        <Tab>Town Hall Tower</Tab>
                                    </TabList>

                                    {content.map((item, index) => (
                                        <TabPanel key={index}>
                                            <figure>
                                                <img src={item.image} alt={item.title} style={item.style} />
                                                <figcaption>{item.figcaption}</figcaption>
                                            </figure>
                                            <div>
                                                {item.text}
                                                <a href={item.link} target="_blank" rel="noreferrer">
                                                    → show more
                                                </a>
                                            </div>
                                        </TabPanel>
                                    ))}
                                </Tabs>
                            </Popup>
                        </Marker>
                    </MapContainer>

                </div>
            </div>
        </div>
    )
}

export default Example;