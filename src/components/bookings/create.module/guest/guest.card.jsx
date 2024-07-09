import { useEffect, useState } from "react";
import { notification, message, Card, Modal, Form, Row, Col, Input, Select } from "antd";
import { DeleteOutlined, PlusSquareOutlined, ZoomInOutlined, IdcardOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { postCreateGuest } from "@/utils/api";
import GuestModalTable from "./guest.modal.table";
import { useDispatch, useSelector } from "react-redux";
import { fetchGuest } from "@/redux/slice/guestSlice";
import queryString from "query-string";

export const GuestCard = (props) => {
  const { guestData, setGuestData } = props
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [form] = Form.useForm();

  const meta = useSelector((state) => state.guest.meta);
  const listGuests = useSelector((state) => state.guest.result);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(null);

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const { Meta } = Card;

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.phone) clone.phone = `/${clone.phone}/i`;
    if (clone.cccd) clone.cccd = `/${clone.cccd}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.phone) {
      sortBy = sort.phone === "ascend" ? "sort=phone" : "sort=-phone";
    }
    if (sort && sort.cccd) {
      sortBy = sort.cccd === "ascend" ? "sort=cccd" : "sort=-cccd";
    }

    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-createdAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchGuest({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchGuest({ query }));
      }
    };
    initData();
  }, [meta.current, meta.pageSize]);

  const onFinish = async (values) => {
    const data = values; // viết gọn của 2 dòng trên
    const res = await postCreateGuest(data);
    if (res.data) {
      setGuestData(data)
      resetModal();
      message.success("Tạo mới khách hàng thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }

  };

  const onSearch = async (value) => {
    let filteredData = {};
    const input = value.trim(); // Xóa khoảng trắng đầu cuối của chuỗi nhập vào
    const isNumeric = /^\d+$/.test(input);
    if (isNumeric) {
      if (input.length === 10) {
        filteredData.phone = input; // Số điện thoại nếu có 10 chữ số
      } else {
        filteredData.cccd = input; // Căn cước công dân nếu số có nhiều hơn 10 chữ số
      }
    } else {
      filteredData.name = input; // Tên nếu không phải là số
    }

    setSearchValue(filteredData);
    const query = buildQuery(filteredData);
    dispatch(fetchGuest({ query }));
  };

  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchGuest({ query }));
    setSearchValue(null)
  };


  return (
    <>
      <div style={{ width: "100%" }}>
        <Card
          style={{ margin: 5, cursor: "default" }}
          cover={
            <div style={{ textAlign: "center", paddingTop: 20, fontSize: 25, fontWeight: 550 }}>
              Khách hàng
            </div>
          }
          actions={[
            <PlusSquareOutlined style={{ fontSize: 20 }} key="setting" onClick={() => setIsCreateModalOpen(true)} />,
            <ZoomInOutlined style={{ fontSize: 20 }} key="edit" onClick={() => setIsTableModalOpen(true)} />,
            <DeleteOutlined style={{ fontSize: 20 }} key="ellipsis" onClick={() => setGuestData("")} />,
          ]}
          hoverable
        >
          <Meta
            avatar={<IdcardOutlined style={{ fontSize: 50 }} />}
            title={<>Tên : {guestData?.name}</>}
            description={
              <div style={{ fontWeight: 550 }}>
                <div>Điện thoại : {guestData?.phone}</div>
                <div>CCCD : {guestData?.cccd}</div>
              </div>
            }
          />
        </Card>
      </div>
      <Modal
        title="Thêm mới khách hàng"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
      >
        <Form
          name="create-new-guest"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Nhập họ tên !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Điện thoại"
                name="phone"
                rules={[{ required: true, message: "Nhập điện thoại !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="CCCD"
                name="cccd"
                rules={[{ required: true, message: "Nhập CCCD !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Ngày sinh"
                name="birthday"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
              >
                <Select
                  placeholder="Chọn giới tính"
                  allowClear
                  options={[
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <GuestModalTable
        reloadTable={reloadTable}
        onSearch={onSearch}
        listGuests={listGuests}
        isTableModalOpen={isTableModalOpen}
        setIsTableModalOpen={setIsTableModalOpen}
        setGuestData={setGuestData}
      />
    </>
  );
};

