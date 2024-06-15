import { notification, message, Row, Col, Drawer, Space, Button } from "antd";
import { postApartment } from "@/utils/api";
import { GuestCard } from "./guest/guest.card";
import { StatusCard } from "./guest/status.card";
import MotorTable from "./motor/motor.table";
import { SalesManCard } from "./guest/salesman.card";
import BillingCard from "./billing.infomation/billing.card";
import { useState } from "react";
import dayjs from "dayjs";

const CreateDrawer = (props) => {
  const { reloadTable, isCreateDrawerOpen, setIsCreateDrawerOpen } = props;
  const [salesman, setSalesMan] = useState(null)
  const [status, setStatus] = useState(null)
  const [guestData, setGuestData] = useState(null);
  const [listMotorsSelected, setListMotorsSelected] = useState([])

  const [deposit, setDeposit] = useState(null)
  const [discount, setDiscount] = useState(null)
  const [amount, setAmount] = useState(null)
  const [total, setTotal] = useState()

  const resetDrawer = () => {
    setIsCreateDrawerOpen(false);
    setStatus(null)
    setSalesMan(null)
    setGuestData(null)
    setDiscount(null)
    setDeposit(null)
    setTotal(null)
    setAmount(null)
    setListMotorsSelected(null)
  };

  const onFinish = async (values) => {
    //console.log("values", values);
    // const data = values; // viết gọn của 2 dòng trên
    // const res = await postApartment(data);
    // if (res.data) {
    //   reloadTable();
    //   message.success("Tạo mới căn hộ thành công !");
    //   resetDrawer();
    // } else {
    //   notification.error({
    //     message: "Có lỗi xảy ra",
    //     placement: "top",
    //     description: res.message,
    //   });
    // }
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
        <Row gutter={[25, 0]} wrap>
          <Col flex="350px">
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
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
            <div style={{ display: "flex", flexDirection: 'column', gap: 15 }}>
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
