import { Input, notification, Form, message, Row, Col, Select, DatePicker, Drawer, Space, Button } from "antd";
import React, { useEffect, useState } from 'react'
import { updateMaintenance } from "@/utils/api";
import { getMotor, getUsers } from "@/utils/api";
import ServiceDetailTable from "./service.detail.table";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";

const UpdateDrawer = (props) => {
    const [form] = Form.useForm();
    const { isUpdateDrawerOpen, setIsUpdateDrawerOpen, reloadTable, listMaintenances, updateData } = props;
    const [motors, setMotors] = useState([]);
    const [users, setUsers] = useState([]);

    const [totalBill, setTotalBill] = useState(0);
    const [dataSource, setDataSource] = useState([
        {
            key: uuidv4(),
            service: '',
            unit: '',
            quantity: 0,
            price: 0,
            total: 0,
            note: '',
        },
    ]);

    const resetDrawer = () => {
        setIsUpdateDrawerOpen(false);
        form.resetFields();
        setTotalBill(0)
        setDataSource([{
            key: uuidv4(),
            service: '',
            unit: '',
            quantity: 0,
            price: 0,
            total: 0,
            note: '',
        }])
    };

    const groupBySelectMotors = (data) => {
        return data.map((item) => ({ value: item._id, label: `${item.brand} - ${item.license}` }));
    };
    const groupBySelectUsers = (data) => {
        return data.map((item) => ({ value: item._id, label: item.name }));
    };

    useEffect(() => {
        if (updateData) {
            const formatStartDate = dayjs(updateData.start_date).isValid()
                ? dayjs(updateData.start_date)
                : dayjs();
            const formatEndDate = dayjs(updateData.end_dat).isValid()
                ? dayjs(updateData.end_dat)
                : dayjs();
            form.setFieldsValue({
                motor: updateData.motor_id._id,
                user: updateData.user_id._id,
                start_date: formatStartDate,
                end_date: formatEndDate,
                supplier: updateData.supplier,
            });
            setDataSource(updateData.maintenance_list)
            setTotalBill(updateData.total_bill)
        }
    }, [updateData, isUpdateDrawerOpen])


    useEffect(() => {
        const initMotors = async () => {
            const res = await getMotor(`current=1&pageSize=100`);
            if (res.data?.result) {
                setMotors(groupBySelectMotors(res.data?.result));
            }
        };
        initMotors();
        const initUsers = async () => {
            const res = await getUsers(`current=1&pageSize=100`);
            if (res.data?.result) {
                setUsers(groupBySelectUsers(res.data?.result));
            }
        };
        initUsers();
    }, [listMaintenances]);

    const onFinish = async (values) => {
        const checkService = dataSource.map((item) => item.service.length > 0);
        const allServiceSelected = checkService.every((isSelected) => isSelected);
        if (!allServiceSelected) {
            return notification.error({
                message: "Bạn phải chọn tên dịch vụ!",
                placement: "top",
            });
        }

        const checkUnit = dataSource.map((item) => item.unit.length > 0);
        const allUnitSelected = checkUnit.every((isSelected) => isSelected);
        if (!allUnitSelected) {
            return notification.error({
                message: "Bạn phải chọn đơn vị!",
                placement: "top",
            });
        }

        const checkQuantity = dataSource.map((item) => item.quantity > 0);
        const allQuantitySelected = checkQuantity.every((isSelected) => isSelected);
        if (!allQuantitySelected) {
            return notification.error({
                message: "Bạn phải nhập số lượng!",
                placement: "top",
            });
        }

        const checkPrice = dataSource.map((item) => item.price > 0);
        const allPriceSelected = checkPrice.every((isSelected) => isSelected);
        if (!allPriceSelected) {
            return notification.error({
                message: "Bạn phải nhập giá dịch vụ!",
                placement: "top",
            });
        }

        const data = {
            _id: updateData?._id,
            motor_id: values.motor,
            user_id: values.user,
            start_date: values.start_date,
            end_date: values.end_date,
            supplier: values.supplier,
            note: values.note,
            total_bill: totalBill,
            maintenance_list: dataSource
        };

        const res = await updateMaintenance(data);
        if (res.data) {
            reloadTable();
            message.success("Cập nhật phiếu bảo trì thành công !");
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
                title={`Cập nhật phiếu bảo trì xe`}
                placement="right"
                width="80%"
                onClose={resetDrawer}
                open={isUpdateDrawerOpen}
                extra={
                    <Space>
                        <Button
                            onClick={resetDrawer}
                        >Đóng</Button>
                        <Button type="primary"
                            onClick={() => form.submit()}
                        >
                            Cập nhật
                        </Button>
                    </Space>
                }
            >
                <Form
                    name="update-maintenances"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <Row gutter={[8, 8]} justify="center" wrap={true}>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <Form.Item
                                style={{
                                    display: "inline-block",
                                    width: "100%",
                                    marginBottom: 0,
                                }}
                                label="Chọn xe"
                                name="motor"
                                rules={[{ required: true, message: "Bạn phải chọn xe cần bảo trì" }]}
                            >
                                <Select
                                    allowClear
                                    placeholder="Chọn xe cần bảo trì"
                                    options={motors}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <Form.Item
                                style={{ width: "100%" }}
                                label="Nhân viên phụ trách"
                                name="user"
                                rules={[{ required: true, message: "Chọn nhân viên phụ trách" }]}
                            >
                                <Select
                                    allowClear
                                    placeholder="Chọn nhân viên phụ trách"
                                    options={users}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <Form.Item
                                label="Ngày bắt đầu"
                                name="start_date"
                            >
                                <DatePicker
                                    placeholder="Chọn ngày"
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <Form.Item label="Ngày hoàn thành"
                                name="end_date"
                            >
                                <DatePicker
                                    placeholder="Chọn ngày"
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} justify="left" wrap={true}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item
                                style={{ width: "100%" }}
                                label="Đơn vị thực hiện"
                                name="supplier"
                                rules={[{ required: true, message: "Nhập đơn vị thực hiện" }]}
                            >
                                <Input placeholder="Tên và địa chỉ đơn vị thực hiện" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} justify="left" wrap={true}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <ServiceDetailTable
                                totalBill={totalBill}
                                setTotalBill={setTotalBill}
                                dataSource={dataSource}
                                setDataSource={setDataSource}
                            />
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}

export default UpdateDrawer