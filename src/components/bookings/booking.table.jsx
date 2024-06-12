import { useState } from "react";
import { Table, Button, notification, Popconfirm, message } from "antd";
import { deleteApartment } from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { apartmentOnchangeTable } from "@/redux/slice/apartmentSlice";

const BookingTable = (props) => {
  const { listBookings, loading, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const confirmDelete = async (user) => {
    const res = await deleteApartment(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá căn hộ thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  // // Tính toán các giá trị duy nhất từ cột "Mã căn hộ"
  // const uniqueCodes = [...new Set(listBookings.map(item => item.code))];
  // // Tạo các bộ lọc từ các giá trị duy nhất
  // const filtersCode = uniqueCodes.map(code => ({ text: `Căn hộ "${code}"`, value: code }));

  // // Tính toán các giá trị duy nhất từ cột "Mã căn hộ"
  // const uniqueHosts = [...new Set(listBookings.map(item => item.users?.name).filter(user => user !== undefined))];
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
      title: "Khách hàng",
      dataIndex: "guest_id",
      key: "guest_id",
      // sorter: (a, b) => a.guest_id.localeCompare(b.guest_id),
      // filters: filtersCode,
      // onFilter: (value, record) => record.guest_id.startsWith(value),
      // filterMode: 'tree',
      // filterSearch: true,
      render: (_value, record) => {
        return <div>{record.guest_id.name}</div>;
      },
    },
    {
      title: "Xe",
      width: 110,
      render: (_value, record) => {
        return <div style={{ whiteSpace: "pre-wrap", textAlign: 'center' }}>{record.motor_id.map(item => item.license).join(', \n')}</div>;
      },
    },
    {
      title: "Ngày đi",
      render: (_value, record) => {
        return <div>{record.start_date}</div>;
      },
    },
    {
      title: "Tổng tiền",
      render: (_value, record) => {
        return <div>{formatCurrency(record.amount)}</div>;
      },
    },
    {
      title: "Đã trả",
      render: (_value, record) => {
        return <div>{formatCurrency(record.amount)}</div>;
      },
    },
    {
      title: "Phải thu",
      render: (_value, record) => {
        return <div></div>;
      },
    },
    {
      title: "Trạng thái",
      render: (_value, record) => {
        return <div>{record.status}</div>;
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
                  title={`Bạn muốn xoá căn hộ ${record.code} không ?`}
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
        dataSource={listBookings}
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
              apartmentOnchangeTable({
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

export default BookingTable;
