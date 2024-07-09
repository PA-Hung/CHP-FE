import { DatePicker, Card, Checkbox, Modal, Tag } from 'antd'
const { RangePicker } = DatePicker;
import Search from 'antd/es/input/Search';
import React, { useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // import ngôn ngữ Vietnamese nếu cần
import { useSelector } from 'react-redux';

const MotorByHSearchModal = (props) => {
    const { isSearchByH_ModalOpen, setIsSearchByH_ModalOpen, listMotors, setListMotorsSelected, listMotorsSelected, onSearch, reloadTable } = props;
    const [searchValue, setSearchValue] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [dateHire, setDateHire] = useState();
    const [defaultDate, setDefautDate] = useState([dayjs(), dayjs().add(1, 'hour')])
    const themeMode = useSelector((state) => state.theme.themeMode);

    const toggleCheckbox = (itemId) => {
        setSelectedItemIds(prevSelectedItemIds =>
            prevSelectedItemIds.includes(itemId)
                ? prevSelectedItemIds.filter(id => id !== itemId)
                : [...prevSelectedItemIds, itemId]
        );
    };

    //  Lọc các phần tử đã được chọn từ danh sách motors
    const filterSelectedMotors = (listMotors, selectedItemIds) => {
        return listMotors.filter(item => selectedItemIds.includes(item._id));
    };

    //  Lọc các phần tử chưa có trong listMotorsSelected
    const filterNewSelectedMotors = (selectedMotors, listMotorsSelected) => {
        return selectedMotors.filter(item =>
            !listMotorsSelected.some(selectedItem => selectedItem._id === item._id)
        );
    };

    const calculateRentalDays = (startDate, endDate) => {
        const start = startDate ? dayjs(startDate) : dayjs();
        const end = endDate ? dayjs(endDate) : dayjs().add(1, "hour");
        return end.diff(start, 'hour');
    }

    // Thêm các thuộc tính cần thiết cho các phần tử trong listMotorsSelected
    const addDatesToMotors = (motors, dateHire) => {
        return motors.map(item => ({
            ...item,
            start_date: dateHire?.start_date ? dateHire.start_date : dayjs(),
            end_date: dateHire?.end_date ? dateHire.end_date : dayjs().add(1, "hour"),
            rental_status: true,
            status: "Đã nhận xe",
            amount: item.priceD * calculateRentalDays(dateHire?.start_date, dateHire?.end_date)
        }));
    };

    // Cập nhật danh sách các motors đã được chọn
    const updateSelectedMotorsList = (newSelectedMotors, setListMotorsSelected) => {
        if (newSelectedMotors.length > 0) {
            setListMotorsSelected(prevList => [...prevList, ...newSelectedMotors]);
        }
    };

    // Hàm handleClickOk tách riêng từng bước
    const handleClickOk = () => {
        const selectedMotors = filterSelectedMotors(listMotors, selectedItemIds);
        if (selectedMotors.length > 0) {
            const filteredNewMotors = filterNewSelectedMotors(selectedMotors, listMotorsSelected);
            const newSelectedMotors = addDatesToMotors(filteredNewMotors, dateHire);

            updateSelectedMotorsList(newSelectedMotors, setListMotorsSelected);

            setSearchValue('');
            setSelectedItemIds([]);
        }
        setDefautDate([dayjs(), dayjs().add(1, 'hour')]);
        setIsSearchByH_ModalOpen(false);
        reloadTable()
    };

    const handleCancel = () => {
        setIsSearchByH_ModalOpen(false)
        reloadTable()
    }


    const handleTimeChange = (e) => {
        const newDateHire = {
            start_date: e ? e[0] : dayjs(),
            end_date: e ? e[1] : dayjs().add(1, "hour")
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
                open={isSearchByH_ModalOpen}
                onOk={handleClickOk}
                onCancel={() => handleCancel()}
                maskClosable={false}
                width={"40%"}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                        <div>
                            <RangePicker
                                showTime={{ format: 'HH:mm giờ' }} // Chỉ hiển thị giờ
                                format="HH:mm giờ DD-MM-YYYY"      // Định dạng hiển thị ngày tháng năm và giờ
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} // Placeholder bằng tiếng Việt 
                                defaultValue={[dayjs(), dayjs().add(1, 'day')]}
                                onChange={(e) => handleTimeChange(e)}
                                value={defaultDate}
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
                            style={{
                                width: "100%",
                                height: 90,
                                backgroundColor: selectedItemIds.includes(item._id) ? (themeMode === "dark" ? "#333" : "#e6f7ff") : ""
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", gap: 20, justifyContent: "start" }}>
                                    <Checkbox checked={selectedItemIds.includes(item._id)} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{item.brand}</div>
                                        <div style={{ fontWeight: 500 }}>Biển số : <Tag color="blue">{item.license}</Tag></div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600 }}>Giá thuê : {formatCurrency(item.priceH)}/ giờ</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Modal>
        </div>
    )
}

export default MotorByHSearchModal;
