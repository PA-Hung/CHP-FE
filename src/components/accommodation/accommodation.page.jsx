import { useEffect, useState } from "react";
import { Button, notification, message, Upload, Row, Col, Flex } from "antd";
import queryString from "query-string";
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { exportExcel, getAccommodation, importExcel } from "../../utils/api";
import CreateModal from "./create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import SearchModal from "./search.modal";
import AccommodationTable from "./accommodation.table";
import AccommodationCard from "./accommodation.card";
import CheckAccess from "@/utils/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";

const AccommodationPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [listAccommodation, setListAccommodation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);

  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const query = buildQuery();
    setLoading(true);
    const res = await getAccommodation(query);
    if (res.data) {
      setListAccommodation(res.data.result);
      setMeta({
        current: res?.data?.meta?.current,
        pageSize: res?.data?.meta?.pageSize,
        pages: res.data.meta.pages,
        total: res.data.meta.total,
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
    setLoading(false);
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (isAdmin.name !== "SUPER_ADMIN") {
      if (user?._id) clone.userId = `/${user._id}/i`;
    }
    if (clone.phone) clone.phone = `/${clone.phone}/i`;
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.passport) clone.passport = `/${clone.passport}/i`;
    if (clone.identification_number)
      clone.identification_number = `/${clone.identification_number}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.userId) {
      sortBy = sort.userId === "ascend" ? "sort=userId" : "sort=-userId";
    }
    if (sort && sort.phone) {
      sortBy = sort.phone === "ascend" ? "sort=phone" : "sort=-phone";
    }
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.passport) {
      sortBy = sort.passport === "ascend" ? "sort=passport" : "sort=-passport";
    }
    if (sort && sort.identification_number) {
      sortBy =
        sort.identification_number === "ascend"
          ? "sort=identification_number"
          : "sort=-identification_number";
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
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-arrival`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const onSearch = async (value) => {
    const query = buildQuery(value);
    setLoading(true);
    const res = await getAccommodation(query);
    if (res.data) {
      setListAccommodation(res.data.result);
      setMeta({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        pages: res.data.meta.pages,
        total: res.data.meta.total,
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
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
    const response = await importExcel(file, "fileExcel");
    if (response.statusCode === 201) {
      message.success(response.data.message);
      setLoadingUpload(false);
      getData();
    } else {
      message.error(response.data.message);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportExcel();
      if (response.statusCode === 200) {
        // Chuyển đổi dữ liệu JSON thành worksheet của workbook
        const ws = XLSX.utils.json_to_sheet(response.data);

        // Tạo workbook và append worksheet vào đó
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

        // Tạo tệp Excel và tải về
        XLSX.writeFile(wb, "exported_data.xlsx");
      }
    } catch (error) {
      console.error("Export error:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
    }
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <div style={{ padding: 20 }}>
        <Flex justify="space-between" align="center">
          <Row gutter={[8, 8]}>
            <Col xs={0} sm={24} md={24} lg={12} xl={12}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalOpen(true)}
              >
                Tìm kiếm
              </Button>
            </Col>
            <Col xs={24} sm={0} md={0} lg={0} xl={0}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalOpen(true)}
              />
            </Col>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.ACCOMMODATION.CREATE}
              hideChildren
            >
              <Col xs={0} sm={24} md={24} lg={12} xl={12}>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Thêm mới
                </Button>
              </Col>
            </CheckAccess>
            <Col xs={24} sm={0} md={0} lg={0} xl={0}>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              />
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.EXCEL.IMPORT}
              hideChildren
            >
              <Col xs={0} sm={24} md={24} lg={12} xl={12}>
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
                  >
                    Import Excel
                  </Button>
                </Upload>
              </Col>
              <Col xs={24} sm={0} md={0} lg={0} xl={0}>
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
            </CheckAccess>
            <CheckAccess
              FeListPermission={ALL_PERMISSIONS.EXCEL.EXPORT}
              hideChildren
            >
              <Col xs={0} sm={24} md={24} lg={12} xl={12}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport()}
                >
                  Export Excel
                </Button>
              </Col>
              <Col xs={24} sm={0} md={0} lg={0} xl={0}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport()}
                />
              </Col>
            </CheckAccess>
          </Row>
        </Flex>
      </div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={0} xl={0}>
          <AccommodationCard
            listAccommodation={listAccommodation}
            setListAccommodation={setListAccommodation}
            loading={loading}
            setLoading={setLoading}
            getData={getData}
          />
        </Col>
        <Col xs={0} sm={0} md={0} lg={24} xl={24}>
          <AccommodationTable
            listAccommodation={listAccommodation}
            loading={loading}
            getData={getData}
          />
        </Col>
      </Row>
      <CreateModal
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <SearchModal
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        onSearch={onSearch}
      />
    </div>
  );
};

export default AccommodationPage;
