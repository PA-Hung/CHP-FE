import { Card, Checkbox, Modal } from 'antd'
import Search from 'antd/es/input/Search';
import React, { useState } from 'react'

const QuestModalTable = (props) => {
    const { isTableModalOpen, setIsTableModalOpen, listGuests, onSearch, reloadTable, setGuestData } = props;
    const [searchValue, setSearchValue] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');

    const toggleCheckbox = (itemId) => {
        setSelectedItemId(itemId === selectedItemId ? '' : itemId); // toggle selection
    };

    const resetModal = () => {
        setIsTableModalOpen(false);
        reloadTable();
        setSearchValue('');
        setSelectedItemId('');
    };

    const handleClickOk = () => {
        const selectedGuest = listGuests.find(item => item._id === selectedItemId);
        if (selectedGuest) {
            setGuestData(selectedGuest);
            setIsTableModalOpen(false);
            setSearchValue('');
            setSelectedItemId('');
        }
    }

    return (
        <>
            <Modal
                title="Tìm khách hàng để đưa vào hợp đồng thuê xe"
                open={isTableModalOpen}
                onOk={handleClickOk}
                onCancel={() => resetModal()}
                maskClosable={false}
            >
                <div style={{ display: "flex", flexDirection: 'column', gap: 25, marginTop: 20, marginBottom: 20 }}>
                    <div style={{ textAlign: "center" }}>
                        <Search
                            placeholder="Tìm theo Tên, SĐT, CCCD"
                            enterButton
                            style={{ width: "80%" }}
                            onSearch={onSearch}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: 'column', gap: 15 }}>
                        <div>
                            <h3>Danh sách khách hàng:</h3>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {listGuests.map((item) => (
                                <Card
                                    onClick={() => toggleCheckbox(item._id)}
                                    key={item._id}
                                    bordered={true}
                                    hoverable
                                    style={{ width: "100%", height: 90, backgroundColor: selectedItemId === item._id ? "#e6f7ff" : "" }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: 20, justifyContent: "start" }}>
                                            <Checkbox checked={selectedItemId === item._id} />
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                                <div style={{ fontWeight: 500 }}>CCCD : {item.cccd}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600 }}>ĐT : {item.phone}</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default QuestModalTable;
