import { useState } from "react";
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
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch } from "react-redux";
import utc from 'dayjs/plugin/utc';
// Kích hoạt plugin UTC
dayjs.extend(utc);

const AccommodationCard = (props) => {
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
                <p>Ngày sinh : {dayjs(item.birthday).format("DD/MM/YYYY")}</p>
                <p>CMND/CCCD : {item.identification_number}</p>
                <p>Loại cư trú : {item.residential_status}</p>
                <p>Ngày đến : {dayjs.utc(item.arrival).format("DD/MM/YYYY (HH:mm)")}</p>
                <p>Ngày đi : {dayjs.utc(item.departure).format("DD/MM/YYYY (HH:mm)")}</p>
                <p>Mã căn hộ : {item.apartment.code}</p>
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
                            <CheckAccess
                              FeListPermission={
                                ALL_PERMISSIONS.ACCOMMODATION.DELETE
                              }
                              hideChildren
                            >
                              <Popconfirm
                                title={`Bạn muốn xoá ${item.name} không ?`}
                                onConfirm={() => confirmDelete(item)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button icon={<DeleteOutlined />} danger />
                              </Popconfirm>
                            </CheckAccess>
                            <CheckAccess
                              FeListPermission={
                                ALL_PERMISSIONS.ACCOMMODATION.UPDATE
                              }
                              hideChildren
                            >
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setIsUpdateModalOpen(true);
                                  setUpdateData(item);
                                }}
                              />
                            </CheckAccess>
                          </div>
                        </div>
                      ),
                      children: (
                        <>
                          <p>Hộ chiếu : {item.passport}</p>
                          <p>Quốc tịch : {item.nationality}</p>
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
                          <p>Lý do lưu trú : {item.reason}</p>

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
          onChange={(page, pageSize) =>
            dispatch(
              accommodationOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: meta.pages,
                total: meta.total,
              })
            )
          }
          showSizeChanger={true}
          defaultPageSize={meta.pageSize}
        />
        <UpdateModal
          updateData={updateData}
          reloadTable={reloadTable}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setUpdateData={setUpdateData}
        />
      </div>
    </div>
  );
};

export default AccommodationCard;
