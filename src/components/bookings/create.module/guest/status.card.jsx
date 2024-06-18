import { Card, Select } from "antd";

export const StatusCard = (props) => {
  const { setStatus, status } = props
  const { Meta } = Card;

  return (
    <div style={{ width: "100%" }}>
      <Card
        style={{ margin: 5, cursor: "default" }}
        cover={
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            <h2>Trạng thái</h2>
          </div>
        }
        hoverable
      >
        <Meta
          description={
            <Select
              style={{ width: "100%", height: 50, fontWeight: 600 }}
              placeholder="Chọn trạng thái"
              allowClear
              value={status}
              options={[
                { value: "Đã nhận xe", label: "Đã nhận xe" },
                { value: "Đã trả xe", label: "Đã trả xe" },
                { value: "Xe tai nạn", label: "Xe tai nạn" },
                { value: "Xe mất trộm", label: "Xe mất trộm" },
              ]}
              onSelect={(value) => setStatus(value)}
            />
          }
        />
      </Card>
    </div>
  );
};

