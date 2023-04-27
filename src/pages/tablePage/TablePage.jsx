import "./tablepage.scss";
import Navbar from "../../components/navbar/BasicNavbar";
import Table from "../../components/table/Table";
import History from "../../components/history/History";


const TablePage = () => {
    return (
        <>
            <div className="tablePage">
                <Navbar />
                <div className="tableContainer">
                    <div className="table">
                        <Table />
                    </div>
                    <div className="history">
                        <History />
                    </div>
                </div>
            </div>
        </>
    );
};
export default TablePage;