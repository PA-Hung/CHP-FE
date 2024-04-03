import { Modal, Form, Row, Col, Input } from "antd";
import React from "react";

const SearchModal = (props) => {
  const { onSearch, isSearchModalOpen, setIsSearchModalOpen } = props;
  const resetModal = () => {
    setIsSearchModalOpen(false);
    form.resetFields();
  };
  const [form] = Form.useForm();
  const handleSearch = () => {
    form.submit();
    setIsSearchModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Tìm kiếm"
        open={isSearchModalOpen}
        onCancel={resetModal}
        onOk={handleSearch}
        maskClosable={false}
        width={"50%"}
      >
        <Form
          name="search-form"
          onFinish={onSearch}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="Họ tên" name="name" style={{ width: "100%" }}>
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="CMND/CCCD"
                name="identification_number"
                style={{ width: "100%" }}
              >
                <Input placeholder="Nhập CMND/CCCD" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="Hộ chiếu" name="passport">
                <Input placeholder="Nhập hộ chiếu" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SearchModal;
