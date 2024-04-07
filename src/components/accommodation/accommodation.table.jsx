import { useEffect, useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  message,
  Descriptions,
} from "antd";
import { deleteAccommodation } from "../../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";
import CheckAccess from "@/utils/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import { accommodationOnchangeTable } from "../../redux/slice/accommodationSlice";

const AccommodationTable = (props) => {
  const { listAccommodation, loading, getData, meta } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const confirmDelete = async (user) => {
    const res = await deleteAccommodation(user._id);
    if (res.data) {
      await getData();
      message.success("Xoá lưu trú thành công !");
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
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
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
      title: "CMND/CCCD",
      dataIndex: "identification_number",
      key: "identification_number",
    },
    {
      title: "Hộ chiếu",
      dataIndex: "passport",
      key: "passport",
    },
    {
      title: "Quốc tịch",
      dataIndex: "nationality",
      key: "nationality",
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
        return <div>{dayjs(record.arrival).format("DD/MM/YYYY")}</div>;
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
      <Descriptions.Item label="Ngày sinh">
        {dayjs(record.birthday).format("DD/MM/YYYY")}
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
      <Descriptions.Item label="Ngày đi ">
        {dayjs(record.departure).format("DD/MM/YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Lý do lưu trú">
        {record.reason}
      </Descriptions.Item>
      <Descriptions.Item label="Mã căn hộ">
        {record.apartment.code}
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
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setUpdateData={setUpdateData}
      />
    </>
  );
};

export default AccommodationTable;
