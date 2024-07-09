import { useEffect, useState } from "react";
import { Modal, notification, message, Row, Col, DatePicker, Card, Space, InputNumber, Select, Tag, Button } from "antd";
import dayjs from "dayjs";
import { postCreatePayment, updateBooking } from "@/utils/api";

const EndByH_BookingModal = (props) => {
  const { endData, setEndData, isEndByH_ModalOpen, setIsEndByH_ModalOpen, reloadTable, reloadTableCompleted } = props;
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [late_fee_amount, setLate_fee_amount] = useState(0); // Thêm trạng thái cho phí quá giờ tổng cộng
  const [endContractDate, setEndContractDate] = useState(dayjs())

  const [finalAmount, setFinalAmount] = useState(0);
  const [finalPayment, setFinalPayment] = useState(0);

  useEffect(() => {
    if (endData) {
      const amount = endData.amount || 0;
      const discount = endData.discount || 0;
      const deposit = endData.deposit || 0;
      setRemainingAmount(amount - discount - deposit + late_fee_amount);
      setFinalAmount((amount - discount - deposit - late_fee_amount - finalPayment))
    }
  }, [endData, late_fee_amount, finalPayment]);

  const onFinish = async () => {
    if (finalAmount > 0) {
      message.error("Bạn phải thanh toán đủ tiền !");
    }
    else {
      // Xử lý hoàn tất thanh toán
      const newMotors = endData.motors.map((item) => ({ ...item, status: "Đã trả xe" }));
      const bookingsData = {
        _id: endData._id,
        end_date: endContractDate,
        motors: newMotors,
        guest_id: endData.guest_id._id,
        user_id: endData.user_id,
        commission: endData.commission || 0,
        contract_status: "Hợp đồng đóng",
        method: endData.method,
        discount: endData.discount || 0,
        deposit: endData.deposit + finalPayment || 0,
        amount: endData.amount || 0,
        late_fee_amount: late_fee_amount,
        remaining_amount: (endData.amount + late_fee_amount) - (endData.discount + endData.deposit + finalPayment)
      }

      const paymentsData = {
        booking_id: endData._id,
        guest_id: endData.guest_id._id,
        user_id: endData.user_id,
        commission: endData.commission || 0,
        discount: endData.discount || 0,
        deposit: endData.deposit || 0,
        late_fee_amount: late_fee_amount,
        amount: endData.amount,
        paid: finalPayment,
        payment_date: endContractDate,
        payment_method: endData.method
      }

      const resPayments = await postCreatePayment(paymentsData);
      const resBookings = await updateBooking(bookingsData);
      if (resPayments.data && resBookings.data) {
        reloadTable();
        reloadTableCompleted();
        message.success("Hợp đồng hoàn tất !");
        resetModal()
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          placement: "top",
          description: resPayments.message,
        });
      }
    }
  };

  const resetModal = () => {
    setIsEndByH_ModalOpen(false);
    setEndData(null);
    setRemainingAmount(0);
    setLate_fee_amount(0);
    setFinalPayment(0)
    setFinalAmount(0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useEffect(() => {
    // Tính tổng phí quá giờ
    let totalLateFee = 0;
    endData?.motors?.forEach((motor) => {
      const hoursOverdue = calculateRentalHours(motor.end_date, endContractDate);
      let lateFeeForThisMotor = 0;

      if (hoursOverdue > 0 && hoursOverdue <= 5) {
        // Nếu thời gian quá hạn nằm trong khoảng 0 đến 5 giờ
        lateFeeForThisMotor = motor.overtime * hoursOverdue;
      } else if (hoursOverdue > 5) {
        // Nếu thời gian quá hạn lớn hơn 5 giờ, làm tròn thành ngày và nhân với priceD
        const daysOverdue = calculateRentalDays(motor.end_date, endContractDate);
        lateFeeForThisMotor = daysOverdue * motor.priceD;
      }

      totalLateFee += lateFeeForThisMotor;
    });
    setLate_fee_amount(totalLateFee);
  }, [endContractDate, endData]);

  const calculateRentalHours = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = dayjs(endDate);
    const diffInHours = end.diff(start, 'hour', true); // Sử dụng true để trả về số giờ có phần thập phân
    return Math.ceil(diffInHours); // Làm tròn lên
  };

  const calculateRentalDays = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = dayjs(endDate);
    const diffInDays = end.diff(start, 'day', true); // Sử dụng true để trả về số ngày có phần thập phân
    return Math.ceil(diffInDays); // Làm tròn lên
  };



  return (
    <>
      <Modal
        title="Hoàn tất hợp đồng thuê xe"
        open={isEndByH_ModalOpen}
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
              <Col><DatePicker
                format={"HH giờ DD/MM/YYYY"}
                defaultValue={dayjs()}
                showTime={{ format: 'HH' }}
                onChange={(date) => setEndContractDate(date)}
              /></Col>
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
                    <div key={item._id} style={{ fontWeight: 450, display: "flex", gap: 5 }}>
                      <span>{item.brand} {<Tag color="blue">{item.license}</Tag>}</span>
                      {dayjs.utc(item.start_date).format("h giờ (DD)")} - {dayjs.utc(item.end_date).format("h giờ (DD/MM/YYYY)")}
                      {<Tag bordered={true} color="volcano">
                        {calculateRentalHours(item.start_date, item.end_date)} giờ
                      </Tag>}:
                      <span style={{ fontWeight: 550 }}>{formatCurrency(item.priceH)}</span>
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
              <Row gutter={[8, 8]} justify="end" wrap={true} align={"middle"}>
                <Col>
                  {endData?.motors?.map((item) => (
                    <div key={item._id} style={{ fontWeight: 450, display: "flex", gap: 5 }}>
                      <span>{item.brand} {<Tag color="blue">{item.license}</Tag>}</span>quá hạn
                      {<Tag bordered={true} color="volcano">
                        {calculateRentalHours(item.end_date, endContractDate) > 0 ? calculateRentalHours(item.end_date, endContractDate) : 0} giờ</Tag>}
                      {calculateRentalHours(item.end_date, endContractDate) > 5 ? <>tính phí <Tag bordered={true} color="volcano">{calculateRentalDays(item.end_date, endContractDate)}ngày</Tag></> : ""} :
                      <span style={{ fontWeight: 550 }}>{formatCurrency(late_fee_amount)}</span>
                    </div>
                  ))}
                </Col>
              </Row>

              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 15, color: '#17c653' }}>Còn phải thu :</span>
                </Col>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 20, color: '#17c653' }}>
                    {formatCurrency(remainingAmount)}
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
                    onChange={(value) => setFinalPayment(value)}
                    value={finalPayment}
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

export default EndByH_BookingModal;
