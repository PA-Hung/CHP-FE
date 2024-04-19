import {
  Modal,
  Input,
  notification,
  Form,
  message,
  Row,
  Col,
  Switch,
} from "antd";
import { createRole, getPermission } from "@/utils/api";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import _ from "lodash";
import CreateRolePermissionApi from "./create.role.permission.api";

const CreateModal = (props) => {
  const { reloadTable, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const [listPermissions, setListPermissions] = useState([]);

  const onFinish = async (values) => {
    const { description, name, permissions } = values;
    const checkedPermissions = [];

    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
          checkedPermissions.push(key);
        }
      }
    }

    const role = {
      name,
      description,
      isActive,
      permissions: checkedPermissions,
    };

    const res = await createRole(role);
    if (res.data) {
      message.success("Thêm mới chức danh thành công");
      resetModal();
      reloadTable();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const groupByPermission = (data) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value };
      })
      .value();
  };

  useEffect(() => {
    const init = async () => {
      const res = await getPermission(`current=1&pageSize=100`);
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  return (
    <>
      <Modal
        title="Thêm nhóm chức danh mới"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"50%"}
      >
        <Form
          name="create-new-role"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row
            gutter={[16, 8]}
            justify="space-around"
            align="middle"
            wrap={true}
          >
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                label="Tên chức danh :"
                name="name"
                rules={[{ required: true, message: "Nhập tên nhóm quyền !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                label="Trạng thái :"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Bật"
                  unCheckedChildren="Tắt"
                  defaultChecked={isActive}
                  onChange={(value) => setIsActive(value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Mô tả :"
                name="description"
                rules={[{ required: true, message: "Nhập mô tả !" }]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả" maxLength={200} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <CreateRolePermissionApi
                form={form}
                listPermissions={listPermissions}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
