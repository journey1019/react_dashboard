import "./samplepage.scss";
import Navbar from "../../components/navbar/Navbar";
import Example from "../../components/example/Example";

import MaterialReactTable from 'material-react-table';
import User from "../../components/example/User";

function SamplePage () {
    return (
        <>
            <div className="samplePage">
                <Navbar />
                <div className="samplePageContainer">
                    {/*<Example age={10}/>*/}
                    <User />
                </div>
            </div>
        </>
    );
}
export default SamplePage;