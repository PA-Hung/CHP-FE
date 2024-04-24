import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm, message, Tag } from "antd";
import { deleteRole } from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.role/update.modal";
import { useDispatch } from "react-redux";
import { fetchRoleById, roleOnchangeTable } from "@/redux/slice/roleSlice";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import CheckAccess from "@/router/check.access"

const RoleTable = (props) => {
  const { listRole, isFetching, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const dispatch = useDispatch();

  const confirmDelete = async (user) => {
    const res = await deleteRole(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá quyền thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Chức danh",
      dataIndex: "name",
      key: "name",
      render: (_value, record) => {
        return (
          <div
            style={{
              textDecoration: "underline",
              color: "blueviolet",
            }}
          >
            {record.name}
          </div>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (_value, record) => {
        return (
          <div>
            <Tag color={record.isActive ? "lime" : "red"}>
              {record.isActive ? "BẬT" : "TẮT"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      render: (record) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.ROLES.UPDATE}
              hideChildren
            >
              <div>
                <Button
                  danger
                  onClick={() => {
                    setIsUpdateModalOpen(true);
                    dispatch(fetchRoleById(record._id));
                  }}
                >
                  Cập nhật
                </Button>
              </div>
            </CheckAccess>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.ROLES.DELETE}
              hideChildren
            >
              <div>
                <Popconfirm
                  title={`Bạn muốn xoá quyền ${record.name} không ?`}
                  onConfirm={() => confirmDelete(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type={"primary"} danger>
                    Xoá
                  </Button>
                </Popconfirm>
              </div>
            </CheckAccess>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={listRole}
        rowKey={"_id"}
        loading={isFetching}
        bordered={true}
        pagination={{
          position: ["bottomCenter"],
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            dispatch(
              roleOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: meta.pages,
                total: meta.total,
              })
            ),
          showSizeChanger: true,
          defaultPageSize: meta.pageSize,
        }}
      />
      <UpdateModal
        reloadTable={reloadTable}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
      />
    </>
  );
};

export default RoleTable;
