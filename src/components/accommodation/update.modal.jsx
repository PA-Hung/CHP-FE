import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  notification,
  Form,
  Select,
  message,
  DatePicker,
  Row,
  Col,
} from "antd";
import { updateAccommodation } from "../../utils/api";
import dayjs from "dayjs";

const UpdateModal = (props) => {
  const {
    updateData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    getData,
    setUpdateData,
  } = props;
  const [form] = Form.useForm();
  const [IdentificationNumber, setIdentificationNumber] = useState(false);
  const [Passport, setPassport] = useState(false);
  const [Documents, setDocuments] = useState(false);

  useEffect(() => {
    if (updateData) {
      const formatBirthday = dayjs(updateData.birthday).isValid()
        ? dayjs(updateData.birthday)
        : null;
      const formatArrival = dayjs(updateData.arrival).isValid()
        ? dayjs(updateData.arrival)
        : null;
      const formatDeparture = dayjs(updateData.departure).isValid()
        ? dayjs(updateData.departure)
        : null;
      form.setFieldsValue({
        name: updateData.name,
        birthday: formatBirthday,
        gender: updateData.gender,
        identification_number: updateData.identification_number,
        passport: updateData.passport,
        documents: updateData.documents,
        phone: updateData.phone,
        job: updateData.job,
        workplace: updateData.workplace,
        ethnicity: updateData.ethnicity,
        nationality: updateData.nationality,
        country: updateData.country,
        province: updateData.province,
        district: updateData.district,
        ward: updateData.ward,
        address: updateData.address,
        residential_status: updateData.residential_status,
        arrival: formatArrival,
        departure: formatDeparture,
        reason: updateData.reason,
        apartment: updateData.apartment,
      });
    }
  }, [updateData]);

  const onFinish = async (values) => {
    const {
      name,
      birthday,
      gender,
      identification_number,
      passport,
      documents,
      phone,
      job,
      workplace,
      ethnicity,
      nationality,
      country,
      province,
      district,
      ward,
      address,
      residential_status,
      arrival,
      departure,
      reason,
      apartment,
    } = values;
    const data = {
      _id: updateData?._id,
      name,
      birthday,
      gender,
      identification_number,
      passport,
      documents,
      phone,
      job,
      workplace,
      ethnicity,
      nationality,
      country,
      province,
      district,
      ward,
      address,
      residential_status,
      arrival,
      departure,
      reason,
      apartment,
    };

    const res = await updateAccommodation(data);
    if (res.data) {
      await getData();
      message.success("Cập nhật quay phim thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const resetModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateData(null);
    form.resetFields();
  };

  const checkField = () => {
    const { getFieldValue } = form;

    const identification_number = getFieldValue("identification_number");
    const passport = getFieldValue("passport");
    const documents = getFieldValue("documents");

    if (identification_number || passport || documents) {
      setIdentificationNumber(false);
      setPassport(false);
      setDocuments(false);
    } else {
      setIdentificationNumber(true);
      setPassport(true);
      setDocuments(true);
    }
    return Promise.resolve();
  };

  useEffect(() => {
    checkField;
  }, [form]);

  return (
    <>
      <Modal
        title="Cập nhật lưu trú"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"60%"}
      >
        <Form
          name="update-new-accommodation"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Nhập họ tên !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                name="birthday"
                label="Ngày sinh"
                rules={[{ required: true, message: "Chọn ngày sinh !" }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Chọn giới tính !" }]}
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
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="CMND/CCCD"
                name="identification_number"
                rules={[{ required: true, validator: checkField }]}
                validateStatus={IdentificationNumber ? "error" : ""}
                help={IdentificationNumber ? "Bạn phải điền CMND/CCCD !" : ""}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Hộ chiếu"
                name="passport"
                rules={[{ required: true, validator: checkField }]}
                validateStatus={Passport ? "error" : ""}
                help={Passport ? "Bạn phải điền Passport !" : ""}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Giấy tờ khác"
                rules={[{ required: true, validator: checkField }]}
                name="documents"
                validateStatus={Documents ? "error" : ""}
                help={Documents ? "Bạn phải điền giấy tờ khác !" : ""}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Điện thoại" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Nghề nghiệp" name="job">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Nơi làm việc" name="workplace">
                <Input maxLength={200} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Dân tộc" name="ethnicity">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Quốc tịch"
                name="nationality"
                rules={[{ required: true, message: "Nhập quốc tịch !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Quốc gia"
                name="country"
                rules={[{ required: true, message: "Nhập quốc gia !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Tỉnh thành" name="province">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Quận huyện" name="district">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Phường xã" name="ward">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Số nhà" name="address">
                <Input maxLength={400} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Loại cư trú"
                name="residential_status"
                rules={[{ required: true, message: "Nhập loại cư trú !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Ngày đến"
                name="arrival"
                rules={[{ required: true, message: "Chọn ngày đến !" }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Ngày đi" name="departure">
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Lý do lưu trú" name="reason">
                <Input maxLength={250} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="left" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Mã căn hộ" name="apartment">
                <Input maxLength={250} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateModal;
