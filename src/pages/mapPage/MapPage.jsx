import Navbar from "../../components/navbar/BasicNavbar";
import "./mappage.scss";
import Map from "../../components/map/Map"

const MapPage = () => {
    return (
        <>
            <div className="mapPage">
                <Navbar />
                <div className="mapPageContainer">
                    <Map />
                </div>
            </div>
        </>
    );
};
export default MapPage;