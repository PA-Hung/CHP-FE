import { Button, Card, Popconfirm, Table, Tag, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import MotorSearchModal from './motor.search.modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMotor } from '@/redux/slice/motorSlice';
import queryString from "query-string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const MotorTable = (props) => {
    const { listMotorsSelected, setListMotorsSelected, total, setTotal } = props
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const loading = useSelector((state) => state.motor.isFetching);
    const meta = useSelector((state) => state.motor.meta);
    const listMotors = useSelector((state) => state.motor.result);
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState(null);

    const calculateRentalDays = (startDate, endDate) => {
        const start = startDate ? dayjs(startDate) : dayjs();
        const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
        return end.diff(start, 'hour');
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    useEffect(() => {
        if (listMotorsSelected) {
            setTotal(listMotorsSelected.reduce((sum, item) => sum + parseInt(item.price * calculateRentalDays(item.start_date, item.end_date), 10), 0))
        }
    }, [listMotorsSelected])

    const buildQuery = (
        params,
        sort,
        filter,
        page = meta.current,
        pageSize = meta.pageSize
    ) => {
        const clone = { ...params };
        if (clone.license) clone.license = `/${clone.license}/i`;
        if (clone.brand) clone.brand = `/${clone.brand}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.license) {
            sortBy = sort.license === "ascend" ? "sort=license" : "sort=-license";
        }
        if (sort && sort.brand) {
            sortBy = sort.brand === "ascend" ? "sort=brand" : "sort=-brand";
        }

        if (sort && sort.createdAt) {
            sortBy =
                sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy =
                sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-createdAt`;
        } else {
            temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
        }
        return temp;
    };

    useEffect(() => {
        const initData = async () => {
            if (searchValue) {
                const query = buildQuery(searchValue);
                dispatch(fetchMotor({ query }));
            } else {
                const query = buildQuery();
                dispatch(fetchMotor({ query }));
            }
        };
        initData();
    }, [meta.current, meta.pageSize]);

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



    const columns = [
        {
            // title: "Actions",
            width: 80,
            render: (record) => {
                return (
                    <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", paddingRight: 15, paddingLeft: 15 }}>

                        <EditOutlined style={{ fontSize: 20 }} />

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
                    <h4>{record.brand}</h4>
                    <Tag color="blue" style={{ fontWeight: 500 }}>{record.license}</Tag>
                </div>;
            },
        },
        {
            title: "Từ ngày",
            render: (_value, record) => {
                return <div>{dayjs.utc(record?.start_date).format("DD/MM/YYYY (HH:00)")}</div>;
            },
        },
        {
            title: "Đến ngày",
            render: (_value, record) => {
                return (
                    <div style={{ display: "flex", gap: 10 }}>
                        <div>
                            {dayjs.utc(record?.end_date).format("DD/MM/YYYY (HH:00)")}
                        </div>
                        <div>
                            {<Tag bordered={true} color="volcano">
                                {calculateRentalDays(record?.start_date, record?.end_date)} giờ
                            </Tag>}
                        </div>
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
                        {formatCurrency(record?.price * calculateRentalDays(record?.start_date, record?.end_date))}
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
                        <div><h2>Danh sách xe</h2></div>
                        <div>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={() => setIsSearchModalOpen(true)}
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
                                summary={pageData => {
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
