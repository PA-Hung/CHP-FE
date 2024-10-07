import { useEffect } from "react";
import { Modal, Input, notification, Form, message, Row, Col, Select } from "antd";
import { updateGuest } from "@/utils/api";

const UpdateModal = (props) => {
  const {
    updateData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    reloadTable,
    setUpdateData,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isUpdateModalOpen && updateData) {
      form.setFieldsValue({
        name: updateData.name,
        phone: updateData.phone,
        cccd: updateData.cccd,
        birthday: updateData?.birthday,
        gender: updateData?.gender,
        address: updateData?.address,
      });
    }
  }, [updateData, isUpdateModalOpen]);

  const onFinish = async (values) => {
    const data = {
      _id: updateData?._id,
      name: values.name,
      phone: values.phone,
      cccd: values.cccd,
      birthday: values.birthday,
      gender: values.gender,
      address: values.address,
    };
    const res = await updateGuest(data);
    if (res.data) {
      reloadTable();
      message.success("Cập nhật thông tin thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const resetModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateData(null);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Cập nhật thông tin khách hàng"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
      >
        <Form
          name="update-guest"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Nhập họ tên !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Điện thoại"
                name="phone"
                rules={[{ required: true, message: "Nhập điện thoại !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="CCCD"
                name="cccd"
                rules={[{ required: true, message: "Nhập CCCD !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Ngày sinh"
                name="birthday"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
              >
                <Select
                  placeholder="Chọn giới tính"
                  allowClear
                  options={[
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateModal;
