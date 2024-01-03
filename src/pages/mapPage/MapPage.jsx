import "./mappage.scss";
import Map from "../../components/map/Map"

const MapPage = () => {
    return (
        <>
            <div className="mapPage">
                <div className="mapPageContainer">
                    <Map />
                </div>
            </div>
        </>
    );
};
export default MapPage;