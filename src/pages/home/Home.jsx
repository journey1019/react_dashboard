import Navbar from "../../components/navbar/Navbar";
import "./home.scss";


const Home = () => {
  return (
      <>
      <div className="home">
        <Navbar />
        <div className="homeContainer">
          <h1>Home Page</h1>
        </div>
      </div>
      </>
  );
};
export default Home;