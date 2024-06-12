import { Modal, Input, notification, Form, message, Row, Col, Drawer, Space, Button } from "antd";
import { postApartment } from "@/utils/api";

const CreateDrawer = (props) => {
  const { reloadTable, isCreateDrawerOpen, setIsCreateDrawerOpen } = props;
  const [form] = Form.useForm();

  const resetDrawer = () => {
    setIsCreateDrawerOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    //console.log("values", values);
    const data = values; // viết gọn của 2 dòng trên
    const res = await postApartment(data);
    if (res.data) {
      reloadTable();
      message.success("Tạo mới căn hộ thành công !");
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
            <Button type="primary" onClick={resetDrawer}>
              Thêm mới
            </Button>
          </Space>
        }
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};

export default CreateDrawer;
