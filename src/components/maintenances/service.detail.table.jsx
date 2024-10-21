import React from 'react';
import { Button, Input, Popconfirm, Select, Table, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const ServiceDetailTable = (props) => {
    const { totalBill, setTotalBill, dataSource, setDataSource } = props

    const calculateTotalBill = (data) => {
        const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
        setTotalBill(total);
    };

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        calculateTotalBill(newData);
    };

    const handleAdd = () => {
        const newData = {
            key: uuidv4(),
            service: '',
            unit: '',
            quantity: 0,
            price: 0,
            total: 0,
            note: '',
        };
        setDataSource([...dataSource, newData]);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleFieldChange = (value, key, field) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => item.key === key);
        if (index > -1) {
            newData[index] = { ...newData[index], [field]: value };
            if (field === 'quantity' || field === 'price') {
                newData[index].total = (newData[index].quantity || 0) * (newData[index].price || 0);
            }
            setDataSource(newData);
            calculateTotalBill(newData);
        }
    };


    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'service',
            width: 200,
            render: (_value, record) => (
                <Select
                    style={{ width: 200 }}
                    placeholder="Chọn dịch vụ"
                    allowClear
                    options={[
                        { value: "Thay nhớt động cơ", label: "Thay nhớt động cơ" },
                        { value: "Thay bình acquy", label: "Thay bình acquy" },
                        { value: "Thay vỏ xe", label: "Thay vỏ xe" },
                        { value: "Khác", label: "Khác" },
                    ]}
                    value={record.service}
                    onChange={(value) => handleFieldChange(value, record.key, 'service')}
                />
            ),
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unit',
            width: 130,
            render: (_value, record) => (
                <Select
                    style={{ width: 130 }}
                    placeholder="Chọn đơn vị"
                    allowClear
                    options={[
                        { value: "Lần", label: "Lần" },
                        { value: "Bộ", label: "Bộ" },
                        { value: "Bình", label: "Bình" },
                        { value: "Cái", label: "Cái" },
                    ]}
                    value={record.unit}
                    onChange={(value) => handleFieldChange(value, record.key, 'unit')}
                />
            ),
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            width: 100,
            render: (_value, record) => (
                <InputNumber
                    style={{ width: 100, borderRadius: 8, fontWeight: "bold" }}
                    value={record.quantity}
                    onChange={(value) => handleFieldChange(value, record.key, 'quantity')}
                />
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            width: 220,
            render: (_value, record) => (
                <InputNumber
                    addonAfter={<b>đ</b>}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    step={1}
                    controls={false}
                    style={{ width: '100%' }}
                    value={record.price}
                    onChange={(value) => handleFieldChange(value, record.key, 'price')}
                />
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            width: 220,
            render: (_value, record) => (
                <div>{formatCurrency(record.total)}</div>
            ),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            render: (_value, record) => (
                <Input
                    style={{ width: '100%' }}
                    value={record.note}
                    onChange={(e) => handleFieldChange(e.target.value, record.key, 'note')}
                />
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            width: 50,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title="Bạn muốn xoá dịch vụ này?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <DeleteOutlined style={{ fontSize: 24 }} />
                        </div>
                    </Popconfirm>
                ) : null,
        },
    ];

    return (
        <>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3}>
                            <Button onClick={handleAdd} type="primary">
                                Thêm dịch vụ
                            </Button>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                            <div style={{ textAlign: 'left', fontWeight: 550 }}>Tổng :</div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                            <div style={{ fontWeight: 550, color: 'red' }}>{formatCurrency(totalBill)}</div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan={2} />
                    </Table.Summary.Row>
                )}
            />
        </>
    );
};

export default ServiceDetailTable;
