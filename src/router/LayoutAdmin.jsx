import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Layout,
  ConfigProvider,
  Menu,
  notification,
  theme,
  Row,
  Col,
} from "antd";
import {
  HomeOutlined,
  ExceptionOutlined,
  LogoutOutlined,
  UserOutlined,
  ApiOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  CarOutlined,
  ContactsOutlined,
  RedditOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  BgColorsOutlined
} from "@ant-design/icons";
import Logo from "@/components/admin/logo.jsx";
import ToggleThemeButton from "@/components/admin/toggleTheme.jsx";
import { postLogOut } from "@/utils/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutAction } from "@/redux/slice/authSlice.js";
import HeaderAdmin from "@/components/admin/header.jsx";
import { setHomeKey, setActiveKey } from "@/redux/slice/menuSlice.js";
import { setThemeMode } from "@/redux/slice/themeSlice";
import { ALL_PERMISSIONS } from "@/utils/permission.module";

const { Sider, Content } = Layout;


const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userPermissions = useSelector((state) => state.auth.user.permissions);

  const themeMode = useSelector((state) => state.theme.themeMode);
  const darkConfig = { algorithm: theme.darkAlgorithm };
  const lightConfig = { algorithm: theme.defaultAlgorithm };

  const activeMenu = useSelector((state) => state.menu.activeKey);
  const [menuItems, setMenuItems] = useState(["items"]);

  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    if (themeMode === "light") {
      dispatch(setThemeMode("dark"));
    } else {
      dispatch(setThemeMode("light"));
    }
  };

  const handleLogout = async () => {
    const res = await postLogOut();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      dispatch(setHomeKey());
      notification.success({
        message: "Đăng xuất thành công !",
      });
      navigate("/");
    }
  };

  const handleMenu = (e) => {
    if (e.key === "home") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Trang chủ",
        })
      );
    }
    if (e.key === "user") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý thành viên",
        })
      );
    }
    if (e.key === "accommodation") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý lưu trú",
        })
      );
    }
    if (e.key === "apartment") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý căn hộ",
        })
      );
    }
    if (e.key === "role") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý chức danh",
        })
      );
    }
    if (e.key === "permission") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý quyền hạn",
        })
      );
    }
    if (e.key === "bookings") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Hợp đồng thuê",
        })
      );
    }
    if (e.key === "motors") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Danh sách xe",
        })
      );
    }
    if (e.key === "rental_schedule") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Lịch thuê xe",
        })
      );
    }
    if (e.key === "reports") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Báo cáo",
        })
      );
    }
    if (e.key === "maintenance") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Bảo trì xe",
        })
      );
    }
  };

  useEffect(() => {
    if (userPermissions?.length) {

      const viewUser = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const viewAccommodation = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ACCOMMODATION.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.ACCOMMODATION.GET_PAGINATE.method
      );

      const viewApartment = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.APARTMENT.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.APARTMENT.GET_PAGINATE.method
      );

      const viewRole = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
      );

      const viewPermission = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.method
      );

      const viewBookings = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.BOOKINGS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.BOOKINGS.GET_PAGINATE.method
      );

      const viewReport = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.BOOKINGS.GET_PAYMENT.apiPath &&
          item.method === ALL_PERMISSIONS.BOOKINGS.GET_PAYMENT.method
      );

      const full = [
        {
          label: <Link style={{ textDecoration: "none" }} to={"/admin"}>Trang chủ</Link>,
          key: "home",
          icon: <HomeOutlined style={{ fontSize: 18 }} />,
          visible: "true",
        },

        ...(viewAccommodation ? [{
          key: 'sub1',
          label: 'Quản lý lưu trú',
          icon: <CalendarOutlined style={{ fontSize: 18 }} />,
          children: [
            ...(viewAccommodation
              ? [
                {
                  label: <Link style={{ textDecoration: "none" }} to={"/admin/accommodation"}>Khách lưu trú</Link>,
                  key: "accommodation",
                  icon: <ContactsOutlined style={{ fontSize: 18 }} />,
                },
              ]
              : []),
            ...(viewApartment
              ? [
                {
                  label: <Link style={{ textDecoration: "none" }} to={"/admin/apartment"}>Quản lý căn hộ</Link>,
                  key: "apartment",
                  icon: <ApartmentOutlined style={{ fontSize: 18 }} />,
                },
              ]
              : []),
            ...(viewUser
              ? [
                {
                  label: <Link style={{ textDecoration: "none" }} to="/admin/user">Quản lý host</Link>,
                  key: "user",
                  icon: <UserOutlined style={{ fontSize: 18 }} />,
                },
              ]
              : []),
          ],
        },] : []),

        ...(viewBookings ? [{
          key: 'sub2',
          label: 'Quản lý thuê xe',
          icon: <CarOutlined style={{ fontSize: 18 }} />,
          children: [
            ...(viewBookings ? [{
              key: 'bookings',
              label: <Link style={{ textDecoration: "none" }} to="/admin/bookings">Hợp đồng thuê</Link>,
              icon: <FileTextOutlined style={{ fontSize: 18 }} />
            },
            {
              key: 'rental_schedule',
              label: <Link style={{ textDecoration: "none" }} to="/admin/rental_schedule">Lịch thuê xe</Link>,
              icon: <CalendarOutlined style={{ fontSize: 18 }} />
            }] : []),

            {
              key: 'guests',
              label: <Link style={{ textDecoration: "none" }} to="/admin/guests">Khách hàng</Link>,
              icon: <TeamOutlined style={{ fontSize: 18 }} />
            },
            {
              key: 'motors',
              label: <Link style={{ textDecoration: "none" }} to="/admin/motors">Danh sách xe</Link>,
              icon: <CarOutlined style={{ fontSize: 18 }} />
            },
            {
              key: 'maintenance',
              //label: <Link style={{ textDecoration: "none" }} to="/admin/maintenance">Bảo trì xe</Link>,
              label: "Bảo trì xe",
              icon: <BgColorsOutlined style={{ fontSize: 18 }} />
            },

            ...(viewReport ? [{
              key: 'reports',
              label: <Link style={{ textDecoration: "none" }} to="/admin/reports">Báo cáo</Link>,
              icon: <BarChartOutlined style={{ fontSize: 18 }} />
            }] : [])
          ],
        },
        ] : []),

        ...(isAdmin.name === "SUPER_ADMIN" ? [{
          key: 'sub3',
          label: 'Dành cho admin',
          icon: <RedditOutlined style={{ fontSize: 18 }} />,
          children: [
            ...(viewRole
              ? [
                {
                  label: <Link style={{ textDecoration: "none" }} to="/admin/role">Quản lý chức danh</Link>,
                  key: "role",
                  icon: <ExceptionOutlined style={{ fontSize: 18 }} />,
                },
              ]
              : []),
            ...(viewPermission
              ? [
                {
                  label: <Link style={{ textDecoration: "none" }} to="/admin/permission">Quản lý quyền hạn</Link>,
                  key: "permission",
                  icon: <ApiOutlined style={{ fontSize: 18 }} />,
                },
              ]
              : []),

          ],
        },] : []),
        {
          label: <Link style={{ textDecoration: "none" }} onClick={() => handleLogout()}>Đăng xuất</Link>,
          key: "logout",
          icon: <LogoutOutlined style={{ fontSize: 18 }} />,
          visible: "true",
        },
      ];
      setMenuItems(full);
    }
  }, [userPermissions]);

  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước màn hình ở đây và cập nhật giá trị của collapsed
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    // Thêm sự kiện lắng nghe cho thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);
    // Gọi handleResize lần đầu tiên để thiết lập giá trị mặc định
    handleResize();
    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ConfigProvider theme={themeMode === "dark" ? darkConfig : lightConfig}>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsed={collapsed}
          breakpoint="lg" // Định nghĩa điểm phá vỡ (breakpoint) khi Sidebar sẽ tự động thu gọn
          collapsedWidth={0}
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div>
            <Logo />
          </div>
          <div>
            <Menu
              onClick={handleMenu}
              style={{ height: "100vh", width: 210, fontWeight: 500 }}
              mode="vertical"
              items={menuItems}
              defaultSelectedKeys={["home"]}
              selectedKeys={activeMenu}
            />
            <ToggleThemeButton toggleTheme={toggleTheme} />
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? "0px" : "200px" }}>
          <HeaderAdmin
            toggleCollapsed={toggleCollapsed}
            collapsed={collapsed}
          />
          <Content
            style={{
              marginLeft: 10,
              marginTop: 10,
              marginRight: 10,
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
              borderRadius: 5,
            }}
          >
            <div
              style={{
                paddingBottom: 10,
                minHeight: "100%",
                background:
                  themeMode === "light" ? colorBgContainer : "#141414",
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div style={{
                marginLeft: 10,
                marginTop: 10,
                marginRight: 10,
                marginBottom: 10,
                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
                borderRadius: 5,
                height: 20,
                textAlign: 'center',
                color: themeMode === "light" ? "black" : "white",
                backgroundColor: themeMode === "light" ? "#cfd9f8" : "#141414",
              }}>
                <span>ChauHomestay App ©2023</span>
              </div>
            </Col>
          </Row>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutAdmin;
