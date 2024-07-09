import { Button, Card, DatePicker, Popconfirm, Switch, Table, Tag, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import MotorSearchModal from './motor.search.modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMotor } from '@/redux/slice/motorSlice';
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const MotorTable = (props) => {
    const { listMotorsSelected, setListMotorsSelected, total, setTotal, setSearchValue, buildQuery, contractType } = props
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const listMotors = useSelector((state) => state.motor.result);
    const dispatch = useDispatch();

    const calculateRentalDays = (startDate, endDate) => {
        const start = startDate ? dayjs(startDate) : dayjs();
        const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
        return end.diff(start, 'day');
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    useEffect(() => {
        if (contractType === "Thuê theo ngày") {
            if (listMotorsSelected) {
                const total = listMotorsSelected.reduce((sum, item) => sum + parseInt(item.priceD * calculateRentalDays(item.start_date, item.end_date), 10), 0)
                setTotal(total)
            }
        }
    }, [listMotorsSelected])


    const onSearch = async (value) => {
        let filteredData = {};
        const input = value.trim(); // Xóa khoảng trắng đầu cuối của chuỗi nhập vào
        const isNumeric = /^\d+$/.test(input);

        if (isNumeric) {
            filteredData.license = input; // Tìm theo license nếu là số
        } else {
            filteredData.brand = input; // Tìm theo brand nếu không phải là số
        }

        setSearchValue(filteredData);
        const query = buildQuery(filteredData);
        dispatch(fetchMotor({ query }));
    };

    const reloadTable = () => {
        const query = buildQuery();
        dispatch(fetchMotor({ query }));
        setSearchValue(null)
    };

    const confirmDelete = async (deleteMotors) => {
        const newlistMotors = listMotorsSelected.filter(item => item._id !== deleteMotors._id);
        if (newlistMotors) {
            message.success("Xoá xe thành công !");
            setListMotorsSelected(newlistMotors)
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Không thể xoá xe này",
            });
        }
    };

    const handleSwitchChange = (id, value) => {
        const newlistMotors = listMotorsSelected.map((item) => {
            if (item._id === id) {
                return { ...item, rental_status: value, status: value === true ? "Đã nhận xe" : "Chưa nhận xe" };
            }
            return item;
        });
        setListMotorsSelected(newlistMotors);
    };

    const handleChangeStartDate = (id, value) => {
        const newlistMotors = listMotorsSelected.map((item) => {
            if (item._id === id) {
                return { ...item, start_date: value };
            }
            return item;
        });
        setListMotorsSelected(newlistMotors);
    };

    const handleChangeEndDate = (id, value) => {
        const newlistMotors = listMotorsSelected.map((item) => {
            if (item._id === id) {
                return { ...item, end_date: value };
            }
            return item;
        });
        setListMotorsSelected(newlistMotors);
    };

    const columns = [
        {
            // title: "Actions",
            width: 80,
            render: (record) => {
                return (
                    <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", paddingRight: 15, paddingLeft: 15 }}>
                        <Popconfirm
                            title={`Bạn muốn xoá xe ${record.license} ra khỏi hợp đồng ?`}
                            onConfirm={() => confirmDelete(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ fontSize: 20 }} />
                        </Popconfirm>
                    </div>
                );
            },
        },
        {
            title: "Tên xe",
            dataIndex: "code",
            key: "code",
            render: (_value, record) => {
                return <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ fontWeight: 550 }}>{record.brand}</div>
                    <Tag color="blue" style={{ fontWeight: 500 }}>{record.license}</Tag>
                    <Switch
                        checkedChildren="Đã nhận xe"
                        unCheckedChildren="Chưa nhận xe"
                        defaultChecked={dayjs(record.rental_status)}
                        onChange={(value) => handleSwitchChange(record._id, value)}
                    />
                </div>;
            },
        },
        {
            title: "Bắt đầu",
            render: (_value, record) => {
                return <div>
                    <DatePicker
                        size="small"
                        format={"HH:mm giờ DD/MM/YYYY"}
                        defaultValue={dayjs(record?.start_date)}
                        showTime={{ format: 'HH:mm giờ' }} // Chỉ hiển thị giờ
                        onChange={(value) => handleChangeStartDate(record?._id, value)}
                    />
                </div>;
            },
        },
        {
            title: "Kết thúc",
            render: (_value, record) => {
                return (
                    <div >
                        <DatePicker
                            size="small"
                            format={"HH:mm giờ DD/MM/YYYY"}
                            defaultValue={dayjs(record?.end_date)}
                            showTime={{ format: 'HH:mm giờ' }} // Chỉ hiển thị giờ
                            onChange={(value) => handleChangeEndDate(record?._id, value)}
                        />
                    </div>
                )
            },
        },
        {
            title: "Thời gian thuê",
            render: (_value, record) => {
                return (
                    <div>
                        {<Tag bordered={true} color="volcano">
                            {calculateRentalDays(record?.start_date, record?.end_date)} ngày
                        </Tag>}
                    </div>
                )
            },
        },


        {
            title: "Tiền thuê",
            width: 200,
            render: (_value, record) => {
                return (
                    <div style={{ fontWeight: 600 }}>
                        {formatCurrency(record?.priceD * calculateRentalDays(record?.start_date, record?.end_date))}
                    </div>
                )
            },
        },
    ];


    return (
        <>
            <div>
                <Card
                    style={{ cursor: "default", marginTop: 5 }}
                    hoverable
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 25, fontWeight: 550 }}>Danh sách xe</div>
                        <div>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={() => { setIsSearchModalOpen(true), reloadTable() }}
                            >Chọn xe</Button>
                        </div>
                    </div>

                    <div style={{ paddingTop: 20 }}>
                        <div>
                            <Table
                                size="small"
                                scroll={{ x: true }}
                                columns={columns}
                                dataSource={listMotorsSelected}
                                rowKey={"_id"}
                                bordered={true}
                                pagination={false}
                                summary={() => {
                                    return (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell colSpan={4}>
                                                <div style={{ textAlign: "right", fontWeight: 600 }}>Tổng :</div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <div style={{ fontWeight: 600 }}>
                                                    {formatCurrency(total)}
                                                </div>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <MotorSearchModal
                isSearchModalOpen={isSearchModalOpen}
                setIsSearchModalOpen={setIsSearchModalOpen}
                listMotors={listMotors}
                listMotorsSelected={listMotorsSelected}
                setListMotorsSelected={setListMotorsSelected}
                onSearch={onSearch}
                reloadTable={reloadTable}
            />
        </>
    )
}

export default MotorTable
