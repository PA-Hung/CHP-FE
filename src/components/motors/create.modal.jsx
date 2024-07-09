import { Modal, Input, notification, Form, message, Row, Col, InputNumber, Switch } from "antd";
import { postCreateMotor } from "@/utils/api";
import TextArea from "antd/es/input/TextArea";

const CreateModal = (props) => {
  const { reloadTable, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const data = values; // viết gọn của 2 dòng trên
    const res = await postCreateMotor(data);
    if (res.data) {
      reloadTable();
      message.success("Thêm mới xe thành công !");
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
        title="Thêm xe mới"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
      >
        <Form
          name="create-new-motor"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          initialValues={{
            availability_status: true, // Set the default value here
          }}
        >
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Thương hiệu"
                name="brand"
                rules={[{ required: true, message: "Nhập thương hiệu !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Biển số"
                name="license"
                rules={[{ required: true, message: "Nhập biển số xe !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Giá thuê theo ngày"
                name="priceD"
                rules={[{ required: true, message: "Nhập giá !" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={<b>đ</b>}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                  step={1} // Bước nhảy
                  controls={false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Giá thuê theo giờ"
                name="priceH"
                rules={[{ required: true, message: "Nhập giá !" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={<b>đ</b>}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                  step={1} // Bước nhảy
                  controls={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Phí quá giờ"
                name="overtime"
                rules={[{ required: true, message: "Nhập phí quá giờ !" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={<b>đ</b>}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                  step={1} // Bước nhảy
                  controls={false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Form.Item
                  label="Tình trạng"
                  name="availability_status"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Hoạt đông" unCheckedChildren="Bảo trì" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Ghi chú"
                name="note"
              >
                <TextArea showCount maxLength={100} rows={3} style={{ resize: "none" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
