import { Modal, Input, notification, Form, Select, message } from "antd";
import { getRole, postCreateUser } from "../../utils/api";
import { useEffect, useState } from "react";
import _ from "lodash";

const CreateUserModal = (props) => {
  const { reloadTable, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();
  const [role, setRole] = useState([]);

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const groupBySelectRole = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
  };

  useEffect(() => {
    const init = async () => {
      const res = await getRole(`current=1&pageSize=100`);
      if (res.data?.result) {
        setRole(groupBySelectRole(res.data?.result));
      }
    };
    init();
  }, []);

  const onFinish = async (values) => {
    const data = {
      name: values.name,
      phone: values.phone,
      password: values.password,
      role: values.role,
    };
    const res = await postCreateUser(data);
    if (res.data) {
      reloadTable();
      message.success("Tạo mới người dùng thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
      >
        <Form
          name="create-new-user"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 16px)",
                marginBottom: 0,
              }}
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50%)",
                marginLeft: 8,
                marginBottom: 0,
              }}
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 16px)",
                marginBottom: 0,
              }}
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50%)",
                marginLeft: 8,
                marginBottom: 5,
              }}
              name="role"
              label="Role"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn quyền !" options={role} />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUserModal;
