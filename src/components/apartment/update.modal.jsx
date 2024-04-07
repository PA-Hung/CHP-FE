import { useEffect } from "react";
import { Modal, Input, notification, Form, message, Row, Col } from "antd";
import { updateApartment } from "@/utils/api";

const UpdateModal = (props) => {
  const {
    updateData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    getData,
    setUpdateData,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (updateData) {
      form.setFieldsValue({
        code: updateData.code,
      });
    }
  }, [updateData]);

  const onFinish = async (values) => {
    const { code } = values;
    const data = {
      _id: updateData?._id,
      code,
    };
    const res = await updateApartment(data);
    if (res.data) {
      await getData();
      message.success("Cập nhật mã căn hộ thành công !");
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
        title="Cập nhật mã căn hộ"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"250px"}
      >
        <Form
          name="update-apartment"
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

export default UpdateModal;
