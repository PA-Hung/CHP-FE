import { useEffect, useState } from "react";
import {
  Collapse,
  notification,
  message,
  Card,
  Flex,
  Spin,
  Pagination,
  Button,
  Popconfirm,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { deleteAccommodation } from "../../utils/api";
import UpdateModal from "./update.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const PermissionCard = (props) => {
  const { listAccommodation, loading, getData } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 15,
    pages: 0,
    total: 0,
  });

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

  const handleOnchangeTable = (page, pageSize) => {
    setMeta({
      current: page,
      pageSize: pageSize,
      pages: meta.pages,
      total: meta.total,
    });
  };

  const { Meta } = Card;

  const customExpandIcon = () => {
    // Thay đổi biểu tượng mở rộng ở đây, ví dụ sử dụng CaretRightOutlined
    return (
      <CaretRightOutlined
        style={{
          fontSize: 20,
          marginTop: 10,
        }}
      />
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div>
        {loading ? (
          <div>
            <Spin size="default" />
          </div>
        ) : (
          <Flex wrap="wrap" gap="small">
            {listAccommodation.map((item) => (
              <Card
                hoverable
                key={item._id}
                style={{ width: 300, margin: "10px" }}
              >
                <Meta title={item.name} />

                <hr />
                <p>CMND/CCCD : {item.identification_number}</p>
                <p>Hộ chiếu : {item.passport}</p>
                <p>Quốc tịch : {item.nationality}</p>
                <p>Loại cư trú : {item.residential_status}</p>
                <p>Ngày đến : {dayjs(item.arrival).format("DD/MM/YYYY")}</p>
                <Collapse
                  expandIcon={customExpandIcon}
                  accordion
                  size="small"
                  items={[
                    {
                      key: "1",
                      label: (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            alignContent: "center",
                            gap: 10,
                          }}
                        >
                          <div>
                            <Col xs={0} sm={24} md={24} lg={24} xl={24}>
                              Xem chi tiêt
                            </Col>
                          </div>

                          <div style={{ display: "flex", gap: 5 }}>
                            <Popconfirm
                              title={`Bạn muốn xoá ${item.name} không ?`}
                              onConfirm={() => confirmDelete(item)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => {
                                setIsUpdateModalOpen(true);
                                setUpdateData(item);
                              }}
                            />
                          </div>
                        </div>
                      ),
                      children: (
                        <>
                          <p>
                            Ngày sinh :{" "}
                            {dayjs(item.birthday).format("DD/MM/YYYY")}
                          </p>
                          <p>Giới tính : {item.gender}</p>
                          <p>Giấy tờ khác : {item.documents}</p>
                          <p>Quốc gia : {item.country}</p>
                          <p>Điện thoại : {item.phone}</p>
                          <p>Nghề nghiệp : {item.job}</p>
                          <p>Nơi làm việc : {item.workplace}</p>
                          <p>Dân tộc : {item.ethnicity}</p>
                          <p>Tỉnh thành : {item.province}</p>
                          <p>Quận huyện : {item.district}</p>
                          <p>Phường xã : {item.ward}</p>
                          <p>Địa chỉ : {item.address}</p>
                          <p>
                            Ngày đi :{" "}
                            {dayjs(item.departure).format("DD/MM/YYYY")}
                          </p>
                          <p>Lý do lưu trú : {item.reason}</p>
                          <p>Mã căn hộ : {item.apartment}</p>
                        </>
                      ),
                    },
                  ]}
                />
              </Card>
            ))}
          </Flex>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <Pagination
          current={meta.current}
          total={meta.total}
          pageSize={meta.pageSize}
          onChange={(page, pageSize) => handleOnchangeTable(page, pageSize)}
          showSizeChanger={true}
          defaultPageSize={meta.pageSize}
        />
        <UpdateModal
          updateData={updateData}
          getData={getData}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setUpdateData={setUpdateData}
        />
      </div>
    </div>
  );
};

export default PermissionCard;
