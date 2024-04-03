import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useSelector } from "react-redux";

const ToggleThemeButton = ({ toggleTheme }) => {
  const themeMode = useSelector((state) => state.theme.themeMode);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 15,
        left: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "5rem",
      }}
    >
      <Button onClick={toggleTheme}>
        {themeMode === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </div>
  );
};

export default ToggleThemeButton;
