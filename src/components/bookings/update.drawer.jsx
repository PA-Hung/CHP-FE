import { notification, message, Row, Col, Drawer, Space, Button } from "antd";
import { GuestCard } from "./create.module/guest/guest.card";
import MotorTable from "./create.module/motor/motor.table";
import { SalesManCard } from "./create.module/guest/salesman.card";
import BillingCard from "./create.module/billing.infomation/billing.card";
import { useEffect, useState } from "react";
import { updateBooking } from "@/utils/api";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMotor } from '@/redux/slice/motorSlice';
import queryString from "query-string";

const UpdateDrawer = (props) => {
  const { reloadTable, isUpdateDrawerOpen, setIsUpdateDrawerOpen, updateData, setUpdateData } = props;
  const [salesman, setSalesMan] = useState(null)
  const [guestData, setGuestData] = useState(null);
  const [listMotorsSelected, setListMotorsSelected] = useState([])
  const meta = useSelector((state) => state.motor.meta);
  const dispatch = useDispatch();
  const [deposit, setDeposit] = useState("")
  const [discount, setDiscount] = useState("")
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState()
  const [method, setMethod] = useState()
  const [checkedBox, setCheckedBox] = useState("nodiscount");
  const [searchValue, setSearchValue] = useState(null);
  const [commission, setCommission] = useState("")

  useEffect(() => {
    if (isUpdateDrawerOpen && updateData) {
      setSalesMan(updateData.user_id || null);
      setGuestData(updateData.guest_id || null);
      setDiscount(updateData.discount || "");
      setDeposit(updateData.deposit || "");
      setTotal(updateData.total || "");
      setAmount(updateData.amount || "");
      setMethod(updateData.method || null);
      setListMotorsSelected(updateData.motors || []);
      setCommission(updateData.commission || "");
      setDeposit(updateData.deposit || "")
      setDiscount(updateData.discount || "")
      setAmount(updateData.amount || "")
    }
  }, [isUpdateDrawerOpen, updateData]);

  const resetDrawer = () => {
    setSalesMan(null)
    setGuestData(null)
    setDiscount(null)
    setDeposit(null)
    setTotal("")
    setAmount("")
    setMethod(null)
    setListMotorsSelected([])
    setCheckedBox("nodiscount")
    const query = buildQuery();
    dispatch(fetchMotor({ query }));
    setIsUpdateDrawerOpen(false);
    setCommission("")
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

    const data = {
      _id: updateData._id,
      motors: listMotorsSelected,
      guest_id: guestData?._id,
      user_id: salesman,
      commission: commission,
      status: "Hợp đồng mở",
      method: method,
      discount: discount,
      deposit: deposit,
      amount: discount ? amount : total
    }


    const res = await updateBooking(data);
    if (res.data) {
      reloadTable();
      message.success("Cập nhật hợp đồng thành công !");
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
        title={`Cập nhật hợp đồng`}
        placement="right"
        width="100%"
        onClose={resetDrawer}
        open={isUpdateDrawerOpen}
        extra={
          <Space>
            <Button onClick={resetDrawer}>Đóng</Button>
            <Button type="primary" onClick={onFinish}>
              Cập nhật
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
                  amount={amount}
                  setAmount={setAmount}
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

export default UpdateDrawer;
