import "./griddata.scss";
import React from "react"
import MaterialTable from 'material-table'


const GridData = () => {
    const data = [
    {device:"e12345",status:"running",location:"seoul",temperature:"100",power:"on"},
    {device:"e12345",status:"running",location:"seoul",temperature:"100",power:"on"},
    {device:"e12345",status:"running",location:"seoul",temperature:"100",power:"on"},
    {device:"e12345",status:"running",location:"seoul",temperature:"100",power:"on"}
    ]

    const columns = [
        {title:"Device",field:"device"},
        {title:"Status",field:"status"},
        {title:"Location",field:"location"},
        {title:"Temperature",field:"temperature"},
        {title:"Power",field:"power"}
    ]

    return(
        <MaterialTable title="Reefer Connect" columns={columns} data={data}/>
    )
}

export default GridData;