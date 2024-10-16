import { useEffect, useState } from "react";
import { Table, notification, Popconfirm, message, Tag, Select, Dropdown, Modal, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch, useSelector } from "react-redux";
import { MenuOutlined, DeleteOutlined, ExclamationCircleOutlined, EditOutlined, ApiOutlined, CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { deleteBooking } from "@/utils/api";
import EndBookingModal from "./end.module/end.booking.modal";
import UpdateDrawer from "./update.drawer";
import { updateBooking } from "@/utils/api";
import { bookingCompletedOnchangeTable } from "@/redux/slice/bookingCompletedSlice";
import OvertimeDetailDrawer from "./overtime.detail.drawer";
import { Link } from "react-router-dom";

const BookingCompletedTable = (props) => {
  const { listBookingsCompleted, loadingCompleted, reloadTableCompleted, metaCompleted, reloadTable } = props;

  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [isOvertimeDetailOpen, setIsOvertimeDetailOpen] = useState(false);
  const [overtimeDetailData, setOvertimeDetailData] = useState(null);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [endData, setEndData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const [end_date, setEnd_date] = useState(dayjs());

  const [checkUpdateContract, setCheckUpdateContract] = useState(Boolean)
  const [checkOpenContract, setCheckOpenContract] = useState(Boolean)
  const [checkDeleteContract, setCheckDeleteContract] = useState(Boolean)
  const userPermissions = useSelector((state) => state.auth.user.permissions);

  useEffect(() => {
    if (userPermissions?.length) {
      const viewBookings_UpdateContract = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.BOOKINGS.UPDATE_PAYMENT.apiPath &&
          item.method === ALL_PERMISSIONS.BOOKINGS.UPDATE_PAYMENT.method
      );
      setCheckUpdateContract(viewBookings_UpdateContract ? true : false)

      const viewBookings_OpenContract = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.BOOKINGS.OPEN_PAYMENT.apiPath &&
          item.method === ALL_PERMISSIONS.BOOKINGS.OPEN_PAYMENT.method
      );
      setCheckOpenContract(viewBookings_OpenContract ? true : false)

      const viewBookings_DeleteContract = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.BOOKINGS.DELETE_PAYMENT.apiPath &&
          item.method === ALL_PERMISSIONS.BOOKINGS.DELETE_PAYMENT.method
      );
      setCheckDeleteContract(viewBookings_DeleteContract ? true : false)
    }
  }, [userPermissions])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const calculateRentalDays = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
    const diffDays = end.diff(start, 'day');
    // Trả về 1 nếu thời gian cho thuê chưa đủ 1 ngày
    return diffDays > 0 ? diffDays : 1;
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
      motors: updatedMotors,
    };

    try {
      const res = await updateBooking(data);
      if (res.data) {
        reloadTableCompleted();
        reloadTable();
        message.success("Cập nhật trạng thái hợp đồng thành công !");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          placement: "top",
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: error.message,
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
          <div>Bạn có muốn thay đổi trạng thái hợp đồng từ <span style={{ fontWeight: 550 }}>{item.status}</span> sang <span style={{ fontWeight: 550 }}>{value}</span> ?</div>),
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

  const handleUpdateCompletedBooking = (record) => {
    if (record.contract_status === "Hợp đồng đóng") {
      notification.warning({
        message: "Thông báo",
        placement: "top",
        description: "Hợp đồng đã đóng, bạn cần liên hệ admin để cập nhật thông tin hợp đồng !",
      });
    } else {
      setIsUpdateDrawerOpen(true)
      setUpdateData(record)
    }
  }

  const handleOpenCompletedBooking = async (record) => {
    if (record.contract_status === "Hợp đồng đóng") {
      notification.warning({
        message: "Thông báo",
        placement: "top",
        description: "Hợp đồng này đã hoàn thành, bạn cần liên hệ admin để mở lại hợp đồng !",
      });
    } else {
      const newMotors = record.motors.map((item) => ({ ...item, status: "Đã nhận xe" }));
      const data = {
        _id: record._id,
        motors: newMotors,
        guest_id: record?.guest_id._id,
        user_id: record.user_id,
        commission: record.commission,
        contract_status: "Hợp đồng mở",
        method: record.method,
        discount: record.discount,
        deposit: record.deposit,
        amount: record.total,
        remaining_amount: 0,
      }
      const resBookings = await updateBooking(data);
      if (resBookings.data) {
        reloadTable();
        reloadTableCompleted();
        message.success("Mở lại hợp đồng thành công !");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          placement: "top",
          description: resBookings.message,
        });
      }
    }
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (metaCompleted.current - 1) * metaCompleted.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Khách hàng",
      dataIndex: "guest_id",
      key: "guest_id",
      render: (_value, record) => {
        return <div style={{ fontWeight: 500 }}>{record.guest_id.name}</div>;
      },
    },
    {
      title: "Xe / Tình trạng",
      width: 250,
      render: (_value, record) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", display: "flex", flexDirection: "column", gap: 2 }}>
            {record.motors.map((item) => (
              <div key={item._id} style={{ display: "flex", gap: 5, flexDirection: "row", justifyContent: "right" }}>
                {item.brand}
                <Tag color="blue">{item.license}</Tag>
                <Select
                  disabled
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
      width: "fit-content",
      render: (_value, record) => {
        return (
          <div style={{ display: "flex", gap: 3, flexDirection: "column" }}>
            {record.motors.map((item) => (
              <div key={item._id}>
                {record.contract_type === "Thuê theo ngày" ?
                  <>
                    {dayjs(item.start_date).format("DD")} - {dayjs(item.end_date).format("DD/MM/YY")} {<Tag bordered={true} color="volcano-inverse">
                      {calculateRentalDays(item.start_date, item.end_date)} ngày
                    </Tag>}
                  </> :
                  <>
                    {dayjs(item.start_date).format("HH:mm")} - {dayjs(item.end_date).format("HH:mm")} {<Tag bordered={true} color="geekblue-inverse">
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
      title: "Phụ thu lễ",
      render: (_value, record) => {
        return <div>{...(record.surcharge ? formatCurrency(record.surcharge) : "")}</div>;
      },
    },
    {
      title: "Phí quá hạn",
      render: (_value, record) => {
        return (
          <Link style={{ textDecoration: "none" }} onClick={() => { setIsOvertimeDetailOpen(true), setOvertimeDetailData(record) }}>
            {...(record.late_fee_amount ? formatCurrency(record.late_fee_amount) : "")}
          </Link>
        )
      },
    },
    {
      title: "Đã trả",
      render: (_value, record) => {
        return <div>{...(record.deposit ? formatCurrency(record.deposit) : "")}</div>;
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

  const handleDeleteCompletedBooking = (record) => {
    if (record.status === "Hợp đồng đóng") {
      notification.warning({
        message: "Thông báo",
        placement: "top",
        description: "Bạn không có quyền xoá hợp đồng này, hãy liên hệ admin !",
      });
    } else {
      confirmDeleteBooking(record)
    }
  }


  const items = (record) => [
    ...(checkUpdateContract ? [{
      key: '1',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><EditOutlined /></div>
          <div onClick={() => handleUpdateCompletedBooking(record)}>Sửa hợp đồng</div>
        </div>
      ),
    }] : []),
    ...(checkOpenContract ? [{
      key: '2',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><ApiOutlined /></div>
          <div onClick={() => handleOpenCompletedBooking(record)}>Mở hợp đồng</div>
        </div>
      ),
    }] : []),
    ...(checkDeleteContract ? [{
      key: '3',
      label: (
        <Popconfirm
          title={`Bạn muốn xoá hợp đồng của ${record.guest_id.name} không ?`}
          onConfirm={() => handleDeleteCompletedBooking(record)}
          okText="Yes"
          cancelText="No"
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 10, color: "red" }}>
            <div><DeleteOutlined /></div>
            <div>Huỷ hợp đồng</div>
          </div>
        </Popconfirm>
      ),
    }] : [])
  ];

  const confirmDeleteBooking = async (book) => {
    const res = await deleteBooking(book._id);
    if (res.data) {
      reloadTableCompleted();
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
        dataSource={listBookingsCompleted}
        rowKey={"_id"}
        loading={loadingCompleted}
        bordered={true}
        pagination={{
          position: ["bottomCenter"],
          current: metaCompleted.current,
          pageSize: metaCompleted.pageSize,
          total: metaCompleted.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            dispatch(
              bookingCompletedOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: metaCompleted.pages,
                total: metaCompleted.total,
              })
            ),
          showSizeChanger: true,
          defaultPageSize: metaCompleted.pageSize,
        }}
      />
      <EndBookingModal
        isEndModalOpen={isEndModalOpen}
        setIsEndModalOpen={setIsEndModalOpen}
        endData={endData}
        setEndData={setEndData}
        reloadTableCompleted={reloadTableCompleted}
        reloadTable={reloadTable}
      />
      <UpdateDrawer
        updateData={updateData}
        setUpdateData={setUpdateData}
        reloadTableCompleted={reloadTableCompleted}
        isUpdateDrawerOpen={isUpdateDrawerOpen}
        setIsUpdateDrawerOpen={setIsUpdateDrawerOpen}
      />
      <OvertimeDetailDrawer
        isOvertimeDetailOpen={isOvertimeDetailOpen}
        setIsOvertimeDetailOpen={setIsOvertimeDetailOpen}
        overtimeDetailData={overtimeDetailData}
        setOvertimeDetailData={setOvertimeDetailData}
      />
    </>
  );
};

export default BookingCompletedTable;
