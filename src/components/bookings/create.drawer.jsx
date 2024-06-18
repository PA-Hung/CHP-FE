import { notification, message, Row, Col, Drawer, Space, Button } from "antd";
import { GuestCard } from "./guest/guest.card";
import { StatusCard } from "./guest/status.card";
import MotorTable from "./motor/motor.table";
import { SalesManCard } from "./guest/salesman.card";
import BillingCard from "./billing.infomation/billing.card";
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

  console.log('deposit', deposit);
  console.log('discount', discount);
  console.log('amount', amount);

  const resetDrawer = () => {
    setIsCreateDrawerOpen(false);
    setStatus(null)
    setSalesMan(null)
    setGuestData(null)
    setDiscount("")
    setDeposit("")
    setTotal("")
    setAmount("")
    setListMotorsSelected([])
  };

  const onFinish = async () => {
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
