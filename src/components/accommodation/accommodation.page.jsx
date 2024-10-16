import { useEffect, useState } from "react";
import { Button, message, Upload, Row, Col, Select, Popconfirm } from "antd";
import queryString from "query-string";
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getApartment, importExcel } from "@/utils/api";
import CreateModal from "./create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import AccommodationTable from "./accommodation.table";
import AccommodationCard from "./accommodation.card";
import CheckAccess from "@/router/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { fetchAccommodation } from "@/redux/slice/accommodationSlice";
import ExportExcelDrawer from "./export.excel.drawer";

const AccommodationPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isExportExcelOpen, setIsExportExcelOpen] = useState(false);

  const loading = useSelector((state) => state.accommodation.isFetching);
  const meta = useSelector((state) => state.accommodation.meta);
  const listAccommodation = useSelector((state) => state.accommodation.result);
  const dispatch = useDispatch();

  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);

  const [apartmentCode, setApartmentCode] = useState();
  const [apartmentId, setApartmentId] = useState(undefined);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    if (isAdmin.name === "SUPER_ADMIN") {
      const initApartment = async () => {
        const res = await getApartment(`current=1&pageSize=100`);
        if (res.data?.result) {
          setApartmentCode(groupBySelectApartment(res.data?.result));
        }
      };
      initApartment();
    } else {
      setApartmentCode(groupBySelectApartment(user.apartments))
    }
  }, []);

  const groupBySelectApartment = (data) => {
    return data.map((item) => ({ value: item._id, label: item.code }));
  };

  useEffect(() => {
    const initData = async () => {
      let query;
      if (searchValue) {
        query = buildQuery(searchValue);
      }
      else {
        query = buildQuery();
      }
      dispatch(fetchAccommodation({ query }));
    };
    initData();
  }, [searchValue, meta.current, meta.pageSize]);


  const reloadTable = () => {
    const query = buildQuery();
    dispatch(fetchAccommodation({ query }));
    setSearchValue(null)
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (isAdmin.name !== "SUPER_ADMIN" & isAdmin.name !== "Supervisor") {
      if (user?._id) clone.userId = `/${user._id}/i`;
    }
    if (clone.apartment) clone.apartment = `/${clone.apartment}/i`;
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.identification_number)
      clone.identification_number = `/${clone.identification_number}/i`;
    if (clone.arrival) clone.arrival = `/${clone.arrival}/i`;
    if (clone.departure) clone.departure = `/${clone.departure}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.userId) {
      sortBy = sort.userId === "ascend" ? "sort=userId" : "sort=-userId";
    }
    if (sort && sort.apartment) {
      sortBy =
        sort.apartment === "ascend" ? "sort=apartment" : "sort=-apartment";
    }
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.identification_number) {
      sortBy =
        sort.identification_number === "ascend"
          ? "sort=identification_number"
          : "sort=-identification_number";
    }
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
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-createdAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const onSearch = async (value) => {
    setSearchValue(value);
    const query = buildQuery(value);
    dispatch(fetchAccommodation({ query }));
  };

  const handleSelectApartment = async (value) => {
    setApartmentId(value);
  };

  const handleClearSelectApartment = () => {
    setApartmentId(undefined);
  };

  const beforeUpload = (file) => {
    const isXLSX =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!isXLSX) {
      message.error(`${file.name} không phải là file excel`);
    }
    return isXLSX || Upload.LIST_IGNORE;
  };

  const handleUploadFileExcel = async ({ file }) => {
    if (apartmentId === undefined) {
      message.error(`Bạn phải chọn mã căn hộ !`);
    } else {
      const response = await importExcel(file, apartmentId);
      if (response.statusCode === 201) {
        message.success(response.data.message);
        setLoadingUpload(false);
        handleClearSelectApartment();
      } else {
        message.error(response.data.message);
      }
    }
  };

  const handleExport = async () => {
    try {
      // chuyển định dạng ngày tháng năm chuẩn ISO8601 thành DD/MM/YYY
      const formatDate = (date) => {
        return dayjs(date).format("DD/MM/YYYY");
      };

      let stt = 1; // Biến đếm số thứ tự
      // Prepare worksheet data, handling dates appropriately
      const worksheetData = listAccommodation.map((accommodation) => ({
        STT: stt++,
        "Họ và tên (*)": accommodation.name,
        "Ngày, tháng, năm sinh (*)": formatDate(accommodation.birthday),
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
        "Thời gian lưu trú (đến ngày) (*)": formatDate(accommodation.arrival),
        "Thời gian lưu trú (đi ngày)": accommodation.departure
          ? formatDate(accommodation.departure)
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
    } catch (error) {
      console.error("Export error:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
    }
  };



  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.ACCOMMODATION.GET_PAGINATE}
      >
        <div style={{ padding: 20 }}>
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={12} lg={8} xl={4}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalOpen(true)}
              >
                Tìm kiếm
              </Button>
            </Col>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.ACCOMMODATION.CREATE}
              hideChildren
            >
              <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Thêm mới
                </Button>
              </Col>
            </CheckAccess>

            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.EXCEL.IMPORT}
              hideChildren
            >
              <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                <Popconfirm
                  title="Chọn mã căn hộ trước khi import"
                  okText={'Đóng'}
                  showCancel={false}
                  onConfirm={() => reloadTable()}
                  description={
                    <Row gutter={[48, 8]} justify="center" wrap={true}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Select
                          allowClear
                          placeholder="Mã căn hộ"
                          defaultValue={{
                            label: "Tất cả căn hộ",
                            value: "tat-ca-can-ho",
                          }}
                          options={apartmentCode}
                          onSelect={(value) => handleSelectApartment(value)}
                          onClear={() => handleClearSelectApartment()}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Upload
                          maxCount={1}
                          multiple={false}
                          showUploadList={false}
                          beforeUpload={beforeUpload}
                          customRequest={handleUploadFileExcel}
                        >
                          <Button
                            icon={
                              loadingUpload ? <LoadingOutlined /> : <ImportOutlined />
                            }
                          />
                        </Upload>
                      </Col>
                    </Row>
                  }

                >   <Button
                  icon={
                    loadingUpload ? <LoadingOutlined /> : <ImportOutlined />
                  }
                >
                    Nhập Excel
                  </Button></Popconfirm>
              </Col>
            </CheckAccess>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.EXCEL.EXPORT}
              hideChildren
            >
              <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport()}
                >
                  Xuất Excel
                </Button>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => setIsExportExcelOpen(true)}
                >
                  Xuất Báo Cáo
                </Button>
              </Col>
            </CheckAccess>
          </Row>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0} xl={0}>
            <AccommodationCard
              listAccommodation={listAccommodation}
              loading={loading}
              reloadTable={reloadTable}
              meta={meta}
            />
          </Col>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <AccommodationTable
              listAccommodation={listAccommodation}
              loading={loading}
              reloadTable={reloadTable}
              meta={meta}
            />
          </Col>
        </Row>
        <CreateModal
          reloadTable={reloadTable}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          apartmentCode={apartmentCode}
          setApartmentCode={setApartmentCode}
        />
        <SearchModal
          isSearchModalOpen={isSearchModalOpen}
          setIsSearchModalOpen={setIsSearchModalOpen}
          onSearch={onSearch}
        />
        <ExportExcelDrawer
          isExportExcelOpen={isExportExcelOpen}
          setIsExportExcelOpen={setIsExportExcelOpen} />
      </CheckAccess>
    </div>
  );
};

export default AccommodationPage;
