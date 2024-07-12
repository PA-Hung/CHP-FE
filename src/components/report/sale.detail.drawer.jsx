import { Button, Drawer, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatCurrency } from "@/utils/api";
import dayjs from "dayjs";


const SaleDetailDrawer = (props) => {
    const { isSaleDetailDrawer, setIsSaleDetailDrawer, dataDetail, searchSaleValue } = props;
    const [totalCommission, setTotalCommission] = useState(0)

    const resetDrawer = () => {
        setIsSaleDetailDrawer(false);
    };

    const calculateTotalCommission = () => {
        const total = dataDetail?.payments?.reduce((acc, payment) => {
            const paymentCommission = payment?.commission;
            return acc + paymentCommission;
        }, 0);
        setTotalCommission(total);
    };

    useEffect(() => {
        calculateTotalCommission()
    }, [dataDetail]);

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
            title: "Số hợp đồng",
            dataIndex: "payment_date",
            width: 100,
            render: (_value, record) => {
                return <div style={{ fontWeight: 550 }}>{record?._id}</div>;
            },
        },
        {
            title: "Khách hàng",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550, color: "blueviolet" }}>{record?.guest.name}</div>;
            },
        },
        {
            title: "Loại hợp đồng",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550 }}>{record?.contract_type}</div>;
            },
        },
        {
            title: "Doanh thu",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550, color: "blueviolet" }}>{formatCurrency(record?.paid)}</div>;
            },
        },
        {
            title: "Hoa hồng",
            render: (_value, record) => {
                return <div style={{ fontWeight: 550, color: "blueviolet" }}>{formatCurrency(record?.commission)}</div>;
            },
        },
    ];

    return (
        <>
            <Drawer
                title={`Báo cáo chi tiết`}
                placement="right"
                width="70%"
                onClose={resetDrawer}
                open={isSaleDetailDrawer}
                style={{ color: "black" }}
                footer={
                    <Space style={{ float: 'right' }}>
                        <Button type="primary" onClick={resetDrawer}>Đóng</Button>
                    </Space>
                }
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 600, fontSize: 20 }}>Báo cáo kinh doanh chi tiết theo nhân viên</p>
                        <p style={{ fontWeight: 600 }}>Nhân viên : <span style={{ color: "blue" }}>{dataDetail?.user[0]?.name}</span> - từ ngày : {dayjs(searchSaleValue?.start_date).format("DD/MM/YYYY")} đến ngày : {dayjs(searchSaleValue?.end_date).format("DD/MM/YYYY")}</p>
                    </div>
                    <Table
                        size="large"
                        width={"100%"}
                        scroll={{ x: true }}
                        columns={columns}
                        dataSource={dataDetail?.payments}
                        rowKey={"_id"}
                        bordered={false}
                        pagination={false}
                        summary={() => {
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={4}>
                                        <div style={{ textAlign: "right", fontWeight: 550 }}>Tổng :</div>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <div style={{ fontWeight: 550, color: "red" }}>
                                            {formatCurrency(dataDetail?.totalPaid)}
                                        </div>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <div style={{ fontWeight: 550, color: "red" }}>
                                            {formatCurrency(totalCommission)}
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

export default SaleDetailDrawer