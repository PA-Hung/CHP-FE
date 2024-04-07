import { Modal, Input, notification, Form, message, Row, Col } from "antd";
import { postApartment } from "@/utils/api";

const CreateModal = (props) => {
  const { getData, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    //console.log("values", values);
    const data = values; // viết gọn của 2 dòng trên
    const res = await postApartment(data);
    if (res.data) {
      await getData();
      message.success("Tạo mới căn hộ thành công !");
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
        title="Thêm mới căn hộ"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"250px"}
      >
        <Form
          name="create-new-apartment"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Mã căn hộ"
                name="code"
                rules={[{ required: true, message: "Nhập mã căn hộ !" }]}
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

export default CreateModal;
