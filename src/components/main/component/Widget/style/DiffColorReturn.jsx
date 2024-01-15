// 타입별 색상지정(data_diff)
function DiffColorReturn(type){
    let color = "";
    switch (type){
        case "running":
            color = "rgba(0, 128, 0, 0.5)";
            break;
        case "caution":
            color = "rgba(255, 217, 0, 0.7)";
            break;
        case "warning":
            color ="rgba(255, 0, 0, 0.5)";
            break;
        case "faulty":
            color = "rgba(0, 0, 0, 0.5)";
            break;
        default:
            color ="white";
    }
    return color;
}

export default DiffColorReturn;