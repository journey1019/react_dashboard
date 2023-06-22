import Navbar from "../../components/navbar/Navbar";
import "./support.scss"

const Support = () => {
    return(
        <>
            <div className="support">
                <div className="navbar">
                    <Navbar />
                </div>
                <div className="contain">
                    <span>
                        <ul>Tel : 02-3444-7311</ul>
                        <ul>문의 : jhlee@orbcomm.co.kr</ul>
                    </span>
                </div>
            </div>
        </>
    );
}

export default Support;