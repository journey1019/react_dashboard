import React, { useState, useEffect } from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AnimatedGaugeChart = ({ label, monthValue, edgePathColor, edgeTrailColor, edgeBackgroundColor, yesterValue, insidePathColor, insideTrailColor, insideBackgroundColor }) => {
    const [monthPercentage, setMonthPercentage] = useState(0);
    const [yesterPercentage, setYesterPercentage] = useState(0);

    useEffect(() => {
        const animationDuration = 1500; // 애니메이션 지속 시간 (밀리초)
        let startTime;
        let requestId;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const newMonthPercentage = Math.min((progress / animationDuration) * monthValue, monthValue);
            const newYesterPercentage = Math.min((progress/animationDuration) * yesterValue, yesterValue);

            setMonthPercentage(newMonthPercentage);
            setYesterPercentage(newYesterPercentage);

            if (progress < animationDuration) {
                requestId = requestAnimationFrame(animate);
            }
        };

        requestId = requestAnimationFrame(animate);

        // cleanup 함수
        return () => cancelAnimationFrame(requestId);
    }, [monthValue, yesterValue]);

    return (
        /* Multi CircularProgressbar Chart */
        <div style={{padding: '2px', position: 'relative'}}>
            <div style={{ textAlign: 'center', paddingBottom:'5px' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>{label}</p>
            </div>

            <CircularProgressbarWithChildren
                value={monthPercentage}
                text={`${monthPercentage.toFixed(2)}%`}
                background
                backgroundPadding={1}
                styles={buildStyles({
                    rotation: 0,
                    strokeLinecap: 'round',
                    textSize: '14px',
                    fontWeight: 'bold',
                    textColor: 'black',
                    pathColor: edgePathColor,
                    trailColor: edgeTrailColor,
                    backgroundColor: edgeBackgroundColor,
                    pathTransitionDuration: 0.5,
                    pathTransition: 'none',
                })}
            >
                <div style={{width: '84%', position: 'relative', zIndex: 1}}>
                    <CircularProgressbar
                        value={yesterPercentage}
                        text={`${yesterPercentage.toFixed(2)}%`}
                        background
                        styles={buildStyles({
                            rotation: 0,
                            strokeLinecap : 'round',
                            textSize: '14px',
                            fontWeight: 'bold',
                            textColor: 'black',
                            pathColor: insidePathColor,
                            trailColor: insideTrailColor,
                            backgroundColor: insideBackgroundColor,
                            pathTransitionDuration: 0.5,
                            pathTransition: 'none',
                        })}
                    />
                    <div style={{ textAlign: 'center', position: 'absolute', top: '30%', width: '100%' }}>
                        <p style={{ fontSize: '15px', marginTop: -5, color: insidePathColor, fontWeight: 'bold' }}>{`${monthPercentage.toFixed(2)}%`}</p>
                    </div>
                </div>
            </CircularProgressbarWithChildren>
        </div>

        /* 단일 circularProgressChart _ 한달평균 */
        /*<div style={{padding: '5px'}}>
            <div style={{ textAlign: 'center', paddingBottom:'5px' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>{label}</p>
            </div>
            <CircularProgressbar
                value={monthPercentage}
                text={`${monthPercentage.toFixed(2)}%`}
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
        </div>*/
    );
};

export default AnimatedGaugeChart;