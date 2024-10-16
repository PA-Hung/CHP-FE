import chpLogo from "../src/assets/chpLogo.png";
import "./styles/app.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div>
        <div className="home">
          <div onClick={() => navigate("/login")}>
            <img src={chpLogo} className="logo" alt="chp logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
