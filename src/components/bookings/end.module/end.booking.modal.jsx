import { useEffect, useState } from "react";
import { Modal, notification, message, Row, Col, DatePicker, Card, Space, InputNumber, Select, Tag } from "antd";
import dayjs from "dayjs";
import { postCreatePayment, updateBooking } from "@/utils/api";

const EndBookingModal = (props) => {
  const { endData, setEndData, isEndModalOpen, setIsEndModalOpen, reloadTable, reloadTableCompleted } = props;
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [late_fee_amount, setLate_fee_amount] = useState(0); // Thêm trạng thái cho phí quá giờ tổng cộng
  const [endContractDate, setEndContractDate] = useState(dayjs())
  const [methodPayment, setMethodPayment] = useState(null)

  const [finalAmount, setFinalAmount] = useState(0);
  const [finalPayment, setFinalPayment] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0)

  const [selectedEndDates, setSelectedEndDates] = useState({});

  const handleDateChange = (date, itemId) => {
    setSelectedEndDates((prev) => ({
      ...prev,
      [itemId]: date, // Lưu giá trị mới cho xe tương ứng
    }));
  };

  const calculateRentalDays = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
    return end.diff(start, 'day');
  };

  const calculateRentalHours = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = dayjs(endDate)
    return end.diff(start, 'hour'); // Thay đổi đơn vị từ 'day' sang 'hour'
  };

  const calculateTotalCommissionByDay = () => {
    const total = endData?.motors?.reduce((acc, motor) => {
      const rentalTime = calculateRentalDays(motor.start_date, motor.end_date);
      const motorCommission = (rentalTime * endData.commission);
      return acc + motorCommission;
    }, 0);
    setTotalCommission(total);
  };

  useEffect(() => {
    if (endData) {
      const amount = endData.amount || 0;
      const discount = endData.discount || 0;
      const deposit = endData.deposit || 0;
      const surcharge = endData.surcharge || 0;

      const calculatedRemainingAmount =
        amount - (discount + deposit + late_fee_amount + surcharge);

      setRemainingAmount(calculatedRemainingAmount);

      setFinalAmount(finalPayment - calculatedRemainingAmount); // Đảm bảo tính đúng
      setMethodPayment(endData.method);
    }
  }, [endData, late_fee_amount, finalPayment, isEndModalOpen]);


  useEffect(() => {
    calculateTotalCommissionByDay();
  }, [endData]);

  const onFinish = async () => {
    // console.log('số tiền ở ô hiển thị còn phải thu', remainingAmount);
    // console.log('số tiền khách nhập vào input thanh toán cuối cùng', finalPayment);
    // console.log('số tiền còn lại sau thanh toán, nếu là số dương thì thanh toán dư, nếu số âm thì thanh toán thiếu, dùng để kiểm tra thanh toán đủ hay chưa', finalAmount);
    if (finalAmount !== 0) {
      notification.error({
        message: "Bạn phải thu đúng số tiền còn phải thu !",
        placement: "top",
      });
    }
    else {
      // Xử lý hoàn tất thanh toán
      const newMotors = endData.motors.map((item) => (
        { ...item, status: "Đã trả xe", late_time: selectedEndDates[item._id] }
      ));
      const bookingsData = {
        _id: endData._id,
        end_date: endContractDate,
        motors: newMotors,
        guest_id: endData.guest_id._id,
        user_id: endData.user_id,
        commission: endData.commission || 0,
        contract_status: "Hợp đồng đóng",
        method: methodPayment,
        discount: endData.discount || 0,
        deposit: endData.deposit + finalPayment || 0,
        surcharge: endData.surcharge || 0,
        amount: endData.amount || 0,
        late_fee_amount: late_fee_amount,
        remaining_amount: (endData.amount + late_fee_amount) - (endData.discount + endData.deposit + finalPayment)
      }

      const paymentsData = {
        booking_id: endData._id,
        guest_id: endData.guest_id._id,
        user_id: endData.user_id,
        commission: totalCommission || 0,
        discount: endData.discount || 0,
        deposit: endData.deposit || 0,
        surcharge: endData.surcharge || 0,
        late_fee_amount: late_fee_amount,
        amount: endData.amount,
        paid: finalPayment,
        contract_type: endData.contract_type,
        payment_date: endContractDate,
        payment_method: methodPayment
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
    setIsEndModalOpen(false);
    setEndData(null);
    setRemainingAmount(0);
    setLate_fee_amount(0);
    setFinalPayment(0)
    setFinalAmount(0)
    setTotalCommission(0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useEffect(() => {
    // Tính tổng phí quá giờ
    let totalLateFee = 0;
    endData?.motors?.forEach((motor) => {

      // Tính số giờ quá hạn
      const hoursLate = calculateRentalHours(motor.end_date, selectedEndDates[motor._id]);

      // Tính phí quá hạn cho xe hiện tại
      const lateFeeForThisMotor = hoursLate > 0 ? (motor.overtime * hoursLate) : 0;

      // Cộng dồn phí quá hạn
      totalLateFee += lateFeeForThisMotor;
    });

    // Cập nhật phí quá hạn tổng cộng
    setLate_fee_amount(totalLateFee);
  }, [endData, selectedEndDates]);


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
          {/* <Card hoverable style={{ cursor: "default" }} >
            <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
              <Col><span style={{ fontWeight: 500 }}>Ngày hoàn tất hợp đồng :</span></Col>
              <Col>
                <DatePicker
                  disabled
                  style={{ width: 180 }}
                  format={"HH:mm giờ DD/MM/YYYY"}
                  defaultValue={dayjs()}
                  showTime={{ format: 'HH:mm' }}
                  onChange={(date) => setEndContractDate(date)}
                />
              </Col>
            </Row>
          </Card> */}
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

              <Row gutter={[8, 8]} justify="end" wrap={true} align={"middle"}>
                <Col>
                  {endData?.motors?.map((item) => (
                    <div key={item._id} style={{ fontWeight: 450, display: "flex", gap: 5 }}>
                      <span>{item.brand} {<Tag color="blue">{item.license}</Tag>}</span>
                      {dayjs.utc(item.start_date).format("HH:mm giờ (DD)")} - {dayjs.utc(item.end_date).format("HH:mm giờ (DD/MM/YYYY)")}
                      {<Tag bordered={true} color="volcano">
                        {calculateRentalDays(item.start_date, item.end_date)} Ngày
                      </Tag>}:
                      <span style={{ fontWeight: 550 }}>{formatCurrency(item.priceD)}</span>
                    </div>
                  ))}
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

              {endData?.surcharge ? (
                <Row gutter={[8, 8]} justify="space-between" wrap={true} align="middle">
                  <Col>
                    <span style={{ fontWeight: 500 }}>Phụ thu lễ :</span>
                  </Col>
                  <Col>
                    <span style={{ fontWeight: 550 }}>{formatCurrency(endData?.surcharge)}</span>
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
                <Col><span style={{ fontWeight: 500 }}>Tổng phí thuê :</span></Col>
                <Col>
                  <span style={{ fontWeight: 550 }}>{formatCurrency(endData?.amount)}</span>
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
                      {item.brand} {<Tag color="blue">{item.license}</Tag>}
                      <span>
                        <DatePicker
                          style={{ width: 180 }}
                          size="small"
                          format={"HH:mm giờ DD/MM/YYYY"}
                          defaultValue={dayjs(selectedEndDates[item._id])}
                          showTime={{ format: 'HH:mm' }}
                          onChange={(date) => handleDateChange(date, item._id)} // Cập nhật giá trị khi thay đổi
                        />
                      </span>
                      quá hạn
                      {<Tag bordered={true} color="volcano">
                        {calculateRentalHours(item.end_date, selectedEndDates[item._id]) > 0 ?
                          calculateRentalHours(item.end_date, selectedEndDates[item._id]) : 0} giờ
                      </Tag>}:
                      <span style={{ fontWeight: 550 }}>
                        {formatCurrency(item.overtime * (calculateRentalHours(item.end_date, selectedEndDates[item._id]) > 0 ?
                          calculateRentalHours(item.end_date, selectedEndDates[item._id]) : 0))}
                      </span>
                    </div>
                  ))}
                </Col>
              </Row>

              <Row gutter={[8, 8]} justify="space-between" wrap={true} align={"middle"}>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 15, color: '#1b8aff' }}>Còn phải thu :</span>
                </Col>
                <Col>
                  <span style={{ fontWeight: 550, fontSize: 20, color: '#1b8aff' }}>
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
                    value={methodPayment}
                    onSelect={(value) => setMethodPayment(value)}
                    allowClear
                    options={[
                      { value: "Tiền mặt", label: "Tiền mặt" },
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
