import "./App.css";
import { NavBar } from "./components/NavBar";
import { CartesianPlan } from "./components/CartesianPlane";

function App() {
  return (
    <div className="h-screen bg-bg ">
      <NavBar />
      <CartesianPlan />
    </div>
  );
}

export default App;
