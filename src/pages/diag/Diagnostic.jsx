import Navbar from "../../components/navbar/Navbar";
import './diagnostic.scss';

import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, Polyline, Polygon, Rectangle, SVGOverlay } from 'react-leaflet';
import { useEffect, useRef, useState} from 'react';
import icon from "leaflet/dist/images/marker-icon.png";

const Diagnostic = () => {

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




    return (
        <div className="ais">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="contain">
                <div>
                    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
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
                    </MapContainer>

                </div>
            </div>
        </div>
    )
}

export default Diagnostic;