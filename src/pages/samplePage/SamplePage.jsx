import "./samplepage.scss";
import Navbar from "../../components/navbar/Navbar";

const SamplePage = () => {
    return (
        <>
            <div className="samplePage">
                <Navbar />
                <div className="samplePageContainer">
                    <h1>Sample Page</h1>
                </div>
            </div>
        </>
    );
};
export default SamplePage;