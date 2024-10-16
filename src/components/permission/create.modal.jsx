import {
  Modal,
  Input,
  notification,
  Form,
  message,
  Select,
  Row,
  Col,
} from "antd";
import { createPermission } from "@/utils/api";
import { ALL_MODULES } from "@/utils/permission.module";

const CreateModal = (props) => {
  const { reloadTable, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const data = values;
    const res = await createPermission(data);
    if (res.data) {
      reloadTable();
      message.success("Tạo mới quyền hạn thành công !");
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
        title="Thêm quyền hạn mới"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"60%"}
      >
        <Form
          name="create-new-permission"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: "Nhập tên !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                name="module"
                label="Chức năng"
                rules={[{ required: true, message: "Nhập chức năng !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Đường dẫn"
                name="apiPath"
                rules={[
                  {
                    required: true,
                    message: "Nhập đường dẫn !",
                  },
                ]}
              >
                <Input placeholder="/api/v1/permissions/:id" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Phương thức"
                name="method"
                rules={[{ required: true, message: "Chọn phương thức !" }]}
              >
                <Select placeholder="Chọn phương thức" options={ALL_MODULES} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
