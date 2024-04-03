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
        width={"20%"}
      >
        <Form
          name="search-form"
          onFinish={onSearch}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Chức danh"
                name="name"
                style={{ width: "100%" }}
              >
                <Input placeholder="Chức danh" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SearchModal;
