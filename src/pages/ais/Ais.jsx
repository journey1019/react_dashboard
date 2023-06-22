import Navbar from "../../components/navbar/Navbar";
import "./ais.scss";


const Ais = () => {
    return(
        <>
            <div className="ais">
                <div className="navbar">
                    <Navbar />
                </div>
                <div className="contain">
                    <iframe src="http://testvms.commtrace.com:12003/index.do?userId=orbcomm&userPwd=orbcomm" width="100%" height="1000px"></iframe>
                </div>
            </div>
        </>
    );
}

export default Ais;