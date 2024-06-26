import { useEffect, useState } from "react";
import { Modal, notification, message, Row, Col, DatePicker, Card, Space, InputNumber, Select, Tag, Button } from "antd";
import dayjs from "dayjs";
import { PlusCircleOutlined } from "@ant-design/icons";

const EndBookingModal = (props) => {
  const { endData, setEndData, isEndModalOpen, setIsEndModalOpen, reloadTable } = props;
  const [license, setLicense] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [numberItems, setNumberItems] = useState(0);
  const [expired_hours, setExpired_hours] = useState(0);
  const [late_fee_amount, setLate_fee_amount] = useState(0); // Thêm trạng thái cho phí quá giờ tổng cộng
  const [endDates, setEndDates] = useState({});

  console.log('endData', endData);

  const groupBySelect = (data) => {
    return data.map((item) => ({ value: item._id, label: item.license }));
  };

  const calculateRentalDays = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
    return end.diff(start, 'day');
  };

  useEffect(() => {
    if (endData) {
      const amount = endData.amount || 0;
      const discount = endData.discount || 0;
      const deposit = endData.deposit || 0;
      setRemainingAmount(amount - discount - deposit - (late_fee_amount || 0));
      setLicense(groupBySelect(endData.motors));
    }
  }, [endData, late_fee_amount]);

  const onFinish = async () => {
    // Xử lý hoàn tất thanh toán
    resetModal()
  };

  const resetModal = () => {
    setIsEndModalOpen(false);
    setEndData(null);
    setLicense([]);
    setRemainingAmount(null);
    setExpired_hours(0);
    setLate_fee_amount(0);
    setSelectedItems([]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSelect = (value) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = [...prevSelectedItems, value];
      setNumberItems(newSelectedItems.length);
      return newSelectedItems;
    });
  };

  const handleDeselect = (value) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = prevSelectedItems.filter((item) => item !== value);
      setNumberItems(newSelectedItems.length);
      return newSelectedItems;
    });
  };

  useEffect(() => {
    // Tính tổng phí quá giờ
    let totalLateFee = 0;
    selectedItems.forEach((itemId) => {
      const motor = endData.motors.find((item) => item._id === itemId);
      if (motor) {
        const lateFeeForThisMotor = motor.priceH * expired_hours;
        totalLateFee += lateFeeForThisMotor;
      }
    });
    setLate_fee_amount(totalLateFee);
  }, [expired_hours, selectedItems]);

  const handleDateChange = (date, dateString, id) => {
    setEndDates(prevValues => ({
      ...prevValues,
      [id]: date ? dateString : dayjs()
    }));
  };

  return (
    <>
      <Modal
        title="Hoàn tất hợp đồng thuê xe"
        open={isEndModalOpen}
        onOk={onFinish}
        onCancel={resetModal}
        maskClosable={false}
        width={"fit-content"}
      >
        <Space
          direction="vertical"
          size="small"
          style={{
            display: 'flex',
          }}
        >
          <Card hoverable style={{ cursor: "default" }} >
            <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
              <Col><span style={{ fontWeight: 500 }}>Ngày hoàn tất hợp đồng :</span></Col>
              <Col><DatePicker format={"HH giờ DD/MM/YYYY"} defaultValue={dayjs()} showTime={{ format: 'HH' }} /></Col>
            </Row>
          </Card>
          <Card hoverable style={{ cursor: "default" }} >
            <Space
              direction="vertical"
              size="small"
              style={{
                display: 'flex',
              }}
            >
              <Row gutter={[8, 8]} justify="left" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Tên khách hàng :</span></Col>
                <Col>
                  <span style={{ fontWeight: 550 }}>{endData?.guest_id?.name}</span>
                </Col>
              </Row>
              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Tổng phí thuê :</span></Col>
                <Col>
                  <span style={{ fontWeight: 550 }}>{formatCurrency(endData?.amount)}</span>
                </Col>
              </Row>
              <Row gutter={[8, 8]} justify="end" wrap={true} align={"middle"}>
                <Col>
                  {endData?.motors?.map((item) => (
                    <div key={item._id} style={{ fontWeight: 450, display: "flex", gap: 10 }}>
                      <DatePicker
                        format={"HH giờ DD/MM/YYYY"}
                        defaultValue={dayjs()}
                        showTime={{ format: 'HH' }}
                        size="small"
                        onChange={(date, dateString) => handleDateChange(date, dateString, item._id)}
                      />
                      <span>{item.brand} {<Tag color="blue">{item.license}</Tag>}
                        {<Tag bordered={true} color="volcano">
                          {calculateRentalDays(item.start_date, item.end_date)} Ngày
                        </Tag>}:
                      </span>
                      <span style={{ fontWeight: 550 }}>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </Col>
              </Row>
              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 15, color: '#1b8aff' }}>Tổng phải thu :</span>
                </Col>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 20, color: "#1b8aff" }}>{formatCurrency(endData?.amount)}</span>
                </Col>
              </Row>

              {endData?.discount ? (
                <Row gutter={[8, 8]} justify="space-between" wrap={true} align="middle">
                  <Col>
                    <span style={{ fontWeight: 500 }}>Giảm giá :</span>
                  </Col>
                  <Col>
                    <span style={{ fontWeight: 550 }}>{formatCurrency(endData?.discount)}</span>
                  </Col>
                </Row>
              ) : ""}


              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Khách đã thanh toán :</span></Col>
                <Col>
                  <span style={{ fontWeight: 550 }}>{formatCurrency(endData?.deposit)}</span>
                </Col>
              </Row>

              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Phí quá hạn :</span></Col>
                <Col>
                  <span style={{ fontWeight: 550 }}>
                    {formatCurrency(late_fee_amount)}
                  </span>
                </Col>
              </Row>

              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 15, color: '#17c653' }}>Còn phải thu :</span>
                </Col>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 20, color: '#17c653' }}>
                    {
                      formatCurrency(remainingAmount)
                    }
                  </span>
                </Col>
              </Row>
            </Space>
          </Card>


          <Card hoverable style={{ cursor: "default" }} >
            <Space
              direction="vertical"
              size="small"
              style={{
                display: 'flex',
              }}
            >
              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Số giờ quá hạn :</span></Col>
                <Col>
                  <InputNumber
                    style={{ width: 50 }}
                    min={0}
                    controls={false}
                    formatter={value => value.replace(/\D/g, '')} // Chỉ cho phép nhập số
                    parser={value => value.replace(/\D/g, '')} // Loại bỏ các ký tự không phải là số
                    defaultValue={expired_hours}
                    onChange={(value) => setExpired_hours(value)}
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="Chọn xe quá giờ"
                    onSelect={(value) => handleSelect(value)}
                    onDeselect={(value) => handleDeselect(value)}
                    options={license}
                    style={{ minWidth: 160 }}
                    mode="multiple"
                  />
                </Col>
              </Row>

              {endData?.discount ? "" : (
                <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                  <Col>
                    <span style={{ fontWeight: 500 }}>Giảm giá :</span>
                  </Col>
                  <Col>
                    <InputNumber
                      addonAfter={<b>đ</b>}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                      step={1} // Bước nhảy
                      controls={false}
                      style={{ width: "100%" }}
                      //onChange={handleChangeDiscount}
                      disabled={endData?.discount ? true : false}
                      value={endData?.discount ? endData?.discount : ""}
                    />
                  </Col>
                </Row>
              )}

              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Khách thanh toán :</span></Col>
                <Col>
                  <InputNumber
                    addonAfter={<b>đ</b>}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                    step={1} // Bước nhảy
                    controls={false}
                    style={{ width: "100%" }}
                  //onChange={handleChangeDiscount}
                  //value={discount}
                  />
                </Col>
              </Row>
              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col><span style={{ fontWeight: 500 }}>Hình thức thanh toán :</span></Col>
                <Col>
                  <Select
                    placeholder="Chọn thanh toán"
                    value={endData?.method}
                    //onSelect={(value) => setMethod(value)}
                    allowClear
                    options={[
                      { value: "tiền mặt", label: "Tiền mặt" },
                      { value: "Chuyển khoản", label: "Chuyển khoản" },
                    ]}
                  />
                </Col>
              </Row>
            </Space>
          </Card>
        </Space>
      </Modal>
    </>
  );
};

export default EndBookingModal;
