
import AllRoutes from "./Routes/AllRoutes";
import Navbar from "./Routes/Navbar";
import ScrollToTop from "./Components/ScrollToTop";

function App() {


  return (
    <div className="App">
      <Navbar />
      <ScrollToTop />
      <AllRoutes />
    </div>
  );
}

export default App;
