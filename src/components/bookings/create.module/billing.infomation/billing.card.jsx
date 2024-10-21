import { Card, Checkbox, Form, InputNumber, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import _ from 'lodash';

const BillingCard = (props) => {
    const { total, deposit, setDeposit, discount, setDiscount, method, setMethod, checkedBox, setCheckedBox, surcharge, setSurcharge } = props;
    const [pay, setPay] = useState(total); // Khởi tạo pay bằng tổng số tiền ban đầu

    const onChange = (e) => {
        setCheckedBox(e.target.name);
        if (e.target.name === "nodiscount") {
            setDiscount(0);
            setPay(total - deposit);
        }
    };

    useEffect(() => {
        if (discount) {
            setCheckedBox('discount')
        }
    }, [discount])

    const handleChangeDeposit = useCallback(_.debounce((value) => {
        setDeposit(value || 0);
        updatePay(total, discount, value || 0);
    }, 300), [total, discount]);

    const handleChangeDiscount = useCallback(_.debounce((value) => {
        setDiscount(value || 0);
        updatePay(total, value || 0, deposit);
    }, 300), [total, deposit]);

    const handleChangeSurcharge = useCallback(_.debounce((value) => {
        setSurcharge(value || 0);
        updatePay(total, value || 0, deposit);
    }, 300), [total, deposit]);

    const updatePay = useCallback(_.debounce((total, discount, deposit, surcharge) => {
        const newPay = total - discount - deposit + surcharge;
        setPay(newPay);
    }, 300), []);

    useEffect(() => {
        updatePay(total, discount, deposit, surcharge);
    }, [total, discount, deposit, surcharge]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div>
            <Card
                style={{ margin: 5, cursor: "default" }}
                cover={
                    <div style={{ textAlign: "left", paddingTop: 20, paddingLeft: 22, fontSize: 25, fontWeight: 550 }}>
                        Thông tin thanh toán
                    </div>
                }
                hoverable
            >
                <div style={{ display: "flex", gap: 50, paddingBottom: 20 }}>
                    <div>
                        <Checkbox onChange={onChange} checked={checkedBox === 'nodiscount'} name='nodiscount' >
                            <div style={{ fontWeight: 600, fontSize: 15 }}>Không giảm giá</div>
                        </Checkbox>
                    </div>
                    <div>
                        <Checkbox onChange={onChange} checked={checkedBox === 'discount'} name="discount">
                            <div style={{ fontWeight: 600, fontSize: 15 }}>Giảm theo số tiền</div>
                        </Checkbox>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                    <div>
                        <Select
                            style={{ width: 150 }}
                            size="middle"
                            placeholder="Chọn thanh toán"
                            value={method}
                            onSelect={(value) => setMethod(value)}
                            allowClear
                            options={[
                                { value: "Tiền mặt", label: "Tiền mặt" },
                                { value: "Chuyển khoản", label: "Chuyển khoản" },
                            ]}
                        />
                    </div>
                    {checkedBox === 'discount' && (
                        <div>
                            <Form.Item label="Giảm giá" style={{ fontWeight: 550 }}>
                                <InputNumber
                                    addonAfter={<b>đ</b>}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                                    step={1} // Bước nhảy
                                    controls={false}
                                    style={{ width: "100%" }}
                                    onChange={handleChangeDiscount}
                                    value={discount}
                                    size="middle"
                                />
                            </Form.Item>
                        </div>
                    )}
                    <div>
                        <Form.Item label="Đặt cọc" style={{ fontWeight: 550 }}>
                            <InputNumber
                                placeholder="Đặt cọc hoặc trả hết"
                                addonAfter={<b>đ</b>}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                                step={1} // Bước nhảy
                                style={{ width: "100%" }}
                                controls={false}
                                onChange={handleChangeDeposit}
                                value={deposit}
                                size="middle"
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item label="Phụ thu lễ" style={{ fontWeight: 550 }}>
                            <InputNumber
                                addonAfter={<b>đ</b>}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                                step={1} // Bước nhảy
                                style={{ width: "100%" }}
                                controls={false}
                                onChange={handleChangeSurcharge}
                                value={surcharge}
                                size="middle"
                            />
                        </Form.Item>
                    </div>
                </div>
                <div style={{ display: "flex", fontSize: 20, fontWeight: 700, marginTop: 20, gap: 6 }}>
                    <div>Số tiền khách phải thanh toán = </div>
                    <div style={{ color: "red" }}>{formatCurrency(pay)}</div>
                </div>
            </Card>
        </div>
    );
};

export default BillingCard;
