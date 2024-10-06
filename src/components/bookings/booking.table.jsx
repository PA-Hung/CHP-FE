import { useState } from "react";
import { Table, Button, notification, Popconfirm, message, Tag, Select, Dropdown, Modal, DatePicker, Tabs } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { bookingOnchangeTable } from "@/redux/slice/bookingSlice";
import { MenuOutlined, DeleteOutlined, ExclamationCircleOutlined, EditOutlined, ApiOutlined, CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { deleteBooking } from "@/utils/api";
import EndBookingModal from "./end.module/end.booking.modal";
import UpdateDrawer from "./update.drawer";
import { updateBooking } from "@/utils/api";
import EndByH_BookingModal from "./end.module/end_by_h.booking.modal";


const BookingTable = (props) => {
  const { listBookings, loading, reloadTable, meta, reloadTableCompleted } = props;
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isEndByH_ModalOpen, setIsEndByH_ModalOpen] = useState(false);
  const [endData, setEndData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const [end_date, setEnd_date] = useState(dayjs());

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

  const calculateRentalHours = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = endDate ? dayjs(endDate) : dayjs().add(1, "hour");
    return end.diff(start, 'hour');
  }

  const handleOkStatusChange = async (value, motors, record) => {
    // Cập nhật trạng thái của motors
    const updatedMotors = record.motors.map(motor => {
      if (value !== "Đã trả xe" && motor._id === motors._id) {
        return { ...motor, status: value };
      }
      if (value === "Đã trả xe" && motor._id === motors._id) {
        return { ...motor, status: value, end_date: end_date };
      }
      return motor;
    });

    // Tạo đối tượng dữ liệu mới với motors đã cập nhật
    const data = {
      _id: record._id,
      contract_status: record.contract_status,
      motors: updatedMotors,
    };

    const res = await updateBooking(data);
    if (res.data) {
      reloadTable();
      message.success("Cập nhật trạng thái hợp đồng thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  }

  const handleStatusChange = (value, item, record) => {
    if (value !== "Đã trả xe") {
      Modal.confirm({
        title: 'Xác nhận thay đổi',
        okText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
        content: (
          <div>Bạn có muốn thay đổi từ <span style={{ fontWeight: 550 }}>{item.status}</span> sang <span style={{ fontWeight: 550 }}>{value}</span> ?</div>),
        onOk: () => {
          handleOkStatusChange(value, item, record);
        },
      });
    }
    if (value === "Đã trả xe") {
      Modal.confirm({
        title: 'Xác nhận thay đổi',
        okText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
        content: (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div>Bạn có muốn thay đổi trạng thái hợp đồng từ <span style={{ fontWeight: 550 }}>{item.status}</span> sang <span style={{ fontWeight: 550 }}>{value}</span> ?</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
                <div>Thời gian trả xe : </div>
                <div>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }} // Chỉ hiển thị giờ
                    defaultValue={dayjs()}
                    format="HH:mm giờ DD-MM-YYYY"
                    onChange={(e) => setEnd_date(e)}
                  /></div>
              </div>
            </div>
          </>
        ),
        onOk: () => {
          handleOkStatusChange(value, item, record);
        },
      });
    }
  };

  const handleUpdateBooking = (record) => {
    setIsUpdateDrawerOpen(true)
    setUpdateData(record)
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
                <Select
                  status="warning"
                  size="small"
                  style={{ width: 150 }}
                  onChange={(value) => handleStatusChange(value, item, record)}
                  placeholder="Select an option"
                  options={[
                    { value: "Chưa nhận xe", label: "Chưa nhận xe" },
                    { value: "Đã nhận xe", label: "Đã nhận xe" },
                    { value: "Đã trả xe", label: "Đã trả xe" },
                  ]}
                  value={item.status}
                />
              </div>
            ))}
          </div>
        )
      },
    },
    {
      title: "Thời gian thuê",
      width: 330,
      render: (_value, record) => {
        return (
          <div style={{ display: "flex", gap: 3, flexDirection: "column" }}>
            {record.motors.map((item) => (
              <div key={item._id}>
                {record.contract_type === "Thuê theo ngày" ?
                  <>
                    {dayjs(item.start_date).format("HH:mm giờ (DD)")} - {dayjs(item.end_date).format("HH:mm giờ (DD/MM/YYYY)")} {<Tag bordered={true} color="volcano-inverse">
                      {calculateRentalDays(item.start_date, item.end_date)} ngày
                    </Tag>}
                  </> :
                  <>
                    {dayjs(item.start_date).format("HH:mm")} - {dayjs(item.end_date).format("HH:mm giờ (DD/MM/YYYY)")} {<Tag bordered={true} color="geekblue-inverse">
                      {calculateRentalHours(item.start_date, item.end_date)} giờ
                    </Tag>}
                  </>
                }
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
        return (
          <div>{...(record.remaining_amount ? formatCurrency(record.remaining_amount) : "")}</div>
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

  const handleEndBooking = (record) => {
    if (record.contract_type === "Thuê theo ngày") {
      setIsEndModalOpen(true)
      setEndData(record)
    }
    if (record.contract_type === "Thuê theo giờ") {
      setIsEndByH_ModalOpen(true)
      setEndData(record)
    }
  }

  const items = (record) => [
    {
      key: '1',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><EditOutlined /></div>
          <div onClick={() => handleUpdateBooking(record)}>Sửa hợp đồng</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><ApiOutlined /></div>
          <div onClick={() => handleEndBooking(record)}>Đóng hợp đồng</div>
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
        reloadTableCompleted={reloadTableCompleted}
        endData={endData}
        setEndData={setEndData}
        reloadTable={reloadTable}
      />
      <EndByH_BookingModal
        isEndByH_ModalOpen={isEndByH_ModalOpen}
        setIsEndByH_ModalOpen={setIsEndByH_ModalOpen}
        reloadTableCompleted={reloadTableCompleted}
        endData={endData}
        setEndData={setEndData}
        reloadTable={reloadTable}
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
