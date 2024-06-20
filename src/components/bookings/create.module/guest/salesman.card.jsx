import { Card, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { getUsers } from "@/utils/api";
dayjs.locale("vi");

export const SalesManCard = (props) => {
  const { setSalesMan, salesman } = props
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
            <Select
              style={{ width: "100%", height: 50, fontWeight: 600 }}
              placeholder="Chọn nhân viên"
              allowClear
              value={salesman}
              options={listUser}
              onSelect={(value) => setSalesMan(value)}
            />
          }
        />
      </Card>
    </div>
  );
};

