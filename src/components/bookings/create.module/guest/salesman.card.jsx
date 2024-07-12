import { Card, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { getUsers } from "@/utils/api";
dayjs.locale("vi");
import { formatCurrency } from "@/utils/api";

export const SalesManCard = (props) => {
  const { setSalesMan, salesman, listMotorsSelected, contractType, totalCommission, setTotalCommission, commission, setCommission } = props
  const [listUser, SetListUser] = useState([]);

  const groupBySelect = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
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


  useEffect(() => {
    const init = async () => {
      const res = await getUsers(`current=1&pageSize=100`);
      if (res.data?.result) {
        SetListUser(groupBySelect(res.data?.result));
      }
    };
    init();
  }, []);

  const calculateTotalCommissionByHours = () => {
    const total = listMotorsSelected.reduce((acc, motor) => {
      const rentalTime = calculateRentalHours(motor.start_date, motor.end_date);
      const motorCommission = (rentalTime * commission);
      return acc + motorCommission;
    }, 0);
    setTotalCommission(total);
  };

  const calculateTotalCommissionByDay = () => {
    const total = listMotorsSelected.reduce((acc, motor) => {
      const rentalTime = calculateRentalDays(motor.start_date, motor.end_date);
      const motorCommission = (rentalTime * commission);
      return acc + motorCommission;
    }, 0);
    setTotalCommission(total);
  };

  useEffect(() => {
    if (contractType === "Thuê theo ngày") {
      calculateTotalCommissionByDay();
    }
    if (contractType === "Thuê theo giờ") {
      calculateTotalCommissionByHours()
    }
  }, [listMotorsSelected, commission]);

  const { Meta } = Card;

  return (
    <div style={{ width: "100%" }}>
      <Card
        style={{ margin: 5, cursor: "default" }}
        cover={
          <div style={{ textAlign: "center", paddingTop: 20, fontSize: 25, fontWeight: 550 }}>
            Nhân viên
          </div>
        }
        hoverable
      >
        <Meta
          description={
            <>
              <div style={{ display: "flex", flexDirection: 'column', gap: 10 }}>
                <Select
                  size="large"
                  placeholder="Chọn nhân viên"
                  allowClear
                  value={salesman}
                  options={listUser}
                  onSelect={(value) => { setSalesMan(value) }}
                />
                <InputNumber
                  size="large"
                  placeholder="Tiền hoa hồng"
                  onChange={(e) => setCommission(e)}
                  addonAfter={<b>đ</b>}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                  step={1} // Bước nhảy
                  controls={false}
                  value={commission}
                />
                <div style={{ fontWeight: 600, fontSize: 16, color: "black" }}>
                  Tiền hoa hồng : <span style={{ color: "red" }}>{formatCurrency(totalCommission)}</span>
                </div>
              </div>
            </>
          }
        />
      </Card>
    </div>
  );
};

