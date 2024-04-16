import { Modal, Form, Row, Col, Input, Select, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { getUsers, getApartment } from "@/utils/api";
import { useSelector } from "react-redux";

const SearchModal = (props) => {
  const { onSearch, isSearchModalOpen, setIsSearchModalOpen } = props;
  const [apartmentUser, setApartmentUser] = useState();
  const [apartmentCode, setApartmentCode] = useState();
  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);

  const resetModal = () => {
    setIsSearchModalOpen(false);
    form.resetFields();
  };
  const [form] = Form.useForm();
  const handleSearch = () => {
    form.submit();
    setIsSearchModalOpen(false);
  };

  useEffect(() => {
    const init = async () => {
      const res = await getUsers(`current=1&pageSize=100`);
      if (res.data?.result) {
        setApartmentUser(groupBySelectUser(res.data?.result));
      }
    };
    init();
  }, []);

  const groupBySelectUser = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
  };

  useEffect(() => {
    if (isAdmin.name === "SUPER_ADMIN") {
      const init = async () => {
        const res = await getApartment(`current=1&pageSize=100`);
        if (res.data?.result) {
          setApartmentCode(groupBySelectApartment(res.data?.result));
        }
      };
      init();
    } else {
      setApartmentCode(groupBySelectApartment(user.apartments))
    }

  }, []);

  const groupBySelectApartment = (data) => {
    return data.map((item) => ({ value: item._id, label: item.code }));
  };

  return (
    <>
      <Modal
        title="Tìm kiếm"
        open={isSearchModalOpen}
        onCancel={resetModal}
        onOk={handleSearch}
        maskClosable={false}
        width={"50%"}
      >
        <Form
          name="search-form"
          onFinish={onSearch}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            {isAdmin.name === "SUPER_ADMIN" ? (
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item
                  label="Chọn host"
                  name="userId"
                  style={{ width: "100%" }}
                >
                  <Select
                    placeholder="Tất cả"
                    options={apartmentUser}
                  />
                </Form.Item>
              </Col>
            ) : (
              ""
            )}

            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="Tất cả"
                name="apartment"
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Mã căn hộ"
                  options={apartmentCode}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="Họ tên" name="name" style={{ width: "100%" }}>
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="CMND/CCCD"
                name="identification_number"
                style={{ width: "100%" }}
              >
                <Input placeholder="Nhập CMND/CCCD" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                label="Ngày đến"
                name="arrival"
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="Ngày đi" name="departure">
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SearchModal;
