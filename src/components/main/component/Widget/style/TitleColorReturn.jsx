// 타입별 색상지정(data_title)
function TitleColorReturn(type){
    let color = "";
    switch (type){
        case "running":
            color = "green";
            break;
        case "caution":
            color = "goldenrod";
            break;
        case "warning":
            color ="crimson";
            break;
        case "faulty":
            color = "charcoal";
            break;
        default:
            color ="white";
    }
    return color;
}
export default TitleColorReturn;