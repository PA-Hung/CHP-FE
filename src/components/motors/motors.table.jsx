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

  // // Tính toán các giá trị duy nhất từ cột "Mã căn hộ"
  // const uniqueCodes = [...new Set(listApartment.map(item => item.code))];
  // // Tạo các bộ lọc từ các giá trị duy nhất
  // const filtersCode = uniqueCodes.map(code => ({ text: `Căn hộ "${code}"`, value: code }));

  // // Tính toán các giá trị duy nhất từ cột "Mã căn hộ"
  // const uniqueHosts = [...new Set(listApartment.map(item => item.users?.name).filter(user => user !== undefined))];
  // // Tạo các bộ lọc từ các giá trị duy nhất
  // const filtersHost = uniqueHosts.map(user => ({ text: `Host "${user}"`, value: user }));

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
      dataIndex: "code",
      key: "code",
      render: (_value, record) => {
        return <div style={{ display: "flex", gap: 10 }}>
          <h4>{record.brand}</h4>
          <Tag color="blue" style={{ fontWeight: 500 }}>{record.license}</Tag>
        </div>;
      },
    },
    {
      title: "Tình trạng",
      // sorter: (a, b) => a.users?.name.localeCompare(b.users?.name),
      // filters: filtersHost,
      // onFilter: (value, record) => record.users?.name.startsWith(value),
      // filterMode: 'tree',
      // filterSearch: true,
      render: (_value, record) => {
        return <div>{record?.status}</div>;
      },
    },
    {
      title: "Giá theo ngày",
      // sorter: (a, b) => a.users?.name.localeCompare(b.users?.name),
      // filters: filtersHost,
      // onFilter: (value, record) => record.users?.name.startsWith(value),
      // filterMode: 'tree',
      // filterSearch: true,
      render: (_value, record) => {
        return <div>{formatCurrency(record?.priceD)}</div>;
      },
    },
    {
      title: "Giá quá hạn theo giờ",
      // sorter: (a, b) => a.users?.name.localeCompare(b.users?.name),
      // filters: filtersHost,
      // onFilter: (value, record) => record.users?.name.startsWith(value),
      // filterMode: 'tree',
      // filterSearch: true,
      render: (_value, record) => {
        return <div>{formatCurrency(record?.priceH)}</div>;
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
        reloadTable={reloadTable}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setUpdateData={setUpdateData}
      />
    </>
  );
};

export default MotorsTable;
