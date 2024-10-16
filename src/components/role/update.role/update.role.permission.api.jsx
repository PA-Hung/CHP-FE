import React from "react";
import { Row, Col, Switch, Card, Collapse, Tooltip, Form } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { colorMethod } from "@/utils/uils";
import { grey } from "@ant-design/colors";

const UpdateRolePermissionApi = ({ form, listPermissions }) => {
  const handleSingleCheck = (checked, childId, parentModule) => {
    form.setFieldValue(["permissions", childId], checked);

    const parent = listPermissions?.find(
      (item) => item.module === parentModule
    );

    if (parent) {
      const remainingPermissions = parent.permissions.filter(
        (perm) => perm._id !== childId
      );

      const allChecked = remainingPermissions.every((perm) =>
        form.getFieldValue(["permissions", perm._id])
      );

      form.setFieldValue(["permissions", parentModule], allChecked && checked);
    }
  };

  const handleSwitchAll = (checked, moduleName) => {
    const module = listPermissions?.find((item) => item.module === moduleName);
    module?.permissions?.forEach((perm) =>
      form.setFieldValue(["permissions", perm._id], checked)
    );
  };

  const handleSwitchChange = (checked, event) => {
    event.stopPropagation();
  };

  // Tạo danh sách items cho Collapse
  const collapseItems = listPermissions?.map((module, index) => ({
    key: index.toString(),
    label: <div style={{ paddingTop: 5 }}>{module.module}</div>,
    forceRender: true,
    extra: (
      <Form.Item
        style={{ margin: 0 }}
        name={["permissions", module.module]}
        valuePropName="checked"
      >
        <Switch
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          onClick={handleSwitchChange}
          onChange={(checked) => handleSwitchAll(checked, module.module)}
        />
      </Form.Item>
    ),
    children: (
      <Row gutter={[16, 16]} justify="start" wrap>
        {module.permissions?.map((perm, i) => (
          <Col xs={24} sm={24} md={24} lg={24} xl={12} key={i}>
            <Card
              size="small"
              bodyStyle={{ display: "flex", flexDirection: "row" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Item
                  name={["permissions", perm._id]}
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    onChange={(checked) =>
                      handleSingleCheck(checked, perm._id, module.module)
                    }
                  />
                </Form.Item>
              </div>
              <div style={{ flex: 1, marginLeft: 20 }}>
                <Tooltip title={perm.name}>
                  <p style={{ margin: 0 }}>{perm.name || ""}</p>
                  <Row gutter={[8, 8]} justify="start" wrap>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: colorMethod(perm.method),
                        }}
                      >
                        {perm.method || ""}
                      </p>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={16}>
                      <p style={{ color: grey[5], margin: 0 }}>
                        {perm.apiPath || ""}
                      </p>
                    </Col>
                  </Row>
                </Tooltip>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    ),
  }));

  return (
    <Card
      size="small"
      title="Các quyền hạn được cho phép ở nhóm chức danh này:"
    >
      <Collapse
        items={collapseItems} // Sử dụng `items` thay vì children
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            style={{ paddingTop: 10 }}
          />
        )}
      />
    </Card>
  );
};

export default UpdateRolePermissionApi;
