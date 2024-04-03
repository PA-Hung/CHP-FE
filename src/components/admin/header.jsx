import React from "react";
import { Layout, Dropdown, Space, notification, Row, Col } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { postLogOut } from "../../utils/api";
import { setLogoutAction } from "../../redux/slice/authSlice";
import { setHomeKey } from "../../redux/slice/menuSlice";
const { Header } = Layout;

const HeaderAdmin = (props) => {
  const { toggleCollapsed, collapsed } = props;
  const activeTitle = useSelector((state) => state.menu.title);
  const loginName = useSelector((state) => state.auth.user.name);
  const themeMode = useSelector((state) => state.theme.themeMode);

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

  const handleUserInfo = () => {
    notification.success({
      message: "Chức năng đang được phát triển !",
      placement: "top",
    });
  };

  const items = [
    {
      key: "1",
      label: (
        <Link onClick={() => handleUserInfo()}>
          <SettingOutlined /> Tài khoản của tôi
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link onClick={() => handleLogout()}>
          <LogoutOutlined /> Đăng xuất
        </Link>
      ),
    },
  ];

  return (
    <>
      <Header
        style={{
          display: "flex",
          flexDirection: "row",
          height: 50,
          paddingLeft: 5,
          paddingRight: 20,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: themeMode === "light" ? "white" : "#141414",
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderBottom: themeMode === "dark" ? "1px solid #313131" : "",
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
              <h3>{activeTitle}</h3>
            </Col>

            <Col xs={24} sm={24} md={24} lg={0} xl={0}>
              <h5>{activeTitle}</h5>
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
    </>
  );
};

export default HeaderAdmin;
