import { Row, Col, Switch, Card, Collapse, Tooltip, Form } from "antd";
import React from "react";
import { colorMethod } from "@/utils/uils";
import { grey } from "@ant-design/colors";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const CreateRolePermissionApi = (props) => {
  const { form, listPermissions } = props;

  const handleSingleCheck = (v, child, parent) => {
    form.setFieldValue(["permissions", child], v);

    //check all
    const temp = listPermissions?.find((item) => item.module === parent);
    if (temp) {
      const restPermission = temp?.permissions?.filter(
        (item) => item._id !== child
      );
      if (restPermission && restPermission.length) {
        const allTrue = restPermission.every((item) =>
          form.getFieldValue(["permissions", item._id])
        );
        form.setFieldValue(["permissions", parent], allTrue && value);
      }
    }
  };

  const handleSwitchAll = (v, name) => {
    const child = listPermissions?.find((item) => item.module === name);
    if (child) {
      child?.permissions?.forEach((item) => {
        if (item._id) form.setFieldValue(["permissions", item._id], v);
      });
    }
  };

  const handleSwitchChange = (checked, event) => {
    event.stopPropagation();
  };

  return (
    <>
      <Card
        size="small"
        title="Các quyền hạn được cho phép ở nhóm chức danh này :"
      >
        <div>
          <Collapse
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                style={{ paddingTop: "10px" }}
              />
            )}
          >
            {listPermissions?.map((item, index) => (
              <Panel
                header={<div style={{ paddingTop: "5px" }}>{item.module}</div>}
                key={index}
                forceRender //force to render form item (with collapse mode)
                extra={
                  <Form.Item
                    style={{ margin: "0px" }}
                    name={["permissions", item.module]}
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Bật"
                      unCheckedChildren="Tắt"
                      defaultChecked={false}
                      onClick={handleSwitchChange}
                      onChange={(v) => handleSwitchAll(v, item.module)}
                    />
                  </Form.Item>
                }
              >
                <Row gutter={[16, 16]}>
                  {item.permissions?.map((value, i) => (
                    <Col lg={12} md={12} sm={24} key={i}>
                      <Card
                        size="small"
                        bodyStyle={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Form.Item
                            name={["permissions", value._id]}
                            valuePropName="checked"
                          >
                            <Switch
                              checkedChildren="Bật"
                              unCheckedChildren="Tắt"
                              defaultChecked={false}
                              onChange={(value) =>
                                handleSingleCheck(value, value._id, item.module)
                              }
                            />
                          </Form.Item>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Tooltip title={value?.name}>
                            <p
                              style={{
                                paddingLeft: 30,
                                marginBottom: 0,
                                marginTop: 0,
                              }}
                            >
                              {value?.name || ""}
                            </p>
                            <div style={{ display: "flex" }}>
                              <p
                                style={{
                                  paddingLeft: 30,
                                  fontWeight: "bold",
                                  marginBottom: 0,
                                  color: colorMethod(value?.method),
                                }}
                              >
                                {value?.method || ""}
                              </p>
                              <p
                                style={{
                                  paddingLeft: 10,
                                  marginBottom: 0,
                                  color: grey[5],
                                }}
                              >
                                {value?.apiPath || ""}
                              </p>
                            </div>
                          </Tooltip>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            ))}
          </Collapse>
        </div>
      </Card>
    </>
  );
};

export default CreateRolePermissionApi;
