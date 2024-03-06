/* React */
import React from 'react';

/* React Circular Progress Bar Chart */
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SingleCircularProgress = ({title, value, pathColor, trailColor, backgroundColor}) => {

    return(
        <>
            <div style={{padding: '5px'}}>
                <div style={{ textAlign: 'center', paddingBottom:'5px' }}>
                    <p style={{ fontSize: '15px', margin: 0 }}>{title}</p>
                </div>
                <CircularProgressbar
                    value={value}
                    text={`${value.toFixed(2)}%`}
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
        </>
    )
}

export default SingleCircularProgress;