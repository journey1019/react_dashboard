import React, { useState, useEffect, useMemo } from 'react';
import ges from './ges.scss';
import Navbar from "../../components/navbar/Navbar";
import Power from "../../components/ges/power/Power";

const GES = () => {
    return(
        <div className="ges">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="contain">
                <div className="powers">
                    <Power />
                </div>
            </div>
        </div>
    )
}

export default GES;
