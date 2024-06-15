import { DatePicker, Card, Checkbox, Modal, Tag, Button } from 'antd'
const { RangePicker } = DatePicker;
import Search from 'antd/es/input/Search';
import React, { useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // import ngôn ngữ Vietnamese nếu cần

const MotorSearchModal = (props) => {
    const { isSearchModalOpen, setIsSearchModalOpen, listMotors, setListMotorsSelected, listMotorsSelected, onSearch, reloadTable } = props;
    const [searchValue, setSearchValue] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [dateHire, setDateHire] = useState({
        start_date: dayjs(),
        end_date: dayjs().add(1, "day")
    });

    const toggleCheckbox = (itemId) => {
        setSelectedItemIds(prevSelectedItemIds =>
            prevSelectedItemIds.includes(itemId)
                ? prevSelectedItemIds.filter(id => id !== itemId)
                : [...prevSelectedItemIds, itemId]
        );
    };

    const handleClickOk = () => {
        const selectedMotors = listMotors.filter(item => selectedItemIds.includes(item._id));
        if (selectedMotors.length > 0) {
            // Lọc các phần tử chưa có trong listMotorsSelected
            const newSelectedMotors = selectedMotors.filter(item =>
                !listMotorsSelected.some(selectedItem => selectedItem._id === item._id)
            ).map(item => ({
                ...item,
                start_date: dateHire.start_date ? dateHire.start_date : dayjs(),
                end_date: dateHire.end_date ? dateHire.end_date : dayjs().add(1, "day")
            }));

            // Chỉ thêm các phần tử mới nếu có
            if (newSelectedMotors.length > 0) {
                setListMotorsSelected(prevList => [...prevList, ...newSelectedMotors]);
            }
            setSearchValue('');
            setSelectedItemIds([]);
        }
        setIsSearchModalOpen(false);
    }

    const handleTimeChange = (e) => {
        const newDateHire = {
            start_date: e ? e[0] : dayjs(),
            end_date: e ? e[1] : dayjs().add(1, "day")
        };
        setDateHire(newDateHire);
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div>
            <Modal
                title="Chọn xe để đưa vào hợp đồng :"
                open={isSearchModalOpen}
                onOk={handleClickOk}
                onCancel={() => setIsSearchModalOpen(false)}
                maskClosable={false}
                width={"40%"}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <div>
                            <RangePicker
                                showTime={{ format: 'HH' }} // Chỉ hiển thị giờ
                                format="YYYY-MM-DD HH"      // Định dạng hiển thị ngày tháng năm và giờ
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} // Placeholder bằng tiếng Việt 
                                defaultValue={[dayjs(), dayjs().add(1, 'day')]}
                                onChange={(e) => handleTimeChange(e)}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Search
                                placeholder="Tìm theo Tên xe, Biển số"
                                enterButton
                                onSearch={onSearch}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Button danger onClick={() => reloadTable()}>Tải lại</Button>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                    {listMotors.map((item) => (
                        <Card
                            onClick={() => toggleCheckbox(item._id)}
                            key={item._id}
                            bordered={true}
                            hoverable
                            style={{ width: "100%", height: 90, backgroundColor: selectedItemIds.includes(item._id) ? "#e6f7ff" : "" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", gap: 20, justifyContent: "start" }}>
                                    <Checkbox checked={selectedItemIds.includes(item._id)} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{item.brand}</div>
                                        <div style={{ fontWeight: 500 }}>Biển số : <Tag color="blue">{item.license}</Tag></div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600 }}>Giá thuê : {formatCurrency(item.price)}/h</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Modal>
        </div>
    )
}

export default MotorSearchModal;
