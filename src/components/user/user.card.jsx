import { useState } from "react";
import {
  notification, message, Card, Flex, Spin, Pagination, Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UpdateUserModal from "./update.user.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { userOnchangeTable } from "@/redux/slice/userSlice";
import { deleteUser } from "@/utils/api";

export const UserCard = (props) => {
  const { listUsers, loading, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const confirmDelete = async (user) => {
    const res = await deleteUser(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá người dùng thành công !");
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
        {loading ? (
          <div>
            <Spin size="default" />
          </div>
        ) : (
          <Flex wrap="wrap" gap="small">
            {listUsers.map((item) => (
              <Card
                actions={[
                  <CheckAccess
                    FeListPermission={
                      ALL_PERMISSIONS.USERS.UPDATE
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
                      ALL_PERMISSIONS.USERS.DELETE
                    }
                    hideChildren
                  >
                    <Popconfirm
                      title={`Bạn muốn xoá ${item.name} không ?`}
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
                <p>Số điện thoại : {item.phone}</p>
                <p>Quyền hạn : {item?.role?.name}</p>
                <p>Mã căn hộ : {item?.apartments.map(apartment => apartment.code).join(', ')}</p>
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
              userOnchangeTable({
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
        <UpdateUserModal
          updateData={updateData}
          reloadTable={reloadTable}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setUpdateData={setUpdateData}
        />
      </div>
    </div>
  );
};

