import { useEffect, useState } from "react";
import { Button, Form, Input, notification } from "antd";
import "@/styles/login.css";
import { postLogin } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/authSlice";
import { useLocation } from "react-router-dom";
import { setActiveKey } from "@/redux/slice/menuSlice";
import Logo from "@/assets/chpLogo.png";

const Login = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //const account = useSelector((state) => state.auth.user);
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const callback = params?.get("callback");
  const activeKey = useSelector((state) => state.menu.activeKey);

  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const toggleSignUp = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      window.location.href = "/admin";
      if (activeKey !== "home") {
        dispatch(
          setActiveKey({
            activeKey: "home",
            title: "Home Admin",
          })
        );
      }
    }
  }, [activeKey, dispatch, isAuthenticated]);

  const onFinish = async (values) => {
    const res = await postLogin(values.username, values.password);
    if (res?.data) {
      notification.success({ message: "Đăng nhập tài khoản thành công!" });
      dispatch(setUserLoginInfo(res.data.user));
      localStorage.setItem("access_token", res.data.access_token);
      window.location.href = callback ? callback : `/admin`;
    } else {
      notification.error({
        message: "Đăng nhập thất bại !",
        placement: "top",
        description: res.message,
      });
    }
  };

  const handleSigup = (e) => {
    notification.success({
      message: "Chức năng đang được xây dựng !",
      placement: "top",
    });
    e.preventDefault()
  }

  const forgetPass = () => {
    notification.success({
      message: "Hãy liên hệ admin để cấp lại mật khẩu : 0963686963",
      placement: "top",
    });
  }

  return (
    <div className="bodyLogin">

      <div className={`container ${isSignUpActive ? 'active' : ''}`}>
        <div className="form-container sign-up">
          <Form onFinish={handleSigup}>
            <div className="logo">
              <img src={Logo} alt="logo" style={{ width: 230, height: 83 }} />
            </div>
            <h1>Đăng ký</h1>
            <span style={{ paddingTop: "10px", paddingBottom: "10px" }}>sử dụng số điện thoại để đăng ký</span>
            <Form.Item
              style={{ width: '100%', padding: 0, margin: 0 }}
              name="username"
            // rules={[
            //   {
            //     required: true,
            //     message: "Nhập số điện thoại !",
            //   },
            // ]}
            >
              <Input style={{
                backgroundColor: '#eee',
                border: "none",
                fontSize: "13px",
                borderRadius: "8px",
                width: '100%',
                outline: "none",
                height: '45px'
              }} type="username" placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              style={{ width: '100%', padding: 0, margin: 0 }}
              name="password1"
            // rules={[
            //   {
            //     required: true,
            //     message: "Nhập mật khẩu !",
            //   },
            // ]}
            >
              <Input.Password style={{
                backgroundColor: '#eee',
                border: "none",
                fontSize: "13px",
                borderRadius: "8px",
                width: '100%',
                outline: "none",
                height: '45px'
              }} type="password1" placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item
              style={{ width: '100%', paddingTop: "8px", margin: 0 }}
              name="password2"
            // rules={[
            //   {
            //     required: true,
            //     message: "Nhập mật khẩu !",
            //   },
            // ]}
            >
              <Input.Password style={{
                backgroundColor: '#eee',
                border: "none",
                fontSize: "13px",
                borderRadius: "8px",
                width: '100%',
                outline: "none",
                height: '45px'
              }} type="password2" placeholder="Nhập lại mật khẩu" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large">Đăng ký</Button>
          </Form>
        </div>
        <div className="form-container sign-in">
          <Form onFinish={onFinish}>
            <div className="logo">
              <img src={Logo} alt="logo" style={{ width: 230, height: 83 }} />
            </div>
            <h1>Đăng nhập</h1>
            <span style={{ paddingTop: "10px", paddingBottom: "10px" }}>sử dụng số điện thoại và mật khẩu</span>
            <Form.Item
              style={{ width: '100%', padding: 0, margin: 0 }}
              name="username"
              rules={[
                {
                  required: true,
                  message: "Nhập số điện thoại !",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Số điện thoại"
                style={{
                  backgroundColor: '#eee',
                  border: "none",
                  fontSize: "13px",
                  borderRadius: "8px",
                  width: '100%',
                  outline: "none",
                  height: '45px'
                }} />
            </Form.Item>
            <Form.Item
              style={{ width: '100%', padding: 0, margin: 0 }}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Nhập mật khẩu !",
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Mật khẩu"
                style={{
                  backgroundColor: '#eee',
                  border: "none",
                  fontSize: "13px",
                  borderRadius: "8px",
                  width: '100%',
                  outline: "none",
                  height: '45px'
                }} />
            </Form.Item>
            <a onClick={() => forgetPass()}>Bạn quên mật khẩu?</a>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
            >Đăng nhập</Button>
          </Form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${isSignUpActive ? '' : 'hidden'}`}>
              <h1>Chào mừng bạn trở lại!</h1>
              <p>Đăng nhập thông tin của bạn để sử dụng tất cả các tính năng của app CHP</p>
              <button className="hidden" onClick={toggleSignUp}>Đăng nhập</button>
            </div>
            <div className={`toggle-panel toggle-right ${isSignUpActive ? 'hidden' : ''}`}>
              <h1>Chào bạn !</h1>
              <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng của app CHP</p>
              <Button type="primary"
                htmlType="submit"
                size="large" className="hidden" onClick={toggleSignUp}>Đăng ký</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
