import { useEffect, useState } from "react";
import { Modal, Input, notification, Form, Select, message } from "antd";
import { getRole, updateUser, getApartment } from "@/utils/api";

const UpdateUserModal = (props) => {
  const {
    updateData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    reloadTable,
    setUpdateData,
  } = props;
  const [form] = Form.useForm();
  const [role, setRole] = useState([]);
  const [apartmentCode, setApartmentCode] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await getRole(`current=1&pageSize=30`);
      if (res.data?.result) {
        setRole(groupBySelectRole(res.data?.result));
      }
    };
    init();
  }, []);

  const groupBySelectRole = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
  };

  useEffect(() => {
    const initApartment = async () => {
      const res = await getApartment(`current=1&pageSize=100`);
      if (res.data?.result) {
        setApartmentCode(groupBySelectApartment(res.data?.result));
      }
    };
    initApartment();
  }, []);

  const groupBySelectApartment = (data) => {
    return data.map((item) => ({ value: item._id, label: item.code }));
  };

  useEffect(() => {
    if (updateData) {
      form.setFieldsValue({
        name: updateData.name,
        phone: updateData.phone,
        role: updateData.role._id,
        apartments: groupBySelectApartment(updateData.apartments)
      });
    }
  }, [updateData]);

  const onFinish = async (values) => {
    const { name, phone, role, apartments } = values;
    const data = {
      _id: updateData?._id,
      name,
      phone,
      role,
      apartments,
    };

    const res = await updateUser(data);
    if (res.data) {
      reloadTable();
      message.success("Cập nhật người dùng thành công !");
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
        title="Cập nhật"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
      >
        <Form
          name="update-user"
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

              name="role"
              label="Role"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn quyền !" options={role} />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50%)",
                marginLeft: 8,
                marginBottom: 5,
              }}
              label="Password"
              name="password"

            >
              <Input.Password disabled={true} />
            </Form.Item>

          </Form.Item>

          <Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "100%",
                marginBottom: 0,
              }}
              label="Mã căn hộ"
              name="apartments"
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn mã căn hộ !"
                options={apartmentCode} />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUserModal;
