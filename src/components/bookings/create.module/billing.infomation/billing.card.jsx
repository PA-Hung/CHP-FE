import { Card, Checkbox, InputNumber, Select, notification } from "antd";
import { useEffect } from "react";

const BillingCard = (props) => {
    const { total, deposit, setDeposit, discount, setDiscount, amount, setAmount, method, setMethod, checkedBox, setCheckedBox } = props


    useEffect(() => {
        if (deposit) {
            setCheckedBox('discount')
        }
    }, [deposit])

    const onChange = (e) => {
        setCheckedBox(e.target.name);
        if (e.target.name === "nodiscount") {
            setDiscount(null)
            setAmount(total)
        }
    };


    const handleChangeDeposit = (value) => {
        // Kiểm tra nếu giá trị nhập vào không phải số
        if (isNaN(value)) {
            return setDeposit(null)
        }
        setDeposit(value)
    };

    const handleChangeDiscount = (value) => {
        if (isNaN(value)) {
            return setDiscount(null)
        }
        setDiscount(value)
        if (total - value > 0) {
            setAmount(total - value)
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                placement: "top",
                description: "Tiền giảm giá phải nhỏ hơn tổng tiền thuê xe",
            });
        }

    };

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
                            size="large"
                            placeholder="Chọn thanh toán"
                            value={method}
                            onSelect={(value) => setMethod(value)}
                            allowClear
                            options={[
                                { value: "tiền mặt", label: "Tiền mặt" },
                                { value: "Chuyển khoản", label: "Chuyển khoản" },
                            ]}
                        />
                    </div>
                    {checkedBox === 'discount' ? <div>
                        <InputNumber
                            addonAfter={<b>đ</b>}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                            step={1} // Bước nhảy
                            controls={false}
                            placeholder="Giảm giá"
                            style={{ width: "100%" }}
                            onChange={handleChangeDiscount}
                            value={discount}
                            size="large"
                        />
                    </div> : ""}
                    <div>
                        <InputNumber
                            placeholder="Đặt cọc hoặc trả hết"
                            addonAfter={<b>đ</b>}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Định dạng hiển thị có dấu phẩy
                            step={1} // Bước nhảy
                            style={{ width: "100%" }}
                            controls={false}
                            onChange={handleChangeDeposit}
                            value={deposit}
                            size="large"
                        />
                    </div>
                </div>
                <div style={{ display: "flex", fontSize: 20, fontWeight: 700, marginTop: 20, gap: 6 }}>
                    <div >Giá trị hợp đồng = (Tiền thuê xe - Giảm giá) = </div>
                    <div style={{ color: "red" }}>{formatCurrency(discount ? amount : total)}</div>
                </div>

            </Card>
        </div>
    )
}

export default BillingCard