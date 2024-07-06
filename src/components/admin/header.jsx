import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Space, notification, Row, Col } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { postLogOut } from "@/utils/api";
import { setLogoutAction } from "@/redux/slice/authSlice";
import { setHomeKey } from "@/redux/slice/menuSlice";
import PasswordModal from "./password.modal";
const { Header } = Layout;

const HeaderAdmin = (props) => {
  const { toggleCollapsed, collapsed } = props;
  const activeTitle = useSelector((state) => state.menu.title);
  const loginName = useSelector((state) => state.auth.user.name);
  const themeMode = useSelector((state) => state.theme.themeMode);

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await postLogOut();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      dispatch(setHomeKey());
      notification.success({
        message: "Đăng xuất thành công !",
        placement: "top",
      });
      navigate("/");
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <Link style={{ textDecoration: "none" }} onClick={() => setIsPassModalOpen(true)}>
          <SettingOutlined /> Đổi mật khẩu
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link style={{ textDecoration: "none" }} onClick={() => handleLogout()}>
          <LogoutOutlined /> Đăng xuất
        </Link>
      ),
    },
  ];

  return (
    <div style={{ paddingLeft: 10, paddingTop: 10, paddingRight: 10 }}>
      <Header
        style={{
          borderRadius: 5,
          display: "flex",
          flexDirection: "row",
          height: 50,
          paddingLeft: 5,
          paddingRight: 20,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: themeMode === "light" ? "#cfd9f8" : "#141414",
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderBottom: themeMode === "dark" ? "1px solid #313131" : "",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            paddingLeft: 5,
            fontSize: 15,
            color: themeMode === "light" ? "black" : "white",
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined onClick={toggleCollapsed} />
          ) : (
            <MenuFoldOutlined onClick={toggleCollapsed} />
          )}
        </div>
        <div
          style={{
            color: themeMode === "light" ? "black" : "white",
          }}
        >
          <Row>
            <Col xs={0} sm={0} md={0} lg={24} xl={24}>
              <div style={{ fontWeight: 550, fontSize: 20 }}>{activeTitle}</div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={0} xl={0}>
              <div style={{ fontWeight: 550, fontSize: 15 }}>{activeTitle}</div>
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <div style={{ paddingBottom: 3 }}>
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {loginName}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Header>
      <PasswordModal
        isPassModalOpen={isPassModalOpen}
        setIsPassModalOpen={setIsPassModalOpen}
      />
    </div>
  );
};

export default HeaderAdmin;
