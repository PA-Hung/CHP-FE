import { notification, message, Row, Col, Drawer, Space, Button } from "antd";
import { GuestCard } from "./create.module/guest/guest.card";
import MotorTable from "./create.module/motor/motor.table";
import { SalesManCard } from "./create.module/guest/salesman.card";
import BillingCard from "./create.module/billing.infomation/billing.card";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { postCreateBooking } from "@/utils/api";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMotor } from '@/redux/slice/motorSlice';
import queryString from "query-string";

const CreateDrawer = (props) => {
  const { reloadTable, isCreateDrawerOpen, setIsCreateDrawerOpen } = props;
  const [salesman, setSalesMan] = useState(null)
  const [guestData, setGuestData] = useState(null);
  const [listMotorsSelected, setListMotorsSelected] = useState([])
  const meta = useSelector((state) => state.motor.meta);
  const dispatch = useDispatch();
  const [deposit, setDeposit] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [method, setMethod] = useState()
  const [checkedBox, setCheckedBox] = useState("nodiscount");
  const [searchValue, setSearchValue] = useState(null);
  const [commission, setCommission] = useState(0)
  const [late_fee_amount, setLate_fee_amount] = useState(0);

  const resetDrawer = () => {
    setSalesMan(null)
    setGuestData(null)
    setDiscount(0)
    setDeposit(0)
    setTotal(0)
    setMethod(null)
    setListMotorsSelected([])
    setCheckedBox("nodiscount")
    const query = buildQuery();
    dispatch(fetchMotor({ query }));
    setCommission(0)
    setIsCreateDrawerOpen(false);
  };

  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchMotor({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchMotor({ query }));
      }
    };
    initData();
  }, [meta.current, meta.pageSize]);

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (clone.license) clone.license = `/${clone.license}/i`;
    if (clone.brand) clone.brand = `/${clone.brand}/i`;
    if (!clone.hasOwnProperty('availability_status')) clone.availability_status = true;
    else clone.availability_status = `/${clone.availability_status}/i`;
    if (!clone.hasOwnProperty('rental_status')) clone.rental_status = false;
    else clone.rental_status = `/${clone.rental_status}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.license) {
      sortBy = sort.license === "ascend" ? "sort=license" : "sort=-license";
    }
    if (sort && sort.brand) {
      sortBy = sort.brand === "ascend" ? "sort=brand" : "sort=-brand";
    }
    if (sort && sort.availability_status) {
      sortBy = sort.brand === "ascend" ? "sort=availability_status" : "sort=-availability_status";
    }
    if (sort && sort.rental_status) {
      sortBy = sort.brand === "ascend" ? "sort=rental_status" : "sort=-rental_status";
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

    const newPay = total - discount - deposit;
    if (newPay < 0) {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: "Số tiền thanh toán cần phải lớn hơn hoặc bằng 0 !",
      });
      return
    }

    const data = {
      start_date: dayjs(),
      end_date: "",
      motors: listMotorsSelected,
      guest_id: guestData?._id,
      user_id: salesman,
      commission: commission,
      status: "Hợp đồng mở",
      method: method,
      discount: discount,
      deposit: deposit,
      late_fee_amount: late_fee_amount,
      remaining_amount: newPay || 0,
      amount: total
    }


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
              <SalesManCard
                setSalesMan={setSalesMan}
                salesman={salesman}
                commission={commission}
                setCommission={setCommission}
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
                  setSearchValue={setSearchValue}
                  buildQuery={buildQuery}
                />
              </div>
              <div>
                <BillingCard
                  total={total}
                  deposit={deposit}
                  setDeposit={setDeposit}
                  discount={discount}
                  setDiscount={setDiscount}
                  method={method}
                  setMethod={setMethod}
                  checkedBox={checkedBox}
                  setCheckedBox={setCheckedBox}
                  setSearchValue={setSearchValue}
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
