import { useState } from "react";
import { Table, Button, notification, Popconfirm, message, Tag, Select, Dropdown } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { bookingOnchangeTable } from "@/redux/slice/bookingSlice";
import { MenuOutlined, DeleteOutlined, PrinterOutlined, EditOutlined, ApiOutlined, CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { deleteBooking } from "@/utils/api";
import EndBookingModal from "./end.module/end.booking.modal";
import UpdateDrawer from "./update.drawer";

const BookingTable = (props) => {
  const { listBookings, loading, reloadTable, meta } = props;
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [endData, setEndData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

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

  const calculateRentalDays = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
    return end.diff(start, 'day');
  }

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
        return <div style={{ fontWeight: 500 }}>{record.guest_id.name}</div>;
      },
    },
    {
      title: "Xe / Tình trạng",
      width: 250,
      render: (_value, record) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", textAlign: 'center', display: "flex", flexDirection: "column", gap: 2 }}>
            {record.motors.map((item) => (
              <div key={item._id} style={{ display: "flex", gap: 5 }}>
                {item.brand}
                <Tag color="blue">{item.license}</Tag>
                {
                  item.rental_status === true ?
                    <Tag icon={<CheckCircleOutlined />} color="#f50" style={{ fontWeight: 550 }}>Đã nhận xe</Tag>
                    : <Tag icon={<MinusCircleOutlined />} color="default" style={{ fontWeight: 550 }}>Chưa nhận xe</Tag>
                }

              </div>
            ))}
          </div>
        )
      },
    },
    {
      title: "Ngày thuê",
      width: 190,
      render: (_value, record) => {
        return (
          <div style={{ display: "flex", gap: 3, flexDirection: "column" }}>
            {record.motors.map((item) => (
              <div key={item._id}>
                {dayjs.utc(item.start_date).format("DD")} - {dayjs.utc(item.end_date).format("DD/MM/YYYY")} {<Tag bordered={true} color="volcano">
                  {calculateRentalDays(item.start_date, item.end_date)} Ngày
                </Tag>}
              </div>
            ))}

          </div>
        )
      },
    },
    {
      title: "Tổng tiền",
      render: (_value, record) => {
        return <div>{...(record.amount ? formatCurrency(record.amount) : "")}</div>;
      },
    },
    {
      title: "Giảm giá",
      render: (_value, record) => {
        return <div>{...(record.discount ? formatCurrency(record.discount) : "")}</div>;
      },
    },
    {
      title: "Đã trả",
      render: (_value, record) => {
        return <div>{...(record.deposit ? formatCurrency(record.deposit) : "")}</div>;
      },
    },
    {
      title: "Phải thu",
      render: (_value, record) => {
        const amount = record.amount || 0;
        const discount = record.discount || 0;
        const deposit = record.deposit || 0;
        // Tính toán giá trị cần hiển thị trong cột "Phải thu"
        const remaining_amount = amount - discount - deposit;
        return (
          <div>{formatCurrency(remaining_amount)}</div>
        );
      },
    },
    {
      title: "Actions",
      width: 40,
      render: (record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Dropdown
              placement="bottom"
              menu={{ items: items(record) }}
              trigger={['click']}
            >
              <MenuOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];


  const items = (record) => [
    {
      key: '1',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><EditOutlined /></div>
          <div onClick={() => { setIsUpdateDrawerOpen(true), setUpdateData(record) }}>Sửa hợp đồng</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><ApiOutlined /></div>
          <div onClick={() => { setIsEndModalOpen(true), setEndData(record) }}>Đóng hợp đồng</div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <Popconfirm
          title={`Bạn muốn xoá hợp đồng của ${record.guest_id.name} không ?`}
          onConfirm={() => confirmDeleteBooking(record)}
          okText="Yes"
          cancelText="No"
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 10, color: "red" }}>
            <div><DeleteOutlined /></div>
            <div>Huỷ hợp đồng</div>
          </div>
        </Popconfirm>
      ),
    },
  ];

  const confirmDeleteBooking = async (book) => {
    const res = await deleteBooking(book._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá hợp đồng thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

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
              bookingOnchangeTable({
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
      <EndBookingModal
        isEndModalOpen={isEndModalOpen}
        setIsEndModalOpen={setIsEndModalOpen}
        endData={endData}
        setEndData={setEndData}
      />
      <UpdateDrawer
        updateData={updateData}
        setUpdateData={setUpdateData}
        reloadTable={reloadTable}
        isUpdateDrawerOpen={isUpdateDrawerOpen}
        setIsUpdateDrawerOpen={setIsUpdateDrawerOpen}
      />
    </>
  );
};

export default BookingTable;
