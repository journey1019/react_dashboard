/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';

/** Diagnostic Widget 생성 함수
 * @author jhlee
 * @date 2024.02.23
 *
 * @param {string} title : Widget's title
 *
 * @param {string} color : Widget's symbol color
 * @param {int} percentage : Percentage of normal terminals for each attribute
 * @param {int} max : 속성 별 최대 범위
 * @param {int} min : 속성 별 최소 범위
 * @param {string} maxTitle : 속성 별 최대 범위의 title
 * @param {string} minTitle : 속성 별 최소 범위의 title
 * @param {string} unit : 수를 세는 단위
 * @param {string} averageTitle : 속성 별 평귬 범위 title
 * @param {int} average : 속성 별 평귬 범위
 * @return {component} component :  각 요소에 들어가는 값에 따라 속성 Widget Component 반환
 *
 * */
const ConditionsToggle = ({title, color, percentage, max, min, maxTitle, minTitle, unit, averageTitle, average, averageUnit}) => {

    return(
        <>
            <Grid item xs={12}>
                <Box className="diagnosticWidget_construct_toggle">
                    <Box className="diagnosticWidget_construct_top">
                        <Typography className="diagnosticWidget_top_title" variant="h5" >{title}</Typography>
                        <Box className="diagnosticWidget_top_percentage" backgroundColor={color}>{percentage} %</Box>
                        {/*<Box className="deviceWidget_icon" sx={{backgroundColor:'#FF666B'}}> 80 % </Box>*/}
                    </Box>
                    <Box sx={{paddingLeft : '20px'}}><hr/></Box>
                    <Box className="diagnosticWidget_construct_component">
                        <Box sx={{display: 'block', color: '#606060'}}>
                            <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                <Typography variant="h8">{maxTitle}</Typography>
                                <Typography variant="h8">{max} {unit}</Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                <Typography variant="h8">{minTitle}</Typography>
                                <Typography variant="h8">{min} {unit}</Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                <Typography variant="h8">{averageTitle}</Typography>
                                <Typography variant="h8">{average} {averageUnit}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </>
    )

}

export default ConditionsToggle;