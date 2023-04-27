import "./list.scss"
import Navbar from "../../components/navbar/BasicNavbar"
import Datatable from "../../components/datatable/Datatable"

const List = () => {
  return (
    <div className="list">
        <Navbar/>
      <div className="listContainer">
        <Datatable/>
      </div>
    </div>
  )
}

export default List