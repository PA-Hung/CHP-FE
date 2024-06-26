import { Card, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { getUsers } from "@/utils/api";
dayjs.locale("vi");

export const SalesManCard = (props) => {
  const { setSalesMan, salesman, commission, setCommission } = props
  const [listUser, SetListUser] = useState([]);

  const groupBySelect = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
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
            </div>
          }
        />
      </Card>
    </div>
  );
};

