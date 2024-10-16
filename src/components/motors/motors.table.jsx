import { useState } from "react";
import { Table, Button, notification, Popconfirm, message, Tag } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { deleteMotor } from "@/utils/api";
import { motorOnchangeTable } from "@/redux/slice/motorSlice";

const MotorsTable = (props) => {
  const { listMotors, loading, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const confirmDelete = async (user) => {
    const res = await deleteMotor(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá xe thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
      title: "Tên xe / biển số",
      dataIndex: "license",
      key: "license",
      render: (_value, record) => {
        return <div style={{ display: "flex", gap: 10 }}>
          <div style={{ fontWeight: 550 }}>{record.brand}</div>
          <Tag color="blue" style={{ fontWeight: 500 }}>{record.license}</Tag>
        </div>;
      },
    },
    {
      title: "Giá thuê theo ngày",
      render: (_value, record) => {
        return <div>{formatCurrency(record?.priceD)}</div>;
      },
    },
    {
      title: "Phí quá hạn",
      render: (_value, record) => {
        return <div>{formatCurrency(record?.overtime)}</div>;
      },
    },
    {
      title: "Tình trạng",
      render: (_value, record) => {
        return <div>{record?.availability_status ? <Tag color="blue-inverse" style={{ fontWeight: 500 }}>Hoạt động</Tag> : <Tag color="red" style={{ fontWeight: 500 }}>Bảo trì</Tag>}</div>;
      },
    },
    {
      title: "Ghi chú",
      render: (_value, record) => {
        return <div>{record?.note}</div>;
      },
    },
    {
      title: "Actions",
      render: (record) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.APARTMENT.UPDATE}
              hideChildren
            >
              <div>
                <Button
                  danger
                  onClick={() => {
                    setIsUpdateModalOpen(true);
                    setUpdateData(record);
                  }}
                >
                  Cập nhật
                </Button>
              </div>
            </CheckAccess>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.APARTMENT.DELETE}
              hideChildren
            >
              <div>
                <Popconfirm
                  title={`Bạn muốn xoá xe ${record.license} không ?`}
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
        dataSource={listMotors}
        rowKey={"_id"}
        loading={loading}
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
              motorOnchangeTable({
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
        updateData={updateData}
        setUpdateData={setUpdateData}
        reloadTable={reloadTable}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
      />
    </>
  );
};

export default MotorsTable;
