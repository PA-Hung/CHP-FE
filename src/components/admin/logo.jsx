import { useSelector } from "react-redux";
import chpLogo from "@/assets/chpLogo.png";

const Logo = () => {
  const themeMode = useSelector((state) => state.theme.themeMode);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeMode === "light" ? "white" : "#141414",
        //border: '1px solid red'
      }}
    >
      <div>
        <img src={chpLogo} alt="logo" style={{ width: 185, height: 72 }} />
      </div>
    </div>
  );
};

export default Logo;
