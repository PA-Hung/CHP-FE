import { useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  message,
  Descriptions,
} from "antd";
import { deleteAccommodation } from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { accommodationOnchangeTable } from "@/redux/slice/accommodationSlice";
import utc from 'dayjs/plugin/utc';
// Kích hoạt plugin UTC
dayjs.extend(utc);

const AccommodationTable = (props) => {
  const { listAccommodation, loading, reloadTable, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const confirmDelete = async (user) => {
    const res = await deleteAccommodation(user._id);
    if (res.data) {
      reloadTable();
      message.success("Xoá lưu trú thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  // Tính toán các giá trị duy nhất từ cột "Mã căn hộ"
  const uniqueNames = [...new Set(listAccommodation.map(item => item.name))];
  // Tạo các bộ lọc từ các giá trị duy nhất
  const filtersName = uniqueNames.map(name => ({ text: name, value: name }));

  // Tính toán các giá trị duy nhất từ cột "Mã căn hộ"
  const uniqueAparments = [...new Set(listAccommodation.map(item => item.apartment?.code).filter(code => code !== undefined))];
  // Tạo các bộ lọc từ các giá trị duy nhất
  const filtersAparment = uniqueAparments.map(code => ({ text: code, value: code }));

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
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: filtersName,
      onFilter: (value, record) => record.name.startsWith(value),
      filterMode: 'tree',
      filterSearch: true,
      render: (_value, record) => {
        return (
          <div
            style={{
              cursor: "pointer",
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
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (_value, record) => {
        return <div>{dayjs(record.birthday).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "CMND/CCCD",
      dataIndex: "identification_number",
      key: "identification_number",
    },
    {
      title: "Loại cư trú",
      dataIndex: "residential_status",
      key: "residential_status",
    },
    {
      title: "Ngày đến",
      dataIndex: "arrival",
      key: "arrival",
      render: (_value, record) => {
        return <div>
          {dayjs.utc(record.arrival).format("DD/MM/YYYY (HH:mm)")}
        </div>;
      },
    },
    {
      title: "Ngày đi",
      dataIndex: "departure ",
      key: "departure ",
      render: (_value, record) => {
        return <div>{dayjs.utc(record.departure).format("DD/MM/YYYY (HH:mm)")}</div>;
      },
    },
    {
      title: "Mã căn hộ",
      dataIndex: "apartment",
      key: "apartment",
      sorter: (a, b) => a.apartment.code.localeCompare(b.apartment.code),
      filters: filtersAparment,
      onFilter: (value, record) => record.apartment.code.startsWith(value),
      filterMode: 'tree',
      filterSearch: true,
      render: (_value, record) => {
        return <div>{record.apartment.code}</div>;
      },
    },
    {
      title: "Actions",
      render: (record) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.ACCOMMODATION.UPDATE}
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
              FeListPermission={ALL_PERMISSIONS.ACCOMMODATION.DELETE}
              hideChildren
            >
              <div>
                <Popconfirm
                  title={`Bạn muốn xoá ${record.name} không ?`}
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

  const expandableTable = (record) => (
    <Descriptions title="Thông tin chi tiết" bordered>
      <Descriptions.Item label="Hộ chiếu">
        {record.passport}
      </Descriptions.Item>
      <Descriptions.Item label="Quốc tịch">
        {record.nationality}
      </Descriptions.Item>
      <Descriptions.Item label="Giới tính">{record.gender}</Descriptions.Item>
      <Descriptions.Item label="Giấy tờ khác">
        {record.documents}
      </Descriptions.Item>
      <Descriptions.Item label="Quốc gia">{record.country}</Descriptions.Item>
      <Descriptions.Item label="Điện thoại">{record.phone}</Descriptions.Item>
      <Descriptions.Item label="Nghề nghiệp">{record.job}</Descriptions.Item>
      <Descriptions.Item label="Nơi làm việc">
        {record.workplace}
      </Descriptions.Item>
      <Descriptions.Item label="Dân tộc">{record.ethnicity}</Descriptions.Item>
      <Descriptions.Item label="Tỉnh thành">
        {record.province}
      </Descriptions.Item>
      <Descriptions.Item label="Quận huyện">
        {record.district}
      </Descriptions.Item>
      <Descriptions.Item label="Phường xã">{record.ward}</Descriptions.Item>
      <Descriptions.Item label="Địa chỉ">{record.address}</Descriptions.Item>
      <Descriptions.Item label="Lý do lưu trú">
        {record.reason}
      </Descriptions.Item>

    </Descriptions>
  );

  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={listAccommodation}
        rowKey={"_id"}
        loading={loading}
        bordered={true}
        expandable={{
          expandedRowRender: expandableTable,
          expandRowByClick: true,
        }}
        pagination={{
          position: ["bottomCenter"],
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            dispatch(
              accommodationOnchangeTable({
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

export default AccommodationTable;
