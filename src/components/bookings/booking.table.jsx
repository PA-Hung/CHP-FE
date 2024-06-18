import { useState } from "react";
import { Table, Button, notification, Popconfirm, message, Tag, Select, Dropdown } from "antd";
import { deleteApartment } from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { apartmentOnchangeTable } from "@/redux/slice/apartmentSlice";
import { MenuOutlined, DeleteOutlined, PrinterOutlined, EditOutlined, ApiOutlined, CloseCircleOutlined } from '@ant-design/icons';

const BookingTable = (props) => {
  const { listBookings, loading, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
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

  const handleStatusChange = ({ _id, status }) => {
    console.log('status', status);
    console.log('_id', _id);
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
        return <div>{record.guest_id.name}</div>;
      },
    },
    {
      title: "Xe",
      width: 110,
      render: (_value, record) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", textAlign: 'center', display: "flex", flexDirection: "column", gap: 2 }}>
            {record.motors.map((item) => (
              <div key={item._id} style={{ display: "flex", gap: 5 }}>
                {item.brand}
                <Tag color="blue">{item.license}</Tag>
              </div>
            ))}
          </div>
        )
      },
    },
    {
      title: "Ngày thuê",
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
      title: "Đã trả",
      render: (_value, record) => {
        return <div>{...(record.deposit ? formatCurrency(record.deposit) : "")}</div>;
      },
    },
    {
      title: "Phải thu",
      render: (_value, record) => {
        return <div>{...(record.deposit ? formatCurrency(record.amount - record.deposit) : "")}</div>;
      },
    },
    {
      title: "Trạng thái",
      render: (_value, record) => {
        return (
          <div>
            <Select
              style={{ width: "100%", height: 40, borderRadius: 10 }}
              placeholder="Chọn trạng thái"
              allowClear
              bordered={true}
              status="warning"
              value={record.status}
              options={[
                { value: "Đã nhận xe", label: "Đã nhận xe" },
                { value: "Đã trả xe", label: "Đã trả xe" },
                { value: "Xe tai nạn", label: "Xe tai nạn" },
                { value: "Xe mất trộm", label: "Xe mất trộm" },
              ]}
              onChange={(value) => handleStatusChange({ _id: record._id, status: value })}
            />
          </div>
        )
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
              menu={{ items }}
            >
              <MenuOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const items = [
    {
      key: '1',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><EditOutlined /></div>
          <div>Sửa hợp đồng</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><PrinterOutlined /></div>
          <div>In hợp đồng</div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div><ApiOutlined /></div>
          <div>Kết thúc hợp đồng</div>
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <div style={{ display: "flex", flexDirection: "row", gap: 10, color: "red" }}>
          <div><DeleteOutlined /></div>
          <div>Huỷ hợp đồng</div>
        </div>
      ),
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
