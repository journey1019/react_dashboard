import Navbar from "../../components/navbar/Navbar";
import "./befonms.scss";

const BefoNms = () => {
    return(
        <>
            <div className = "befoNms">
                <div className="navbar">
                    <Navbar />
                </div>
                <div className="contain">
                    <iframe src="http://testvms.commtrace.com:12050" width="100%" height="1000px"></iframe>
                </div>
            </div>
        </>
    );
}

export default BefoNms;