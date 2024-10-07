import { Button, Drawer, Space, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatCurrency } from "@/utils/api";
import dayjs from "dayjs";

const OvertimeDetailDrawer = (props) => {
    const { isOvertimeDetailOpen, setIsOvertimeDetailOpen, overtimeDetailData } = props;
    const [late_fee_amount, setLate_fee_amount] = useState(0); // Thêm trạng thái cho phí quá giờ tổng cộng

    console.log('overtimeDetailData', overtimeDetailData);

    const resetDrawer = () => {
        setIsOvertimeDetailOpen(false);
    };

    const calculateRentalHours = (startDate, endDate) => {
        const start = startDate ? dayjs(startDate) : dayjs();
        const end = dayjs(endDate)
        return end.diff(start, 'hour'); // Thay đổi đơn vị từ 'day' sang 'hour'
    };

    const calculateRentalDays = (startDate, endDate) => {
        const start = startDate ? dayjs(startDate) : dayjs();
        const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
        return end.diff(start, 'day');
    }

    useEffect(() => {
        // Tính tổng phí quá giờ
        let totalLateFee = 0;
        overtimeDetailData?.motors?.forEach((motor) => {

            // Tính số giờ quá hạn
            const hoursLate = calculateRentalHours(motor.end_date, motor.late_time);

            // Tính phí quá hạn cho xe hiện tại
            const lateFeeForThisMotor = hoursLate > 0 ? (motor.overtime * hoursLate) : 0;

            // Cộng dồn phí quá hạn
            totalLateFee += lateFeeForThisMotor;
        });

        // Cập nhật phí quá hạn tổng cộng
        setLate_fee_amount(totalLateFee);
    }, [overtimeDetailData]);

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return <>{index + 1}</>;
            },
            hideInSearch: true,
        },
        {
            title: "Xe",
            width: 150,
            render: (_value, record) => {
                return <div style={{ fontWeight: 550 }}>{record?.brand} <Tag color="blue">{record.license}</Tag></div>;
            },
        },
        {
            title: "Thời gian thuê",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550, color: "blueviolet" }}>
                    {dayjs(record.start_date).format("HH:mm giờ DD")} - {dayjs(record.end_date).format("HH:mm giờ DD/MM/YY")} {<Tag bordered={true} color="volcano-inverse">
                        {calculateRentalDays(record.start_date, record.end_date)} ngày
                    </Tag>}
                </div>;
            },
        },
        {
            title: "Thời gian trả xe",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550, color: "blueviolet" }}>
                    {dayjs(record.late_time).format("HH:mm giờ DD/MM/YY")}
                </div>;
            },
        },
        {
            title: "Quá hạn",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550, color: "blueviolet" }}>
                    {<Tag bordered={true} color="volcano">
                        {calculateRentalHours(record.end_date, record.late_time) > 0 ?
                            calculateRentalHours(record.end_date, record.late_time) : 0} giờ
                    </Tag>}
                </div>;
            },
        },
        {
            title: "Phí quá hạn",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550 }}>
                    {formatCurrency(record.overtime * (calculateRentalHours(record.end_date, record.late_time) > 0 ?
                        calculateRentalHours(record.end_date, record.late_time) : 0))}
                </div>;
            },
        },
    ];

    return (
        <>
            <Drawer
                title={`Báo cáo chi tiết`}
                placement="right"
                width="50%"
                onClose={resetDrawer}
                open={isOvertimeDetailOpen}
                style={{ color: "black" }}
                footer={
                    <Space style={{ float: 'right' }}>
                        <Button type="primary" onClick={resetDrawer}>Đóng</Button>
                    </Space>
                }
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 20, textAlign: "center" }}>
                        Chi tiết phí quá hạn khách hàng <span style={{ color: "chocolate" }}>{overtimeDetailData?.guest_id?.name}</span>
                    </div>
                    <Table
                        size="large"
                        width={"100%"}
                        scroll={{ x: true }}
                        columns={columns}
                        dataSource={overtimeDetailData?.motors}
                        rowKey={"_id"}
                        bordered={false}
                        pagination={false}
                        summary={() => {
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={3}>
                                        <div style={{ textAlign: "right", fontWeight: 550 }}>Tổng :</div>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <div style={{ fontWeight: 550, color: "red" }}>
                                            {formatCurrency(late_fee_amount)}
                                        </div>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    />
                </div>
            </Drawer>
        </>
    )
}

export default OvertimeDetailDrawer