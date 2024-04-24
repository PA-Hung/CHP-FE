import { useState } from "react";
import {
  notification,
  message,
  Card,
  Flex,
  Spin,
  Pagination,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { deletePermission } from "@/utils/api";
import UpdateModal from "./update.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
dayjs.locale("vi");
import { colorMethod } from "@/utils/uils";
import CheckAccess from "@/router/check.access"

const PermissionCard = (props) => {
  const { permissions, isFetching, meta, reloadTable } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const confirmDelete = async (user) => {
    const res = await deletePermission(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá quyền hạn thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const { Meta } = Card;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div>
        {isFetching ? (
          <div>
            <Spin size="default" />
          </div>
        ) : (
          <Flex wrap="wrap" gap="small">
            {permissions.map((item) => (
              <Card
                actions={[
                  <CheckAccess
                    FeListPermission={
                      ALL_PERMISSIONS.PERMISSIONS.UPDATE
                    }
                    hideChildren
                  >
                    <EditOutlined
                      key="edit"
                      onClick={() => {
                        setIsUpdateModalOpen(true);
                        setUpdateData(item);
                      }} />
                  </CheckAccess>,
                  <CheckAccess
                    FeListPermission={
                      ALL_PERMISSIONS.PERMISSIONS.DELETE
                    }
                    hideChildren
                  >
                    <Popconfirm
                      title={`Bạn muốn xoá quyền ${item.name} không ?`}
                      onConfirm={() => confirmDelete(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>
                  </CheckAccess>
                ]}
                hoverable
                key={item._id}
                style={{ width: 300, margin: "10px" }}
              >
                <Meta title={item.name} />
                <hr />
                <p>Chức năng : {item.module}</p>
                <p>Đường dẫn : {item.apiPath}</p>
                <Row>
                  <Col>Phương thức : </Col>
                  <Col> <p
                    style={{
                      paddingLeft: 10,
                      fontWeight: "bold",
                      marginBottom: 0,
                      color: colorMethod(item?.method),
                    }}
                  >
                    {item?.method || ""}
                  </p>
                  </Col>
                </Row>
              </Card>
            ))}
          </Flex>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <Pagination
          current={meta.current}
          total={meta.total}
          pageSize={meta.pageSize}
          onChange={(page, pageSize) =>
            dispatch(
              permissionOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: meta.pages,
                total: meta.total,
              })
            )
          }
          showSizeChanger={true}
          defaultPageSize={meta.pageSize}
        />
        <UpdateModal
          updateData={updateData}
          setUpdateData={setUpdateData}
          reloadTable={reloadTable}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
        />
      </div>
    </div>
  );
};

export default PermissionCard;
