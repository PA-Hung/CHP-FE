import {
  Modal,
  Input,
  notification,
  Form,
  message,
  DatePicker,
  Select,
  Row,
  Col,
} from "antd";
import { postCreateAccommodation } from "@/utils/api";
import { useEffect, useState } from "react";

const CreateModal = (props) => {
  const {
    reloadTable,
    isCreateModalOpen,
    setIsCreateModalOpen,
    apartmentCode,
    setApartmentCode,
  } = props;
  const [form] = Form.useForm();

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const [IdentificationNumber, setIdentificationNumber] = useState(false);
  const [Passport, setPassport] = useState(false);
  const [Documents, setDocuments] = useState(false);

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

  const onFinish = async (values) => {
    await checkField();
    // Kiểm tra xem có lỗi nào không
    if (IdentificationNumber || Passport || Documents) {
      notification.error({
        message: "Lỗi",
        placement: "top",
        description: "Phải cung cấp ít nhất một trong số: số CMND, hộ chiếu, hoặc tài liệu",
      });
      return;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
    if (!dateRegex.test(values.birthday)) {
      notification.error({
        message: "Ngày sinh không hợp lệ",
        placement: "top",
        description: "Ngày sinh phải theo định dạng DD/MM/YYYY",
      });
      return;
    }

    if (values.identification_number) {
      const idNumberRegex = /^\d{9,12}$/;
      if (!idNumberRegex.test(values.identification_number)) {
        notification.error({
          message: "Số CCCD không hợp lệ",
          placement: "top",
          description: "Số CCCD phải từ 9 đến 12 số !",
        });
        return;
      }
    }

    const data = values; // viết gọn của 2 dòng trên
    const res = await postCreateAccommodation(data);
    if (res.data) {
      reloadTable();
      message.success("Tạo mới lưu trú thành công !");
      resetModal();
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
      <Modal
        title="Thêm mới lưu trú"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"60%"}
      >
        <Form
          name="create-new-accommodation"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Mã căn hộ"
                name="apartment"
                rules={[{ required: true, message: "Chọn mã căn hộ !" }]}
              >
                <Select
                  placeholder="Chọn mã căn hộ"
                  allowClear
                  options={apartmentCode}
                />
              </Form.Item>
            </Col>
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
                rules={[{ required: true, message: "Nhập ngày sinh !" }]}
              >
                <Input type="text" placeholder="DD/MM/YYYY" />
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
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
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
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Nghề nghiệp" name="job">
                <Input />
              </Form.Item>
            </Col>
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
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                label="Quốc gia"
                name="country"
                rules={[{ required: true, message: "Nhập quốc gia !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
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
          </Row>
          <Row gutter={[16, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Số nhà" name="address">
                <Input maxLength={400} />
              </Form.Item>
            </Col>
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
              <Form.Item
                label="Ngày đi"
                name="departure"
                rules={[{ required: true, message: "Chọn ngày đi !" }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="left" wrap={true}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item label="Lý do lưu trú" name="reason">
                <Input maxLength={250} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
