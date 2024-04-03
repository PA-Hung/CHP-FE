import { useSelector } from "react-redux";
import chpLogo from "../../assets/chpLogo.png";

const Logo = () => {
  const themeMode = useSelector((state) => state.theme.themeMode);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeMode === "light" ? "white" : "#141414",
      }}
    >
      <div style={{ padding: "10px" }}>
        <img src={chpLogo} alt="logo" style={{ width: 190, height: 71 }} />
      </div>
    </div>
  );
};

export default Logo;
