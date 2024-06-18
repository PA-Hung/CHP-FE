import { notification, message, Row, Col, Drawer, Space, Button, Form } from "antd";
import { GuestCard } from "./create.module/guest/guest.card";
import { StatusCard } from "./create.module/guest/status.card";
import MotorTable from "./create.module/motor/motor.table";
import { SalesManCard } from "./create.module/guest/salesman.card";
import BillingCard from "./create.module/billing.infomation/billing.card";
import { useState } from "react";
import dayjs from "dayjs";
import { postCreateBooking } from "@/utils/api";

const CreateDrawer = (props) => {
  const { reloadTable, isCreateDrawerOpen, setIsCreateDrawerOpen } = props;
  const [salesman, setSalesMan] = useState(null)
  const [status, setStatus] = useState(null)
  const [guestData, setGuestData] = useState(null);
  const [listMotorsSelected, setListMotorsSelected] = useState([])

  const [deposit, setDeposit] = useState("")
  const [discount, setDiscount] = useState("")
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState()
  const [method, setMethod] = useState()
  const [checkedBox, setCheckedBox] = useState("nodiscount");

  const [form] = Form.useForm();

  const resetDrawer = () => {
    setIsCreateDrawerOpen(false);
    setStatus(null)
    setSalesMan(null)
    setGuestData(null)
    setDiscount(null)
    setDeposit(null)
    setTotal("")
    setAmount("")
    setMethod(null)
    setListMotorsSelected([])
    setCheckedBox("nodiscount")
    form.resetFields();
  };

  const onFinish = async () => {
    if (!guestData) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: "Bạn phải chọn khách hàng",
      });
      return
    }
    if (listMotorsSelected.length === 0) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: "Bạn phải chọn xe",
      });
      return
    }
    if (!salesman) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: "Bạn phải chọn nhân viên bán hàng",
      });
      return
    }
    if (!method) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: "Bạn phải chọn phương thức thanh toán",
      });
      return
    }
    if (!status) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: "Bạn phải chọn trạng thái hợp đồng",
      });
      return
    }
    const data = {
      start_date: dayjs(),
      motors: listMotorsSelected,
      guest_id: guestData?._id,
      user_id: salesman,
      status: status,
      method: method,
      discount: discount,
      deposit: deposit,
      amount: discount ? amount : total
    }
    setIsCreateDrawerOpen(false);

    const res = await postCreateBooking(data);
    if (res.data) {
      reloadTable();
      message.success("Tạo mới hợp đồng thành công !");
      resetDrawer();
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
      <Drawer
        title={`Tạo mới hợp đồng`}
        placement="right"
        width="100%"
        onClose={resetDrawer}
        open={isCreateDrawerOpen}
        extra={
          <Space>
            <Button onClick={resetDrawer}>Đóng</Button>
            <Button type="primary" onClick={onFinish}>
              Thêm mới
            </Button>
          </Space>
        }
        style={{ color: "black" }}
      >
        <Row gutter={[20, 20]} wrap={false}>
          <Col flex="350px">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <GuestCard
                setGuestData={setGuestData}
                guestData={guestData}
              />
              <StatusCard
                setStatus={setStatus}
                status={status}
              />
              <SalesManCard
                setSalesMan={setSalesMan}
                salesman={salesman}
              />
            </div>
          </Col>
          <Col flex="auto" >
            <div style={{ display: "flex", flexDirection: 'column', gap: 20 }}>
              <div>
                <MotorTable
                  listMotorsSelected={listMotorsSelected}
                  setListMotorsSelected={setListMotorsSelected}
                  total={total}
                  setTotal={setTotal}
                />
              </div>
              <div>
                <BillingCard
                  total={total}
                  deposit={deposit}
                  setDeposit={setDeposit}
                  discount={discount}
                  setDiscount={setDiscount}
                  amount={amount}
                  setAmount={setAmount}
                  method={method}
                  setMethod={setMethod}
                  form={form}
                  checkedBox={checkedBox}
                  setCheckedBox={setCheckedBox}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default CreateDrawer;
