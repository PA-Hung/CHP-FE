import { useState } from "react";
import {
  notification, message, Card, Flex, Spin, Pagination, Popconfirm,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { deleteRole } from "@/utils/api";
import UpdateModal from "./update.role/update.modal";
import { roleOnchangeTable } from "@/redux/slice/roleSlice";
import { fetchRoleById } from "@/redux/slice/roleSlice";

const RoleCard = (props) => {
  const { listRole, isFetching, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const dispatch = useDispatch();

  const confirmDelete = async (user) => {
    const res = await deleteRole(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá chức danh thành công !");
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
            {listRole.map((item) => (
              <Card
                actions={[
                  <CheckAccess
                    FeListPermission={
                      ALL_PERMISSIONS.ROLES.UPDATE
                    }
                    hideChildren
                  >
                    <EditOutlined
                      key="edit"
                      onClick={() => {
                        setIsUpdateModalOpen(true);
                        dispatch(fetchRoleById(item._id));
                      }} />
                  </CheckAccess>,
                  <CheckAccess
                    FeListPermission={
                      ALL_PERMISSIONS.ROLES.DELETE
                    }
                    hideChildren
                  >
                    <Popconfirm
                      title={`Bạn muốn xoá chức danh ${item.name} không ?`}
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
                <p>Mô tả : {item.description}</p>
                <p>Trạng thái : {'   '}
                  <Tag
                    color={item.isActive ? "lime" : "red"}>
                    {item.isActive ? "BẬT" : "TẮT"}
                  </Tag>
                </p>
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
              roleOnchangeTable({
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
          reloadTable={reloadTable}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
        />
      </div>
    </div>
  );
};

export default RoleCard;
