import { Col, Form, Input, Modal, Row, message, notification } from 'antd'
import React from 'react'
import { changePassword } from '@/utils/api';
import { useDispatch } from 'react-redux';

const PasswordModal = (props) => {
    const { isPassModalOpen, setIsPassModalOpen } = props;
    const [form] = Form.useForm();
    const resetModal = () => {
        setIsPassModalOpen(false);
        form.resetFields();
    };


    const onFinish = async (values) => {
        const data = {
            oldPassword: values?.oldPassword,
            newPassword: values?.newPassword,
        };
        const res = await changePassword(data);
        if (res.data) {
            message.success("Đổi mật khẩu thành công !");
            resetModal();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                placement: "top",
                description: res.message,
            });
        }
    };

    return (
        <>
            <Modal
                title="Đổi mật khẩu"
                open={isPassModalOpen}
                onOk={() => form.submit()}
                onCancel={resetModal}
                maskClosable={false}
                width={"250px"}
            >
                <Form
                    name="change-password"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <Row gutter={[8, 8]} justify="center" wrap={true}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item
                                label="Mật khẩu cũ"
                                name="oldPassword"
                                rules={[{ required: true, message: "Nhập mật khẩu cũ !" }]}
                                style={{ margin: "0px" }}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[{ required: true, message: "Nhập mật khẩu mới !" }]}
                                style={{ margin: "0px" }}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: "Nhập lại mật khẩu mới !" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu mới chưa giống nhau !'));
                                        },
                                    }),
                                ]}
                                style={{ margin: "0px" }}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </>
    )
}

export default PasswordModal
