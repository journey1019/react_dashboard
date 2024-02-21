import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AnimatedGaugeChart = ({ label, targetValue, pathColor, trailColor, backgroundColor }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const animationDuration = 1500; // 애니메이션 지속 시간 (밀리초)
        let startTime;
        let requestId;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const newPercentage = Math.min((progress / animationDuration) * targetValue, targetValue);

            setPercentage(newPercentage);

            if (progress < animationDuration) {
                requestId = requestAnimationFrame(animate);
            }
        };

        requestId = requestAnimationFrame(animate);

        // cleanup 함수
        return () => cancelAnimationFrame(requestId);
    }, [targetValue]);

    return (
        <div style={{padding: '5px'}}>
            <div style={{ textAlign: 'center', paddingBottom:'5px' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>{label}</p>
            </div>
            <CircularProgressbar
                value={percentage}
                text={`${percentage.toFixed(2)}%`}
                background
                backgroundPadding={1}
                styles={buildStyles({
                    rotation: 0,
                    strokeLinecap: 'round',
                    textSize: '14px',
                    fontWeight: 'bold',
                    pathTransitionDuration: 0.5,
                    pathColor: pathColor,
                    textColor: 'black',
                    trailColor: trailColor,
                    backgroundColor: backgroundColor,
                    pathTransition: 'none',
                })}
            />
        </div>
    );
};

export default AnimatedGaugeChart;