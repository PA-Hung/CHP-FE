import { Button, Drawer, Space, DatePicker, Row, Col, message } from 'antd'
const { RangePicker } = DatePicker;
import React, { useState } from 'react'
import dayjs from "dayjs";
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayjs.extend(quarterOfYear)
import { DownloadOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { exportReportExcel } from '@/utils/api';
import * as XLSX from "xlsx";

const ExportExcelDrawer = (props) => {
    const { isExportExcelOpen, setIsExportExcelOpen } = props;

    const [queryDate, setQueryDate] = useState()
    const [queryWeek, setQueryWeek] = useState()
    const [queryMonth, setQueryMonth] = useState()
    const [queryQuarter, setQueryQuarter] = useState()
    const [queryYear, setQueryYear] = useState()

    const resetDrawer = () => {
        setIsExportExcelOpen(false);
    };

    const buildQuery = (params, sort) => {
        const clone = { ...params };
        if (clone.arrival) clone.arrival = `/${clone.arrival}/i`;
        if (clone.departure) clone.departure = `/${clone.departure}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.arrival) {
            sortBy = sort.arrival === "ascend" ? "sort=arrival" : "sort=-arrival";
        }
        if (sort && sort.departure) {
            sortBy = sort.departure === "ascend" ? "sort=departure" : "sort=-departure";
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
            temp = `${temp}&sort=-createdAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }
        return temp;
    };

    const handleDateChange = (e) => {
        const inputQuery = {
            arrival: e[0],
            departure: e[1],
        }
        const query = buildQuery(inputQuery);
        setQueryDate(query)
    }

    const handleDateExport = async () => {
        try {
            if (queryDate) {
                const exportReportData = await exportReportExcel(queryDate);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ  liệu không tồn tại !");
                }
            } else {
                const inputQuery = {
                    arrival: dayjs(),
                    departure: dayjs().add(1, "day"),
                }
                const query = buildQuery(inputQuery);
                const exportReportData = await exportReportExcel(query);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ  liệu không tồn tại !");
                }
            }

        } catch (error) {
            console.error("Export error:", error);
        }
    };

    const handleWeekChange = (week) => {
        if (week) {
            const startOfWeek = dayjs(week).startOf('week');
            const endOfWeek = dayjs(week).endOf('week');
            const inputQuery = {
                arrival: startOfWeek,
                departure: endOfWeek,
            }
            const query = buildQuery(inputQuery);
            setQueryWeek(query)
        }
    }

    const handleWeekExport = async () => {
        try {
            if (queryWeek) {
                const exportReportData = await exportReportExcel(queryWeek);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            } else {
                const startOfWeek = dayjs().startOf('week');
                const endOfWeek = dayjs().endOf('week');
                const inputQuery = {
                    arrival: startOfWeek,
                    departure: endOfWeek,
                }
                const query = buildQuery(inputQuery);
                const exportReportData = await exportReportExcel(query);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            }

        } catch (error) {
            console.error("Export error:", error);
        }
    };

    const handleMonthChange = (month) => {
        if (month) {
            const startOfMonth = dayjs(month).startOf('month');
            const endOfMonth = dayjs(month).endOf('month');
            const inputQuery = {
                arrival: startOfMonth,
                departure: endOfMonth,
            }
            const query = buildQuery(inputQuery);
            setQueryMonth(query)
        }
    }

    const handleMonthExport = async () => {
        try {
            if (queryMonth) {
                const exportReportData = await exportReportExcel(queryMonth);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            } else {
                const startOfMonth = dayjs().startOf('month');
                const endOfMonth = dayjs().endOf('month');
                const inputQuery = {
                    arrival: startOfMonth,
                    departure: endOfMonth,
                }
                const query = buildQuery(inputQuery);
                const exportReportData = await exportReportExcel(query);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            }
        } catch (error) {
            console.error("Export error:", error);
        }
    };

    const handleQuarterChange = (quarter) => {
        if (quarter) {
            const startOfQuarter = dayjs(quarter).startOf('quarter')
            const endOfQuarter = dayjs(quarter).endOf('quarter')
            const inputQuery = {
                arrival: startOfQuarter,
                departure: endOfQuarter,
            }
            const query = buildQuery(inputQuery);
            setQueryQuarter(query)
        }
    }

    const handleQuarterExport = async () => {
        try {
            if (queryQuarter) {
                const exportReportData = await exportReportExcel(queryQuarter);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            } else {
                const startOfQuarter = dayjs().startOf('quarter')
                const endOfQuarter = dayjs().endOf('quarter')
                const inputQuery = {
                    arrival: startOfQuarter,
                    departure: endOfQuarter,
                }
                const query = buildQuery(inputQuery);
                const exportReportData = await exportReportExcel(query);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            }
        } catch (error) {
            console.error("Export error:", error);
        }
    };

    const handleYearChange = (year) => {
        if (year) {
            const startOfYear = dayjs(year).startOf('year');
            const endOfYear = dayjs(year).endOf('year');
            const inputQuery = {
                arrival: startOfYear,
                departure: endOfYear,
            }
            const query = buildQuery(inputQuery);
            setQueryYear(query)
        }
    }

    const handleYearExport = async () => {
        try {
            if (queryYear) {
                const exportReportData = await exportReportExcel(queryYear);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            } else {
                const startOfYear = dayjs().startOf('year');
                const endOfYear = dayjs().endOf('year');
                const inputQuery = {
                    arrival: startOfYear,
                    departure: endOfYear,
                }
                const query = buildQuery(inputQuery);
                const exportReportData = await exportReportExcel(query);
                if (exportReportData.data.length > 0) {
                    exportReport(exportReportData);
                } else {
                    message.error("Dữ liệu không tồn tại !");
                }
            }
        } catch (error) {
            console.error("Export error:", error);
        }
    };



    const exportReport = (exportReportData) => {
        const formatDate = (date) => {
            return dayjs(date).format("DD/MM/YYYY");
        };
        let stt = 1; // Biến đếm số thứ tự

        // Prepare worksheet data, handling dates appropriately
        const worksheetData = exportReportData.data.map((accommodation) => ({
            STT: stt++,
            "Họ và tên (*)": accommodation.name,
            "Ngày, tháng, năm sinh (*)": formatDate(accommodation.birthday, (formattedDate) => formattedDate),
            "Giới tính (*)": accommodation.gender,
            "CMND/ CCCD/ Số định danh (*)": accommodation.identification_number,
            "Số hộ chiếu (*)": accommodation.passport,
            "Giấy tờ khác (*)": accommodation.documents,
            "Số điện thoại": accommodation.phone,
            "Nghề nghiệp": accommodation.job,
            "Nơi làm việc": accommodation.workplace,
            "Dân tộc": accommodation.ethnicity,
            "Quốc tịch (*)": accommodation.nationality,
            "Địa chỉ – Quốc gia (*)": accommodation.country,
            "Địa chỉ – Tỉnh thành": accommodation.province,
            "Địa chỉ – Quận huyện": accommodation.district,
            "Địa chỉ – Phường xã": accommodation.ward,
            "Địa chỉ – Số nhà": accommodation.address,
            "Loại cư trú (*)": accommodation.residential_status,
            "Thời gian lưu trú (đến ngày) (*)": formatDate(accommodation.arrival, (formattedDate) => formattedDate),
            "Thời gian lưu trú (đi ngày)": accommodation.departure
                ? formatDate(accommodation.departure, (formattedDate) => formattedDate)
                : "",
            "Lý do lưu trú": accommodation.reason,
            "Số phòng/Mã căn hộ": accommodation.apartment.code,
            // Add other fields as needed
        }));
        const ws = XLSX.utils.json_to_sheet(worksheetData);
        // Tạo workbook và append worksheet vào đó
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
        // Tạo tệp Excel và tải về
        XLSX.writeFile(wb, "exported_data.xlsx");
    };

    return (
        <>
            <Drawer
                title={`Xuất thông tin lưu trú thành file excel`}
                placement="right"
                width="30%"
                onClose={resetDrawer}
                open={isExportExcelOpen}
                style={{ color: "black" }}
                footer={
                    <Space style={{ float: 'right' }}>
                        <Button type="primary" onClick={resetDrawer}>Đóng</Button>
                    </Space>
                }
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <Row gutter={[8, 8]} justify="space-between" align="middle">
                        <Col style={{ flexGrow: 1 }}>
                            Theo ngày :
                            <RangePicker
                                style={{ marginLeft: 5, marginRight: 5, width: 250 }}
                                format="DD-MM-YYYY"
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                defaultValue={[dayjs(), dayjs().add(1, 'day')]}
                                onChange={(e) => handleDateChange(e)}
                            />
                        </Col>
                        <Col>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleDateExport()} />
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} justify="space-between" align="middle">
                        <Col style={{ flexGrow: 1 }}>
                            Theo tuần :
                            <DatePicker
                                style={{ marginLeft: 5, marginRight: 5, width: 'auto' }}
                                picker="week"
                                defaultValue={dayjs()}
                                onChange={(week) => handleWeekChange(week)}
                            />
                        </Col>
                        <Col>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleWeekExport()} />
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} justify="space-between" align="middle">
                        <Col style={{ flexGrow: 1 }}>
                            Theo tháng :
                            <DatePicker
                                style={{ marginLeft: 5, marginRight: 5, width: 'auto' }}
                                picker="month"
                                defaultValue={dayjs()}
                                onChange={(month) => handleMonthChange(month)}
                            />
                        </Col>
                        <Col>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleMonthExport()} />
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} justify="space-between" align="middle">
                        <Col style={{ flexGrow: 1 }}>
                            Theo quý :
                            <DatePicker
                                style={{ marginLeft: 5, marginRight: 5, width: 'auto' }}
                                picker="quarter"
                                defaultValue={dayjs()}
                                onChange={(quarter) => handleQuarterChange(quarter)}
                            />
                        </Col>
                        <Col>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleQuarterExport()} />
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} justify="space-between" align="middle">
                        <Col style={{ flexGrow: 1 }}>
                            Theo năm :
                            <DatePicker
                                style={{ marginLeft: 5, marginRight: 5, width: 'auto' }}
                                picker="year"
                                defaultValue={dayjs()}
                                onChange={(year) => handleYearChange(year)}
                            />
                        </Col>
                        <Col>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleYearExport()} />
                        </Col>
                    </Row>
                </div>

            </Drawer>
        </>
    )
}

export default ExportExcelDrawer