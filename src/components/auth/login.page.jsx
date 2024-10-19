import "@/styles/login.page.css"
import image1 from "@/assets/image1.jpg";
import image2 from "@/assets/image2.jpg";
import image3 from "@/assets/image3.jpg";
import Logo from "@/assets/chpLogo.png";
import { useEffect, useState } from "react";
import { Button, Form, Input, notification, Carousel } from "antd";
import { postLogin } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/authSlice";
import { useLocation } from "react-router-dom";
import { setActiveKey } from "@/redux/slice/menuSlice";

const Login = () => {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state) => state.auth.user.role);
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
        <div id="loginPage">
            <div className="mainLogin">
                <div className="box">
                    <div className="inner-box">
                        <div className="forms-wrap">
                            <Form className="form" onFinish={onFinish}>
                                <div className="logo">
                                    <img src={Logo} alt="Logo" />
                                </div>

                                <div className="heading">
                                    <h2>ĐĂNG NHẬP</h2>
                                    {/* <h6>Bạn chưa có tài khoản ? Liên hệ admin 0963686963 để được chỗ trợ</h6> */}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
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
                                                className="input-field"
                                                type="text"
                                                placeholder="Số điện thoại"
                                            />
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
                                            <Input.Password type="password"
                                                placeholder="Mật khẩu"
                                                className="input-field"
                                            />
                                        </Form.Item>
                                    </div>
                                    <Button type="primary" htmlType="submit" className="sign-btn">
                                        Đăng nhập
                                    </Button>

                                    <p className="text">
                                        Bạn quên mật khẩu ? Liên hệ admin 0963686963 để được hỗ trợ
                                    </p>
                                </div>
                            </Form>
                        </div>

                        <div className="carousel">
                            <Carousel infinite={true} autoplay dots={false}>
                                <div>
                                    <img src={image1} style={{ width: '100%', height: '575px', objectFit: 'cover' }} alt="image1" />
                                </div>
                                <div>
                                    <img src={image2} style={{ width: '100%', height: '575px', objectFit: 'cover' }} alt="image2" />
                                </div>
                                <div>
                                    <img src={image3} style={{ width: '100%', height: '575px', objectFit: 'cover' }} alt="image3" />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div >
            </div >
        </div>
    )
}

export default Login